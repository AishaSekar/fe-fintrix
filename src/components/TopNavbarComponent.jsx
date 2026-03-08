import { Navbar, Container, Form, InputGroup, Nav, Dropdown } from "react-bootstrap";
import { Search, Bell, MessageSquare, ChevronDown } from "lucide-react";
import "../styles/topnavbar.css";

function TopNavbarComponent() {
  return (
    <Navbar className="top-navbar bg-white border-bottom py-3 sticky-top">
      <Container fluid className="px-4 pe-md-5 d-flex align-items-center">
        
        {/* Search Bar */}
        <div className="search-wrapper d-none d-md-flex align-items-center flex-grow-1">
          <Form style={{ width: "350px" }}> 
            <InputGroup className="search-group border rounded-3 bg-light">
              <InputGroup.Text className="bg-transparent border-0 pe-1">
                <Search size={18} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="transactions, accounts..."
                className="bg-transparent border-0 shadow-none ps-2"
              />
            </InputGroup>
          </Form>
        </div>

        {/* Icons & Profile Section */}
        <Nav className="ms-auto d-flex flex-row align-items-center flex-shrink-0">
          
          {/* Ikon Lonceng (Notification) */}
          <div className="icon-wrapper bg-light rounded-3 position-relative ms-3">
            <Bell size={20} className="text-muted" />
            <span className="notification-dot"></span>
          </div>

          {/* Ikon Pesan (Message) */}
          <div className="icon-wrapper bg-light rounded-3 mx-2">
            <MessageSquare size={20} className="text-muted" />
          </div>

          {/* Profile Dropdown */}
          <Dropdown align="end" className="profile-dropdown ms-2">
            <Dropdown.Toggle as="div" className="d-flex align-items-center cursor-pointer">
              <div className="avatar-small">A</div>
              <ChevronDown size={16} className="text-muted ms-2" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow border-0 mt-3">
              <Dropdown.Item>My Profile</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default TopNavbarComponent;