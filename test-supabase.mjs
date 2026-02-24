import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase URL or Key not found. Make sure they are set in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Attempting to connect to Supabase...");
  const { data, error } = await supabase.from("tours").select("*").limit(1);

  if (error) {
    console.error("Error fetching tours:", error);
  } else {
    console.log("Successfully connected to Supabase and fetched data:");
    console.log(data);
  }
}

testConnection();
