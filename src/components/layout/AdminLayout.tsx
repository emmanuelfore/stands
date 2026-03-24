import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  Map as MapIcon, 
  Users, 
  CreditCard, 
  BarChart3, 
  Files, 
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Developments', href: '/admin/developments', icon: Building2 },
  { name: 'Stands', href: '/admin/stands', icon: MapIcon },
  { name: 'Buyers', href: '/admin/buyers', icon: Users },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Documents', href: '/admin/documents', icon: Files },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-bg-base">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-bg-surface flex flex-col fixed inset-y-0">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center font-bold text-white">
              SV
            </div>
            <span className="font-display text-xl font-bold tracking-tight">StandVault</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group",
                  isActive 
                    ? "bg-primary-muted text-primary" 
                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-text-muted group-hover:text-text-secondary")} />
                <span className="font-medium">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-text-secondary hover:bg-danger/10 hover:text-danger transition-colors group">
            <LogOut className="w-5 h-5 text-text-muted group-hover:text-danger" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="h-16 border-b border-border bg-bg-surface/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted">Developments</span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <span className="text-text-primary font-medium">Hogerty Hill Phase 2</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-bg-elevated border border-border" />
          </div>
        </header>

        <div className="p-8 flex-1 animate-fade-in-up">
          {children}
        </div>
      </main>
    </div>
  )
}
