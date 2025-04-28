import { client } from '../../../sanity/lib/client'
import { groq } from 'next-sanity'
import { PortableText, PortableTextBlock } from '@portabletext/react'

type Post = {
  title: string
  body: PortableTextBlock[]
}

type Params = {
  params: {
    slug: string
  }
}

export default async function DeepDivePage({ params }: Params) {
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
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      <div className="prose prose-lg">
        <PortableText value={post.body} />
      </div>
    </main>
  )
}
