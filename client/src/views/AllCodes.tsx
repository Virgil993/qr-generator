import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
} from "reactstrap";
import { useState, useEffect } from "react";
import { CodeService, Code } from "@genezio-sdk/qr-generator";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@genezio/auth";
import QRcode from "qrcode";
import validator from "validator";
import { ClockLoader } from "react-spinners";
import CodeCard from "../components/CodeCard";
import { colors } from "../assets/utils/colors";

export default function AllCodes() {
  const navigate = useNavigate();

  const trackingURL = import.meta.env.VITE_TRACKING_URL
    ? import.meta.env.VITE_TRACKING_URL
    : "";
  const [codes, setCodes] = useState<Code[]>([]);
  const [codesImages, setCodesImages] = useState<string[]>([]);
  const [modalAddCode, setModalAddCode] = useState(false);
  const toggleModalAddCode = () => {
    setModalAddCode(!modalAddCode);
    setCodeTitle("");
  };
  const [codesLoading, setCodesLoading] = useState(true);
  const [addCodeLoading, setAddCodeLoading] = useState(false);

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [alertErrorMessage, setAlertErrorMessage] = useState<string>("");

  const [codeTitle, setCodeTitle] = useState("");
  const [codeText, setCodeText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  useEffect(() => {
    const fetchCodes = async () => {
      setCodesLoading(true);
      const result = await CodeService.getAllCodes().catch((error) => {
        setAlertErrorMessage(
          `Unexpected error: ${
            error.message
              ? error.message
              : "Please check the backend logs in the project dashboard - https://app.genez.io."
          }`
        );
        return null;
      });
      if (result && result.success) {
        setCodes(result.codes);
        const images = await Promise.all(
          result.codes.map(async (code) => {
            const res = await QRcode.toDataURL(
              trackingURL + "?codeId=" + code.codeId,
              {
                color: {
                  dark: "#0000",
                  light: colors.main,
                },
                margin: 10,
              }
            );
            return res;
          })
        );
        setCodesImages(images);
        setCodesLoading(false);
      }
    };
    if (codesLoading) {
      fetchCodes();
    }
  }, [codesLoading, codes, codesImages, alertErrorMessage, trackingURL]);

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
      setErrorModal("The code text is not a valid URL");
      return;
    }
    const generatedCode = await QRcode.toDataURL(codeText);
    setGeneratedCode(generatedCode);
  }

  async function handleAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!codeTitle) {
      setErrorTitle("Title is mandatory");
      return;
    }
    if (!codeText) {
      setErrorText("Text is mandatory");
      return;
    }
    setAddCodeLoading(true);
    const res = await CodeService.createCode(codeTitle, codeText).catch(
      (error) => {
        setErrorModal(
          `${
            error.message
              ? error.message
              : "Unexpected error: Please check the backend logs in the project dashboard - https://app.genez.io."
          }`
        );
        return null;
      }
    );
    if (res && res.success) {
      const generatedCode = await QRcode.toDataURL(
        trackingURL + "?codeId=" + res.code!.codeId,
        {
          color: {
            dark: "#0000",
            light: colors.main,
          },
          margin: 10,
        }
      );
      setCodes([...codes, res.code!]);
      setCodesImages([...codesImages, generatedCode]);
      setCodeTitle("");
      setCodeText("");
      setGeneratedCode("");
      toggleModalAddCode();
    }
    setAddCodeLoading(false);
  }

  return alertErrorMessage != "" ? (
    <Row className="ms-5 me-5 ps-5 pe-5 mt-5 pt-5">
      <Alert color="danger">{alertErrorMessage}</Alert>
    </Row>
  ) : (
    <>
      <Modal isOpen={modalAddCode} toggle={toggleModalAddCode}>
        <ModalHeader toggle={toggleModalAddCode}>Add new QR code</ModalHeader>
        <form>
          <ModalBody>
            <div className="text-center mb-3">
              <span className="text-danger ">{errorTitle}</span>
            </div>
            <div className="d-flex flex-column align-items-center mb-3">
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
            <div className="text-center mb-3">
              <span className="text-danger">{errorText}</span>
            </div>
            <div className="d-flex flex-column align-items-center mb-3">
              <label>QR Code Link</label>
              <Input
                className="form-control"
                placeholder="Link"
                autoComplete="Text"
                value={codeText}
                onChange={(e) => {
                  setCodeText(e.target.value);
                  setErrorText("");
                  setErrorModal("");
                }}
              />
            </div>
            <div className="text-center mb-3">
              <span className="text-danger">{errorModal}</span>
            </div>
            {generatedCode ? (
              <div className="mb-3 d-flex flex-column">
                <label className="mb-2">Code</label>
                <img src={generatedCode} style={{ width: "50%" }} alt="N/A" />
              </div>
            ) : (
              <></>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={(e) => generateCode(e)}
              type="submit"
            >
              Generate QR code
            </Button>
            <Button color="primary" onClick={(e) => handleAdd(e)} type="submit">
              {addCodeLoading ? (
                <ClockLoader
                  color={"black"}
                  loading={addCodeLoading}
                  size={26}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <>Add QR Code</>
              )}
            </Button>
            <Button color="secondary" onClick={toggleModalAddCode}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
      <Container className="mt-2">
        <Card className="p-4 mt-2">
          <Row>
            <Col xs="6" className="text-left">
              <h1 className="text-left">All QR Codes</h1>
            </Col>
            <Col xs="6" className="text-end">
              <Button
                color="primary"
                onClick={async () => {
                  await AuthService.getInstance().logout();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              {codesLoading ? (
                <Row className="d-flex justify-content-center">
                  <ClockLoader
                    color={colors.main}
                    loading={codesLoading}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Row>
              ) : (
                <>
                  <Row className="mt-4">
                    {codes.map((code, index) => (
                      <Col className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                        <CodeCard
                          photoUrl={codesImages[index]}
                          code={code}
                          setCodes={setCodes}
                          codes={codes}
                          codesImages={codesImages}
                          setCodesImages={setCodesImages}
                          setAlertErrorMessage={setAlertErrorMessage}
                        />
                      </Col>
                    ))}
                  </Row>
                  <Row className="mt-3">
                    <Col sm="3" className="mt-4">
                      <Button
                        color="primary"
                        onClick={() => {
                          toggleModalAddCode();
                        }}
                      >
                        Add Code
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
