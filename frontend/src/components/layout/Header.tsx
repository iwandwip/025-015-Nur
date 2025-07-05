import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ModeToggle } from '@/components/mode-toggle'
import { Bell, RefreshCw, Wifi } from 'lucide-react'
import { format } from 'date-fns'

interface HeaderProps {
  title: string
  onRefresh?: () => void
}

export function Header({ title, onRefresh }: HeaderProps) {
  const currentTime = format(new Date(), 'PPp')

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{currentTime}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Badge variant="outline" className="gap-1">
          <Wifi className="h-3 w-3" />
          Connected
        </Badge>
        
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
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