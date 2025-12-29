import React, { useEffect, useState } from "react";
import Card from "../Common/Card";
import { getAllCategories } from "../../api/categoryApi"; // adjust path to your API file

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        if (response?.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;

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
          {categories.map((service, index) => (
            <Card
              key={service.id}
              data={{
                icon: service.icon,
                title: service.name,
                description: service.description,
                link: `/service/${service.link}`,
                isActive: service.isActive, // optional: for styling inactive cards
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
