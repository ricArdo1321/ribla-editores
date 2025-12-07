import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Catalog from '@/components/Catalog';
import Journal from '@/components/Journal';
import Services from '@/components/Services';
import Newsletter from '@/components/Newsletter';
import About from '@/components/About';
import Footer from '@/components/Footer';

export const revalidate = 3600; // ISR: Revalidate every hour

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
