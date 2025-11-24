import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        // Fail gracefully if profile is not accessible (e.g., CORS/RLS)
        console.warn('Failed to fetch profile:', error.message);
        setProfile(null);
        return;
      }
      setProfile(data);
    } catch (e: any) {
      console.warn('Error fetching profile:', e?.message || e);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let cancelled = false;
    // Fallback: ensure we never keep the app in a perpetual loading state
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user);
        }
      } catch (e: any) {
        console.warn('Error getting session:', e?.message || e);
      } finally {
        clearTimeout(fallbackTimer);
        if (!cancelled) setLoading(false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user);
        } else {
          setProfile(null);
        }
      } catch (e: any) {
        console.warn('Auth state change error:', e?.message || e);
      } finally {
        clearTimeout(fallbackTimer);
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      authListener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    refreshProfile
  };

  // Always render children and let consumers decide how to handle `loading`
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
