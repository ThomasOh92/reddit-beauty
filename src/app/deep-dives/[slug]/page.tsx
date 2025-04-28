import { client } from '../../../sanity/lib/client'
import { groq } from 'next-sanity'
import { PortableText } from '@portabletext/react'

type Post = {
  title: string
  body: any
}

export default async function DeepDivePage({ params }: { params: { slug: string } }) {
  const { slug } = params

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
