import { Button, Card, Container, Row, Col, Input } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../network/ApiAxios";
import { AxiosError } from "axios";
import { ClockLoader } from "react-spinners";
import { colors } from "../assets/utils/colors";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO 13: Implement the handleSubmit function for logging in
  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {}

  return (
    <Container className="mt-5">
      <Row className="mt-5">
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Card className="p-4 mt-5">
            <div className="auth-wrapper">
              <div className="auth-inner">
                <form>
                  <h3>Sign In</h3>
                  <span className="text-danger">{error}</span>
                  <div className="mb-3">
                    <label>Email address</label>
                    <Input
                      className="form-control"
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Password</label>
                    <Input
                      className="form-control"
                      placeholder="Password"
                      type="password"
                      autoComplete="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="text-center">
                    {loading ? (
                      <div className="d-flex justify-content-center">
                        <ClockLoader
                          color={colors.main}
                          loading={loading}
                          size={30}
                          aria-label="Loading Spinner"
                          data-testid="loader"
                        />
                      </div>
                    ) : (
                      <Button
                        className="btn-submit"
                        type="submit"
                        color="primary"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                  <div className="mt-2">
                    <span>
                      Don't have an account?{" "}
                      <a href="/auth/register">Register</a>
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
