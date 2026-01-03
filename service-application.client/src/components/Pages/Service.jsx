import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../Common/Card";
import { getAllServices } from "../../api/serviceList";
import { getAllCategories } from "../../api/categoryApi";
import LoadingPage from "../Common/LoadingPage"; // import loading component

// Helper function to map slug -> categoryName
const slugToCategoryName = (slug, categories) => {
  const cat = categories.find(c => c.link.toLowerCase() === slug.toLowerCase());
  return cat ? cat.title || cat.name || cat.categoryName : "";
};

const Service = () => {
  const { category } = useParams(); // slug from URL
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, categoryRes] = await Promise.all([
          getAllServices(),
          getAllCategories(),
        ]);

        const serviceData = serviceRes?.data || [];
        const categoryData = categoryRes?.data || [];

        // Get category object from slug
        const categoryObj = categoryData.find(
          c => c.link.toLowerCase() === category.toLowerCase()
        );
        setSelectedCategory(categoryObj || null);

        // Map slug to categoryName
        const selectedCategoryName = slugToCategoryName(category, categoryData);

        // Filter services by categoryName
        const filtered = serviceData.filter(
          service => service.categoryName.toLowerCase() === selectedCategoryName.toLowerCase()
        );

        setServices(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category]);

  if (loading) return <LoadingPage />;

  return (
    <section id="services" className="services section-bg py-5">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>{selectedCategory?.title || selectedCategory?.name || "Services"}</h2>
          <p>
            Choose a service from {selectedCategory?.title || selectedCategory?.name || "this"} category
          </p>
        </div>

        <div className="row gy-4 section-cards">
          {services.length > 0 ? (
            services.map((service, idx) => {
              const serviceSlug = service.name.toLowerCase().replace(/\s+/g, "-");
              const categorySlug = selectedCategory?.link;

              return (
                <Card
                  key={service.id}
                  data={{
                    icon: service.icon,
                    title: service.name,
                    description: service.description,
                    link: `/searchvendors?category=${categorySlug}&service=${serviceSlug}&location=`,
                    isActive: service.isActive,
                  }}
                  delay={(idx + 1) * 100}
                />
              );
            })
          ) : (
            <div className="col-12 text-center text-muted">
              No services available in this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Service;
