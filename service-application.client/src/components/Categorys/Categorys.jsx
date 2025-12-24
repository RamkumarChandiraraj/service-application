import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const categoryData = {
    home: {
        title: "Home Categories",
        items: ["Plumbing", "Carpentry", "Electrician"],
    },
    mechanic: {
        title: "Mechanic Categories",
        items: ["Two Wheeler", "Four Wheeler", "Heavy Mechanics"],
    },
    food: {
        title: "Food Categories",
        items: ["Dine In", "Take Away"],
    },
    agriculture: {
        title: "Agriculture Categories",
        items: ["Harvest", "Delivery"],
    },
};

const Categories = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const data = categoryData[category];

    const goToHome = () => navigate("/");

    if (!data) {
        return (
            <section className="categories section light-background">
                <div className="container text-center">
                    <h2>Please select a category</h2>
                    <button className="btn btn-primary mt-3" onClick={goToHome}>
                        Back to Home
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section id="categories" className="categories section light-background">
            <div className="container section-title text-center" data-aos="fade-up">
                <h2>{data.title}</h2>
                <p>Select a category based on your needs</p>

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
                            <div className="category-item position-relative">
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

export default Categories;
