import { supabase } from '../supabase/client';
import { getUserProfile } from './userService';

export const registerUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}


// Helper to set cookie
const setCookie = (name: string, value: string, maxAge: number) => {
    // Note: Removed 'Secure' for localhost development support
    document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

// Helper to delete cookie
const deleteCookie = (name: string) => {
    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

//token aayo vany cookies ma store garney
//error aayp vaye errror log garney and return garney
export const loginUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log(data);
    if (error) throw error

    if (data.session) {
        // Set cookies for middleware authentication
        setCookie('sb-access-token', data.session.access_token, data.session.expires_in);
        setCookie('sb-refresh-token', data.session.refresh_token, 60 * 60 * 24 * 7); // 7 days
    }

    return data
}

/**
 * Logs in the user and fetches their profile details from the database.
 * Useful for initializing app state after login.
 */
export const loginUserWithDetails = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    if (data?.user) {
        const profile = await getUserProfile(data.user.id);
        return { ...data, profile };
    }
    return data;
}

/**
 * Logs out the user by signing out from Supabase.
 * Component calling this should handle redirection (e.g., router.push('/login')).
 */
export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error during sign out:', error.message);
        throw error;
    }

    // Clear cookies on logout
    deleteCookie('sb-access-token');
    deleteCookie('sb-refresh-token');
}
