import QRCode from "qrcode";
import {
  Button,
  Col,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { ImageType } from "../views/Guest";
import { useState } from "react";
import Select from "react-select";

type DownloadModalProps = {
  phototUrl: string;
  codeTitle: string;
  codeText: string;
  trackUrl: string;
  isOpen: boolean;
  toggle: () => void;
};

const reactSelectOptions = [
  { value: ImageType.Png, label: "PNG" },
  { value: ImageType.Jpeg, label: "JPEG" },
  { value: ImageType.Webp, label: "WEBP" },
];

export default function DownloadModal(props: DownloadModalProps) {
  const [imageType, setImageType] = useState<ImageType>(ImageType.Png);
  const [imageQuality, setImageQuality] = useState(0.5);
  const [scale, setScale] = useState(1);

  async function handleDownload() {
    const url = await QRCode.toDataURL(props.trackUrl, {
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
        a.download = `${props.codeTitle}.png`;
        break;
      case ImageType.Jpeg:
        a.download = `${props.codeTitle}.jpeg`;
        break;
      case ImageType.Webp:
        a.download = `${props.codeTitle}.webp`;
        break;
      default:
        a.download = `${props.codeTitle}.png`;
    }

    // Programmatically click the anchor element to trigger the download
    a.click();
    props.toggle();
  }

  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle}>
      <ModalHeader>Download QR Code</ModalHeader>
      <form>
        <ModalBody>
          <div className="d-flex flex-column align-items-center mb-3">
            <label>QR Code Title</label>
            <div className="text-center mb-3"> {props.codeTitle} </div>
          </div>
          <div className="d-flex flex-column align-items-center mb-3">
            <label>QR Code Link</label>
            <Row className="text-center mb-3 w-100">
              <Col
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  wordBreak: "break-all",
                  whiteSpace: "none",
                }}
              >
                {" "}
                {props.codeText}{" "}
              </Col>
            </Row>
          </div>
          <div className="mb-3 d-flex flex-column">
            <label className="mb-2">Code</label>
            <Row className="card-top p-3">
              <Col
                className="card-photo-wrapper"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <img className="card-photo" src={props.phototUrl} alt="code" />
              </Col>
            </Row>
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
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleDownload} type="submit">
            Download QR code
          </Button>
          <Button color="secondary" onClick={props.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
