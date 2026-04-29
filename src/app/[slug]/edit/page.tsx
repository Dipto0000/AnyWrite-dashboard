import { getBlog, getCategories } from "@/actions/blogs"
import { BlogForm } from "@/components/blog-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { requireAuth } from "@/lib/auth"

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await requireAuth()
  const { slug } = await params
  const blog = await getBlog(slug)
  const categories = await getCategories()

  if (!blog) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm blog={blog} categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}