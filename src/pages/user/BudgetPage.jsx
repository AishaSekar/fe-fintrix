import React, { useState } from "react";
import SidebarComponent from "../../components/SidebarComponent";
import TopNavbarComponent from "../../components/TopNavbarComponent";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import { Plus, Utensils, Car, LayoutList, Package, AlertTriangle, MoreVertical } from "lucide-react";
import "../../styles/BudgetPage.css";
import "../../styles/animations.css";

const initialBudgets = [
  { id: 1, name: "Food & Dining",  budget: 600,  spent: 520, icon: Utensils,   iconColor: "#f5a623", iconBg: "#fff4e5" },
  { id: 2, name: "Transportation", budget: 400,  spent: 380, icon: Car,         iconColor: "#339af0", iconBg: "#e7f5ff" },
  { id: 3, name: "Healthcare",     budget: 400,  spent: 250, icon: LayoutList,  iconColor: "#339af0", iconBg: "#e7f5ff" },
  { id: 4, name: "Miscellaneous",  budget: 1500, spent: 550, icon: Package,     iconColor: "#845ef7", iconBg: "#f3e8ff" },
];

const budgetTemplates = [
  { id: "diy-1", label: "Custom DIY Budget", desc: "Create a personalized budget from scratch tailored to your needs", icon: "✏️", iconBg: "#e6fcf5" },
  { id: "diy-2", label: "Custom DIY Budget", desc: "Create a personalized budget from scratch tailored to your needs", icon: "📋", iconBg: "#e7f5ff" },
];

const CATEGORY_OPTIONS = ["Food & Dining","Transportation","Healthcare","Shopping","Miscellaneous","Entertainment"];

const ICON_MAP   = { "Food & Dining": Utensils, "Transportation": Car, "Healthcare": LayoutList };
const COLOR_MAP  = {
  "Food & Dining": { color: "#f5a623", bg: "#fff4e5" },
  "Transportation": { color: "#339af0", bg: "#e7f5ff" },
  "Healthcare": { color: "#339af0", bg: "#e7f5ff" },
};

function BudgetPage() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [budgets, setBudgets]           = useState(initialBudgets);
  const [showModal, setShowModal]       = useState(false);
  const [form, setForm]                 = useState({ name: "Food & Dining", budget: "", spent: "" });
  const [menuOpen, setMenuOpen]         = useState(null);

  const remainingMonth = budgets.reduce((acc, b) => acc + (b.budget - b.spent), 0);

  const alerts = budgets
    .map(b => ({ ...b, pct: Math.round((b.spent / b.budget) * 100) }))
    .filter(b => b.pct >= 80)
    .sort((a, b) => b.pct - a.pct);

  const handleAdd = () => {
    if (!form.budget) return;
    const icon  = ICON_MAP[form.name]  || Package;
    const { color, bg } = COLOR_MAP[form.name] || { color: "#845ef7", bg: "#f3e8ff" };
    setBudgets(prev => [...prev, {
      id: Date.now(), name: form.name, budget: Number(form.budget),
      spent: Number(form.spent) || 0, icon, iconColor: color, iconBg: bg,
    }]);
    setShowModal(false);
    setForm({ name: "Food & Dining", budget: "", spent: "" });
  };

  const handleDelete = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    setMenuOpen(null);
  };

  return (
    <div className="d-flex budget-page">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-layout budget-layout flex-grow-1 d-flex flex-column">
        <TopNavbarComponent onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="dashboard-main p-4 p-md-5">
          <Container fluid className="px-0 px-md-3">

            {/* Header */}
            <div className="budget-header mb-4 anim-fade-up anim-d0">
              <h2 className="fw-bold m-0">Budget</h2>
              <p className="text-muted mb-0">Plan and manage your monthly spending limits</p>
            </div>

            {/* Top Row */}
            <Row className="g-4 mb-4">
              <Col xs={12} md={8}>
                <Card className="shadow-sm budget-card h-100 card-hover anim-fade-up anim-d1">
                  <Card.Body className="p-4">
                    <div className="d-flex budget-create-header justify-content-between align-items-start mb-1">
                      <div>
                        <h5 className="fw-bold text-dark mb-1">Create New Budget</h5>
                        <p className="text-muted small mb-0">Set up a custom budget or use a template</p>
                      </div>
                      <Button className="budget-btn-create d-flex align-items-center px-4 py-2" onClick={() => setShowModal(true)}>
                        <Plus size={17} className="me-1" /> Create Budget
                      </Button>
                    </div>
                    <Row className="g-3 mt-2">
                      {budgetTemplates.map(t => (
                        <Col xs={12} sm={6} key={t.id}>
                          <div className="p-3 border budget-template-card" onClick={() => setShowModal(true)}>
                            <div className="budget-template-icon" style={{ backgroundColor: t.iconBg }}>{t.icon}</div>
                            <div className="fw-bold text-dark small mb-1">{t.label}</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>{t.desc}</div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col xs={12} md={4}>
                <Card className="shadow-sm budget-card h-100 card-hover anim-fade-right anim-d2">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold text-dark mb-1">Budget Alerts</h5>
                    <p className="text-muted small mb-3">Categories approaching limit</p>
                    <div className="d-flex flex-column gap-2 mb-4">
                      {alerts.length === 0 && <div className="text-muted small">All budgets are on track 🎉</div>}
                      {alerts.map((a, i) => (
                        <div key={i} className="p-3 budget-alert-item d-flex align-items-start gap-2">
                          <AlertTriangle size={18} className="mt-1 flex-shrink-0" style={{ color: "#f5a623" }} />
                          <div>
                            <div className="fw-bold small budget-alert-title">{a.pct}% Used</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>You have used {a.pct}% of your {a.name} budget</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small text-muted">Remaining This Month</span>
                      <span className="fw-bold budget-remaining-value">${remainingMonth.toLocaleString()}</span>
                    </div>
                    <div className="budget-remaining-bar-track">
                      <div className="budget-remaining-bar-fill" />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Budget Cards Grid */}
            <Card className="shadow-sm budget-card card-hover anim-fade-up anim-d3">
              <Card.Body className="p-4">
                <h5 className="fw-bold text-dark mb-1">Your Budgets</h5>
                <p className="text-muted small mb-4">Track your spending across different categories</p>
                <Row className="g-3">
                  {budgets.map(b => {
                    const pct       = Math.min(Math.round((b.spent / b.budget) * 100), 100);
                    const remaining = b.budget - b.spent;
                    const barColor  = pct >= 90 ? "#ff6b6b" : pct >= 70 ? "#f5a623" : "#20c997";
                    const cardClass = pct >= 80 ? "budget-item-card--warning" : "budget-item-card--normal";
                    return (
                      <Col key={b.id} xs={12} md={6}>
                        <div className={`p-4 border budget-item-card ${cardClass}`}>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-3">
                              <div className="budget-item-icon" style={{ backgroundColor: b.iconBg, color: b.iconColor }}>
                                <b.icon size={20} />
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{b.name}</div>
                                <div className="text-muted small">Budget: ${b.budget.toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="position-relative">
                              <button className="btn btn-sm btn-light p-1" onClick={() => setMenuOpen(menuOpen === b.id ? null : b.id)}>
                                <MoreVertical size={16} />
                              </button>
                              {menuOpen === b.id && (
                                <div className="position-absolute end-0 bg-white shadow budget-context-menu py-1">
                                  <button className="btn btn-sm w-100 text-start text-danger px-3" onClick={() => handleDelete(b.id)}>Delete</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="budget-item-stats">
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted small">Spent</span>
                              <span className="fw-bold text-dark">${b.spent.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted small">Remaining</span>
                              <span className="fw-bold budget-item-remaining">${remaining.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-muted small">Progress</span>
                              <span className="fw-bold small" style={{ color: barColor }}>{pct}%</span>
                            </div>
                          </div>
                          <div className="budget-progress-track">
                            <div className="budget-progress-fill" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>

          </Container>
        </main>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Create New Budget</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Category</Form.Label>
            <Form.Select className="budget-modal-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}>
              {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Budget Amount ($)</Form.Label>
            <Form.Control type="number" placeholder="e.g. 500" className="budget-modal-input" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold">Amount Already Spent ($)</Form.Label>
            <Form.Control type="number" placeholder="0" className="budget-modal-input" value={form.spent} onChange={e => setForm({ ...form, spent: e.target.value })} />
          </Form.Group>
          <Button className="budget-modal-btn w-100 fw-bold py-2" onClick={handleAdd}>Save Budget</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default BudgetPage;
