import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from './lib/supabase'
import { AdminLayout } from './components/layout/AdminLayout'
import { BuyerLayout } from './components/layout/BuyerLayout'
import { AuthScreen } from './pages/AuthScreen'
import { LandingPage } from './pages/Landing'
import { AdminDashboard } from './pages/admin/Dashboard'
import { DevelopmentsPage } from './pages/admin/Developments'
import { StandsPage } from './pages/admin/Stands'
import { BuyersPage } from './pages/admin/Buyers'
import { PaymentsQueue } from './pages/admin/PaymentsQueue'
import { ReportsPage } from './pages/admin/Reports'
import { DocumentsPage } from './pages/admin/Documents'
import { BulkMatching } from './pages/admin/BulkMatching'
import { TransferWorkflow } from './pages/admin/TransferWorkflow'
import { PenaltyManagement } from './pages/admin/PenaltyManagement'
import { BuyerDashboard } from './pages/buyer/Dashboard'
import { PaymentSchedule } from './pages/buyer/Schedule'
import { SubmitPayment } from './pages/buyer/SubmitPayment'
import { PayoffSimulator } from './pages/buyer/PayoffSimulator'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Basic Routing Logic
  // In a real app, we'd check roles/metadata to decide where to route
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {!session ? (
            <>
              <Route path="/admin/login" element={<AuthScreen role="admin" />} />
              <Route path="/portal/login" element={<AuthScreen role="buyer" />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminLayout>
                    <Routes>
                      <Route path="/" element={<AdminDashboard />} />
                      <Route path="/developments" element={<DevelopmentsPage />} />
                      <Route path="/stands" element={<StandsPage />} />
                      <Route path="/buyers" element={<BuyersPage />} />
                      <Route path="/payments" element={<PaymentsQueue />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/documents" element={<DocumentsPage />} />
                      <Route path="/bulk-match" element={<BulkMatching />} />
                      <Route path="/transfers" element={<TransferWorkflow />} />
                      <Route path="/penalties" element={<PenaltyManagement />} />
                      <Route path="/settings" element={<div>Settings</div>} />
                    </Routes>
                  </AdminLayout>
                }
              />

              {/* Buyer Routes */}
              <Route
                path="/portal/*"
                element={
                  <BuyerLayout>
                    <Routes>
                      <Route path="/" element={<BuyerDashboard />} />
                      <Route path="/schedule" element={<PaymentSchedule />} />
                      <Route path="/submit-payment" element={<SubmitPayment />} />
                      <Route path="/simulator" element={<PayoffSimulator />} />
                      <Route path="/payments" element={<div>Payment History</div>} />
                      <Route path="/documents" element={<div>Vault</div>} />
                      <Route path="/profile" element={<div>Your Profile</div>} />
                    </Routes>
                  </BuyerLayout>
                }
              />

              {/* Fallback */}
              <Route 
                path="*" 
                element={<Navigate to={session.user.email?.includes('admin') ? "/admin" : "/portal"} replace />} 
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
