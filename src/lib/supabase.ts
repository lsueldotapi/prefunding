import { createClient } from '@supabase/supabase-js';

// Check if environment variables are defined
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging for environment variables
console.log('🔍 Supabase Configuration Check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Missing Supabase environment variables. Please check your .env file or Netlify environment variables.';
  console.error('❌', errorMsg);
  throw new Error(errorMsg);
}

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Enhanced connection test function
export async function testConnection() {
  try {
    console.log('🔌 Testing Supabase connection...');
    
    // Test basic connection with a simple query
    const { data, error } = await supabase.from('clients').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful');
    return { success: true, data };
  } catch (error) {
    console.error('❌ Unexpected error connecting to Supabase:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to safely fetch clients
export async function fetchClients(tableName: 'clients' | 'clients_duplicate' = 'clients') {
  try {
    console.log(`📋 Fetching clients from ${tableName}...`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('client_company_name');

    if (error) {
      console.error(`❌ Error fetching clients from ${tableName}:`, error);
      return { data: null, error: error.message };
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} clients from ${tableName}`);
    return { data: data || [], error: null };
  } catch (error) {
    console.error(`❌ Unexpected error fetching clients from ${tableName}:`, error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Function to safely fetch a single client
export async function fetchClient(clientId: string, tableName: 'clients' | 'clients_duplicate' = 'clients') {
  try {
    console.log(`👤 Fetching client ${clientId} from ${tableName}...`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) {
      console.error(`❌ Error fetching client ${clientId} from ${tableName}:`, error);
      return { data: null, error: error.message };
    }

    console.log(`✅ Successfully fetched client ${clientId} from ${tableName}`);
    return { data, error: null };
  } catch (error) {
    console.error(`❌ Unexpected error fetching client ${clientId} from ${tableName}:`, error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}