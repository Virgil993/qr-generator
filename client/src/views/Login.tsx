import { Button, Card, Container, Row, Col, Input } from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@genezio/auth";
import { GenezioError } from "@genezio/types";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

  async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!email || !password) {
      setError("All fields are mandatory");
      return;
    }

    setError("");

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
  }

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    setGoogleLoginLoading(true);
    try {
      await AuthService.getInstance().googleRegistration(
        credentialResponse.credential!
      );

      navigate("/admin/all-codes");
    } catch (error) {
      console.log("Login Failed", error);
      alert("Login Failed");
    }

    setGoogleLoginLoading(false);
  };

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
                  <div className="mb-3">
                    {googleLoginLoading ? (
                      <>Loading...</>
                    ) : (
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          handleGoogleLogin(credentialResponse);
                        }}
                        width={300}
                        onError={() => {
                          console.log("Login Failed");
                          alert("Login Failed");
                        }}
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <Button
                      type="submit"
                      color="primary"
                      onClick={(e) => handleSubmit(e)}
                    >
                      Submit
                    </Button>
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
