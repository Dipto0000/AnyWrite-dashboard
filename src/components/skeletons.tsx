export function BlogTableSkeleton() {
  return (
    <div className="border border-border rounded-md">
      <div className="bg-background">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-border last:border-0"
          >
            <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="ml-auto flex gap-2">
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
              <div className="h-8 w-8 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <BlogTableSkeleton />
    </div>
  )
}

export function BlogFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
        <div className="h-9 w-full bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <div className="h-9 w-full bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        <div className="h-48 w-full bg-muted animate-pulse rounded" />
      </div>
      <div className="h-10 w-32 bg-muted animate-pulse rounded" />
    </div>
  )
}