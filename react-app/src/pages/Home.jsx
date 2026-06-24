import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Categories from "../components/Categories";
import AboutSection from "../components/AboutSection";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <Hero />

      <FeaturedProducts />

      <Categories />

      <AboutSection />
    </div>
  );
}

export default Home;