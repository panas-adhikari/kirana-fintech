// Handles tha major auth operations i.e login and register
import { supabase } from '../supabase/client';

export const registerUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}
//token aayo vany cookies ma store garney
//error aayp vaye errror log garney and return garney
export const loginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}
//1 cookies clear garney
//2 supabase ko signout function call garney
//2 router.push('/login') garney
export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}
