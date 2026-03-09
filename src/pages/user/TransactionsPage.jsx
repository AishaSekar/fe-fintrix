import SidebarComponent from "../../components/SidebarComponent";
import TopNavbarComponent from "../../components/TopNavbarComponent";
import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Badge,
} from "react-bootstrap";
import { PlusCircle } from "lucide-react";
import "../../styles/dashboard.css";

const initialTransactions = [
  {
    id: 1,
    date: "2026-03-05",
    description: "Salary Payment",
    category: "Income",
    type: "income",
    amount: 8240,
    note: "Monthly salary",
  },
  {
    id: 2,
    date: "2026-03-05",
    description: "Grocery Store",
    category: "Food",
    type: "expense",
    amount: 127.5,
    note: "",
  },
];

function TransactionsPage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState({
    type: "all",
    category: "all",
  });

  const handleAdd = (e) => {
    e.preventDefault();
  };

  const filtered = transactions.filter((t) => {
    if (filter.type !== "all" && t.type !== filter.type) return false;
    if (filter.category !== "all" && t.category !== filter.category)
      return false;
    return true;
  });

  return (
    <div className="d-flex">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-layout flex-grow-1 d-flex flex-column">
        <TopNavbarComponent onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <main className="dashboard-main p-4">
          <Container fluid>
            <Row className="g-4">
              <Col lg={4}>
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Add transaction</h5>
                      <PlusCircle size={20} className="text-success" />
                    </div>
                    <Form onSubmit={handleAdd}>
                      <Form.Group className="mb-2">
                        <Form.Label>Type</Form.Label>
                        <Form.Select>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Select>
                          <option>Food</option>
                          <option>Transport</option>
                          <option>Bills</option>
                          <option>Entertainment</option>
                          <option>Investment</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" step="0.01" />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Optional"
                        />
                      </Form.Group>
                      <Button type="submit" variant="success" className="w-100">
                        Save
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={8}>
                <Card className="shadow-sm border-0 mb-3">
                  <Card.Body>
                    <div className="d-flex flex-wrap gap-3 align-items-end">
                      <div>
                        <Form.Label className="mb-1 small">Type</Form.Label>
                        <Form.Select
                          size="sm"
                          value={filter.type}
                          onChange={(e) =>
                            setFilter((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                        >
                          <option value="all">All</option>
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </Form.Select>
                      </div>
                      <div>
                        <Form.Label className="mb-1 small">Category</Form.Label>
                        <Form.Select
                          size="sm"
                          value={filter.category}
                          onChange={(e) =>
                            setFilter((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                        >
                          <option value="all">All</option>
                          <option value="Income">Income</option>
                          <option value="Food">Food</option>
                        </Form.Select>
                      </div>
                    </div>
                  </Card.Body>
                </Card>

                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h5 className="mb-3">Transaction history</h5>
                    <Table hover responsive className="mb-0 align-middle">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th className="text-end">Amount</th>
                          <th className="text-center">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((t) => (
                          <tr key={t.id}>
                            <td>{t.date}</td>
                            <td>{t.description}</td>
                            <td>{t.category}</td>
                            <td
                              className={`text-end ${t.type === "income"
                                  ? "text-success"
                                  : "text-danger"
                                }`}
                            >
                              {t.type === "income" ? "+" : "-"}$
                              {t.amount.toLocaleString()}
                            </td>
                            <td className="text-center">
                              <Badge
                                bg={
                                  t.type === "income"
                                    ? "success-subtle"
                                    : "danger-subtle"
                                }
                                text="dark"
                              >
                                {t.type}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default TransactionsPage;

