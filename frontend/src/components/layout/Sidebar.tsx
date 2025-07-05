import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BarChart3, User, Settings, Thermometer } from 'lucide-react'

const navigation = [
  {
    name: 'Monitoring',
    href: '/',
    icon: BarChart3,
    description: 'Sensor Dashboard'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Settings & Account'
  }
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-50 dark:bg-gray-900 sticky top-0">
      <div className="flex h-16 items-center gap-2 px-6 border-b">
        <Thermometer className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-lg font-semibold">Smart AC Control</h1>
          <p className="text-xs text-muted-foreground">IoT Monitoring System</p>
        </div>
      </div>
      
      <Separator />
      
      <nav className="flex-1 space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link key={item.name} to={item.href}>
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
      
      <div className="p-4">
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-3 text-center">
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
  )
}