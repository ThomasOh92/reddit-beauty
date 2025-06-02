import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText, PortableTextBlock } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

function urlFor(source: string) {
  return builder.image(source).url();
}

type Post = {
  title: string;
  body: PortableTextBlock[];
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
};

type Params = {
  slug: string;
};

export default async function DeepDivePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const post: Post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      body
    }`,
    { slug }
  );

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
      <h2 className="font-bold m-2 text-neutral">{post.title}</h2>
      {post.mainImage && (
        <img
          src={urlFor(post.mainImage.asset._ref)}
          alt={post.mainImage.alt || "Image"}
          className="w-full h-auto rounded-md"
        />
      )}
      <div className="card-body max-w-[600px] p-2 pl-0 prose prose-sm [&_p]:m-2 [&_p]:mt-0 [&_ul]:m-0 [&_blockquote]:m-0 [&_li]:m-0 [&_h1]:m-2 [&_h2]:m-2 [&_h3]:m-2 [&_h4]:m-2 [&_h5]:m-2 [&_h6]:m-2">
        <PortableText value={post.body} />
      </div>
    </div>
  );
}
