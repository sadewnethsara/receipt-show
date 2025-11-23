import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pmorkwivuibpgbusocif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtb3Jrd2l2dWlicGdidXNvY2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTc2NDMsImV4cCI6MjA3ODA3MzY0M30.OspO64dwsFRbOJy8BqS32ZknNpiKTI6QipLQJ5TiEOE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
