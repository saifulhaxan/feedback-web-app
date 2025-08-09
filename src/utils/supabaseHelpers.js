// supabaseHelpers.js
import { supabase } from '../library/supabase';

export async function insertSupabaseUser({ uuid, name, accountType, imageUrl }) {
  try {
    const { error } = await supabase.from('users').insert({
      id: uuid,
      name,
      account_type: accountType,
      image_url: imageUrl,
    });

    if (error) {
      console.error('Supabase insert error:', error.message);
    } else {
      console.log('User inserted into Supabase:', uuid);
    }
  } catch (err) {
    console.error('Supabase insert failed:', err);
  }
} 