import axios from 'axios';
import { createClient } from '../utils/supabase/client';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

api.interceptors.request.use(async (config) => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
    console.log("Token enviado na requisição (primeiros 10 chars):", session.access_token.substring(0, 10));
  } else {
    console.error("NENHUM TOKEN ENCONTRADO NO SUPABASE!");
  }
  return config;
});

export default api;