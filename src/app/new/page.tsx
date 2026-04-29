import { getCategories } from "@/actions/blogs"
import { BlogForm } from "@/components/blog-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireAuth } from "@/lib/auth"

export default async function NewBlogPage() {
  await requireAuth()
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}