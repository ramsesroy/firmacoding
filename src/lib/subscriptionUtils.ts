import { supabase } from "./supabaseClient";

export type PlanType = 'free' | 'premium' | 'team' | 'agency';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  stripe_subscription_id?: string | null;
  stripe_customer_id?: string | null;
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
 * Verifica si un usuario tiene plan premium activo
 */
export async function isPremiumUser(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('plan_type, status, current_period_end')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Si no hay suscripción, es usuario free
      return false;
    }

    // Verificar que el plan no sea free y esté activo
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
 * Obtiene la información de suscripción del usuario
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Si no existe suscripción, crear una free por defecto
      return await createFreeSubscription(userId);
    }

    return data as Subscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

/**
 * Crea una suscripción free por defecto para un usuario
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
        current_period_end: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 100 años (ilimitado)
        cancel_at_period_end: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating free subscription:', error);
      return null;
    }

    // También crear límites iniciales
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
 * Verifica si el usuario puede guardar más firmas
 */
export async function canSaveSignature(userId: string): Promise<{ canSave: boolean; remaining: number; limit: number }> {
  try {
    const subscription = await getUserSubscription(userId);
    
    // Premium users tienen límite ilimitado
    if (subscription && subscription.plan_type !== 'free' && subscription.status === 'active') {
      return { canSave: true, remaining: -1, limit: -1 }; // -1 significa ilimitado
    }

    // Para usuarios free, verificar límite
    const { data: limits, error } = await supabase
      .from('user_limits')
      .select('saved_signatures_count, max_saved_signatures')
      .eq('user_id', userId)
      .single();

    if (error || !limits) {
      // Crear registro inicial si no existe
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
 * Incrementa el contador de firmas guardadas
 */
export async function incrementSavedSignatures(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('increment_saved_signatures', { 
      p_user_id: userId 
    });

    if (error) {
      // Fallback: actualizar manualmente si la función RPC no existe
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
      // Fallback: actualizar manualmente
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
 * Obtiene los límites actuales del usuario
 */
export async function getUserLimits(userId: string): Promise<UserLimits | null> {
  try {
    const { data, error } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Crear límites por defecto
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
 * Verifica si el usuario tiene acceso a una característica premium
 */
export async function hasPremiumFeature(userId: string, feature: 'templates' | 'unlimited_saves' | 'analytics' | 'no_watermark'): Promise<boolean> {
  const isPremium = await isPremiumUser(userId);
  
  if (isPremium) {
    return true;
  }

  // Para usuarios free, algunas características están limitadas
  switch (feature) {
    case 'templates':
      return false; // Solo tienen acceso a templates básicos
    case 'unlimited_saves':
      return false; // Tienen límite de 3
    case 'analytics':
      return false;
    case 'no_watermark':
      return false;
    default:
      return false;
  }
}

