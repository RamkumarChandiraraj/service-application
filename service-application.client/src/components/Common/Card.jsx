import { Link } from "react-router-dom";

const Card = ({ data, delay = 100, col = "col-12 col-sm-6 col-lg-3" }) => {
  const { icon, title, description, link } = data;

  return (
    <div className={col} data-aos="zoom-out" data-aos-delay={delay}>
      <Link to={link} className="card-link">
        <article className="icon-box">
          {/* Icon */}
          <div className="icon" aria-hidden="true">
            <i className={`bi ${icon}`}></i>
          </div>

          {/* Title */}
          <h4 className="title">{title}</h4>

          {/* Description */}
          <p className="description">{description}</p>
        </article>
      </Link>
    </div>
  );
};

export default Card;
