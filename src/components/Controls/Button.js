import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import arrowLeft from '@fortawesome/fontawesome-free-solid/faArrowCircleLeft';
import arrowRight from '@fortawesome/fontawesome-free-solid/faArrowCircleRight';
import styles from "./styles.scss";

const SIZE = "2x";

const getIcon = direction => {
  if (direction === "left") {
    return arrowLeft;
  }

  return arrowRight;
};

const Button = ({
  direction,
  handleClick,
  disabled,
}) => (
  <a
    className={disabled ? styles.disabled : ""}
    onClick={handleClick}
  >
    <FontAwesomeIcon
      icon={getIcon(direction)}
      size={SIZE}
    />
  </a>
);

export default Button;
