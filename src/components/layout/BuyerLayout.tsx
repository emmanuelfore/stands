import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  History, 
  Calendar, 
  FileText, 
  UserCircle 
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { name: 'Home', href: '/portal', icon: Home },
  { name: 'Schedule', href: '/portal/schedule', icon: Calendar },
  { name: 'Payments', href: '/portal/payments', icon: History },
  { name: 'Docs', href: '/portal/documents', icon: FileText },
  { name: 'Profile', href: '/portal/profile', icon: UserCircle },
]

export const BuyerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  
  // This state will eventually come from the buyer's payment status
  const status: 'behind' | 'at-risk' | 'on-track' | 'ahead' = 'on-track'

  const statusStyles = {
    'behind': 'from-danger/20 to-bg-base',
    'at-risk': 'from-warning/20 to-bg-base',
    'on-track': 'from-success/10 to-bg-base',
    'ahead': 'from-trophy/20 to-bg-base',
  }

  return (
    <div className={cn(
      "min-h-screen bg-bg-base flex flex-col transition-colors duration-700 bg-gradient-to-b",
      statusStyles[status]
    )}>
      {/* Mobile-first main content */}
      <main className="flex-1 pb-24 px-4 pt-6 max-w-md mx-auto w-full animate-fade-in-up">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-bg-surface/80 backdrop-blur-xl border-t border-border pb-safe pt-2 z-50">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 px-3 transition-all",
                  isActive ? "text-primary translate-y-[-2px]" : "text-text-muted"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
