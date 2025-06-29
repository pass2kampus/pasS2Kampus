import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { Database } from '@/lib/database.types'

type UserProgress = Database['public']['Tables']['user_progress']['Row']

export function useUserProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserProgress()
    } else {
      setProgress(null)
      setLoading(false)
    }
  }, [user])

  const fetchUserProgress = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user progress:', error)
        return
      }

      if (!data) {
        // Create initial progress record
        const initialProgress = {
          user_id: user.id,
          keys: 4,
          completed_modules: [],
          unlocked_modules: ['school', 'pre-arrival-1', 'pre-arrival-2'],
          current_page: 'checklist'
        }

        const { data: newProgress, error: insertError } = await supabase
          .from('user_progress')
          .insert(initialProgress)
          .select()
          .single()

        if (insertError) {
          console.error('Error creating user progress:', insertError)
          return
        }

        setProgress(newProgress)
      } else {
        setProgress(data)
      }
    } catch (error) {
      console.error('Error in fetchUserProgress:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (updates: Partial<UserProgress>) => {
    if (!user || !progress) return

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user progress:', error)
        return
      }

      setProgress(data)
      return data
    } catch (error) {
      console.error('Error in updateProgress:', error)
    }
  }

  return {
    progress,
    loading,
    updateProgress,
    refetch: fetchUserProgress
  }
}