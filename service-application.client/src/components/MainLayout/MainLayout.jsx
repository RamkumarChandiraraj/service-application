import React from 'react';
import HeroSection from './HeroSection/HeroSection';
import About from './About/About';
import Contact from './Contact/Contact'; // Updated for JSX version without iframe

function MainLayout() {
  return (
    <div>
      <HeroSection />
      <About />
      <Contact />
    </div>
  );
}

export default MainLayout;
