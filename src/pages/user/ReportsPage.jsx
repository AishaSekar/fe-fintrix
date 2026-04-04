import React, { useState } from "react";
import SidebarComponent from "../../components/SidebarComponent";
import TopNavbarComponent from "../../components/TopNavbarComponent";
import { Container, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import { Filter, FileText, TrendingUp, TrendingDown, Wallet, Utensils, Home, Car, ShoppingCart, Zap, Download } from "lucide-react";
import "../../styles/ReportsPage.css";
import "../../styles/animations.css";

const categoryData = [
  { title: "Food & Dining",  amount: "$2,850", percent: 32.7, icon: Utensils,     color: "#20c997", bg: "#e6fcf5" },
  { title: "Housing",        amount: "$2,200", percent: 25.2, icon: Home,          color: "#339af0", bg: "#e7f5ff" },
  { title: "Transportation", amount: "$1,580", percent: 18.1, icon: Car,           color: "#f5a623", bg: "#fff4e5" },
  { title: "Shopping",       amount: "$1,110", percent: 12.8, icon: ShoppingCart,  color: "#845ef7", bg: "#f3e8ff" },
  { title: "Utilities",      amount: "$980",   percent: 11.2, icon: Zap,           color: "#ff6b6b", bg: "#ffe8e6" },
];

const tableData = [
  { date: "Jun 28, 2026", income: "+$5,200", expense: "-$450",  category: "Salary & Dining", note: "Monthly salary and restaurant" },
  { date: "Jun 25, 2026", income: "-",       expense: "-$1,200", category: "Housing",         note: "Rent payment"                 },
  { date: "Jun 12, 2026", income: "-",       expense: "-$320",   category: "Shopping",        note: "Clothing and accessories"     },
  { date: "Jun 01, 2026", income: "+$2,950", expense: "-",       category: "Investment",      note: "Dividend income"              },
];

function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex reports-page">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-layout reports-layout flex-grow-1 d-flex flex-column">
        <TopNavbarComponent onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <main className="dashboard-main p-4 p-md-5">
          <Container fluid className="px-0 px-md-3">

            {/* Header */}
            <div className="reports-header mb-4 anim-fade-up anim-d0">
              <h2 className="fw-bold m-0">Reports</h2>
              <p className="text-muted">View and export your financial reports</p>
            </div>

            {/* BLOCK 1: REPORT FILTERS */}
            <Card className="shadow-sm reports-card mb-4 card-hover anim-fade-up anim-d1">
              <Card.Body className="p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center text-dark">
                    <Filter size={20} className="reports-filter-icon me-2" /> Report Filters
                  </h5>
                  <Button className="reports-btn-generate fw-bold px-4 py-2 d-flex align-items-center">
                    <FileText size={18} className="me-2" /> Generate Report
                  </Button>
                </div>
                <Row className="g-3">
                  {[
                    { label: "Report Type",    type: "select", options: ["Yearly","Monthly","Weekly"],                  def: "Yearly"          },
                    { label: "Date From",      type: "text",                                                             def: "01/01/2026"      },
                    { label: "Date To",        type: "text",                                                             def: "06/30/2026"      },
                    { label: "Category Filter",type: "select", options: ["All Categories","Food & Dining","Housing"],   def: "All Categories"  },
                  ].map((f, i) => (
                    <Col xs={12} sm={6} md={3} key={i}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-dark mb-1">{f.label}</Form.Label>
                        {f.type === "select" ? (
                          <Form.Select className="reports-form-field py-2" defaultValue={f.def}>
                            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                          </Form.Select>
                        ) : (
                          <Form.Control type="text" defaultValue={f.def} className="reports-form-field py-2" />
                        )}
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            {/* BLOCK 2: KEY METRICS */}
            <Row className="g-3 mb-4">
              <Col xs={12} sm={4}>
                <Card className="shadow-sm reports-card h-100 card-hover card-hover-green anim-fade-up anim-d2">
                  <Card.Body className="p-4">
                    <div className="reports-metric-icon reports-metric-icon--income mb-3"><TrendingUp size={20} /></div>
                    <p className="small text-muted fw-semibold mb-1">Total Income</p>
                    <h3 className="fw-bold mb-0 reports-metric-value--income">$12,450</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={4}>
                <Card className="shadow-sm reports-card h-100 card-hover anim-fade-up anim-d3">
                  <Card.Body className="p-4">
                    <div className="reports-metric-icon reports-metric-icon--expense mb-3"><TrendingDown size={20} /></div>
                    <p className="small text-muted fw-semibold mb-1">Total Expenses</p>
                    <h3 className="fw-bold mb-0 reports-metric-value--expense">$8,720</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={4}>
                <Card className="shadow-sm reports-card h-100 card-hover card-hover-green anim-fade-up anim-d4">
                  <Card.Body className="p-4">
                    <div className="reports-metric-icon reports-metric-icon--balance mb-3"><Wallet size={20} /></div>
                    <p className="small text-muted fw-semibold mb-1">Total Balance</p>
                    <h3 className="fw-bold mb-0 reports-metric-value--balance">+$3,730</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* BLOCK 3: CATEGORY REPORT */}
            <Card className="shadow-sm reports-card mb-4 card-hover anim-fade-up anim-d3">
              <Card.Body className="p-4">
                <h5 className="fw-bold text-dark mb-4">Category Report</h5>
                <div className="d-flex reports-category-scroll gap-3 pb-2">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="reports-category-col flex-shrink-0">
                      <Card className={`reports-category-card h-100 card-hover-subtle anim-scale-in anim-d${i + 1}`}>
                        <Card.Body className="p-4">
                          <div className="reports-category-icon mb-4" style={{ backgroundColor: cat.bg, color: cat.color }}>
                            <cat.icon size={22} />
                          </div>
                          <p className="small text-muted fw-bold mb-1">{cat.title}</p>
                          <h4 className="fw-bold text-dark mb-4">{cat.amount}</h4>
                          <div className="d-flex align-items-center">
                            <div className="reports-progress-bar-track">
                              <div className="reports-progress-bar-fill anim-progress-fill" style={{ width: `${cat.percent}%`, backgroundColor: cat.color }} />
                            </div>
                            <span className="small text-muted fw-bold" style={{ fontSize: 11 }}>{cat.percent}%</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* BLOCK 4: MONTHLY REPORT TABLE */}
            <Card className="shadow-sm reports-table-card mb-4 card-hover anim-fade-up anim-d4">
              <Card.Body className="p-4">
                <h5 className="fw-bold text-dark mb-4">Monthly Report Table</h5>
                <div className="table-responsive">
                  <Table hover borderless className="reports-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="text-secondary fw-bold py-3 text-uppercase">Date</th>
                        <th className="text-secondary fw-bold py-3 text-uppercase text-center">Income</th>
                        <th className="text-secondary fw-bold py-3 text-uppercase text-center">Expense</th>
                        <th className="text-secondary fw-bold py-3 text-uppercase">Category</th>
                        <th className="text-secondary fw-bold py-3 text-uppercase">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, i) => (
                        <tr key={i}>
                          <td className="text-secondary fw-bold py-3">{row.date}</td>
                          <td className={`text-center fw-bold py-3 ${row.income !== "-" ? "income-positive" : "income-dash"}`}>{row.income}</td>
                          <td className={`text-center fw-bold py-3 ${row.expense !== "-" ? "expense-negative" : "expense-dash"}`}>{row.expense}</td>
                          <td className="text-dark fw-bold py-3">{row.category}</td>
                          <td className="text-secondary py-3">{row.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            {/* BLOCK 5: EXPORT REPORT */}
            <Card className="shadow-sm reports-card card-hover anim-fade-up anim-d5">
              <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center reports-export-row">
                <div className="mb-3 mb-md-0">
                  <h5 className="fw-bold text-dark mb-1">Export Report</h5>
                  <p className="text-muted small mb-0">Download your financial report in different formats</p>
                </div>
                <div className="d-flex flex-wrap gap-3 reports-export-btn-group">
                  <Button className="reports-btn-pdf fw-bold px-4 py-2 d-flex align-items-center">
                    <FileText size={18} className="me-2" /> Export as PDF
                  </Button>
                  <Button className="reports-btn-excel fw-bold px-4 py-2 d-flex align-items-center">
                    <Download size={18} className="me-2" /> Export as Excel
                  </Button>
                </div>
              </Card.Body>
            </Card>

          </Container>
        </main>
      </div>
    </div>
  );
}

export default ReportsPage;
