import React, { useState, useMemo, useEffect, useCallback } from "react";
import SidebarComponent from "../../components/SidebarComponent";
import TopNavbarComponent from "../../components/TopNavbarComponent";
import { Container, Row, Col, Card, Form, Button, Table, InputGroup, Modal, Spinner } from "react-bootstrap";
import { Plus, Wallet, TrendingUp, TrendingDown, Receipt, Calendar, Search, Filter, Pencil, Trash2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { transactionApi } from "../../services/api";
import "../../styles/dashboard.css";
import "../../styles/trasaction.css";
import "../../styles/animations.css";

const StatusBadge = ({ status }) => (
  <span className={`tp-badge-base ${status === "Completed" ? "tp-badge-completed" : "tp-badge-pending"}`}>{status}</span>
);

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "";
const formatDateInput = (d) => d ? new Date(d).toISOString().split('T')[0] : "";
const formatMoney = (a) => "$" + a.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ── Mobile Transaction Card ── */
const TransactionMobileCard = ({ t, onEdit, onDelete }) => (
  <div className="tp-mobile-card p-3 mb-3">
    <div className="d-flex justify-content-between align-items-start mb-2">
      <div className="d-flex align-items-center gap-2">
        <div className={`tp-mobile-card-icon ${t.amountType === "income" ? "tp-mobile-card-icon--income" : "tp-mobile-card-icon--expense"}`}>
          {t.amountType === "income" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
        <div>
          <div className="fw-bold text-dark tp-mobile-card-category">{t.category}</div>
          <div className="text-muted tp-mobile-card-date">{formatDate(t.date)}</div>
        </div>
      </div>
      <div className="text-end">
        <div className={`fw-bold ${t.amountType === "income" ? "tp-table-td-amount-income" : "tp-table-td-amount-expense"} tp-mobile-card-amount`}>
          {t.amountType === "income" ? "+" : "-"}{formatMoney(t.amount)}
        </div>
        <StatusBadge status={t.status} />
      </div>
    </div>
    {(t.note || t.budget) && (
      <div className="tp-mobile-card-meta">
        {t.budget && <span className="tp-mobile-card-tag">{t.budget}</span>}
        {t.note && <span className="text-muted tp-mobile-card-note">{t.note}</span>}
      </div>
    )}
    <div className="d-flex justify-content-end gap-3 mt-2 pt-2 tp-mobile-card-actions">
      <button className="btn btn-sm btn-light d-flex align-items-center gap-1 tp-mobile-edit-btn" onClick={() => onEdit(t)}>
        <Pencil size={14} /> Edit
      </button>
      <button className="btn btn-sm btn-light text-danger d-flex align-items-center gap-1 tp-mobile-delete-btn" onClick={() => onDelete(t._id)}>
        <Trash2 size={14} /> Delete
      </button>
    </div>
  </div>
);

function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterType, setFilterType]     = useState("All Types");
  const [showModal, setShowModal]       = useState(false);
  const [editingId, setEditingId]       = useState(null);
  const [saving, setSaving]             = useState(false);
  const [formData, setFormData]         = useState({ date: "", category: "", budget: "", note: "", amount: "", amountType: "income", status: "Completed" });

  const uniqueCategories = ["All Categories","Salary","Freelance","Investment","Side Hustle","Groceries","Food & Dining","Shopping","Transportation","Bills & Utilities","Entertainment","Healthcare","Education","Others"];

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await transactionApi.getAll();
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => transactions.filter((t) => {
    const matchSearch   = t.category.toLowerCase().includes(searchTerm.toLowerCase()) || (t.note || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchType     = filterType === "All Types" || (filterType === "Income" && t.amountType === "income") || (filterType === "Expense" && t.amountType === "expense");
    const matchCategory = filterCategory === "All Categories" || t.category === filterCategory;
    return matchSearch && matchType && matchCategory;
  }), [transactions, searchTerm, filterType, filterCategory]);

  const { totalBalance, monthlyIncome, monthlyExpenses } = useMemo(() => {
    let income = 0, expenses = 0;
    transactions.forEach((t) => { if (t.amountType === "income") income += t.amount; else expenses += t.amount; });
    return { totalBalance: income - expenses, monthlyIncome: income, monthlyExpenses: expenses };
  }, [transactions]);

  const handleCreate = () => {
    setFormData({ date: "", category: "", budget: "", note: "", amount: "", amountType: "income", status: "Completed" });
    setEditingId(null); setShowModal(true);
  };

  const handleEdit = (t) => {
    setFormData({
      date: formatDateInput(t.date),
      category: t.category,
      budget: t.budget || "",
      note: t.note || "",
      amount: t.amount,
      amountType: t.amountType,
      status: t.status
    });
    setEditingId(t._id); setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await transactionApi.delete(id);
      setTransactions(transactions.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete transaction:", err);
      alert("Failed to delete transaction");
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...formData, amount: parseFloat(formData.amount) || 0 };

    try {
      if (editingId) {
        const updated = await transactionApi.update(editingId, payload);
        setTransactions(transactions.map((t) => t._id === editingId ? updated : t));
      } else {
        const created = await transactionApi.create(payload);
        setTransactions([created, ...transactions]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save transaction:", err);
      alert(err.response?.data?.message || "Failed to save transaction");
    } finally {
      setSaving(false);
    }
  };

  const handleModalChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };

  const metricCards = [
    { label: "Total Balance",      value: formatMoney(totalBalance),    iconCls: "tp-card-icon-blue",   valCls: "tp-card-value-dark",  Icon: Wallet,       trend: <div className="d-flex align-items-center tp-trend-green"><ArrowUpRight size={16} /></div>, animD: "anim-d1", extraCls: "card-hover-green" },
    { label: "Monthly Income",     value: formatMoney(monthlyIncome),   iconCls: "tp-card-icon-green",  valCls: "tp-card-value-green", Icon: TrendingUp,   trend: <div className="d-flex align-items-center tp-trend-green"><ArrowUpRight size={16} /></div>, animD: "anim-d2", extraCls: "card-hover-green" },
    { label: "Monthly Expenses",   value: formatMoney(monthlyExpenses), iconCls: "tp-card-icon-red",    valCls: "tp-card-value-red",   Icon: TrendingDown, trend: <div className="d-flex align-items-center tp-trend-red"><ArrowDownRight size={16} /></div>, animD: "anim-d3", extraCls: ""              },
    { label: "Total Transactions", value: String(transactions.length),  iconCls: "tp-card-icon-purple", valCls: "tp-card-value-dark",  Icon: Receipt,      trend: null, animD: "anim-d4", extraCls: ""              },
  ];

  return (
    <div className="d-flex transactions-page-wrapper">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-layout flex-grow-1 d-flex flex-column">
        <TopNavbarComponent onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="dashboard-main p-3 p-md-4">
          <Container fluid className="px-0">

            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 tp-page-header anim-fade-up anim-d0">
              <div>
                <h2 className="mb-1 fw-bold tp-title">Transactions</h2>
                <p className="text-muted mb-0 tp-subtitle">Track and manage your income and expenses</p>
              </div>
              <Button onClick={handleCreate} className="d-flex justify-content-center align-items-center gap-2 rounded-2 px-4 py-2 border-0 shadow-sm tp-btn-add">
                <Plus size={18} /> Add Transaction
              </Button>
            </div>

            {/* Metric Cards */}
            <Row className="mb-4 g-3">
              {metricCards.map((m, i) => (
                <Col key={i} xs={6} md={6} xl={3} className="tp-metric-col">
                  <Card className={`border-0 shadow-sm rounded-4 h-100 card-hover ${m.extraCls} anim-fade-up ${m.animD}`}>
                    <Card.Body className="tp-metric-card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2 mb-md-3">
                        <div className={`p-2 rounded-3 tp-metric-icon-wrap ${m.iconCls}`}><m.Icon size={20} /></div>
                        {m.trend}
                      </div>
                      <div className="text-muted mb-1 tp-card-label">{m.label}</div>
                      <h3 className={`mb-0 fw-bold ${m.valCls}`}>{m.value}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Filter Bar */}
            <Card className="border-0 shadow-sm rounded-4 mb-4 card-hover anim-fade-up anim-d4">
              <Card.Body className="p-3 p-lg-4">
                <Row className="g-3 align-items-end">
                  <Col xs={12} sm={6} xl={3} lg={4} md={6}>
                    <Form.Group>
                      <Form.Label className="small text-dark fw-bold mb-2">Date Range</Form.Label>
                      <InputGroup className="rounded-3 tp-filter-input-group">
                        <InputGroup.Text className="bg-white border-0 text-muted ps-3 pe-2"><Calendar size={18} /></InputGroup.Text>
                        <Form.Control type="text" placeholder="Select date range" className="border-0 ps-0 shadow-none text-muted tp-filter-input" readOnly />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} xl={2} lg={4} md={6}>
                    <Form.Group>
                      <Form.Label className="small text-dark fw-bold mb-2">Category</Form.Label>
                      <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="shadow-none text-muted rounded-3 tp-filter-select">
                        {uniqueCategories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} xl={2} lg={4} md={6}>
                    <Form.Group>
                      <Form.Label className="small text-dark fw-bold mb-2">Type</Form.Label>
                      <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="shadow-none text-muted rounded-3 tp-filter-select">
                        <option value="All Types">All Types</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} xl={3} lg={8} md={6}>
                    <Form.Group>
                      <Form.Label className="small text-dark fw-bold mb-2">Search</Form.Label>
                      <InputGroup className="rounded-3 tp-filter-input-group">
                        <InputGroup.Text className="bg-white border-0 text-muted ps-3 pe-2"><Search size={18} /></InputGroup.Text>
                        <Form.Control type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0 ps-0 shadow-none text-muted tp-filter-input" />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} xl={2} lg={4} md={12} className="d-flex align-items-end mt-1 mt-xl-0">
                    <Button variant="dark" className="w-100 d-flex justify-content-center align-items-center gap-2 rounded-2 border-0 tp-btn-filter">
                      <Filter size={16} /> <span className="tp-btn-filter-text">Filter</span>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Transactions History */}
            <Card className="border-0 shadow-sm rounded-4 mb-4 card-hover anim-fade-up anim-d5">
              <Card.Body className="p-0">
                <div className="p-3 p-md-4 border-bottom">
                  <h5 className="fw-bold mb-0 tp-title">Transactions History</h5>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="success" />
                    <p className="text-muted mt-2">Loading transactions...</p>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <Receipt size={40} className="mb-2 opacity-25" />
                    <p className="mb-0">No transactions found</p>
                    <small>Add your first transaction to see it here</small>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table — hidden on mobile */}
                    <div className="p-3 p-md-4 pt-2 d-none d-md-block">
                      <Table responsive className="align-middle mb-0 text-nowrap tp-table">
                        <thead>
                          <tr>
                            {["DATE","CATEGORY","BUDGET","NOTE","AMOUNT","STATUS","ACTIONS"].map((h, i) => (
                              <th key={i} className={`text-muted fw-semibold pb-3 border-bottom text-uppercase tp-table-th${h === "ACTIONS" ? " text-center" : ""}`}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="border-top-0">
                          {filteredTransactions.map((t) => (
                            <tr key={t._id}>
                              <td className="py-3 text-muted tp-table-td-date">{formatDate(t.date)}</td>
                              <td className="py-3 fw-bold tp-table-td-category">{t.category}</td>
                              <td className="py-3 text-muted tp-table-td-budget">{t.budget}</td>
                              <td className="py-3 text-muted tp-table-td-note">{t.note}</td>
                              <td className={`py-3 fw-bold ${t.amountType === "income" ? "tp-table-td-amount-income" : "tp-table-td-amount-expense"}`}>
                                {t.amountType === "income" ? "+" : "-"}{formatMoney(t.amount)}
                              </td>
                              <td className="py-3"><StatusBadge status={t.status} /></td>
                              <td className="py-3 text-center">
                                <div className="d-flex gap-3 justify-content-center">
                                  <button className="btn btn-link p-0 text-muted tp-action-btn-edit" onClick={() => handleEdit(t)}><Pencil size={18} /></button>
                                  <button className="btn btn-link p-0 text-danger tp-action-btn-delete" onClick={() => handleDelete(t._id)}><Trash2 size={18} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>

                    {/* Mobile Card List — visible only on mobile */}
                    <div className="p-3 d-md-none">
                      {filteredTransactions.map((t) => (
                        <TransactionMobileCard key={t._id} t={t} onEdit={handleEdit} onDelete={handleDelete} />
                      ))}
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>

          </Container>
        </main>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" backdrop="static" dialogClassName="tp-transaction-modal">
        <Modal.Header closeButton className="tp-modal-header border-0">
          <div>
            <Modal.Title className="fw-bold tp-modal-title">{editingId ? "Edit Transaction" : "Add Transaction"}</Modal.Title>
            <p className="tp-modal-subtitle mb-0">Create a new income or expense transaction</p>
          </div>
        </Modal.Header>
        <Form onSubmit={handleModalSubmit}>
          <Modal.Body className="tp-modal-body">
            <div className="tp-modal-section">
              <Form.Label className="tp-label">Transaction Type</Form.Label>
              <div className="tp-type-switcher">
                <button type="button" className={`tp-type-option ${formData.amountType === "income" ? "income-active" : ""}`} onClick={() => setFormData((p) => ({ ...p, amountType: "income" }))}>Income</button>
                <button type="button" className={`tp-type-option ${formData.amountType === "expense" ? "expense-active" : ""}`} onClick={() => setFormData((p) => ({ ...p, amountType: "expense" }))}>Expense</button>
              </div>
            </div>
            <Row className="g-4">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="tp-label">Category</Form.Label>
                  <Form.Select name="category" value={formData.category} onChange={handleModalChange} required className="tp-input">
                    <option value="">Select a category</option>
                    {formData.amountType === "income"
                      ? <><option value="Salary">Salary</option><option value="Freelance">Freelance</option><option value="Investment">Investment</option><option value="Side Hustle">Side Hustle</option><option value="Others">Others</option></>
                      : <><option value="Groceries">Groceries</option><option value="Food & Dining">Food & Dining</option><option value="Shopping">Shopping</option><option value="Transportation">Transportation</option><option value="Bills & Utilities">Bills & Utilities</option><option value="Entertainment">Entertainment</option><option value="Healthcare">Healthcare</option><option value="Education">Education</option><option value="Others">Others</option></>}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="tp-label">Budget</Form.Label>
                  <Form.Select name="budget" value={formData.budget} onChange={handleModalChange} required className="tp-input">
                    <option value="">Select a budget</option>
                    {formData.amountType === "income"
                      ? <><option value="Monthly Income">Monthly Income</option><option value="Side Income">Side Income</option><option value="Investments">Investments</option></>
                      : <><option value="Food & Dining">Food & Dining</option><option value="Bills & Utilities">Bills & Utilities</option><option value="Entertainment">Entertainment</option><option value="Transportation">Transportation</option><option value="Shopping">Shopping</option><option value="Personal Care">Personal Care</option></>}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="tp-label">Date</Form.Label>
                  <div className="tp-date-wrap">
                    <Calendar size={18} className="tp-field-icon" />
                    <Form.Control type="date" name="date" value={formData.date} onChange={handleModalChange} required className="tp-input tp-input-date" />
                  </div>
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="tp-label">Amount</Form.Label>
                  <InputGroup className="tp-amount-group">
                    <InputGroup.Text className="tp-amount-prefix">$</InputGroup.Text>
                    <Form.Control type="number" step="0.01" min="0" name="amount" value={formData.amount} onChange={handleModalChange} required placeholder="0.00" className="tp-amount-input" />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label className="tp-label">Transaction Note</Form.Label>
                  <Form.Control as="textarea" rows={3} name="note" value={formData.note} onChange={handleModalChange} placeholder="Add note about this transaction..." className="tp-input tp-textarea" />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="tp-modal-footer border-0">
            <Button type="button" variant="light" onClick={() => setShowModal(false)} className="tp-btn-cancel">Cancel</Button>
            <Button type="submit" className="tp-btn-save" disabled={saving}>
              {saving ? <><Spinner size="sm" className="me-2" />Saving...</> : "Save Transaction"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default TransactionsPage;
