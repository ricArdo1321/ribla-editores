'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserRole, Permission, ROLE_PERMISSIONS } from '@/types/auth';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    supabaseUser: SupabaseUser | null;
    session: Session | null;
    role: UserRole | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    checkPermission: (permission: Permission) => boolean;
    signOut: () => Promise<void>;
    login: (token: string, userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // User state maintenance

    // Verify token and fetch user on mount
    useEffect(() => {
        const verifyAuth = async () => {
            const token = localStorage.getItem('wp_token');
            const storedUser = localStorage.getItem('wp_user');

            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setRole(parsedUser.role);
                } catch (e) {
                    console.error('Error parsing stored user', e);
                    signOut();
                }
            } else {
                // If no token, check if we have a session cookie (optional, for server-side match)
                // For now, simple client-side persistence
                setUser(null);
            }
            setIsLoading(false);
        };

        verifyAuth();
    }, []);

    // Check if user has permission
    const checkPermission = (permission: Permission): boolean => {
        if (!role) return false;
        const permissions = ROLE_PERMISSIONS[role] || [];
        return permissions.includes(permission);
    };

    // Sign out
    const signOut = async () => {
        localStorage.removeItem('wp_token');
        localStorage.removeItem('wp_user');
        document.cookie = 'wp_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        setRole(null);
        setSession(null);
        setSupabaseUser(null);
    };

    // Login helper (exposed for Login page to use)
    const login = (token: string, userData: any) => {
        localStorage.setItem('wp_token', token);
        localStorage.setItem('wp_user', JSON.stringify(userData));
        document.cookie = `wp_token=${token}; path=/; max-age=86400; SameSite=Strict`; // Sync with cookie for middleware

        setUser(userData);
        setRole(userData.role);
    };

    const value: AuthContextType = {
        user,
        supabaseUser,
        session,
        role,
        isLoading,
        isAuthenticated: !!user,
        checkPermission,
        signOut,
        login,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
