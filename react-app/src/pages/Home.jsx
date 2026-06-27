import Hero from "../components/Hero";
import ProductCarousel
from "../components/ProductCarousel";
import Categories from "../components/Categories";
import AboutSection from "../components/AboutSection";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <Hero />

      <ProductCarousel />

      <Categories />

      <AboutSection />
    </div>
  );
}

export default Home;