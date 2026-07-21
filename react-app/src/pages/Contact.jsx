import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/Contact.css";

function Contact() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!name || !email || !message) {

      toast.error("Please fill in all fields.");

      return;

    }

    toast.success("Message sent! We'll get back to you soon 🌿");

    setName("");
    setEmail("");
    setMessage("");

  };

  return (
    <div className="contact-page">

      <div className="contact-header">

        <span className="contact-tag">
          🧶 Get In Touch
        </span>

        <h1>Contact Us</h1>

        <p>
          Have a question about an order, a custom crochet
          request, or just want to say hi? We'd love to hear
          from you.
        </p>

      </div>

      <div className="contact-layout">

        <aside className="contact-info-card">

          <h2>Reach Us Directly</h2>

          <div className="info-row">

            <span className="info-icon">📍</span>

            <div>
              <h4>Studio Location</h4>
              <p>Add your studio address here</p>
            </div>

          </div>

          <div className="info-row">

            <span className="info-icon">✉️</span>

            <div>
              <h4>Email</h4>
              <p>hello@knotandbloom.com</p>
            </div>

          </div>

          <div className="info-row">

            <span className="info-icon">📞</span>

            <div>
              <h4>Phone</h4>
              <p>+91 00000 00000</p>
            </div>

          </div>

          <div className="info-row">

            <span className="info-icon">🕐</span>

            <div>
              <h4>Working Hours</h4>
              <p>Mon - Sat, 10am - 6pm</p>
            </div>

          </div>

          <hr />

          <div className="contact-features">
            <span>🧶 Handmade</span>
            <span>🎁 Gift Ready</span>
            <span>🌿 Eco Friendly</span>
          </div>

        </aside>

        <form
          className="contact-form-card"
          onSubmit={handleSubmit}
        >

          <h2>Send A Message</h2>

          <label>Name</label>

          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email</label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Message</label>

          <textarea
            placeholder="Tell us what's on your mind..."
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button type="submit">
            Send Message →
          </button>

        </form>

      </div>

    </div>
  );

}

export default Contact;