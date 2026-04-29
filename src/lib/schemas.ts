import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category_id: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
})

export type BlogFormValues = z.infer<typeof blogSchema>