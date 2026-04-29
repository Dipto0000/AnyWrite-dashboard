"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientBrowser } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Editor } from "@/components/editor"
import { blogSchema, type BlogFormValues } from "@/lib/schemas"
import type { Category } from "@/types"

interface BlogFormProps {
  blog?: {
    id: string
    title: string
    category_id: string
    content: string
    header_image: string | null
  }
  categories: Category[]
}

export function BlogForm({ blog, categories }: BlogFormProps) {
  const router = useRouter()
  const supabase = createClientBrowser()
  const [loading, setLoading] = useState(false)
  const [headerImage, setHeaderImage] = useState(blog?.header_image || "")
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || "",
      category_id: blog?.category_id || "",
      content: blog?.content || "",
    },
  })

  const content = watch("content")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `blog-images/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath)
    setHeaderImage(data.publicUrl)
    setUploading(false)
  }

  const onSubmit = async (data: BlogFormValues) => {
    setLoading(true)

    if (blog) {
      const { error } = await supabase
        .from("blogs")
        .update({
          title: data.title,
          category_id: data.category_id,
          content: data.content,
          header_image: headerImage || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", blog.id)

      if (error) {
        console.error("Error updating blog:", error)
        setLoading(false)
        return
      }
    } else {
      const { error } = await supabase.from("blogs").insert({
        title: data.title,
        category_id: data.category_id,
        content: data.content,
        header_image: headerImage || null,
      })

      if (error) {
        console.error("Error creating blog:", error)
        setLoading(false)
        return
      }
    }

    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register("title")}
          placeholder="Enter blog title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={watch("category_id")}
          onValueChange={(value) => setValue("category_id", value)}
          className="w-full"
        >
          <option value="" disabled>Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>
        {errors.category_id && (
          <p className="text-sm text-destructive">{errors.category_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="headerImage">Header Image</Label>
        <Input
          id="headerImage"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
        {headerImage && (
          <div className="mt-2">
            <img
              src={headerImage}
              alt="Header"
              className="max-w-md w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <Editor content={content} onChange={(val) => setValue("content", val)} />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : blog ? "Update Blog" : "Create Blog"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}