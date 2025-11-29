// Handles tha major auth operations i.e login and register
import { supabase } from '../supabase/client';

export const registerUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}

export const loginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}

export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}
