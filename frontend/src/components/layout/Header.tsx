import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/mode-toggle'
import { MobileNav } from '@/components/layout/MobileNav'
import { Bell, RefreshCw, Wifi } from 'lucide-react'
import { format } from 'date-fns'

interface HeaderProps {
  title: string
  onRefresh?: () => void
}

export function Header({ title, onRefresh }: HeaderProps) {
  const currentTime = format(new Date(), 'PPp')

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center">
        <MobileNav />
        <div>
          <h1 className="text-xl md:text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">{currentTime}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <Badge variant="outline" className="gap-1 hidden sm:flex">
          <Wifi className="h-3 w-3" />
          Connected
        </Badge>
        
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Refresh</span>
          </Button>
        )}
        
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <ModeToggle />
      </div>
    </header>
  )
}