"use client"

import { useQuery } from "@tanstack/react-query"
import { createClientBrowser } from "@/lib/supabase/client"
import type { Blog, Category } from "@/types"

const supabase = createClientBrowser()

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*, categories(name)")
        .order("created_at", { ascending: false })

      if (error) throw error
      return (data || []).map((blog) => ({
        ...blog,
        category_name: blog.categories?.name,
      })) as Blog[]
    },
  })
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*, categories(name)")
        .eq("id", id)
        .single()

      if (error) throw error
      return {
        ...data,
        category_name: data.categories?.name,
      } as Blog
    },
    enabled: !!id,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name")

      if (error) throw error
      return data as Category[]
    },
  })
}