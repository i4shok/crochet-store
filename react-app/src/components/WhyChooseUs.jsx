import {
  HeartHandshake,
  Gift,
  Truck,
  Leaf,
} from "lucide-react";

import "../styles/WhyChooseUs.css";

function WhyChooseUs() {

  const features = [

    {
      icon: <HeartHandshake size={40} />,
      title: "Handmade With Love",
      text:
        "Every crochet piece is carefully handcrafted with patience, creativity and attention to detail.",
    },

    {
      icon: <Gift size={40} />,
      title: "Perfect For Gifting",
      text:
        "Thoughtful handmade creations for birthdays, anniversaries and every special moment.",
    },

    {
      icon: <Truck size={40} />,
      title: "Reliable Delivery",
      text:
        "Every order is packed with care to make sure it reaches you safely and beautifully.",
    },

    {
      icon: <Leaf size={40} />,
      title: "Quality Materials",
      text:
        "Made using soft, durable yarns chosen for comfort, beauty and long-lasting quality.",
    },

  ];

  return (

    <section className="why-section">

      <h2>

        Why Choose Knot & Bloom

      </h2>

      <p className="why-subtitle">

        Handmade creations designed to bring warmth,
        comfort and happiness.

      </p>

      <div className="why-grid">

        {features.map((item, index) => (

          <div
            key={index}
            className="why-card"
          >

            <div className="why-icon">

              {item.icon}

            </div>

            <h3>

              {item.title}

            </h3>

            <p>

              {item.text}

            </p>

          </div>

        ))}

      </div>

    </section>

  );

}

export default WhyChooseUs;