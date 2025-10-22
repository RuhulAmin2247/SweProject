import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About RajshahiStay</h1>
        <p>
          RajshahiStay is committed to helping students find safe, affordable, and
          convenient accommodation near campus. We verify listings and provide a
          user-friendly platform to connect students with trusted property owners.
        </p>

        <h2>Our Success</h2>
        <ul>
          <li>Thousands of verified listings across Rajshahi</li>
          <li>Hundreds of happy students placed in safe housing</li>
          <li>Quick and responsive support for our users</li>
        </ul>

        <h2>Trusted By</h2>
        <p>
          We work closely with local property owners and community partners to ensure
          listings are accurate and trustworthy.
        </p>
      </div>
    </div>
  );
};

export default About;