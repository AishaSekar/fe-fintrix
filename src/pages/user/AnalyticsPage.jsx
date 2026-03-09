import { useState } from "react";
import SidebarComponent from "../../components/SidebarComponent";
import TopNavbarComponent from "../../components/TopNavbarComponent";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);
import "../../styles/dashboard.css";

const expenseByCategory = {
  labels: ["Food", "Transport", "Bills", "Shopping", "Entertainment"],
  datasets: [
    {
      label: "Expenses",
      data: [1200, 450, 680, 850, 500],
      backgroundColor: "#f97373",
      borderRadius: 8,
    },
  ],
};

const trendData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Expenses",
      data: [3200, 3400, 3600, 3800, 3900, 3680],
      backgroundColor: "#0ea5e9",
      borderRadius: 8,
    },
  ],
};

const categoryShare = {
  labels: ["Needs", "Wants", "Savings"],
  datasets: [
    {
      data: [55, 30, 15],
      backgroundColor: ["#22c55e", "#6366f1", "#f97373"],
      borderWidth: 0,
    },
  ],
};

function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="d-flex">
      <SidebarComponent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="dashboard-layout flex-grow-1 d-flex flex-column">
        <TopNavbarComponent onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        <main className="dashboard-main p-4">
          <Container fluid>
            <Row className="g-4">
              <Col lg={8}>
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h5 className="mb-1">Monthly expenses trend</h5>
                    <small className="text-muted">
                      Compare with previous months
                    </small>
                    <div style={{ height: 260 }} className="mt-3">
                      <Bar data={trendData} options={{ responsive: true }} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <h5 className="mb-1">Expenses per category</h5>
                    <small className="text-muted">Current month</small>
                    <div style={{ height: 260 }} className="mt-3">
                      <Bar
                        data={expenseByCategory}
                        options={{
                          indexAxis: "y",
                          responsive: true,
                          plugins: { legend: { display: false } },
                          scales: { x: { grid: { display: false } } },
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="g-4 mt-1">
              <Col lg={4}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <h5 className="mb-1">Spending structure</h5>
                    <small className="text-muted">Needs vs wants</small>
                    <div className="mt-3 d-flex justify-content-center">
                      <div style={{ width: 200 }}>
                        <Doughnut data={categoryShare} />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={8}>
                <Card className="shadow-sm border-0 h-100">
                  <Card.Body>
                    <h5 className="mb-3">Financial insight</h5>
                    <ul className="mb-0 text-muted">
                      <li>
                        Pengeluaran makan meningkat 12% dibanding bulan lalu.
                      </li>
                      <li>
                        Tagihan tetap stabil, tidak ada lonjakan signifikan.
                      </li>
                      <li>
                        Rasio tabungan saat ini 15% dari total pemasukan, di
                        bawah target 20%.
                      </li>
                    </ul>
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

export default AnalyticsPage;

