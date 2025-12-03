"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUserSubscription, isPremiumUser, Subscription } from '@/lib/subscriptionUtils';

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setSubscription(null);
        setIsPremium(false);
        setLoading(false);
        return;
      }

      try {
        const sub = await getUserSubscription(session.user.id);
        const premium = await isPremiumUser(session.user.id);
        
        setSubscription(sub);
        setIsPremium(premium);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setSubscription(null);
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();

    // Listen for auth changes
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => authSub.unsubscribe();
  }, []);

  return { subscription, isPremium, loading };
}

