import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  ArrowRight, 
  Building2, 
  UserCircle 
} from 'lucide-react'
import { Button } from '../components/ui/Button'

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary selection:bg-primary/30">
      {/* Navigation */}
      <nav className="h-20 border-b border-border bg-bg-surface/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              SV
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">StandVault</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/portal/login">
              <Button variant="ghost">Buyer Portal</Button>
            </Link>
            <Link to="/admin/login">
              <Button>Admin Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
            <Zap className="w-3 h-3" />
            Fintech for Property Developers
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl font-bold leading-[1.1] mb-8 animate-fade-in-up [animation-delay:100ms]">
            Transparency in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Property Finance</span>
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up [animation-delay:200ms]">
            The high-precision platform for managing housing developments. 
            Automate payment schedules, verify PoPs, and give buyers total 
            visibility into their home-ownership journey.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
            <Link to="/admin/login">
              <Button size="lg" className="h-14 px-8 text-lg font-bold group">
                Manage Developments
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/portal/login">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold">
                Access Buyer Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={BarChart3}
              title="Automated Scheduling"
              description="One-click allocation generates 24-month payment schedules with absolute precision. No spreadsheets, no errors."
              delay="100ms"
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="Verified Payments"
              description="A streamlined workflow for bank statement reconciliation. Match proof-of-payments with high-speed accuracy."
              delay="200ms"
            />
            <FeatureCard 
              icon={Zap}
              title="Buyer Gamification"
              description="Buyers see real-time progress. Interactive simulators show exactly how extra payments save months of time."
              delay="300ms"
            />
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
              Built for the <br /> 
              <span className="text-primary">Zimbabwean Real Estate</span> Market.
            </h2>
            <div className="space-y-6">
              <ValuePoint 
                title="Mobile-First for Accessibility" 
                text="Optimized for low-bandwidth environments with PWA support for offline access to financial records."
              />
              <ValuePoint 
                title="Trust-Building Logistics" 
                text="Automated notifications and transparent verification queues remove friction between developer and buyer."
              />
              <ValuePoint 
                title="Multi-Tenant Security" 
                text="Bank-grade isolation ensures that every development and every buyer's data is strictly compartmentalized."
              />
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-white/10 p-8 flex items-center justify-center">
              <div className="w-full h-full bg-bg-base/50 backdrop-blur-md rounded-xl border border-border shadow-2xl flex flex-col p-6 overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <div className="h-4 w-32 bg-bg-elevated rounded animate-pulse" />
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                 </div>
                 <div className="space-y-4">
                    <div className="h-12 w-full bg-bg-elevated rounded animate-pulse [animation-delay:100ms]" />
                    <div className="h-12 w-full bg-bg-elevated rounded animate-pulse [animation-delay:200ms]" />
                    <div className="h-12 w-full bg-bg-elevated rounded animate-pulse [animation-delay:300ms]" />
                 </div>
                 <div className="mt-8 pt-8 border-t border-border">
                    <div className="h-20 w-full bg-primary/5 rounded border border-primary/10" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <div className="w-6 h-6 bg-text-muted rounded flex items-center justify-center font-bold text-white text-[10px]">
              SV
            </div>
            <span className="font-display font-bold tracking-tight text-text-muted text-sm uppercase">StandVault</span>
          </div>
          <p className="text-text-muted text-sm">
            © 2026 StandVault Technologies. High-Precision Estate Logistics.
          </p>
          <div className="flex gap-6 text-sm font-medium text-text-secondary">
             <a href="#" className="hover:text-primary transition-colors">Privacy</a>
             <a href="#" className="hover:text-primary transition-colors">Terms</a>
             <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const FeatureCard: React.FC<{ icon: any, title: string, description: string, delay: string }> = ({ icon: Icon, title, description, delay }) => (
  <div 
    className="p-8 rounded-2xl bg-bg-base border border-border hover:border-primary transition-all duration-300 group animate-fade-in-up"
    style={{ animationDelay: delay }}
  >
    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-text-secondary leading-relaxed">
      {description}
    </p>
  </div>
)

const ValuePoint: React.FC<{ title: string, text: string }> = ({ title, text }) => (
  <div className="flex gap-4">
    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
      <ShieldCheck className="w-3 h-3 text-success" />
    </div>
    <div>
      <h4 className="font-bold mb-1">{title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">{text}</p>
    </div>
  </div>
)
