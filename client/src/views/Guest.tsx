import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Input,
  ButtonGroup,
} from "reactstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QRcode from "qrcode";
import validator from "validator";
import { colors } from "../assets/utils/colors";

export default function Guest() {
  const navigate = useNavigate();

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");

  const [codeTitle, setCodeTitle] = useState("");
  const [codeText, setCodeText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  async function generateCode(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (!codeTitle) {
      setErrorTitle("Title is mandatory");
      return;
    }
    if (!codeText) {
      setErrorText("Text is mandatory");
      return;
    }
    const isValidUrl = validator.isURL(codeText, {
      protocols: ["http", "https"],
      require_protocol: true,
    });
    if (!isValidUrl) {
      setErrorText("The code text is not a valid URL");
      return;
    }
    const generatedCode = await QRcode.toDataURL(codeText, {
      color: {
        dark: "#fff",
        light: colors.main,
      },
    });
    setGeneratedCode(generatedCode);
  }

  async function handleDownload() {
    const isValidUrl = validator.isURL(codeText, {
      protocols: ["http", "https"],
      require_protocol: true,
    });
    if (!isValidUrl) {
      setErrorText("The code text is not a valid URL");
      return;
    }

    const url = await QRcode.toDataURL(codeText);
    // Create an anchor element dynamically
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${codeTitle}.png`; // Set the filename for the downloaded image

    // Programmatically click the anchor element to trigger the download
    a.click();
  }

  return (
    <>
      <Container className="mt-2">
        <Card className="p-4 mt-2">
          <Row>
            <Col xs="6">
              <h2>Generate QR Code</h2>
            </Col>
            <Col xs="6" className="text-end">
              <Button
                color="primary"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col className="d-flex flex-column justify-content-center align-items-center text-center">
              <span className="text-danger">{errorTitle}</span>
              <div className="mb-3 form-guest-div">
                <label>QR Code Title</label>
                <Input
                  className="form-control"
                  placeholder="Title"
                  autoComplete="Title"
                  value={codeTitle}
                  onChange={(e) => {
                    setCodeTitle(e.target.value);
                    setErrorTitle("");
                  }}
                />
              </div>
              <span className="text-danger">{errorText}</span>
              <div className="mb-3 form-guest-div">
                <label>QR Code Link</label>
                <Input
                  className="form-control"
                  placeholder="Link"
                  autoComplete="Link"
                  value={codeText}
                  onChange={(e) => {
                    setCodeText(e.target.value);
                    setErrorText("");
                  }}
                />
              </div>
              {generatedCode ? (
                <div className="mb-3 mt-3 form-guest-div d-flex flex-column justify-content-center align-items-center">
                  <img
                    src={generatedCode}
                    style={{ borderRadius: "20px" }}
                    alt="N/A"
                  />
                </div>
              ) : (
                <></>
              )}
              <ButtonGroup className="mt-3">
                <Button
                  color="success"
                  onClick={(e) => generateCode(e)}
                  type="submit"
                >
                  Generate code
                </Button>
                <Button
                  color="primary"
                  onClick={() => handleDownload()}
                  type="submit"
                >
                  Download code
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
