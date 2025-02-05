import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API!,
);

supabase
  .channel('realtime_updates')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('Change received!', payload);
  })
  .subscribe();
