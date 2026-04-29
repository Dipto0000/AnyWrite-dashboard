export interface Blog {
  id: string
  title: string
  category_id: string
  category_name?: string
  content: string
  header_image: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
}