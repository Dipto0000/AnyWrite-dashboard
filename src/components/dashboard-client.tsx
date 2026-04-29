"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Select } from "@/components/ui/select"
import { BlogTable } from "@/components/blog-table"
import type { Blog, Category } from "@/types"

export function DashboardClient({
  blogs,
  categories,
}: {
  blogs: Blog[]
  categories: Category[]
}) {
  const router = useRouter()
  const [categoryFilter, setCategoryFilter] = useState("")

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      categoryFilter === "" || blog.category_id === categoryFilter
    return matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select 
          value={categoryFilter} 
          onValueChange={setCategoryFilter}
          className="w-full sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </div>

      <BlogTable blogs={filteredBlogs} />
    </div>
  )
}