import { Button, Col } from "reactstrap";
import logo from "../assets/images/logo.webp";
import { useNavigate } from "react-router-dom";

function HeaderHero() {
  const navigate = useNavigate();

  return (
    <>
      <Col>
        <img src={logo} alt="Logo" className="header-logo-img" />
      </Col>
      <Col className="text-end">
        <Button
          color="primary"
          size="lg"
          onClick={(e) => {
            e.preventDefault();
            navigate("/auth/login");
          }}
        >
          Log in
        </Button>
      </Col>
    </>
  );
}

export default HeaderHero;
