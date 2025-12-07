'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Try to fetch user profile from database, but don't fail if table doesn't exist
    const fetchUserProfile = async (userId: string) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                return null;
            }

            return profile;
        } catch (err) {
            return null;
        }
    };

    // Update user state with profile data or fallback to Supabase user metadata
    const updateUserState = (supabaseUser: SupabaseUser | null, profile?: any) => {
        if (!supabaseUser) {
            setUser(null);
            setRole(null);
            setSupabaseUser(null);
            return;
        }

        setSupabaseUser(supabaseUser);

        if (profile) {
            // Use profile from database
            const userRole = profile.role as UserRole || UserRole.COLLABORATOR;
            setUser({
                id: supabaseUser.id,
                name: profile.full_name || supabaseUser.email?.split('@')[0] || 'Usuario',
                email: supabaseUser.email || '',
                role: userRole,
                avatarUrl: profile.avatar_url,
            });
            setRole(userRole);
        } else {
            // Fallback: use Supabase user metadata
            const userEmail = supabaseUser.email || '';

            // Check if this is the admin email
            let userRole = UserRole.COLLABORATOR;
            const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

            if (adminEmail && userEmail === adminEmail) {
                userRole = UserRole.GLOBAL_ADMIN;
            }

            setUser({
                id: supabaseUser.id,
                name: supabaseUser.user_metadata?.full_name ||
                    supabaseUser.user_metadata?.name ||
                    userEmail.split('@')[0] || 'Usuario',
                email: userEmail,
                role: userRole,
                avatarUrl: supabaseUser.user_metadata?.avatar_url ||
                    supabaseUser.user_metadata?.picture,
            });
            setRole(userRole);
        }
    };

    // Initialize auth state
    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                // Get initial session with timeout
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Session timeout')), 5000)
                );

                const result = await Promise.race([sessionPromise, timeoutPromise]) as any;
                const initialSession = result?.data?.session;

                if (mounted) {
                    setSession(initialSession || null);

                    if (initialSession?.user) {
                        // Try to fetch profile, but don't block
                        const profile = await fetchUserProfile(initialSession.user.id).catch(() => null);
                        updateUserState(initialSession.user, profile);
                    } else {
                        updateUserState(null);
                    }

                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        initAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            console.log('Auth state changed:', event);
            if (mounted) {
                setSession(newSession);

                if (newSession?.user) {
                    const profile = await fetchUserProfile(newSession.user.id).catch(() => null);
                    updateUserState(newSession.user, profile);
                } else {
                    updateUserState(null);
                }

                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Check if user has permission
    const checkPermission = (permission: Permission): boolean => {
        if (!role) return false;
        const permissions = ROLE_PERMISSIONS[role] || [];
        return permissions.includes(permission);
    };

    // Sign out
    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setSupabaseUser(null);
            setSession(null);
            setRole(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
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
