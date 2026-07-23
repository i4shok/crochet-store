import Hero from "../components/Hero";
import OurProcess from "../components/OurProcess";
import ProductCarousel from "../components/ProductCarousel";
import WhyChooseUs from "../components/WhyChooseUs";

function Home() {
  return (
    <div className="home-page">
      <Hero />

      <OurProcess />

      <ProductCarousel />

      <WhyChooseUs />
    </div>
  );
}

export default Home;