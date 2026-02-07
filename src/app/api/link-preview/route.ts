type PreviewResponse = {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  url?: string;
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

    const preview: PreviewResponse = {
      title: pickFirst(meta["og:title"], meta["twitter:title"], title),
      description: pickFirst(
        meta["og:description"],
        meta["twitter:description"],
        meta["description"]
      ),
      image: pickFirst(meta["og:image"], meta["twitter:image"]),
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
