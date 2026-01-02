import React, { useEffect, useState } from "react";
import Card from "../Common/Card";
import { getAllCategories } from "../../api/categoryApi";
import LoadingPage from "../Common/LoadingPage"; // import loading component

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const data = response?.data || [];
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <section id="categories" className="services section-bg py-5">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Categories</h2>
          <p>Choose a service category to get started</p>
        </div>

        <div className="row gy-4 section-cards">
          {categories.map((category, index) => (
            <Card
              key={category.id}
              data={{
                icon: category.icon,
                title: category.name,
                description: category.description,
                link: `/service/${category.link}`, // go to Service page
                isActive: true,
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
