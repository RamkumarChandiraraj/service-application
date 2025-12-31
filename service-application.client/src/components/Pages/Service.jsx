import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../Common/Card";
import { getAllServices } from "../../api/serviceList";
import { getAllCategories } from "../../api/categoryApi";

const Service = () => {
    const { category } = useParams(); // category link from URL

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

                // find category by link
                const categoryObj = categoryData.find(
                    (cat) => cat.link === category
                );

                setSelectedCategory(categoryObj || null);

                // filter services by categoryId
                if (categoryObj) {
                    const filtered = serviceData.filter(
                        (service) => service.categoryId === categoryObj.id
                    );
                    setServices(filtered);
                } else {
                    setServices([]);
                }
            } catch (error) {
                console.error("Failed to load services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category]);

    if (loading) return <p>Loading services...</p>;

    return (
        <section id="services" className="services section-bg py-5">
            <div className="container">
                {/* Section Title */}
                <div className="section-title" data-aos="fade-up">
                    <h2>{selectedCategory?.name || "Services"}</h2>
                    <p>
                        Choose a service from{" "}
                        {selectedCategory?.name || "this"} category
                    </p>
                </div>

                {/* Service Cards */}
                <div className="row gy-4 section-cards">
                    {services.length > 0 ? (
                        services.map((service, index) => (
                            <Card
                                key={service.id}
                                data={{
                                    icon: service.icon,
                                    title: service.name,
                                    description: service.description,
                                    link: `/service/${category}/${service.id}`,
                                    isActive: service.isActive,
                                }}
                                delay={(index + 1) * 100}
                            />
                        ))
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
