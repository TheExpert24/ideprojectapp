import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';

export interface UserProfile {
  email: string;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      updateUserFields(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateUserFields(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUserFields = (session: Session | null) => {
    if (session?.user) {
      setUser({
        email: session.user.email ?? '',
        name: session.user.user_metadata?.full_name ?? '',
      });
    } else {
      setUser(null);
    }
  };

  return user;
}
