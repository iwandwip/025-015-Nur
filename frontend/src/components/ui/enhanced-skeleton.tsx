import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'pulse' | 'wave' | 'none'
}

function Skeleton({
  className,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted",
        animation === 'pulse' && "animate-pulse",
        animation === 'wave' && "animate-[wave_2s_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  )
}

function SkeletonChart() {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <div className="h-64 md:h-80 relative">
        <div className="absolute inset-0 space-y-4">
          {/* Chart area */}
          <div className="flex justify-between items-end h-full px-4 pb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton 
                key={i} 
                className="w-2" 
                style={{ height: `${Math.random() * 60 + 20}%` }}
                animation="wave"
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between px-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="bg-muted/50 p-3 border-b">
          <div className="flex justify-between">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16" />
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-3 border-b last:border-b-0">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-4" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonChart, 
  SkeletonTable 
}