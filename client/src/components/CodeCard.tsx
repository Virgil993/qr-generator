import { useState } from "react";
import { Button, Card, Col, Row } from "reactstrap";
import QRCode from "qrcode";
import { useNavigate } from "react-router-dom";
import { CodeService, Code } from "@genezio-sdk/qr-generator";
import { ClockLoader } from "react-spinners";

interface CodeCardProps {
  photoUrl: string;
  code: Code;
  setCodes: (codes: Code[]) => void;
  setCodesImages: (codesImages: string[]) => void;
  codes: Code[];
  codesImages: string[];
  setAlertErrorMessage: (message: string) => void;
}

export default function CodeCard(props: CodeCardProps) {
  const navigate = useNavigate();
  const trackingURL = import.meta.env.VITE_TRACKING_URL
    ? import.meta.env.VITE_TRACKING_URL
    : "";
  const code = props.code;

  const [deleteCodeLoading, setDeleteCodeLoading] = useState(false);

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
      .then(() => {
        props.setCodes(
          props.codes.filter((codeElem) => codeElem.codeId !== code.codeId)
        );
        props.setCodesImages(
          props.codesImages.filter(
            (_, index) => props.codes[index].codeId !== code.codeId
          )
        );
      })
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
    <Card className="ht-100">
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
          <Button
            color="success"
            onClick={() => {
              navigate(`/admin/view-code/${code.codeId}`);
            }}
          >
            View QR Code
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
