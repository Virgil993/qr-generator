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
import {
  CodeService,
  Code,
  Track,
  TrackService,
} from "@genezio-sdk/qr-generator";
import { useNavigate, useParams } from "react-router-dom";
import { AuthService } from "@genezio/auth";
import QRcode from "qrcode";
import validator from "validator";
import { ClockLoader } from "react-spinners";
import CodeCardSingle from "../components/CodeCardSingle";
import { colors } from "../assets/utils/colors";

export default function ViewCode() {
  const navigate = useNavigate();

  const trackingURL = import.meta.env.VITE_TRACKING_URL
    ? import.meta.env.VITE_TRACKING_URL
    : "";
  const [code, setCode] = useState<Code>();
  const [codeImage, setCodeImage] = useState<string>();
  const [modalEditCode, setModalEditCode] = useState(false);
  const toggleModalEditCode = () => {
    setModalEditCode(!modalEditCode);
    setCodeTitle(code?.title || "");
    setCodeText(code?.codeText || "");
  };
  const [trackingData, setTrackingData] = useState<Track[]>();
  const [codeLoading, setCodeLoading] = useState(true);
  const [editCodeLoading, setEditCodeLoading] = useState(false);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [alertErrorMessage, setAlertErrorMessage] = useState<string>("");

  const [codeTitle, setCodeTitle] = useState("");
  const [codeText, setCodeText] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { codeId } = useParams<{ codeId?: string }>();

  useEffect(() => {
    const fetchCode = async () => {
      setCodeLoading(true);
      const result = await CodeService.getCode(codeId || "").catch((error) => {
        setAlertErrorMessage(
          `Unexpected error: ${
            error.message
              ? error.message
              : "Please check the backend logs in the project dashboard - https://app.genez.io."
          }`
        );
        return null;
      });
      if (result) {
        setCode(result);
        const image = await QRcode.toDataURL(
          trackingURL + "?codeId=" + result.codeId,
          {
            color: {
              dark: "#0000",
              light: colors.main,
            },
            margin: 10,
          }
        );
        setCodeImage(image);
        setCodeLoading(false);
        await fetchTrackingData(result.codeId);
      }
    };
    if (codeLoading) {
      fetchCode();
    }
  }, [codeLoading, code, codeImage, alertErrorMessage, trackingURL, codeId]);

  async function fetchTrackingData(id: string) {
    setTrackingLoading(true);
    const result = await TrackService.getTrackingData(id).catch((error) => {
      setAlertErrorMessage(
        `Unexpected error: ${
          error.message
            ? error.message
            : "Please check the backend logs in the project dashboard - https://app.genez.io."
        }`
      );
      return null;
    });
    if (result) {
      setTrackingData(result);
      setTrackingLoading(false);
    }
  }

  async function generateCode(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
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

  async function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!codeTitle) {
      setErrorTitle("Title is mandatory");
      return;
    }
    if (!codeText) {
      setErrorText("Text is mandatory");
      return;
    }
    setEditCodeLoading(true);
    const res = await CodeService.updateCode(
      code!.codeId,
      codeTitle,
      codeText
    ).catch((error) => {
      setErrorModal(
        `${
          error.message
            ? error.message
            : "Unexpected error: Please check the backend logs in the project dashboard - https://app.genez.io."
        }`
      );
      return null;
    });
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
      setCode(res.code!);
      setCodeImage(generatedCode);
      setCodeTitle("");
      setCodeText("");
      setGeneratedCode("");
      toggleModalEditCode();
    }
    setEditCodeLoading(false);
  }

  return alertErrorMessage != "" ? (
    <Row className="ms-5 me-5 ps-5 pe-5 mt-5 pt-5">
      <Alert color="danger">{alertErrorMessage}</Alert>
    </Row>
  ) : (
    <>
      <Modal isOpen={modalEditCode} toggle={toggleModalEditCode}>
        <ModalHeader toggle={toggleModalEditCode}>Edit QR code</ModalHeader>
        <form>
          <ModalBody>
            <div className="text-center mb-3">
              <span className="text-danger">{errorTitle}</span>
            </div>

            <div className="mb-3">
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
            <div>
              <span className="text-danger">{errorText}</span>
            </div>
            <div className="mb-3">
              <label>QR Code Link</label>
              <Input
                className="form-control"
                placeholder="Link"
                autoComplete="Link"
                value={codeText}
                onChange={(e) => {
                  setCodeText(e.target.value);
                  setErrorText("");
                  setErrorModal("");
                }}
              />
            </div>
            <div>
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
              Generate code
            </Button>
            <Button
              color="primary"
              onClick={(e) => handleEdit(e)}
              type="submit"
            >
              {editCodeLoading ? (
                <ClockLoader
                  color={"black"}
                  loading={editCodeLoading}
                  size={26}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              ) : (
                <>Edit Code</>
              )}
            </Button>
            <Button color="secondary" onClick={toggleModalEditCode}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
      <Container className="mt-2">
        <Card className="p-4 mt-2">
          {codeLoading ? (
            <div className="d-flex justify-content-center">
              <ClockLoader
                color={colors.main}
                loading={codeLoading}
                size={60}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <>
              <Row className="mt-2">
                <Col xs="6">
                  <h1>QR Code Title: {code ? code.title : ""}</h1>
                </Col>
                <Col xs="6" className="text-end">
                  <Button
                    className="ms-2 me-2"
                    color="success"
                    onClick={() => {
                      navigate("/admin/all-codes");
                    }}
                  >
                    All Codes
                  </Button>
                  <Button
                    className="ms-2 me-2"
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
              <Row>
                <Col className="d-flex justify-content-center">
                  <CodeCardSingle
                    photoUrl={codeImage!}
                    code={code!}
                    setAlertErrorMessage={setAlertErrorMessage}
                    toogleModalEditCode={toggleModalEditCode}
                  />
                </Col>
              </Row>
              <Row className="d-flex justify-content-center align-items-center flex-column mt-4 text-center">
                <Col>
                  <h2>Tracking Data</h2>
                </Col>
                <Col className="mt-2 mb-3">
                  <Button
                    color="info"
                    onClick={() => fetchTrackingData(code!.codeId)}
                  >
                    Refresh
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center align-items-center ">
                  {trackingLoading ? (
                    <ClockLoader
                      color={colors.main}
                      loading={trackingLoading}
                      size={60}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  ) : (
                    <div style={{ fontSize: "30px" }}>
                      This code has been accesed{" "}
                      {trackingData ? trackingData.length : "0"} times today
                    </div>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Container>
    </>
  );
}
