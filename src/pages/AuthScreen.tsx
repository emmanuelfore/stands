import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export const AuthScreen: React.FC<{ role: 'admin' | 'buyer' }> = ({ role }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [otp, setOtp] = useState('')

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      setIsSent(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'magiclink' })
      if (error) throw error
      // Redirect handled by auth listener
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-base relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 overflow-hidden">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-bg-surface border border-border rounded-xl mb-6 shadow-2xl animate-fade-in-up">
            <span className="text-primary font-display font-bold text-2xl">SV</span>
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2 animate-fade-in-up">StandVault</h1>
          <p className="text-text-secondary animate-fade-in-up delay-100">
            {role === 'admin' ? 'Strategic Land Management' : 'Your path to land ownership'}
          </p>
        </div>

        <div className="premium-card animate-fade-in-up delay-150">
          {!isSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-6" isLoading={isLoading}>
                Continue with email
                <ArrowRight className="w-5 h-5" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary ml-1 text-center block">
                  Enter 6-digit code sent to {email}
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="000 000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-4 text-3xl font-mono text-center tracking-[0.5em] text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-6" isLoading={isLoading}>
                Verify & Login
                <ShieldCheck className="w-5 h-5" />
              </Button>
              
              <button 
                type="button" 
                onClick={() => setIsSent(false)}
                className="w-full text-sm text-text-muted hover:text-text-secondary transition-colors"
                disabled={isLoading}
              >
                Back to email
              </button>
            </form>
          )}
        </div>
        
        <p className="text-center text-xs text-text-muted mt-8 max-w-[280px] mx-auto">
          By continuing, you agree to StandVault's <span className="underline italic">Terms of Service</span> and <span className="underline italic">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
