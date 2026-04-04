import React, { useState } from "react";
import SidebarComponent from "../../components/SidebarComponent";
import TopNavbarComponent from "../../components/TopNavbarComponent";
import { Container, Row, Col, Card, Button, Table, Modal, Form } from "react-bootstrap";
import { TrendingUp, TrendingDown, DollarSign, LayoutGrid, BarChart2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/InvestmentPage.css";
import "../../styles/animations.css";

const metrics = [
  { label: "Total Investment Value", value: "$125,480", change: "+28.04%", up: true,  icon: DollarSign, cls: "investment-metric-icon--green" },
  { label: "Total Profit / Loss",   value: "$27,480",  change: "+28.04%", up: true,  icon: TrendingUp,  cls: "investment-metric-icon--green", valCls: "investment-metric-value--profit" },
  { label: "Today Change",           value: "+2.35%",  change: "+2.35%",  up: true,  icon: BarChart2,   cls: "investment-metric-icon--purple" },
  { label: "Number of Assets",       value: "12",       change: null,                 icon: LayoutGrid,  cls: "investment-metric-icon--violet" },
];

const growthData = [
  { month: "Jul", val: 80000  },
  { month: "Aug", val: 85000  },
  { month: "Sep", val: 88000  },
  { month: "Oct", val: 92000  },
  { month: "Nov", val: 100000 },
  { month: "Dec", val: 103000 },
  { month: "Jan", val: 107000 },
  { month: "Feb", val: 109000 },
  { month: "Mar", val: 115000 },
];

const allocationData = [
  { label: "Stocks",      percent: 42.5, value: "$52,000", color: "#20c997" },
  { label: "Crypto",      percent: 30.3, value: "$38,000", color: "#339af0" },
  { label: "Mutual Fund", percent: 20.3, value: "$25,480", color: "#f5a623" },
  { label: "Gold",        percent:  7.9, value: "$10,000", color: "#ff6b6b" },
];

const initialPortfolio = [
  { id: 1, name: "Bitcoin",        abbr: "B", type: "Crypto",      invested: 20000, current: 28000, profit:  8000, profitPct:  40.00, iconColor: "#f5a623", iconBg: "#fff4e5" },
  { id: 2, name: "Gold ETF",       abbr: "G", type: "Gold",        invested: 10000, current: 10000, profit:     0, profitPct:   0.00, iconColor: "#ff6b6b", iconBg: "#ffe8e6" },
  { id: 3, name: "Tesla Inc.",     abbr: "T", type: "Stock",       invested:  8000, current:  7200, profit:  -800, profitPct: -10.00, iconColor: "#20c997", iconBg: "#e6fcf5" },
  { id: 4, name: "Vanguard Index", abbr: "V", type: "Mutual Fund", invested: 12000, current: 13480, profit:  1480, profitPct:  12.33, iconColor: "#f5a623", iconBg: "#fff4e5" },
];

/* custom tooltip untuk growth chart */
const GrowthTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#fff", border: "none", borderRadius: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", padding: "10px 18px" }}>
        <p style={{ margin: 0, fontSize: 12, color: "#64748b", fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 15, color: "#20c997", fontWeight: 700 }}>${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

/* custom tooltip untuk donut */
const DonutTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = allocationData.find(a => a.label === payload[0].name);
    return (
      <div style={{ background: "#fff", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", padding: "8px 14px", fontSize: 13 }}>
        <span style={{ color: payload[0].payload.color, fontWeight: 700 }}>{payload[0].name}</span>
        <span style={{ color: "#64748b", marginLeft: 8 }}>{payload[0].value}%{d ? ` · ${d.value}` : ""}</span>
      </div>
    );
  }
  return null;
};

/* donut data formatted für Recharts Pie */
const pieData = allocationData.map(d => ({ name: d.label, value: d.percent, color: d.color }));

function InvestmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portfolio, setPortfolio]     = useState(initialPortfolio);
  const [expanded, setExpanded]       = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState({ name: "", type: "Crypto", invested: "", current: "" });

  const best  = [...portfolio].sort((a, b) => b.profitPct - a.profitPct)[0];
  const worst = [...portfolio].sort((a, b) => a.profitPct - b.profitPct)[0];

  const handleAdd = () => {
    if (!form.name || !form.invested || !form.current) return;
    const inv = Number(form.invested), cur = Number(form.current);
    const profit    = cur - inv;
    const profitPct = Number(((profit / inv) * 100).toFixed(2));
    setPortfolio(prev => [...prev, {
      id: Date.now(), name: form.name, abbr: form.name.charAt(0).toUpperCase(),
      type: form.type, invested: inv, current: cur, profit, profitPct,
      iconColor: "#339af0", iconBg: "#e7f5ff",
    }]);
    setShowModal(false);
    setForm({ name: "", type: "Crypto", invested: "", current: "" });
  };

  return (
    <div className="d-flex investment-page">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-layout investment-layout flex-grow-1 d-flex flex-column">
        <TopNavbarComponent onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="dashboard-main p-4 p-md-5">
          <Container fluid className="px-0 px-md-3">

            {/* Header */}
            <div className="investment-header d-flex flex-column flex-md-row justify-content-between align-items-md-center investment-header-row mb-4 gap-3 anim-fade-up anim-d0">
              <div>
                <h2 className="fw-bold m-0">Investment</h2>
                <p className="text-muted mb-0">Track and manage your investment portfolio</p>
              </div>
              <Button className="investment-btn-add d-flex align-items-center" onClick={() => setShowModal(true)}>
                <Plus size={18} className="me-1" /> Add Investment
              </Button>
            </div>

            {/* Metrics */}
            <Row className="g-3 mb-4">
              {metrics.map((m, i) => (
                <Col key={i} xs={6} md={3}>
                  <Card className={`shadow-sm investment-card h-100 card-hover card-hover-green anim-fade-up anim-d${i + 1}`}>
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className={`investment-metric-icon ${m.cls}`}><m.icon size={18} /></div>
                        {m.change && (
                          <span className={`small fw-bold ${m.up ? "investment-metric-change--up" : "investment-metric-change--down"}`}>
                            {m.up ? "↑" : "↓"} {m.change}
                          </span>
                        )}
                      </div>
                      <p className="text-muted small mb-1">{m.label}</p>
                      <h4 className={`fw-bold mb-0 ${m.valCls || "investment-metric-value--dark"}`}>{m.value}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* ── Growth Chart + Donut ── */}
            <Row className="g-3 mb-4">

              {/* Investment Growth — Recharts AreaChart with animated draw */}
              <Col xs={12} md={8}>
                <Card className="shadow-sm investment-card h-100 card-hover anim-fade-up anim-d5">
                  <Card.Body className="p-4">
                    <h5 className="fw-bold text-dark mb-1">Investment Growth</h5>
                    <p className="text-muted small mb-3">Portfolio value over the last 9 months</p>

                    <div style={{ width: "100%", height: 220 }}>
                      <ResponsiveContainer>
                        <AreaChart
                          data={growthData}
                          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%"   stopColor="#20c997" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#20c997" stopOpacity={0}    />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="#f1f5f9"
                          />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            dy={8}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: "#94a3b8" }}
                            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
                            width={42}
                          />
                          <Tooltip content={<GrowthTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="val"
                            stroke="#20c997"
                            strokeWidth={2.5}
                            fill="url(#investGrad)"
                            dot={{ r: 4, fill: "#20c997", stroke: "#fff", strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: "#20c997", stroke: "#fff", strokeWidth: 2 }}
                            isAnimationActive={true}
                            animationDuration={1200}
                            animationEasing="ease-out"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* Allocation Donut — Recharts PieChart with animated reveal */}
              <Col xs={12} md={4}>
                <Card className="shadow-sm investment-card h-100 card-hover anim-fade-right anim-d5">
                  <Card.Body className="p-4 d-flex flex-column align-items-center">

                    {/* Donut chart */}
                    <div style={{ width: 180, height: 180 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={84}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            isAnimationActive={true}
                            animationBegin={200}
                            animationDuration={1000}
                            animationEasing="ease-out"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<DonutTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="w-100 mt-3">
                      {allocationData.map((d, i) => (
                        <div key={i} className={`d-flex justify-content-between align-items-center mb-2 anim-fade-up anim-d${i + 5}`}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="investment-alloc-dot" style={{ backgroundColor: d.color }} />
                            <span className="small text-muted">{d.label}</span>
                          </div>
                          <div className="text-end">
                            <div className="small fw-bold text-dark">{d.percent}%</div>
                            <div className="small text-muted">{d.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Best / Worst */}
            <Row className="g-3 mb-4">
              <Col xs={12} md={6}>
                <Card className="investment-best-card shadow-sm border-0 card-hover card-hover-green anim-fade-up anim-d6">
                  <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="small text-muted mb-1">Best Performing Asset</p>
                      <h5 className="fw-bold text-dark mb-1">{best.name}</h5>
                      <h3 className="fw-bold mb-0 investment-best-value">+{best.profitPct.toFixed(2)}% <span style={{ fontSize: 18 }}>↗</span></h3>
                    </div>
                    <div className="investment-performer-icon investment-performer-icon--best">
                      <TrendingUp size={24} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card className="investment-worst-card shadow-sm border-0 card-hover anim-fade-up anim-d7">
                  <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="small text-muted mb-1">Worst Performing Asset</p>
                      <h5 className="fw-bold text-dark mb-1">{worst.name}</h5>
                      <h3 className="fw-bold mb-0 investment-worst-value">{worst.profitPct.toFixed(2)}% <span style={{ fontSize: 18 }}>↘</span></h3>
                    </div>
                    <div className="investment-performer-icon investment-performer-icon--worst">
                      <TrendingDown size={24} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Investment List */}
            <Card className="shadow-sm investment-list-card border-0 card-hover anim-fade-up anim-d7">
              <Card.Body className="p-4">
                <h5 className="fw-bold text-dark mb-1">Investment List</h5>
                <p className="text-muted small mb-4">Your current investment portfolio</p>
                <div className="table-responsive">
                  <Table hover borderless className="investment-table align-middle mb-0">
                    <thead>
                      <tr>
                        {["Asset Name","Type","Invested","Current Value","Profit/Loss","Actions"].map((h, i) => (
                          <th key={i} className="text-secondary fw-bold text-uppercase py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map(inv => (
                        <React.Fragment key={inv.id}>
                          <tr>
                            <td className="py-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="investment-asset-avatar" style={{ backgroundColor: inv.iconBg, color: inv.iconColor }}>{inv.abbr}</div>
                                <span className="fw-bold text-dark">{inv.name}</span>
                              </div>
                            </td>
                            <td className="text-secondary small py-3">{inv.type}</td>
                            <td className="fw-bold text-dark py-3">${inv.invested.toLocaleString()}</td>
                            <td className="fw-bold text-dark py-3">${inv.current.toLocaleString()}</td>
                            <td className="py-3">
                              <div className={`fw-bold ${inv.profit >= 0 ? "investment-profit-positive" : "investment-profit-negative"}`}>
                                {inv.profit >= 0 ? "+" : ""}${inv.profit.toLocaleString()}
                              </div>
                              <div className={`small ${inv.profit >= 0 ? "investment-profit-positive" : "investment-profit-negative"}`}>
                                {inv.profitPct >= 0 ? "+" : ""}{inv.profitPct.toFixed(2)}%
                              </div>
                            </td>
                            <td className="py-3">
                              <button className="btn btn-sm btn-light" onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}>
                                {expanded === inv.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                            </td>
                          </tr>
                          {expanded === inv.id && (
                            <tr className="investment-expand-row">
                              <td colSpan={6} className="px-4 py-3">
                                <div className="d-flex gap-5 flex-wrap">
                                  <div><span className="text-muted small">Asset Type</span><div className="fw-bold">{inv.type}</div></div>
                                  <div><span className="text-muted small">Invested</span><div className="fw-bold">${inv.invested.toLocaleString()}</div></div>
                                  <div><span className="text-muted small">Current Value</span><div className="fw-bold">${inv.current.toLocaleString()}</div></div>
                                  <div>
                                    <span className="text-muted small">Profit / Loss</span>
                                    <div className={`fw-bold ${inv.profit >= 0 ? "investment-profit-positive" : "investment-profit-negative"}`}>
                                      {inv.profit >= 0 ? "+" : ""}${inv.profit.toLocaleString()} ({inv.profitPct.toFixed(2)}%)
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

          </Container>
        </main>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Add Investment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Asset Name</Form.Label>
            <Form.Control className="investment-modal-input" placeholder="e.g. Apple Inc." value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Type</Form.Label>
            <Form.Select className="investment-modal-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option>Crypto</option><option>Stock</option><option>Gold</option><option>Mutual Fund</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">Amount Invested ($)</Form.Label>
            <Form.Control className="investment-modal-input" type="number" placeholder="0" value={form.invested} onChange={e => setForm({ ...form, invested: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold">Current Value ($)</Form.Label>
            <Form.Control className="investment-modal-input" type="number" placeholder="0" value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} />
          </Form.Group>
          <Button className="investment-modal-btn w-100 fw-bold py-2" onClick={handleAdd}>Add to Portfolio</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default InvestmentPage;
