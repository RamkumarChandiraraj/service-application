import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllServices } from "../../api/serviceList";

const serviceData = {
  home: {
    title: "Home Services",
    items: ["Plumber", "Carpenter", "Electrician"],
  },
  mechanic: {
    title: "Mechanic Services",
    items: ["Two Wheeler", "Four Wheeler", "Heavy Mechanics"],
  },
  food: {
    title: "Food Services",
    items: ["Dine In", "Take Away"],
  },
  agriculture: {
    title: "Agriculture Services",
    items: ["Harvest", "Delivery"],
  },
};

const Services = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const data = serviceData[category];

  const goToHome = () => {
    navigate("/"); // redirect to Hero page
  };

  if (!data) {
    return (
      <section className="services section light-background">
        <div className="container text-center">
          <h2>Please select a service category</h2>
          <button className="btn btn-primary mt-3" onClick={goToHome}>
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="services section light-background">
      <div className="container section-title text-center" data-aos="fade-up">
        <h2>{data.title}</h2>
        <p>Select a service based on your needs</p>

        {/* 🔙 Back to Home Button */}
        <button className="btn btn-outline-primary mt-3" onClick={goToHome}>
          <i className="bi bi-arrow-left"></i> Back to Home
        </button>
      </div>

      <div className="container">
        <div className="row gy-4">
          {data.items.map((item, index) => (
            <div
              key={item}
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={(index + 1) * 100}
            >
              <div className="service-item position-relative">
                <h3>{item}</h3>
                <p>
                  Professional {item.toLowerCase()} services delivered with
                  quality and reliability.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
