import { useLocation, Link } from '@tanstack/react-router'
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Building, Users, Calendar, MapPin, BarChart3, CreditCard } from "lucide-react"

interface BreadcrumbConfig {
  path: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
}

const breadcrumbConfig: BreadcrumbConfig[] = [
  { path: '/admin', label: 'Admin', icon: Home },
  { path: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { path: '/admin/fields', label: 'Fields', icon: Building },
  { path: '/admin/locations', label: 'Locations', icon: MapPin },
  { path: '/admin/payments', label: 'Payments', icon: CreditCard },
]

export function DynamicBreadcrumb() {
  const location = useLocation()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  
  // Build breadcrumb items from current path
  const breadcrumbItems: Array<{ path: string; label: string; icon?: React.ComponentType<{ className?: string }> }> = []
  
  let currentPath = ''
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    const config = breadcrumbConfig.find(item => item.path === currentPath)
    
    if (config) {
      breadcrumbItems.push({
        path: currentPath,
        label: config.label,
        icon: config.icon
      })
    } else {
      // Fallback for unknown routes - capitalize the segment
      breadcrumbItems.push({
        path: currentPath,
        label: segment.charAt(0).toUpperCase() + segment.slice(1)
      })
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const IconComponent = item.icon
          
          return (
            <div key={item.path} className="flex items-center">
              <BreadcrumbItem className={index === 0 ? "hidden md:flex" : ""}>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path} className="flex items-center gap-1 hover:text-foreground">
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
