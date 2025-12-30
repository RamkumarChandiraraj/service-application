import { useParams } from "react-router-dom";
import Card from "../Common/Card";
import { serviceCards } from "./serviceCards";

const Service = () => {
  const { category } = useParams();

  // Filter services by category
  const filteredServices = serviceCards.filter(
    (service) => service.category === category
  );

  return (
    <section className="services py-5">
      <div className="container">
        {/* Section Title */}
        <div className="section-title">
          <h2 className="text-capitalize">{category} Services</h2>
          <p>Available services under {category} category</p>
        </div>

        {/* Services */}
        <div className="row gy-4 section-cards">
          {filteredServices.length > 0 ? (
            filteredServices.map((service, index) => (
              <Card
                key={service.id}
                data={{
                  icon: service.icon,
                  title: service.name,
                  description: service.description,
                  link: `/service/${category}/${service.link}`, // ✅ dynamic link
                }}
                delay={(index + 1) * 100}
                col="col-12 col-sm-6 col-lg-4"
              />
            ))
          ) : (
            <div className="col-12 text-center text-muted">
              No services available for this category.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Service;
