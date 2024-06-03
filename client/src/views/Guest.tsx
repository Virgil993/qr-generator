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

export default function Guest() {
  const navigate = useNavigate();

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");

  const [codeTitle, setCodeTitle] = useState("");
  const [codeText, setCodeText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  async function generateCode(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
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
    const generatedCode = await QRcode.toDataURL(codeText);
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
          <Row className="mt-2">
            <Col sm="6" md="4">
              <span className="text-danger">{errorTitle}</span>
              <div className="mb-3">
                <label>Code Title</label>
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
              <div className="mb-3">
                <label>Code Text</label>
                <Input
                  className="form-control"
                  placeholder="Text"
                  autoComplete="Text"
                  value={codeText}
                  onChange={(e) => {
                    setCodeText(e.target.value);
                    setErrorText("");
                  }}
                />
              </div>
              {generatedCode ? (
                <div className="mb-3 d-flex flex-column">
                  <label className="mb-2">Code</label>
                  <img src={generatedCode} style={{ width: "50%" }} alt="N/A" />
                </div>
              ) : (
                <></>
              )}
              <ButtonGroup>
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

            <Col className="text-end">
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
        </Card>
      </Container>
    </>
  );
}
