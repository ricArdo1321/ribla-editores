"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { COLORS } from '@/constants';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessingOAuth, setIsProcessingOAuth] = useState(false);

    // Supabase logic removed

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const { wpClient } = await import('@/lib/wordpress');
            const { LOGIN_MUTATION } = await import('@/lib/mutations');

            // Call WP GraphQL Login
            const data: any = await wpClient.request(LOGIN_MUTATION, {
                username: email,
                password: password
            });

            if (data?.login?.authToken) {
                const { authToken, user: wpUser } = data.login;

                // Map WP user to our auth context format
                // Assuming WP roles are returned. WPGraphQL JWT usually returns proper user object if requested.
                // Our mutation asks for user { roles { nodes { name } } }

                const userRoleName = wpUser.roles?.nodes[0]?.name?.toLowerCase();
                let role = 'COLLABORATOR'; // Default
                if (userRoleName === 'administrator') role = 'GLOBAL_ADMIN';
                if (userRoleName === 'editor') role = 'EDITOR';

                const userData = {
                    id: wpUser.id || 'wp-id',
                    name: wpUser.name || email.split('@')[0],
                    email: wpUser.email || email,
                    role: role,
                    avatarUrl: null
                };

                // Use the login function from AuthContext (which we need to expose first, or just use localStorage here and reload/redirect)
                // Since AuthContext reads from localStorage on mount, we can set it here.
                // But better to pull `login` from useAuth if available.
                // We added `login` to AuthContext interface in previous step.

                // However, I need to access `login` from useAuth hook. I'll rely on useAuth() having it.
                // But wait, I can't destructure `login` if TS doesn't know it yet?
                // I updated AuthContext file content, so TS should know if I update the import usage but here I am editing the file...
                // I will assume `login` is available.

                // Actually, I can just manually set it here like I did in AuthContext refactor plan.
                localStorage.setItem('wp_token', authToken);
                localStorage.setItem('wp_user', JSON.stringify(userData));
                document.cookie = `wp_token=${authToken}; path=/; max-age=86400; SameSite=Strict`;

                // Force a reload or push to admin to trigger AuthContext re-mount or update
                window.location.href = '/admin';
            } else {
                setError('Credenciales inválidas');
            }

        } catch (err: any) {
            console.error('Login error:', err);
            if (err.message && err.message.includes('invalid_username')) {
                setError('Usuario no encontrado');
            } else if (err.message && err.message.includes('incorrect_password')) {
                setError('Contraseña incorrecta');
            } else {
                setError('Error al iniciar sesión. Verifica tus credenciales.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setIsGoogleLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                setError('Error al conectar con Google');
            }
        } catch (err) {
            setError('Error al iniciar sesión con Google');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col">
            {/* Header */}
            <header className="px-6 py-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio
                </Link>
            </header>

            {/* Login Form */}
            <main className="flex-1 flex items-center justify-center px-6 pb-12">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <h1
                            className="text-2xl font-light tracking-[0.2em] uppercase mb-2"
                            style={{ color: COLORS.ashGray }}
                        >
                            Ribla Editores
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Inicia sesión en tu cuenta
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Email/Password Form */}
                        <form onSubmit={handleEmailLogin} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password */}
                            <div className="text-right">
                                <Link
                                    href="/login/forgot-password"
                                    className="text-sm text-orange-600 hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    'Iniciar sesión'
                                )}
                            </button>
                        </form>


                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-500 mt-6">
                            ¿No tienes cuenta?{' '}
                            <Link href="/login/register" className="text-orange-600 hover:underline font-medium">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
