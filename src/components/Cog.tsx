import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Cog() {
  /* 	Stores states for the cog, data and settings */
  const [hover, setHover] = useState<boolean>(false);

  return (
    <Link
      to="/settings"
      id="cog"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FontAwesomeIcon icon={faCog} className={hover ? "animate-spin" : ""} />
    </Link>
  );
}
