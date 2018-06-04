import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import angle from '@fortawesome/fontawesome-free-solid/faAngleDown';

import React from 'react';

export default ({
  className,
  handleClick,
}) => (
  <div
    className={className}
    onClick={handleClick}
  >
    <FontAwesomeIcon
      icon={angle}
      size={"sm"}
    />
  </div>
);

