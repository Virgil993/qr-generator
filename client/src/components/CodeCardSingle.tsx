import { useState } from "react";
import { Button, Card, Col, Row } from "reactstrap";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { CodeService, Code } from "@genezio-sdk/qr-generator";
import { ClockLoader } from "react-spinners";
import DownloadModal from "./DownloadModal";

interface CodeCardProps {
  photoUrl: string;
  code: Code;
  setAlertErrorMessage: (message: string) => void;
  toogleModalEditCode: () => void;
}

export default function CodeCardSingle(props: CodeCardProps) {
  const navigate = useNavigate();
  const trackingURL = import.meta.env.VITE_TRACKING_URL
    ? import.meta.env.VITE_TRACKING_URL
    : "";

  const code = props.code;
  const [deleteCodeLoading, setDeleteCodeLoading] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  async function handleDownload() {
    const url = await QRCode.toDataURL(trackingURL + "?codeId=" + code.codeId);
    // Create an anchor element dynamically
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${code.title}.png`; // Set the filename for the downloaded image

    // Programmatically click the anchor element to trigger the download
    a.click();
  }

  async function handleDelete() {
    setDeleteCodeLoading(true);
    await CodeService.deleteCode(code.codeId)
      .then(() => navigate("/admin/all-codes"))
      .catch((error) => {
        navigate(0);
        props.setAlertErrorMessage(
          `Unexpected error: ${
            error.message
              ? error.message
              : "Please check the backend logs in the project dashboard - https://app.genez.io."
          }`
        );
      });
    setDeleteCodeLoading(false);
  }

  return (
    <Card className="ht-100 code-card-single">
      <DownloadModal
        codeText={code.codeText}
        codeTitle={code.title}
        phototUrl={props.photoUrl}
        trackUrl={trackingURL + "?codeId=" + code.codeId}
        isOpen={downloadModalOpen}
        toggle={() => {
          setDownloadModalOpen(!downloadModalOpen);
        }}
      />
      <Row className="card-top p-3">
        <div className="card-photo-wrapper">
          <img className="card-photo" src={props.photoUrl} alt="code" />
        </div>
      </Row>
      <Row className="card-middle p-3">
        <div
          className="card-text text-center mb-3 pe-3 ps-3"
          style={{ fontSize: "23px" }}
        >
          QR Code Title:
          <br /> {code.title}
        </div>
      </Row>

      <Row className="card-bottom d-flex flex-column">
        <Col className="text-center ps-4 pe-4 mb-3">
          <Button color="primary" onClick={() => handleDownload()}>
            Download QR Code
          </Button>
        </Col>
        <Col className="text-center ps-4 pe-4 mb-3">
          <Button color="warning" onClick={() => props.toogleModalEditCode()}>
            Edit QR Code
          </Button>
        </Col>
        <Col className="text-center ps-4 pe-4 mb-3">
          {deleteCodeLoading ? (
            <div className="d-flex justify-content-center">
              <ClockLoader
                color={"black"}
                loading={deleteCodeLoading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
            </div>
          ) : (
            <Button
              color="danger"
              onClick={() => {
                handleDelete();
              }}
            >
              Delete QR Code
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  );
}
