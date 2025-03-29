import { supabase } from './supabase';
import type { SavedTour } from './supabase';
import type { Itinerary } from '../types';

export async function saveTour(userId: string, itinerary: Itinerary) {
  const { data, error } = await supabase
    .from('saved_tours')
    .insert([
      {
        user_id: userId,
        title: itinerary.title || 'My Tour',
        destinations: itinerary.places.map(place => place.name),
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserTours(userId: string): Promise<SavedTour[]> {
  const { data, error } = await supabase
    .from('saved_tours')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteTour(tourId: string) {
  const { error } = await supabase
    .from('saved_tours')
    .delete()
    .eq('id', tourId);

  if (error) throw error;
} 