import { supabase } from "./supabaseClient";

export type PlanType = 'free' | 'premium' | 'team' | 'agency';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  lemonsqueezy_subscription_id?: string | null;
  lemonsqueezy_customer_id?: string | null;
  lemonsqueezy_order_id?: string | null;
  lemonsqueezy_variant_id?: string | null;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserLimits {
  user_id: string;
  saved_signatures_count: number;
  max_saved_signatures: number;
  last_reset_date: string;
  created_at: string;
  updated_at: string;
}

/**
 * Checks if a user has an active premium plan
 */
export async function isPremiumUser(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan_type, status, current_period_end')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // If no subscription exists, user is free
      return false;
    }

    // Verify that the plan is not free and is active
    const isActive = data.status === 'active' || data.status === 'trialing';
    const isPremium = data.plan_type !== 'free';
    const isNotExpired = new Date(data.current_period_end) > new Date();

    return isActive && isPremium && isNotExpired;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
}

/**
 * Gets the user's subscription information
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // If subscription doesn't exist, create a free one by default
      return await createFreeSubscription(userId);
    }

    return data as Subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

/**
 * Creates a default free subscription for a user
 */
export async function createFreeSubscription(userId: string): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: 'free',
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 100 years (unlimited)
        cancel_at_period_end: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating free subscription:', error);
      return null;
    }

    // Also create initial limits
    await supabase.from('user_limits').insert({
      user_id: userId,
      saved_signatures_count: 0,
      max_saved_signatures: 3,
      last_reset_date: new Date().toISOString().split('T')[0],
    });

    return data as Subscription;
  } catch (error) {
    console.error('Error creating free subscription:', error);
    return null;
  }
}

/**
 * Checks if the user can save more signatures
 */
export async function canSaveSignature(userId: string): Promise<{ canSave: boolean; remaining: number; limit: number }> {
  try {
    const subscription = await getUserSubscription(userId);
    
    // Premium users have unlimited limit
    if (subscription && subscription.plan_type !== 'free' && subscription.status === 'active') {
      return { canSave: true, remaining: -1, limit: -1 }; // -1 means unlimited
    }

    // For free users, check limit
    const { data: limits, error } = await supabase
      .from('user_limits')
      .select('saved_signatures_count, max_saved_signatures')
      .eq('user_id', userId)
      .single();

    if (error || !limits) {
      // Create initial record if it doesn't exist
      const { data: newLimits } = await supabase
        .from('user_limits')
        .insert({
          user_id: userId,
          saved_signatures_count: 0,
          max_saved_signatures: 3,
          last_reset_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (newLimits) {
        return { canSave: true, remaining: 3, limit: 3 };
      }
      return { canSave: false, remaining: 0, limit: 3 };
    }

    const remaining = limits.max_saved_signatures - limits.saved_signatures_count;
    return { 
      canSave: remaining > 0, 
      remaining: Math.max(0, remaining),
      limit: limits.max_saved_signatures
    };
  } catch (error) {
    console.error('Error checking save limit:', error);
    return { canSave: false, remaining: 0, limit: 3 };
  }
}

/**
 * Increments the saved signatures counter
 */
export async function incrementSavedSignatures(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment_saved_signatures', { 
      p_user_id: userId 
    });

    if (error) {
      // Fallback: update manually if RPC function doesn't exist
      const { data } = await supabase
        .from('user_limits')
        .select('saved_signatures_count')
        .eq('user_id', userId)
        .single();

      if (data) {
        await supabase
          .from('user_limits')
          .update({ 
            saved_signatures_count: data.saved_signatures_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('user_limits')
          .insert({
            user_id: userId,
            saved_signatures_count: 1,
            max_saved_signatures: 3,
            last_reset_date: new Date().toISOString().split('T')[0],
          });
      }
    }

    return true;
  } catch (error) {
    console.error('Error incrementing saved signatures:', error);
    return false;
  }
}

/**
 * Decrementa el contador de firmas guardadas
 */
export async function decrementSavedSignatures(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('decrement_saved_signatures', { 
      p_user_id: userId 
    });

    if (error) {
      // Fallback: update manually
      const { data } = await supabase
        .from('user_limits')
        .select('saved_signatures_count')
        .eq('user_id', userId)
        .single();

      if (data) {
        await supabase
          .from('user_limits')
          .update({ 
            saved_signatures_count: Math.max(0, data.saved_signatures_count - 1),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      }
    }

    return true;
  } catch (error) {
    console.error('Error decrementing saved signatures:', error);
    return false;
  }
}

/**
 * Gets the current user limits
 */
export async function getUserLimits(userId: string): Promise<UserLimits | null> {
  try {
    const { data, error } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Create default limits
      const { data: newLimits } = await supabase
        .from('user_limits')
        .insert({
          user_id: userId,
          saved_signatures_count: 0,
          max_saved_signatures: 3,
          last_reset_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      return newLimits as UserLimits | null;
    }

    return data as UserLimits;
  } catch (error) {
    console.error('Error getting user limits:', error);
    return null;
  }
}

/**
 * Checks if the user has access to a premium feature
 */
export async function hasPremiumFeature(userId: string, feature: 'templates' | 'unlimited_saves' | 'analytics' | 'no_watermark'): Promise<boolean> {
  const isPremium = await isPremiumUser(userId);
  
  if (isPremium) {
    return true;
  }

  // For free users, some features are limited
  switch (feature) {
    case 'templates':
      return false; // Free users only have access to basic templates
    case 'unlimited_saves':
      return false; // Free users have a limit of 3 signatures
    case 'analytics':
      return false;
    case 'no_watermark':
      return false;
    default:
      return false;
  }
}

