import React from "react";
import Home from "./Home/Home";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Stats from "./Stats/Stats";
import CurrentLocation from "../Location/CurrentLocation";

const MainLayout = () => {
  return (
    <div>
      <Home />
       <CurrentLocation /> 
      <About />
      <Stats />
      <Contact />
    </div>
  );
};

export default MainLayout;
