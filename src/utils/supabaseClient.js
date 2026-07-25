import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient(
  'https://cfebfglgrlbzdmhrwmra.supabase.co',
  'sb_publishable_XyzQZvg5jFBGsSPuj_3U_A_MyGRo2V3',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export default supabase;
