import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import cover1 from "../image_assets/cover1.jpg";
import cover2 from "../image_assets/cover2.jpg";
import cover3 from "../image_assets/cover3.jpg";
import cover4 from "../image_assets/cover4.png";

const HomePage = () => {
  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const images = [cover1, cover2, cover3, cover4];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setBgImage(randomImage);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "absolute",
        top: 0,
        right: 0,
        // "homepage": "https://tanay-errorcode.github.io/ErrorCode_amuhacks3.0/#",
        //
        bottom: 0,
        left: 0,
        zIndex: -1,
      }}
    >
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        />
        <Container>
          <Row className="justify-content-md-center text-center">
            <Col md="auto" style={{ zIndex: 10 }}>
              <h1 style={{ color: "white" }}>Lupo Skill</h1> <br />
              <h5 style={{ color: "white" }}>
                A platform where people can learn, join events to learn
                together. A platform where creative minds meet and innovate.
              </h5>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
