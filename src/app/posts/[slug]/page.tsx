import { client } from '../../../sanity/lib/client'
import { groq } from 'next-sanity'
import { PortableText, PortableTextBlock } from '@portabletext/react'

type Post = {
  title: string
  body: PortableTextBlock[]
}

type Params = {
    slug: string
}

export default async function DeepDivePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  const post: Post = await client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]{
      title,
      body
    }`,
    { slug }
  )

  if (!post) {
    return <div>Post not found.</div>
  }

  return (
    <div className="max-w-[600px] md:mx-auto my-[0] bg-white shadow-md items-center p-2">
      <h2 className="font-bold m-2 text-neutral">{post.title}</h2>
      <div className="card-body p-4 prose prose-lg"> 
        <PortableText value={post.body} />
      </div>
    </div>
  )
}
