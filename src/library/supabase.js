// src/library/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://agnwclsgsviiajipoaov.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbndjbHNnc3ZpaWFqaXBvYW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMTgzMzIsImV4cCI6MjA1ODY5NDMzMn0.z-Qb9lg8u_DfJ4fVQaYZPZ9GlqHU-jHTDLAhhXBLDuM"; // your full anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
