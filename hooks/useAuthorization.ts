"use client";

import { useAuth } from '@/context/AuthContext';
import { Permission, UserRole } from '@/types/auth';

/**
 * Hook to check if the current user has a specific permission.
 * @param permission The permission to check.
 * @returns boolean True if authorized.
 * 
 * Example:
 * const canEdit = useCan('manage_products');
 * if (!canEdit) return null;
 */
export function useCan(permission: Permission): boolean {
    const { checkPermission } = useAuth();
    return checkPermission(permission);
}

/**
 * Hook to get the current user's role.
 * @returns UserRole | null
 */
export function useRole(): UserRole | null {
    const { role } = useAuth();
    return role;
}
