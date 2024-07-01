import { Button, Card, Container, Row, Col, Input } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../network/ApiAxios";
import { AxiosError } from "axios";
import { User } from "../models/user";
import { ClockLoader } from "react-spinners";
import { colors } from "../assets/utils/colors";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setpasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!email || !password || !passwordConfirmation || !name) {
      setError("All fields are mandatory");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    const user: User = {
      email,
      password,
      name,
    };
    setLoading(true);
    const res = await register(user);
    
    setLoading(false);
    if (res instanceof AxiosError && res.response?.data.error) {
      setError(res.response.data.error);
      return;
    }
    if (res.status === 200) {
      navigate("/auth/login");
    }
  }

  return (
    <Container className="mt-5">
      <Row className="mt-5">
        <Col sm="12" md={{ size: 6, offset: 3 }}>
          <Card className="p-4 mt-5">
            <div className="auth-wrapper">
              <div className="auth-inner">
                <form>
                  <h3>Sign Up</h3>
                  <span className="text-danger">{error}</span>
                  <div className="mb-3">
                    <label>Name</label>
                    <Input
                      className="form-control"
                      placeholder="Name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
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
                  <div className="mb-3">
                    <label>Password</label>
                    <Input
                      className="form-control"
                      placeholder="Repeat Password"
                      type="password"
                      value={passwordConfirmation}
                      onChange={(e) => setpasswordConfirmation(e.target.value)}
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
                      Already have an account? <a href="/auth/login">Login</a>
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
