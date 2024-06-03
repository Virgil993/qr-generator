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
  ButtonGroup,
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
    setCodeTitle("");
  };
  const [trackingData, setTrackingData] = useState<Track[]>();
  const [codeLoading, setCodeLoading] = useState(true);
  const [deleteCodeLoading, setDeleteCodeLoading] = useState(false);
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
          trackingURL + "?codeId=" + result.codeId
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

  async function handleDelete(id: string) {
    setDeleteCodeLoading(true);
    await CodeService.deleteCode(id)
      .then(() => {
        alert("Code deleted successfully");
        navigate(0);
      })
      .catch((error) => {
        navigate(0);
        setAlertErrorMessage(
          `Unexpected error: ${
            error.message
              ? error.message
              : "Please check the backend logs in the project dashboard - https://app.genez.io."
          }`
        );
      });
    setDeleteCodeLoading(false);
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
        trackingURL + "?codeId=" + res.code!.codeId
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

  async function handleDownload() {
    if (code) {
      const url = await QRcode.toDataURL(
        trackingURL + "?codeId=" + code.codeId
      );
      // Create an anchor element dynamically
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${code.title}.png`; // Set the filename for the downloaded image

      // Programmatically click the anchor element to trigger the download
      a.click();
    }
  }

  return alertErrorMessage != "" ? (
    <Row className="ms-5 me-5 ps-5 pe-5 mt-5 pt-5">
      <Alert color="danger">{alertErrorMessage}</Alert>
    </Row>
  ) : (
    <>
      <Modal isOpen={modalEditCode} toggle={toggleModalEditCode}>
        <ModalHeader toggle={toggleModalEditCode}>Add new code</ModalHeader>
        <form>
          <ModalBody>
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
                  setErrorModal("");
                }}
              />
            </div>
            <span className="text-danger">{errorModal}</span>
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
                <>Add Code</>
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
          <Row className="mt-2">
            <Col sm="9">
              {codeLoading ? (
                <Row className="mt-5 ms-5 mb-3">
                  <ClockLoader
                    color={"blue"}
                    loading={codeLoading}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Row>
              ) : (
                <Row>
                  <Col sm="12">
                    <div className="mb-3">
                      <p className="mb-0 d-flex flex-column">
                        <span className="h4">Code title: {code?.title}</span>
                        <span className="h4">Code text: {code?.codeText}</span>
                      </p>
                      <div className="mb-3">
                        <img src={codeImage} id={code?.codeId} alt="N/A" />
                      </div>
                      <ButtonGroup aria-label="Basic example">
                        <Button
                          color="danger"
                          onClick={() => handleDelete(code?.codeId || "")}
                        >
                          {deleteCodeLoading ? (
                            <ClockLoader
                              color={"black"}
                              loading={deleteCodeLoading}
                              size={30}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          ) : (
                            <>Delete Code</>
                          )}
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => handleDownload()}
                        >
                          Download Code
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => {
                            toggleModalEditCode();
                          }}
                        >
                          Edit Code
                        </Button>
                      </ButtonGroup>
                    </div>

                    <Row>
                      <Col sm="12">
                        {trackingLoading ? (
                          <Row className="mt-5 ms-5 mb-3">
                            <ClockLoader
                              color={"blue"}
                              loading={trackingLoading}
                              size={100}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          </Row>
                        ) : (
                          <Row>
                            <Col sm="12">
                              <div className="mb-3">
                                <p className="mb-0 d-flex flex-column">
                                  <span className="h3">Tracking data</span>
                                </p>
                                <p className="mb-0 d-flex flex-column">
                                  <span className="h4">
                                    This code has been accesed{" "}
                                    {trackingData?.length} time
                                    {trackingData?.length === 1 ? "" : "s"}
                                  </span>
                                </p>
                                <div className="mb-3">
                                  <table className="table">
                                    <thead>
                                      <tr>
                                        <th scope="col">Source IP</th>
                                        <th scope="col">Date</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {trackingData?.map((track, index) => (
                                        <tr key={index}>
                                          <td>{track.sourceIp}</td>
                                          <td>{track.date.toString()}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </Col>
                          </Row>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
            </Col>
            <Col sm="3" className="text-right">
              <ButtonGroup className="d-flex">
                <Button
                  color="success"
                  onClick={() => {
                    navigate("/admin/all-codes");
                  }}
                >
                  All Codes
                </Button>
                <Button
                  color="primary"
                  onClick={async () => {
                    await AuthService.getInstance().logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
