import { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from './AuthModal'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Card className="w-full max-w-md">
              <CardContent className="p-8 text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome to pas<span className="text-cyan-600">S</span>2<span className="text-blue-600">K</span>ampus
                </h1>
                <p className="text-gray-600 mb-6">
                  Your complete guide to studying in France. Sign in to track your progress and access personalized features.
                </p>
                <Button onClick={() => setShowAuthModal(true)} className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    )
  }

  return <>{children}</>
}