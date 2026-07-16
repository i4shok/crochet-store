import { Link } from "react-router-dom";

import "../styles/EmptyState.css";

function EmptyState({

  icon,

  title,

  description,

  buttonText,

  buttonLink,

}) {

  return (

    <div className="empty-state">

      <div className="empty-icon">

        {icon}

      </div>

      <h2>

        {title}

      </h2>

      <p>

        {description}

      </p>

      {

        buttonText && buttonLink && (

          <Link

            to={buttonLink}

            className="empty-btn"

          >

            {buttonText}

          </Link>

        )

      }

    </div>

  );

}

export default EmptyState;