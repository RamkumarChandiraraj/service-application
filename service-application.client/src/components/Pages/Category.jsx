import React from "react";
import Card from "../Common/Card";
import { categoryCards } from "./CategoryCards";

const Category = () => {
  return (
    <section id="categories" className="services section-bg py-5">
      <div className="container">
        {/* Section Title */}
        <div className="section-title" data-aos="fade-up">
          <h2>Categories</h2>
          <p>Choose a service category to get started</p>
        </div>

        {/* Category Cards */}
        <div className="row gy-4 section-cards">
          {categoryCards.map((service, index) => (
            <Card
              key={service.id}
              data={{
                icon: service.icon,
                title: service.title,
                description: service.description,
                link: `/service/${service.link}`, // ✅ default dynamic link
              }}
              delay={(index + 1) * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;
