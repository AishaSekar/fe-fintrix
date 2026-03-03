import { Container, Row, Col } from "react-bootstrap";

const HomePage = () => {
  return (
    <div className="homepage">
      <header className="w-100 min-vh-100 d-flex align-items-center pt-lg-5">
        <Container>
          <Row className="header-box d-flex align-items-center">
            <Col lg="6">
              <h1>
                Control
                <br />
                Your <span>Money</span> <br />
                Own Your Future
              </h1>
              <p className="mb-4">
                Track income, monitor expense, and build smarter financial{" "}
                <br />
                habits with fintrix
              </p>
              <button className="btn-get-started">
                Get Started
              </button>
              <button className="btn-learn-more">
                Learn More
              </button>
            </Col>
          </Row>
        </Container>
      </header>
      <div className="lembar-dua w-100 min-vh-100">
      </div>
    </div>
  );
};

export default HomePage;
