import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Journal from './components/Journal';
import Services from './components/Services';
import Newsletter from './components/Newsletter';
import About from './components/About';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white selection:bg-[#F2E2C4] selection:text-[#4A4A48]">
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
    </div>
  );
};

export default App;