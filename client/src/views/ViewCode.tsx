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
import { useNavigate, useParams } from "react-router-dom";
import QRcode from "qrcode";
import validator from "validator";
import { ClockLoader } from "react-spinners";
import { Code } from "../models/code";
import {
  deleteCode,
  getCode,
  logout,
  updateCode,
} from "../network/ApiAxios";
import { AxiosError } from "axios";

export default function ViewCode() {
  const navigate = useNavigate();

  const [code, setCode] = useState<Code>();
  const [codeImage, setCodeImage] = useState<string>();
  const [modalEditCode, setModalEditCode] = useState(false);
  const toggleModalEditCode = () => {
    if(!modalEditCode){
      setCodeTitle(code?.title || "");
      setUrl(code?.url || "");
    }
    setModalEditCode(!modalEditCode);
    
  };
  const [codeLoading, setCodeLoading] = useState(true);
  const [deleteCodeLoading, setDeleteCodeLoading] = useState(false);
  const [editCodeLoading, setEditCodeLoading] = useState(false);

  const [errorTitle, setErrorTitle] = useState("");
  const [errorText, setErrorText] = useState("");
  const [errorModal, setErrorModal] = useState("");
  const [alertErrorMessage, setAlertErrorMessage] = useState<string>("");

  const [codeTitle, setCodeTitle] = useState("");
  const [url, setUrl] = useState("");
  const { codeId } = useParams<{ codeId?: string }>();

  useEffect(() => {
    const fetchCode = async () => {
      setCodeLoading(true);
      const result = await getCode(codeId || "");
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
      if (result.data) {
        setCode(result.data);
        const image = await QRcode.toDataURL(
          result.data?.url
        );
        setCodeImage(image);
        setCodeLoading(false);
      }
    };
    if (codeLoading) {
      fetchCode();
    }
  }, [codeLoading, code, codeImage, alertErrorMessage, codeId]);

  async function handleDelete(id: string) {
    setDeleteCodeLoading(true);
    const res = await deleteCode(id);
    if (res instanceof AxiosError) {
      setAlertErrorMessage(
        `Unexpected error: ${
          res.response?.data.error
            ? res.response?.data.error
            : "Please check the backend logs in the project dashboard - https://app.genez.io."
        }`
      );
      return;
    }

    alert("Code deleted successfully");
    navigate(0);
    setDeleteCodeLoading(false);
  }

  async function handleEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!codeTitle) {
      setErrorTitle("Title is mandatory");
      return;
    }
    if (!url) {
      setErrorText("Text is mandatory");
      return;
    }
    const isValidUrl = validator.isURL(url, {
      protocols: ["http", "https"],
      require_protocol: true,
    });
    if (!isValidUrl) {
      setErrorModal("The text is not a valid URL");
      return;
    }
    setEditCodeLoading(true);
    const res = await updateCode(code?.id || "", codeTitle, url);

    if (res instanceof AxiosError) {
      setAlertErrorMessage(
        `Unexpected error: ${
          res.response?.data.error
            ? res.response?.data.error
            : "Please check the backend logs in the project dashboard - https://app.genez.io."
        }`
      );
      return;
    }
    if (res.data) {
      const generatedCode = await QRcode.toDataURL(
        res.data.url
      );
      setCode(res.data);
      setCodeImage(generatedCode);
      setCodeTitle("");
      setUrl("");
      toggleModalEditCode();
    }
    setEditCodeLoading(false);
  }

  async function handleDownload() {
    if (code) {
      const url = await QRcode.toDataURL(code.url);
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
        <ModalHeader toggle={toggleModalEditCode}>Edit code</ModalHeader>
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
              <label>Code URL</label>
              <Input
                className="form-control"
                placeholder="URL"
                autoComplete="URL"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrorText("");
                  setErrorModal("");
                }}
              />
            </div>
            <span className="text-danger">{errorModal}</span>
          </ModalBody>
          <ModalFooter>
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
                        <span className="h4">Code url: {code?.url}</span>
                      </p>
                      <div className="mb-3">
                        <img src={codeImage} id={code?.id} alt="N/A" />
                      </div>
                      <ButtonGroup aria-label="Basic example">
                        <Button
                          color="danger"
                          onClick={() => handleDelete(code?.id || "")}
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
                    await logout();
                    localStorage.clear();
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
