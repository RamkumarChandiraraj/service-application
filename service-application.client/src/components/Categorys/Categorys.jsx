import React from "react";
import { useNavigate } from "react-router-dom";

// Sample category data
const categoryData = {
    home: {
        title: "Home Services",
        description: "Plumbing, Carpentry, Electrical, and more",
    },
    mechanic: {
        title: "Mechanic Services",
        description: "Two Wheeler, Four Wheeler, Heavy Mechanics",
    },
    food: {
        title: "Food Services",
        description: "Dine In, Take Away",
    },
    agriculture: {
        title: "Agriculture Services",
        description: "Harvesting, Delivery, Equipment Services",
    },
};

const Category = () => {
    const navigate = useNavigate();

    // Redirect to service page on category click
    const goToCategory = (categoryKey) => {
        navigate(`/services/${categoryKey}`); // assuming Services route: /services/:category
    };

    return (
        <section id="category" className="category section light-background">
            <div className="container section-title text-center" data-aos="fade-up">
                <h2>Our Categories</h2>
                <p>Select a category to explore available services</p>
            </div>

            <div className="container">
                <div className="row gy-4">
                    {Object.keys(categoryData).map((key, index) => (
                        <div
                            key={key}
                            className="col-lg-3 col-md-6"
                            data-aos="fade-up"
                            data-aos-delay={(index + 1) * 100}
                        >
                            <div
                                className="category-item position-relative border rounded p-3 text-center cursor-pointer"
                                onClick={() => goToCategory(key)}
                                style={{ cursor: "pointer", minHeight: "150px" }}
                            >
                                <h3>{categoryData[key].title}</h3>
                                <p>{categoryData[key].description}</p>
                                <button className="btn btn-outline-primary mt-2">
                                    Explore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Category;
