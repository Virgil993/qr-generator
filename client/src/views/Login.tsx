import { Button, Row, Col, Input, Form, Alert } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@genezio/auth";
import { GenezioError } from "@genezio/types";
import React from "react";
import logo from "../assets/images/logo.webp";
import { ClockLoader } from "react-spinners";
import { colors } from "../assets/utils/colors";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!email || !password) {
      setError("All fields are mandatory");
      return;
    }

    setError("");

    setLoading(true);
    const res = await AuthService.getInstance()
      .login(email, password)
      .catch((err) => {
        setError(
          "Error code: " +
            (err as GenezioError).code +
            ": " +
            (err as GenezioError).message
        );
        return null;
      });
    if (res) {
      navigate("/admin/all-codes");
    }
    setLoading(false);
  }

  return (
    <React.Fragment>
      <div className="page bg-white">
        <div className="page-single">
          <div className="container" style={{ marginTop: "10vh" }}>
            <Row>
              <Col
                xl={5}
                lg={6}
                md={8}
                sm={8}
                xs={10}
                className="card-sigin-main mx-auto my-auto py-4 justify-content-center"
              >
                <div
                  className="card-sigin"
                  style={{ border: "3px solid #0d6efd" }}
                >
                  {/* <!-- Demo content--> */}
                  <div className="main-card-signin d-md-flex">
                    <div className="wd-100p">
                      <div className="d-flex mb-4 justify-content-center">
                        <img
                          src={logo}
                          className="sign-favicon ht-60"
                          alt="logo"
                        />
                      </div>

                      <div className="main-signup-header">
                        <h2 className="text-center" style={{ fontSize: 40 }}>
                          Sign In
                        </h2>

                        <div>
                          {error && (
                            <Alert className="mt-3 mb-3" color="danger">
                              {error}
                            </Alert>
                          )}
                          <Form>
                            <div
                              className="row"
                              style={{
                                justifyContent: "center",
                              }}
                            >
                              <div className="d-flex flex-column align-items-center mb-3 mt-3 text-center">
                                <label>Email address</label>
                                <Input
                                  className="form-control"
                                  placeholder="Email"
                                  type="email"
                                  autoComplete="email"
                                  value={email}
                                  onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                  }}
                                />
                              </div>
                              <div className="d-flex flex-column align-items-center mb-3 text-center">
                                <label>Password</label>
                                <Input
                                  className="form-control"
                                  placeholder="Password"
                                  type="password"
                                  autoComplete="password"
                                  value={password}
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                  }}
                                />
                              </div>
                              <div
                                className="d-flex justify-content-center col-lg-7"
                                id="google_login_wrapper_btn"
                              ></div>
                              <div className="text-center mt-3">
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
                              <div className="d-flex justify-content-center col-lg-12 my-2"></div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
