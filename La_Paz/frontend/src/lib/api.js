import axios from 'axios';
import { createClient } from '../utils/supabase/client';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const supabase = createClient(); // Usa o novo client SSR
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error("Erro ao buscar sessão do Supabase:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;