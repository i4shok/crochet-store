import Hero from "../components/Hero";
import ProductCarousel from "../components/ProductCarousel";
import WhyChooseUs from "../components/WhyChooseUs";

function Home() {
  return (
    <div className="home-page">
      <Hero />

      <ProductCarousel />

      <WhyChooseUs />
    </div>
  );
}

export default Home;