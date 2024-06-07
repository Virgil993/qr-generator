import { Col } from "reactstrap";
import logo from "../assets/images/logo.webp";

export default function Footer() {
  return (
    <>
      <Col className="ps-5 pe-5" style={{ fontSize: "20px" }}>
        Our app is a free QR Code Generator designed for ease of use and
        functionality. As a guest, you can generate and download unlimited QR
        codes without any restrictions. For a more personalized experience, you
        can register or log in to save your QR codes in our secure database.
        This allows you to keep track of all your QR codes in one place.
        Additionally, our app offers a unique feature for registered users: the
        ability to track the performance of your QR codes. You can monitor how
        many times each code has been scanned, giving you valuable insights into
        their usage. Whether you are a guest or a registered user, our app
        provides a seamless and efficient way to create and manage QR codes.
      </Col>
    </>
  );
}
