"use server"

import { createClientServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getBlogs(search?: string, categoryId?: string) {
  const supabase = await createClientServer()
  let query = supabase
    .from("blogs")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })

  if (search) {
    query = query.ilike("title", `%${search}%`)
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const { data: blogs, error } = await query

  if (error) {
    console.error("Error fetching blogs:", error)
    return []
  }

  return blogs?.map((blog) => ({
    ...blog,
    category_name: blog.categories?.name,
  })) || []
}

export async function getBlog(slug: string) {
  const supabase = await createClientServer()
  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*, categories(name)")
    .eq("id", slug)
    .single()

  if (error) {
    console.error("Error fetching blog:", error)
    return null
  }

  return {
    ...blog,
    category_name: blog.categories?.name,
  }
}

export async function getCategories() {
  const supabase = await createClientServer()
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return categories || []
}

export async function createBlog(formData: FormData) {
  const supabase = await createClientServer()
  const title = formData.get("title") as string
  const category_id = formData.get("category_id") as string
  const content = formData.get("content") as string
  const header_image = formData.get("header_image") as string

  const { error } = await supabase.from("blogs").insert({
    title,
    category_id,
    content,
    header_image: header_image || null,
  })

  if (error) {
    console.error("Error creating blog:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

export async function updateBlog(id: string, formData: FormData) {
  const supabase = await createClientServer()
  const title = formData.get("title") as string
  const category_id = formData.get("category_id") as string
  const content = formData.get("content") as string
  const header_image = formData.get("header_image") as string

  const { error } = await supabase
    .from("blogs")
    .update({
      title,
      category_id,
      content,
      header_image: header_image || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating blog:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  redirect("/")
}

export async function deleteBlog(id: string) {
  const supabase = await createClientServer()

  const { error } = await supabase.from("blogs").delete().eq("id", id)

  if (error) {
    console.error("Error deleting blog:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  return { success: true }
}