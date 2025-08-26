// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tfuvicxbnemfcuxrugna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdXZpY3hibmVtZmN1eHJ1Z25hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODMzMzI4OSwiZXhwIjoyMDYzOTA5Mjg5fQ.8jvLqTMnU-x9D_UG9hCzDr7kt2tJHC0boZ1HE_MbGgo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
