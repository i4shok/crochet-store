import { Link } from "react-router-dom";

import heroImage from "../assets/hero-bouquet.png";

import "../styles/Hero.css";

function Hero() {

  return (

<section className="hero">

<div className="hero-content">

<div className="hero-text">

<span className="hero-brand">

🌸 Knot & Bloom

</span>

<h1>

Handmade treasures,

stitched with love.

</h1>

<p>

Every crochet piece is handcrafted
with patience, creativity and care—
made to bring warmth to your home
or become the perfect heartfelt gift.

</p>

<Link
to="/shop"
className="hero-btn"
>

Explore Collection

</Link>

</div>

<div className="hero-image">

<img

src={heroImage}

alt="Crochet Bouquet"

/>

</div>

</div>

<div className="scroll-down">

↓

</div>

</section>

  );

}

export default Hero;