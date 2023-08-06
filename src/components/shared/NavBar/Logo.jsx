import { Link } from "react-router-dom";
import logoImage from "./../../../assets/images/logo.png";

const Logo = () => {
  return (
    <Link to="/">
      <img
        className="hidden md:block"
        src={logoImage}
        alt="web-site-logo"
        width="100"
        height="100"
      />
    </Link>
  );
};

export default Logo;
