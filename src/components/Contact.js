import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>If you face any problems, please contact us:</p>
        <ul>
          <li>Email: <a href="mailto:ruhulamin200327@gmail.com">ruhulamin200327@gmail.com</a></li>
          <li>Phone: <a href="tel:+8801782315183">01782315183</a></li>
        </ul>
        <p>We're here to help — reach out and we'll respond as soon as possible.</p>
      </div>
    </div>
  );
};

export default Contact;