import dotenv from "dotenv";
dotenv.config();

import { createClient } from '@supabase/supabase-js'


const supabase_url = process.env.SUPABASE_URL!
const supabase_key = process.env.SUPABASE_PUBLISHABLE_KEY!

const supabase = createClient(supabase_url, supabase_key);


export default supabase