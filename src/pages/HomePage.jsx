import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { lembarDua } from "../data/index";

const HomePage = () => {
  let navigate = useNavigate();
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
              <div class="d-flex gap-3 flex-column flex-md-row">
                <button
                  onClick={() => navigate("/login")}
                  className="btn-get-started"
                >
                  Get Started
                </button>
                <button className="btn-learn-more">Learn More</button>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <div className="lembar-dua w-100 min-vh-100">
        <Container>
          <Row>
            <Col>
              <h2 className="text-center fw-bold">
                Everything you need to manage your finances
              </h2>
              <p className="text-center">
                Simple, powerful tools to help you take control of your
                financial future.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-start g-4">
            {lembarDua.map((hal2) => {
              return (
                <Col key={hal2.id} lg="4" md="6" sm="12">
                  <div className="shadow-rounded">
                    <img src={hal2.image} alt={hal2.judul} className="mb-3" />
                    <div className="hal2">
                      <h5 className="mb-3 fw-bold">{hal2.judul}</h5>
                      <p>{hal2.paragraf}</p>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Container>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default HomePage;
