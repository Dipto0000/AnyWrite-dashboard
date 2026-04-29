import { createClientServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const supabase = await createClientServer()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}

export async function getSession() {
  const supabase = await createClientServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}