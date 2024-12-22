'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthWrapper({ children }) {
    const [user, loading] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if (loading) return; // Wait until the auth state is fully resolved

        // Handle redirection based on the user's auth state
        if (user) {
            if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
                router.replace('/'); // Redirect to home if logged in and on login/signup page
            }
        } else {
            if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                router.replace('/login'); // Redirect to login if not logged in and on any other page
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading...</div>; // Show loading state while auth state is being determined
    }

    return <>{children}</>;
}
