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
import { useNavigate } from "react-router-dom";
import QRcode from "qrcode";
import validator from "validator";
import { ClockLoader } from "react-spinners";
import { Code } from "../models/code";
import {
  createCode,
  deleteCode,
  getAllCodes,
  logout,
} from "../network/ApiAxios";
import { AxiosError } from "axios";

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
  const [deleteCodeLoading, setDeleteCodeLoading] = useState(false);
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
      const result = await getAllCodes();
      if (result instanceof AxiosError) {
        setAlertErrorMessage(
          `Unexpected error: ${
            result.response?.data.error
              ? result.response?.data.error
              : "Please check the backend logs in the project dashboard - https://app.genez.io."
          }`
        );
        return;
      }
      if (result?.data) {
        const resCodes = result.data;
        setCodes(resCodes);
        const images = await Promise.all(
          resCodes.map(async (code: Code) => {
            const res = await QRcode.toDataURL(
              trackingURL + "?codeId=" + code.id
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

  async function handleDelete(id: string) {
    setDeleteCodeLoading(true);
    const res = await deleteCode(id);
    if (res instanceof AxiosError) {
      setAlertErrorMessage(
        `${
          res.response?.data.error
            ? res.response?.data.error
            : "Unexpected error: Please check the backend logs in the project dashboard - https://app.genez.io."
        }`
      );
    }
    setCodes(codes.filter((code) => code.id !== id));
    setCodesImages(codesImages.filter((_, index) => codes[index].id !== id));
    setDeleteCodeLoading(false);
  }

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
    const res = await createCode(codeTitle, codeText);
    if (res instanceof AxiosError) {
      setErrorModal(
        `${
          res.response?.data.error
            ? res.response?.data.error
            : "Unexpected error: Please check the backend logs in the project dashboard - https://app.genez.io."
        }`
      );
    }
    if (res.data) {
      const generatedCode = await QRcode.toDataURL(
        trackingURL + "?codeId=" + res.data.id
      );
      setCodes([...codes, res.data]);
      setCodesImages([...codesImages, generatedCode]);
      setCodeTitle("");
      setCodeText("");
      setGeneratedCode("");
      toggleModalAddCode();
    }
    setAddCodeLoading(false);
  }

  async function handleDownload(id: string) {
    const code = codes.find((code) => code.id === id);
    if (code) {
      const url = await QRcode.toDataURL(trackingURL + "?codeId=" + code.id);
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
      <Modal isOpen={modalAddCode} toggle={toggleModalAddCode}>
        <ModalHeader toggle={toggleModalAddCode}>Add new code</ModalHeader>
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
                <>Add Code</>
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
          <Row className="mt-2">
            <Col sm="11">
              <h3>All Codes</h3>

              {codesLoading ? (
                <Row className="mt-5 ms-5 mb-3">
                  <ClockLoader
                    color={"blue"}
                    loading={codesLoading}
                    size={100}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </Row>
              ) : (
                <Row>
                  <Col sm="12">
                    {codes.map((code, index) => (
                      <div key={code.id} className="mb-3">
                        <p className="mb-0 d-flex flex-column">
                          <span className="h4">Code title: {code.title}</span>
                          <span className="h4">Code text: {code.codeText}</span>
                        </p>
                        <div className="mb-3">
                          <img
                            src={codesImages[index]}
                            id={code.id}
                            alt="N/A"
                          />
                        </div>
                        <ButtonGroup aria-label="Basic example">
                          <Button
                            color="danger"
                            onClick={() => handleDelete(code.id || "")}
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
                            onClick={() => handleDownload(code.id || "")}
                          >
                            Download Code
                          </Button>
                          <Button
                            color="success"
                            onClick={() => {
                              navigate(`/admin/view-code/${code.id}`);
                            }}
                          >
                            View Code
                          </Button>
                        </ButtonGroup>
                      </div>
                    ))}
                  </Col>

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
              )}
            </Col>
            <Col sm="1" className="text-right">
              <Button
                color="primary"
                onClick={async () => {
                  await logout();
                  localStorage.clear();
                  navigate("/auth/login");
                }}
              >
                Logout
              </Button>
            </Col>
          </Row>
        </Card>
      </Container>
    </>
  );
}
