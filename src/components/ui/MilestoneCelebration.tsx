import React, { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, X } from 'lucide-react'
import { Button } from '../ui/Button'

interface MilestoneProps {
  milestone: string
  onClose: () => void
}

export const MilestoneCelebration: React.FC<MilestoneProps> = ({ milestone, onClose }) => {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-bg-base/90 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="premium-card max-w-sm w-full text-center relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)]" />
            </div>

            <button 
                onClick={() => { setShow(false); setTimeout(onClose, 300) }}
                className="absolute top-4 right-4 text-text-muted hover:text-text-primary transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="relative z-10 py-6">
                <div className="w-24 h-24 rounded-full bg-trophy/20 border-4 border-trophy/30 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-trophy/20">
                    <Trophy className="w-12 h-12 text-trophy" />
                </div>
                
                <div className="flex justify-center gap-1 mb-4">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-accent text-accent" />)}
                </div>

                <h2 className="text-3xl font-display font-bold text-text-primary mb-2">Incredible!</h2>
                <p className="text-xl font-display font-bold text-primary mb-4">{milestone}</p>
                <p className="text-text-secondary text-sm mb-8 px-4">
                    You've reached a major milestone on your journey to owning your home stand. Keep the momentum going!
                </p>

                <Button className="w-full py-6 text-lg" onClick={() => { setShow(false); setTimeout(onClose, 300) }}>
                    Let's Go! 🚀
                </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
