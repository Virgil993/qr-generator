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
import Select from "react-select";

export enum ImageType {
  Png = "image/png",
  Jpeg = "image/jpeg",
  Webp = "image/webp",
}

const reactSelectOptions = [
  { value: ImageType.Png, label: "PNG" },
  { value: ImageType.Jpeg, label: "JPEG" },
  { value: ImageType.Webp, label: "WEBP" },
];

export default function Guest() {
  const navigate = useNavigate();

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");

  const [codeTitle, setCodeTitle] = useState("");
  const [codeText, setCodeText] = useState("");
  const [imageType, setImageType] = useState<ImageType>(ImageType.Png);
  const [generatedCode, setGeneratedCode] = useState("");
  const [imageQuality, setImageQuality] = useState(0.5);
  const [scale, setScale] = useState(1);

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

    const url = await QRcode.toDataURL(codeText, {
      type: imageType,
      rendererOpts: {
        quality: imageQuality,
      },
      scale: scale,
    });
    // Create an anchor element dynamically
    const a = document.createElement("a");
    a.href = url;

    switch (imageType) {
      case ImageType.Png:
        a.download = `${codeTitle}.png`;
        break;
      case ImageType.Jpeg:
        a.download = `${codeTitle}.jpeg`;
        break;
      case ImageType.Webp:
        a.download = `${codeTitle}.webp`;
        break;
      default:
        a.download = `${codeTitle}.png`;
    }

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
                  navigate("/auth/login");
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
              <div className="mb-3 form-guest-div">
                <label>Image Type</label>
                <Select
                  className="mt-3"
                  options={reactSelectOptions}
                  value={reactSelectOptions.find(
                    (option) => option.value === imageType
                  )}
                  onChange={(option) => {
                    if (option) {
                      setImageType(option.value);
                    }
                  }}
                  isMulti={false}
                  isSearchable={false}
                />
              </div>
              <div className="mb-3 form-guest-div">
                <label>Image Quality</label>
                <Input
                  name="imageQuality"
                  type="range"
                  value={imageQuality}
                  min={0}
                  max={1}
                  onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                  step={0.01}
                ></Input>
              </div>
              <div>
                <label>Scale</label>
                <div className="p-1 m-1" style={{ fontSize: 13 }}>
                  <b>number of pixels per block</b>
                </div>
                <Input
                  name="scale"
                  type="range"
                  value={scale}
                  min={1}
                  max={30}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                ></Input>
                <p>Value {scale}</p>
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
