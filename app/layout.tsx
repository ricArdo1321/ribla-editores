import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: {
        default: 'Ribla Editores - Editorial Independiente',
        template: '%s | Ribla Editores',
    },
    description: 'Editorial independiente especializada en ensayos, poesía y narrativa contemporánea. Descubre nuestro catálogo y servicios editoriales.',
    keywords: ['editorial', 'libros', 'ensayos', 'poesía', 'literatura', 'publicación'],
    authors: [{ name: 'Ribla Editores' }],
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        siteName: 'Ribla Editores',
    },
    twitter: {
        card: 'summary_large_image',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={inter.className}>
            <body className="min-h-screen bg-white">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
