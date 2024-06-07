import { Button, Col, Container, Row } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/HomeFooter";

export function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Container className="mt-3">
        <Row className="mt-5">
          <HomeHeader />
        </Row>
        <Row className="d-flex flex-column mt-3">
          <Col className="text-center mb-5 mt-5">
            <h1 className="">Free QR Code Generator</h1>
          </Col>
          <Col className="text-center">
            <Button
              className="signup-button"
              color="primary"
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/register");
              }}
            >
              Sign up
            </Button>
          </Col>
          <Col className="text-center mt-5">
            Don't want to sign in?{" "}
            <Link
              style={{
                color: "#036DB5",
              }}
              to="/auth/guest"
            >
              Continue as guest
            </Link>{" "}
          </Col>
          <Col className="text-center mt-2">
            <a href="https://www.freeprivacypolicy.com/live/5ac90497-cd99-45ad-8c4d-e447a8df5ff8">
              Privacy policy
            </a>
          </Col>
        </Row>
        <Row className="d-flex flex-column" style={{ marginTop: "20vh" }}>
          {" "}
          <Footer />
        </Row>
      </Container>
    </>
  );
}
