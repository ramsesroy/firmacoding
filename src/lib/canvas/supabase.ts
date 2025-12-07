// Canvas Editor - Supabase Integration
// Functions to save/load canvas signatures from Supabase

import { supabase } from '@/lib/supabaseClient';
import { SignatureState } from '@/types/canvas';
import { logger } from '@/lib/logger';

export interface CanvasSignature {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  canvas_data: SignatureState;
  html_preview?: string;
  thumbnail_url?: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface SaveCanvasSignatureParams {
  name: string;
  description?: string;
  canvasData: SignatureState;
  htmlPreview?: string;
  thumbnailUrl?: string;
  isFavorite?: boolean;
}

export interface UpdateCanvasSignatureParams extends Partial<SaveCanvasSignatureParams> {
  id: string;
}

/**
 * Get all canvas signatures for the current user
 */
export async function getCanvasSignatures(): Promise<CanvasSignature[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('canvas_signatures')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      logger.error('Error fetching canvas signatures', error, 'Canvas Supabase');
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Error in getCanvasSignatures', error instanceof Error ? error : new Error(String(error)), 'Canvas Supabase');
    throw error;
  }
}

/**
 * Get a single canvas signature by ID
 */
export async function getCanvasSignature(id: string): Promise<CanvasSignature | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('canvas_signatures')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      logger.error('Error fetching canvas signature', error, 'Canvas Supabase');
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Error in getCanvasSignature', error instanceof Error ? error : new Error(String(error)), 'Canvas Supabase');
    throw error;
  }
}

/**
 * Save a new canvas signature
 */
export async function saveCanvasSignature(
  params: SaveCanvasSignatureParams
): Promise<CanvasSignature> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('canvas_signatures')
      .insert({
        user_id: session.user.id,
        name: params.name,
        description: params.description || null,
        canvas_data: params.canvasData,
        html_preview: params.htmlPreview || null,
        thumbnail_url: params.thumbnailUrl || null,
        is_favorite: params.isFavorite || false,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error saving canvas signature', error, 'Canvas Supabase');
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Error in saveCanvasSignature', error instanceof Error ? error : new Error(String(error)), 'Canvas Supabase');
    throw error;
  }
}

/**
 * Update an existing canvas signature
 */
export async function updateCanvasSignature(
  params: UpdateCanvasSignatureParams
): Promise<CanvasSignature> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const updateData: Partial<{
      name: string;
      description: string | null;
      canvas_data: SignatureState;
      html_preview: string | null;
      thumbnail_url: string | null;
      is_favorite: boolean;
    }> = {};
    if (params.name !== undefined) updateData.name = params.name;
    if (params.description !== undefined) updateData.description = params.description || null;
    if (params.canvasData !== undefined) updateData.canvas_data = params.canvasData;
    if (params.htmlPreview !== undefined) updateData.html_preview = params.htmlPreview || null;
    if (params.thumbnailUrl !== undefined) updateData.thumbnail_url = params.thumbnailUrl || null;
    if (params.isFavorite !== undefined) updateData.is_favorite = params.isFavorite;

    const { data, error } = await supabase
      .from('canvas_signatures')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      logger.error('Error updating canvas signature', error, 'Canvas Supabase');
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Error in updateCanvasSignature', error instanceof Error ? error : new Error(String(error)), 'Canvas Supabase');
    throw error;
  }
}

/**
 * Delete a canvas signature
 */
export async function deleteCanvasSignature(id: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('canvas_signatures')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      logger.error('Error deleting canvas signature', error, 'Canvas Supabase');
      throw error;
    }
  } catch (error) {
    logger.error('Error in deleteCanvasSignature', error instanceof Error ? error : new Error(String(error)), 'Canvas Supabase');
    throw error;
  }
}

/**
 * Toggle favorite status of a canvas signature
 */
export async function toggleCanvasSignatureFavorite(id: string): Promise<CanvasSignature> {
  try {
    const signature = await getCanvasSignature(id);
    if (!signature) {
      throw new Error('Signature not found');
    }

    return await updateCanvasSignature({
      id,
      isFavorite: !signature.is_favorite,
    });
  } catch (error) {
    logger.error('Error in toggleCanvasSignatureFavorite', error instanceof Error ? error : new Error(String(error)), 'Canvas Supabase');
    throw error;
  }
}

/**
 * Get favorite canvas signatures
 */
export async function getFavoriteCanvasSignatures(): Promise<CanvasSignature[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('canvas_signatures')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('is_favorite', true)
      .order('updated_at', { ascending: false });

    if (error) {
      logger.error('Error fetching favorite canvas signatures', error, 'Canvas Supabase');
      throw error;
    }

    return data || [];
  } catch (error) {
    logger.error('Error in getFavoriteCanvasSignatures', error instanceof Error ? error : new Error(String(error)), 'Canvas Supabase');
    throw error;
  }
}

