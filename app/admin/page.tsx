"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';
import {
    LayoutDashboard,
    Users,
    FileText,
    BookOpen,
    Settings,
    BarChart3,
    ShoppingBag,
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    Eye,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Types
interface Profile {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    role: UserRole;
    created_at: string;
}

interface Post {
    id: string;
    title: string;
    author: { full_name: string } | null;
    status: string;
    created_at: string;
}


// Dashboard sections
const DASHBOARD_SECTIONS = [
    {
        id: 'overview',
        name: 'Resumen',
        icon: LayoutDashboard,
        description: 'Vista general del sitio',
        stats: [
            { label: 'Visitas hoy', value: '1,234' },
            { label: 'Posts publicados', value: '24' },
            { label: 'Usuarios activos', value: '8' },
        ]
    },
    {
        id: 'users',
        name: 'Usuarios',
        icon: Users,
        description: 'Gestionar colaboradores y administradores',
        count: 8
    },
    {
        id: 'posts',
        name: 'Posts',
        icon: FileText,
        description: 'Gestionar artículos del blog',
        count: 24
    },
    {
        id: 'catalog',
        name: 'Catálogo',
        icon: BookOpen,
        description: 'Gestionar libros y publicaciones',
        count: 6,
        href: '/admin/catalog'
    },
    {
        id: 'stats',
        name: 'Estadísticas',
        icon: BarChart3,
        description: 'Métricas y análisis del sitio',
    },
    {
        id: 'settings',
        name: 'Configuración',
        icon: Settings,
        description: 'Ajustes generales del sitio',
    },
];

const MOCK_STATS = [
    { label: 'Visitas hoy', value: '1,234' }, // Placeholder
];


export default function AdminDashboard() {
    const router = useRouter();
    const { user, role, isLoading } = useAuth();
    const [activeSection, setActiveSection] = React.useState('overview');
    const [userTab, setUserTab] = React.useState<'admins' | 'collaborators'>('admins');

    // Data State
    const [profiles, setProfiles] = React.useState<Profile[]>([]);
    const [posts, setPosts] = React.useState<Post[]>([]);
    const [stats, setStats] = React.useState({ posts: 0, users: 0, drafts: 0 });
    const [isFetching, setIsFetching] = React.useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                // Fetch Profiles
                const { data: profilesData } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (profilesData) setProfiles(profilesData as any); // Cast for simplicity if types mismatch slightly

                // Fetch Posts
                const { data: postsData } = await supabase
                    .from('posts')
                    .select('*, author:profiles(full_name)')
                    .order('created_at', { ascending: false });

                if (postsData) setPosts(postsData as any);

                // Update Stats
                setStats({
                    posts: postsData?.filter(p => p.status === 'published').length || 0,
                    users: profilesData?.length || 0,
                    drafts: postsData?.filter(p => p.status === 'draft').length || 0
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsFetching(false);
            }
        };

        if (role === UserRole.GLOBAL_ADMIN) {
            fetchData();
        }
    }, [user, role]);


    // Protect route - only GLOBAL_ADMIN
    useEffect(() => {
        if (!isLoading && role !== UserRole.GLOBAL_ADMIN) {
            router.push('/');
        }
    }, [isLoading, role, router]);

    if (isLoading || isFetching) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <p className="text-gray-500 text-sm">Cargando panel...</p>
                </div>
            </div>
        );
    }

    if (role !== UserRole.GLOBAL_ADMIN) {
        return null;
    }


    const currentSection = DASHBOARD_SECTIONS.find(s => s.id === activeSection);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-lg font-medium">Ribla Editores</h1>
                    <p className="text-xs text-gray-400 mt-1">Panel de Administración</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                        {DASHBOARD_SECTIONS.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            // If section has href, use Link instead of button
                            if ((section as any).href) {
                                return (
                                    <li key={section.id}>
                                        <Link
                                            href={(section as any).href}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {section.name}
                                            {section.count !== undefined && (
                                                <span className="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded">
                                                    {section.count}
                                                </span>
                                            )}
                                        </Link>
                                    </li>
                                );
                            }

                            return (
                                <li key={section.id}>
                                    <button
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {section.name}
                                        {section.count !== undefined && (
                                            <span className="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded">
                                                {section.count}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            {user?.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400">Global Admin</p>
                        </div>
                    </div>
                </div>

                {/* Back to site */}
                <Link
                    href="/"
                    className="m-4 flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al sitio
                </Link>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {currentSection?.name}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {currentSection?.description}
                            </p>
                        </div>
                        {(activeSection === 'posts' || activeSection === 'users' || activeSection === 'catalog') && (
                            <Link
                                href={
                                    activeSection === 'posts' ? '/editor' :
                                        activeSection === 'catalog' ? '/admin/books/new' :
                                            '#'
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Añadir {activeSection === 'posts' ? 'Post' : activeSection === 'users' ? 'Usuario' : 'Libro'}
                            </Link>
                        )}
                    </div>
                </header>

                {/* Content */}
                <div className="p-8">
                    {/* Overview Section */}
                    {activeSection === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">Visitas hoy</span>
                                        <BarChart3 className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-3xl font-semibold text-gray-800">1,234</p>
                                    <p className="text-xs text-green-500 mt-2">+12% vs ayer</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">Posts publicados</span>
                                        <FileText className="w-5 h-5 text-green-500" />
                                    </div>
                                    <p className="text-3xl font-semibold text-gray-800">{stats.posts}</p>
                                    <p className="text-xs text-gray-400 mt-2">{stats.drafts} borradores</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-500">Usuarios Totales</span>
                                        <Users className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <p className="text-3xl font-semibold text-gray-800">{stats.users}</p>
                                    <p className="text-xs text-gray-400 mt-2">Registrados en plataforma</p>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Acciones rápidas</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Link href="/editor" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Plus className="w-6 h-6 text-blue-600 mb-2" />
                                        <span className="text-sm text-gray-600">Nuevo Post</span>
                                    </Link>
                                    <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Users className="w-6 h-6 text-purple-600 mb-2" />
                                        <span className="text-sm text-gray-600">Añadir Usuario</span>
                                    </button>
                                    <Link href="/admin/books/new" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <BookOpen className="w-6 h-6 text-green-600 mb-2" />
                                        <span className="text-sm text-gray-600">Nuevo Libro</span>
                                    </Link>
                                    <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Settings className="w-6 h-6 text-gray-600 mb-2" />
                                        <span className="text-sm text-gray-600">Configuración</span>
                                    </button>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Actividad reciente</h3>
                                <ul className="space-y-4">
                                    {posts.slice(0, 5).map(post => (
                                        <li key={post.id} className="flex items-center gap-4 text-sm">
                                            <div className={`w-2 h-2 rounded-full ${post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                            <span className="text-gray-600">
                                                {post.author?.full_name || 'Desconocido'} {post.status === 'published' ? 'publicó' : 'creó borrador'} "{post.title}"
                                            </span>
                                            <span className="text-gray-400 ml-auto">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                    {posts.length === 0 && (
                                        <p className="text-gray-400 text-sm">No hay actividad reciente.</p>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Users Section */}
                    {activeSection === 'users' && (
                        <div className="space-y-6">
                            {/* Info banner */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-700">
                                    <strong>Nota:</strong> Los colaboradores se registran ellos mismos. Solo puedes crear o modificar administradores desde aquí.
                                </p>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-4 border-b border-gray-200">
                                <button
                                    onClick={() => setUserTab('admins')}
                                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${userTab === 'admins'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Administradores
                                </button>
                                <button
                                    onClick={() => setUserTab('collaborators')}
                                    className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${userTab === 'collaborators'
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Colaboradores
                                </button>
                            </div>

                            {/* Admins Tab */}
                            {userTab === 'admins' && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-gray-800">Administradores del sistema</h3>
                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors">
                                            <Plus className="w-3 h-3" />
                                            Añadir Admin
                                        </button>
                                    </div>
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rol</th>
                                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {profiles
                                                .filter(p => p.role === UserRole.GLOBAL_ADMIN || p.role === UserRole.CONTENT_ADMIN)
                                                .map((adminUser) => (
                                                    <tr key={adminUser.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                                                    {(adminUser.full_name || adminUser.email).charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-800">{adminUser.full_name || 'Sin nombre'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{adminUser.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 text-xs rounded ${adminUser.role === 'GLOBAL_ADMIN'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                {adminUser.role}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button className="p-2 hover:bg-gray-100 rounded" title="Editar rol">
                                                                    <Edit className="w-4 h-4 text-gray-500" />
                                                                </button>
                                                                {adminUser.email !== user?.email && (
                                                                    <button className="p-2 hover:bg-gray-100 rounded" title="Revocar acceso">
                                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Collaborators Tab */}
                            {userTab === 'collaborators' && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                                    <div className="p-4 border-b border-gray-100">
                                        <h3 className="text-sm font-medium text-gray-800">Colaboradores registrados</h3>
                                        <p className="text-xs text-gray-500 mt-1">Los colaboradores se registran ellos mismos desde la página de login</p>
                                    </div>
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Posts</th>
                                                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {profiles
                                                .filter(p => p.role === UserRole.COLLABORATOR)
                                                .map((collab) => (
                                                    <tr key={collab.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                                                                    {(collab.full_name || collab.email).charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-800">{collab.full_name || 'Sin nombre'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{collab.email}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                                                                Activo
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">- posts</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button className="p-2 hover:bg-blue-50 rounded" title="Promover a Admin">
                                                                    <ChevronRight className="w-4 h-4 text-blue-500" />
                                                                </button>
                                                                <button className="p-2 hover:bg-gray-100 rounded" title="Ver perfil">
                                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                                </button>
                                                                <button className="p-2 hover:bg-red-50 rounded" title="Desactivar">
                                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            {profiles.filter(p => p.role === UserRole.COLLABORATOR).length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                        No hay colaboradores registrados.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Posts Section */}
                    {activeSection === 'posts' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Título</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Autor</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-800">{post.title}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{post.author?.full_name || 'Desconocido'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(post.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded ${post.status === 'published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {post.status === 'published' ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 hover:bg-gray-100 rounded"><Eye className="w-4 h-4 text-gray-500" /></button>
                                                    <button className="p-2 hover:bg-gray-100 rounded"><Edit className="w-4 h-4 text-gray-500" /></button>
                                                    <button className="p-2 hover:bg-gray-100 rounded"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {posts.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                                No hay posts creados aún.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Other sections - placeholder */}
                    {['catalog', 'store', 'stats', 'settings'].includes(activeSection) && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="text-gray-400 mb-4">
                                {activeSection === 'catalog' && <BookOpen className="w-12 h-12 mx-auto" />}
                                {activeSection === 'store' && <ShoppingBag className="w-12 h-12 mx-auto" />}
                                {activeSection === 'stats' && <BarChart3 className="w-12 h-12 mx-auto" />}
                                {activeSection === 'settings' && <Settings className="w-12 h-12 mx-auto" />}
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                {currentSection?.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Esta sección estará disponible próximamente.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
