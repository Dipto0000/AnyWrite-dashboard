import { getBlogs, getCategories } from "@/actions/blogs"
import { DashboardClient } from "@/components/dashboard-client"
import { requireAuth } from "@/lib/auth"

export default async function DashboardPage() {
  await requireAuth()
  const blogs = await getBlogs()
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <DashboardClient blogs={blogs} categories={categories} />
    </div>
  )
}