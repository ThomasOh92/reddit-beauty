type PreviewResponse = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
};

type YouTubeOEmbedResponse = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

const metaTagRegex = /<meta\s+[^>]*>/gi;

const getAttr = (tag: string, attr: string) => {
  const match = new RegExp(`${attr}=["']([^"']+)["']`, "i").exec(tag);
  return match?.[1];
};

const parseMeta = (html: string) => {
  const tags = html.match(metaTagRegex) ?? [];
  const meta: Record<string, string> = {};

  tags.forEach((tag) => {
    const property = getAttr(tag, "property") ?? getAttr(tag, "name");
    const content = getAttr(tag, "content");
    if (property && content) {
      meta[property.toLowerCase()] = content;
    }
  });

  const titleMatch = /<title[^>]*>([^<]*)<\/title>/i.exec(html);
  const title = titleMatch?.[1]?.trim();

  return { meta, title };
};

const pickFirst = (...values: Array<string | undefined>) =>
  values.find((value) => value && value.length > 0);

const isYouTubeUrl = (target: URL) => {
  const host = target.hostname.toLowerCase();
  return (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be" ||
    host === "www.youtu.be"
  );
};

const getYouTubeVideoId = (target: URL) => {
  const host = target.hostname.toLowerCase();

  if (host === "youtu.be" || host === "www.youtu.be") {
    const id = target.pathname.replace(/^\/+/, "").split("/")[0];
    return id || undefined;
  }

  if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) {
    const fromQuery = target.searchParams.get("v");
    if (fromQuery) return fromQuery;

    const pathParts = target.pathname.split("/").filter(Boolean);
    if (pathParts[0] === "shorts" && pathParts[1]) return pathParts[1];
    if (pathParts[0] === "embed" && pathParts[1]) return pathParts[1];
  }

  return undefined;
};

const getYouTubePreview = async (target: URL): Promise<PreviewResponse> => {
  const videoId = getYouTubeVideoId(target);
  const thumbnail = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : undefined;

  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(target.toString())}&format=json`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      return {
        title: "YouTube",
        image: thumbnail,
        siteName: "YouTube",
        url: target.toString(),
      };
    }

    const data = (await response.json()) as YouTubeOEmbedResponse;
    return {
      title: pickFirst(data.title, "YouTube"),
      image: pickFirst(data.thumbnail_url, thumbnail),
      siteName: "YouTube",
      url: target.toString(),
    };
  } catch {
    return {
      title: "YouTube",
      image: thumbnail,
      siteName: "YouTube",
      url: target.toString(),
    };
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return Response.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!{"http:": true, "https:": true}[target.protocol]) {
    return Response.json({ error: "Unsupported protocol" }, { status: 400 });
  }

  if (isYouTubeUrl(target)) {
    const preview = await getYouTubePreview(target);
    return Response.json(preview, {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  try {
    const response = await fetch(target.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)",
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch" }, { status: 502 });
    }

    const html = await response.text();
    const { meta, title } = parseMeta(html);

    const rawImage = pickFirst(meta["og:image"], meta["twitter:image"]);
    const image = rawImage ? new URL(rawImage, target).toString() : undefined;

    const preview: PreviewResponse = {
      title: pickFirst(meta["og:title"], meta["twitter:title"], title),
      description: pickFirst(
        meta["og:description"],
        meta["twitter:description"],
        meta["description"]
      ),
      image,
      siteName: pickFirst(meta["og:site_name"]),
      url: target.toString(),
    };

    return Response.json(preview, {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return Response.json({ error: "Preview error" }, { status: 500 });
  }
}
