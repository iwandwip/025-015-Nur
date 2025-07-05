import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Menu, BarChart3, User, Settings, Thermometer } from 'lucide-react'

const navigation = [
  {
    name: 'Monitoring',
    href: '/',
    icon: BarChart3,
    description: 'Sensor Dashboard'
  },
  {
    name: 'Control',
    href: '/control',
    icon: Settings,
    description: 'AC Management'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Settings & Account'
  }
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>
        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center gap-2 px-6 border-b">
            <Thermometer className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold">Smart AC Control</h1>
              <p className="text-xs text-muted-foreground">IoT Monitoring System</p>
            </div>
          </div>
          
          <Separator />
          
          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon
              
              return (
                <Link key={item.name} to={item.href} onClick={() => setOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start h-auto p-3",
                      isActive && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className={cn(
                        "text-xs truncate",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </Button>
                </Link>
              )
            })}
          </nav>
          
          <Separator />
          
          {/* System Status */}
          <div className="p-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/50 p-3 text-center border">
              <Settings className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                System Status
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                All sensors online
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}