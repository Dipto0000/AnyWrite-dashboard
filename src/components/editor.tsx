"use client"

import { useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { cn } from "@/lib/utils"
import { createClientBrowser } from "@/lib/supabase/client"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Code,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditorProps {
  content: string
  onChange: (content: string) => void
  className?: string
}

const ToolbarButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title?: string
}) => (
  <Button
    type="button"
    variant="ghost"
    size="icon"
    onClick={onClick}
    title={title}
    className={cn(isActive && "bg-secondary")}
  >
    {children}
  </Button>
)

const PlaceholderExtension = Placeholder.configure({
  placeholder: "Write your blog content here...",
})

export function Editor({ content, onChange, className }: EditorProps) {
  const supabase = createClientBrowser()
  const [uploading, setUploading] = useState(false)
  const [imageInputKey, setImageInputKey] = useState(0)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

    setUploading(true)
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `blog-content/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file)

    if (uploadError) {
      console.error("Upload error:", uploadError)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath)
    
    editor.chain().focus().setImage({ src: data.publicUrl }).run()
    setUploading(false)
    setImageInputKey((k) => k + 1)
  }

  const addLink = () => {
    const url = window.prompt("Enter URL")
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: true,
      }),
      PlaceholderExtension,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) return null

  return (
    <div className={cn("border border-border rounded-md overflow-hidden", className)}>
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-secondary/50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-border mx-1" />
        <ToolbarButton
          onClick={addLink}
          isActive={editor.isActive("link")}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="relative">
          <ToolbarButton
            onClick={() => document.getElementById("inline-image-input")?.click()}
            title="Add Image"
          >
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <Input
            id="inline-image-input"
            key={imageInputKey}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {uploading && (
            <span className="absolute -top-6 left-0 text-xs text-muted-foreground">
              Uploading...
            </span>
          )}
        </div>
      </div>
      <EditorContent editor={editor} className="bg-transparent min-h-[300px]" />
    </div>
  )
}