import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'

export interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  isProUser: boolean
  subscriptionStatus: string
  monthlyContentLimit: number
  contentProcessedThisMonth: number
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    isProUser: false,
    subscriptionStatus: 'free',
    monthlyContentLimit: 1,
    contentProcessedThisMonth: 0
  })

  useEffect(() => {
    console.log('useAuth: Initializing...')
    
    // Get initial session
    const getInitialSession = async () => {
      console.log('useAuth: Calling getSession...')
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('useAuth: Session data:', session)
        console.log('useAuth: Session error:', error)
        
        if (session?.user) {
          console.log('useAuth: User found in session, fetching profile...')
          const profile = await fetchUserProfile(session.user.id)
          console.log('useAuth: Profile fetched:', profile)
          
          setAuthState({
            user: session.user,
            session,
            profile,
            loading: false,
            isProUser: profile?.subscription_status === 'pro' || profile?.is_pro_user || false,
            subscriptionStatus: profile?.subscription_status || 'free',
            monthlyContentLimit: profile?.monthly_content_limit || 1,
            contentProcessedThisMonth: profile?.content_processed_this_month || 0
          })
          console.log('useAuth: Setting loading to false (session found)')
        } else {
          console.log('useAuth: No session found')
          setAuthState(prev => ({ 
            ...prev, 
            loading: false 
          }))
          console.log('useAuth: Setting loading to false (no session)')
        }
      } catch (error) {
        console.error('useAuth: Error in getInitialSession:', error)
        setAuthState(prev => ({ 
          ...prev, 
          loading: false 
        }))
        console.log('useAuth: Setting loading to false (error occurred)')
      }
    }

    getInitialSession()

    // Listen for auth changes
    console.log('useAuth: Setting up auth state change listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state change event:', event)
        console.log('useAuth: Auth state change session:', session)
        
        try {
          if (session?.user) {
            console.log('useAuth: User found in auth change, fetching profile...')
            const profile = await fetchUserProfile(session.user.id)
            console.log('useAuth: Profile fetched in auth change:', profile)
            
            setAuthState({
              user: session.user,
              session,
              profile,
              loading: false,
              isProUser: profile?.subscription_status === 'pro' || profile?.is_pro_user || false,
              subscriptionStatus: profile?.subscription_status || 'free',
              monthlyContentLimit: profile?.monthly_content_limit || 1,
              contentProcessedThisMonth: profile?.content_processed_this_month || 0
            })
            console.log('useAuth: Setting loading to false (auth change with user)')
          } else {
            console.log('useAuth: No user in auth change')
            setAuthState({
              user: null,
              session: null,
              profile: null,
              loading: false,
              isProUser: false,
              subscriptionStatus: 'free',
              monthlyContentLimit: 1,
              contentProcessedThisMonth: 0
            })
            console.log('useAuth: Setting loading to false (auth change without user)')
          }
        } catch (error) {
          console.error('useAuth: Error in auth state change handler:', error)
          setAuthState({
            user: null,
            session: null,
            profile: null,
            loading: false,
            isProUser: false,
            subscriptionStatus: 'free',
            monthlyContentLimit: 1,
            contentProcessedThisMonth: 0
          })
          console.log('useAuth: Setting loading to false (auth change error)')
        }
      }
    )

    console.log('useAuth: Auth state change listener set up')

    return () => {
      console.log('useAuth: Cleaning up auth state change listener')
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
    console.log('useAuth: fetchUserProfile called for userId:', userId)
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('useAuth: Error fetching profile:', error)
        return null
      }

      console.log('useAuth: Profile fetch successful:', data)
      return data
    } catch (error) {
      console.error('useAuth: Exception in fetchUserProfile:', error)
      return null
    }
  }

  const signUp = async (email: string, password: string) => {
    console.log('useAuth: signUp called for email:', email)
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error('useAuth: signUp error:', error)
      throw error
    }
    
    console.log('useAuth: signUp successful:', data)
    return data
  }

  const signIn = async (email: string, password: string) => {
    console.log('useAuth: signIn called for email:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('useAuth: signIn error:', error)
      throw error
    }
    
    console.log('useAuth: signIn successful:', data)
    return data
  }

  const signOut = async () => {
    console.log('useAuth: signOut called')
    
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('useAuth: signOut error:', error)
      throw error
    }
    
    console.log('useAuth: signOut successful')
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    console.log('useAuth: updateProfile called with updates:', updates)
    
    if (!authState.user) {
      console.error('useAuth: updateProfile called but no user logged in')
      throw new Error('No user logged in')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', authState.user.id)
      .select()
      .single()

    if (error) {
      console.error('useAuth: updateProfile error:', error)
      throw error
    }

    console.log('useAuth: updateProfile successful:', data)
    setAuthState(prev => ({
      ...prev,
      profile: data,
      isProUser: data.subscription_status === 'pro' || data.is_pro_user,
      subscriptionStatus: data.subscription_status || 'free',
      monthlyContentLimit: data.monthly_content_limit || 1,
      contentProcessedThisMonth: data.content_processed_this_month || 0
    }))

    return data
  }

  console.log('useAuth: Current auth state:', authState)

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile: () => authState.user && fetchUserProfile(authState.user.id)
  }
}