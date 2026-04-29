import { Suspense } from "react"
import { getCategories } from "@/actions/blogs"
import { BlogForm } from "@/components/blog-form"
import { BlogFormSkeleton } from "@/components/skeletons"
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
          <Suspense fallback={<BlogFormSkeleton />}>
            <BlogForm categories={categories} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}