"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientBrowser } from "@/lib/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus } from "lucide-react"
import type { Blog } from "@/types"

interface BlogTableProps {
  blogs: Blog[]
}

export function BlogTable({ blogs }: BlogTableProps) {
  const router = useRouter()
  const supabase = createClientBrowser()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDelete = async (id: string) => {
    // Get the blog to find the header image path
    const { data: blog } = await supabase
      .from("blogs")
      .select("header_image")
      .eq("id", id)
      .single()

    // Delete the blog from database
    const { error } = await supabase.from("blogs").delete().eq("id", id)

    if (error) {
      console.error("Error deleting blog:", error)
      return
    }

    // Delete header image from storage if exists
    if (blog?.header_image) {
      try {
        const imagePath = blog.header_image.split("/blog-images/")[1]
        if (imagePath) {
          await supabase.storage.from("blog-images").remove([`blog-images/${imagePath}`])
        }
      } catch (storageError) {
        console.error("Error deleting image from storage:", storageError)
      }
    }

    setDeletingId(null)
    router.refresh()
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => router.push("/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Blog
        </Button>
      </div>

      <div className="border border-border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No blogs found. Create your first blog!
                </TableCell>
              </TableRow>
            ) : (
              blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>{blog.category_name}</TableCell>
                  <TableCell>{formatDate(blog.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/${blog.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this blog?")) {
                            handleDelete(blog.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}