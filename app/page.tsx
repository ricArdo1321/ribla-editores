import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import Journal from '@/components/Journal';
import Services from '@/components/Services';
import Newsletter from '@/components/Newsletter';
import About from '@/components/About';
import Footer from '@/components/Footer';

// Force dynamic rendering to avoid SSG errors when env vars are not available at build time
export const dynamic = 'force-dynamic';

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <Catalog />
                <Journal />
                <Services />
                <About />
                <Newsletter />
            </main>
            <Footer />
        </>
    );
}
