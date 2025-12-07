"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole, Permission, ROLE_PERMISSIONS } from '@/types/auth';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isLoading: boolean;
    checkPermission: (permission: Permission) => boolean;
    // Temporary for debugging/demo purposes
    debugSetRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MOCK USER for development
const MOCK_USER: User = {
    id: 'user_123',
    name: 'Demo User',
    email: 'demo@riblaeditores.com',
    role: UserRole.GLOBAL_ADMIN, // Default to highest priv
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Simulate picking up a session
    useEffect(() => {
        // In a real app, we would fetch session from Supabase/API here
        const initSession = async () => {
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
                setUser(MOCK_USER);
            } catch (error) {
                console.error('Session init error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initSession();
    }, []);

    const checkPermission = (permission: Permission): boolean => {
        if (!user || !user.role) return false;
        const allowedPermissions = ROLE_PERMISSIONS[user.role];
        return allowedPermissions.includes(permission);
    };

    const debugSetRole = (newRole: UserRole) => {
        if (user) {
            setUser({ ...user, role: newRole });
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            role: user?.role || null,
            isLoading,
            checkPermission,
            debugSetRole
        }}>
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
