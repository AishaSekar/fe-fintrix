import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { transactionService, storageService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [formData, setFormData] = useState({
    type: 'expense',
    category: 'Makanan & Minuman',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash'
  });

  const navigate = useNavigate();
  const user = storageService.getUser();

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [summaryRes, transactionsRes] = await Promise.all([
        transactionService.getSummary(selectedPeriod),
        transactionService.getAll({ limit: 10, sort: '-date' })
      ]);
      
      setSummary(summaryRes.data.data.summary);
      setTransactions(transactionsRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data dashboard');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    
    try {
      await transactionService.create({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Refresh data
      await fetchDashboardData();
      
      // Close modal and reset form
      setShowModal(false);
      setFormData({
        type: 'expense',
        category: 'Makanan & Minuman',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Cash'
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambah transaksi');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      return;
    }
    
    try {
      await transactionService.delete(id);
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghapus transaksi');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Makanan & Minuman': '🍔',
      'Transportasi': '🚗',
      'Belanja': '🛍️',
      'Hiburan': '🎮',
      'Tagihan': '📃',
      'Kesehatan': '🏥',
      'Pendidikan': '📚',
      'Gaji': '💰',
      'Investasi': '📈',
      'Lainnya': '📌'
    };
    return icons[category] || '📌';
  };

  if (loading && !summary) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Memuat dashboard...</p>
      </Container>
    );
  }

  return (
    <div className="dashboard-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Navbar Spacing */}
      <div style={{ height: '80px' }} />
      
      <Container className="py-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            {error}
          </Alert>
        )}

        {/* Welcome Header */}
        <Row className="mb-4">
          <Col>
            <h2>Welcome back, {user?.fullName || 'User'}! 👋</h2>
            <p className="text-muted">Here's your financial overview</p>
          </Col>
          <Col xs="auto">
            <Button 
              variant="success" 
              onClick={() => setShowModal(true)}
              style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}
            >
              + Add Transaction
            </Button>
          </Col>
        </Row>

        {/* Period Selector */}
        <Row className="mb-4">
          <Col xs="auto">
            <Button 
              variant={selectedPeriod === 'week' ? 'success' : 'outline-secondary'}
              onClick={() => setSelectedPeriod('week')}
              className="me-2"
            >
              Week
            </Button>
            <Button 
              variant={selectedPeriod === 'month' ? 'success' : 'outline-secondary'}
              onClick={() => setSelectedPeriod('month')}
              className="me-2"
            >
              Month
            </Button>
            <Button 
              variant={selectedPeriod === 'year' ? 'success' : 'outline-secondary'}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </Button>
          </Col>
        </Row>

        {/* Summary Cards */}
        <Row className="mb-4 g-4">
          <Col md={4}>
            <Card className="shadow-sm h-100 border-0">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px',
                    backgroundColor: '#e6f7e6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                      <path d="M12 2v20M17 7l-5-5-5 5M7 17l5 5 5-5" />
                    </svg>
                  </div>
                  <div>
                    <Card.Title className="mb-1" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      Total Income
                    </Card.Title>
                    <h3 className="mb-0" style={{ color: '#22c55e', fontWeight: '700' }}>
                      {formatCurrency(summary?.totalIncome || 0)}
                    </h3>
                  </div>
                </div>
                <Card.Text className="text-muted small">
                  {summary?.totalByType?.find(t => t._id === 'income')?.count || 0} transactions
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="shadow-sm h-100 border-0">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px',
                    backgroundColor: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                      <path d="M12 2v20M7 17l5 5 5-5M17 7l-5-5-5 5" />
                    </svg>
                  </div>
                  <div>
                    <Card.Title className="mb-1" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      Total Expense
                    </Card.Title>
                    <h3 className="mb-0" style={{ color: '#ef4444', fontWeight: '700' }}>
                      {formatCurrency(summary?.totalExpense || 0)}
                    </h3>
                  </div>
                </div>
                <Card.Text className="text-muted small">
                  {summary?.totalByType?.find(t => t._id === 'expense')?.count || 0} transactions
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="shadow-sm h-100 border-0">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px',
                    backgroundColor: '#e0f2fe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <Card.Title className="mb-1" style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      Balance
                    </Card.Title>
                    <h3 className="mb-0" style={{ 
                      color: summary?.balance >= 0 ? '#0ea5e9' : '#ef4444', 
                      fontWeight: '700' 
                    }}>
                      {formatCurrency(summary?.balance || 0)}
                    </h3>
                  </div>
                </div>
                <Card.Text className="text-muted small">
                  Net income this period
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Category Breakdown */}
        {summary?.byCategory && summary.byCategory.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Card className="shadow-sm border-0">
                <Card.Header style={{ backgroundColor: 'white', borderBottom: '1px solid #f1f5f9' }}>
                  <h5 className="mb-0">Category Breakdown</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {summary.byCategory.slice(0, 6).map((item, index) => (
                      <Col md={4} key={index} className="mb-3">
                        <div className="d-flex align-items-center">
                          <div style={{ 
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: item._id.type === 'income' ? '#e6f7e6' : '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px',
                            fontSize: '1.2rem'
                          }}>
                            {getCategoryIcon(item._id.category)}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                              {item._id.category}
                            </div>
                            <div style={{ fontWeight: '600', color: '#0f172a' }}>
                              {formatCurrency(item.total)}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                              {item.count} transactions
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Recent Transactions */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header style={{ backgroundColor: 'white', borderBottom: '1px solid #f1f5f9' }}>
                <h5 className="mb-0">Recent Transactions</h5>
              </Card.Header>
              <Card.Body>
                {transactions.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-3">No transactions yet</p>
                    <Button 
                      variant="success" 
                      onClick={() => setShowModal(true)}
                      style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}
                    >
                      Add Your First Transaction
                    </Button>
                                      </div>
                ) : (
                  <Table responsive hover>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc' }}>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Payment Method</th>
                        <th className="text-end">Amount</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td>{formatDate(transaction.date)}</td>
                          <td>
                            <Badge 
                              bg={transaction.type === 'income' ? 'success' : 'danger'}
                              style={{ 
                                backgroundColor: transaction.type === 'income' ? '#22c55e' : '#ef4444',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontWeight: '500'
                              }}
                            >
                              {getCategoryIcon(transaction.category)} {transaction.category}
                            </Badge>
                          </td>
                          <td>{transaction.description || '-'}</td>
                          <td>{transaction.paymentMethod || 'Cash'}</td>
                          <td className="text-end">
                            <span style={{ 
                              color: transaction.type === 'income' ? '#22c55e' : '#ef4444',
                              fontWeight: '600'
                            }}>
                              {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                            </span>
                          </td>
                          <td className="text-center">
                            <Button 
                              variant="link" 
                              size="sm" 
                              onClick={() => handleDeleteTransaction(transaction._id)}
                              style={{ color: '#ef4444' }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                              </svg>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Add Transaction Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton style={{ borderBottom: '1px solid #f1f5f9' }}>
            <Modal.Title>Add New Transaction</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAddTransaction}>
            <Modal.Body>
              {/* Transaction Type */}
              <Form.Group className="mb-3">
                <Form.Label>Transaction Type</Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    label="Income"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    label="Expense"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>

              {/* Category */}
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select 
                  name="category" 
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Makanan & Minuman">🍔 Makanan & Minuman</option>
                  <option value="Transportasi">🚗 Transportasi</option>
                  <option value="Belanja">🛍️ Belanja</option>
                  <option value="Hiburan">🎮 Hiburan</option>
                  <option value="Tagihan">📃 Tagihan</option>
                  <option value="Kesehatan">🏥 Kesehatan</option>
                  <option value="Pendidikan">📚 Pendidikan</option>
                  <option value="Gaji">💰 Gaji</option>
                  <option value="Investasi">📈 Investasi</option>
                  <option value="Lainnya">📌 Lainnya</option>
                </Form.Select>
              </Form.Group>

              {/* Amount */}
              <Form.Group className="mb-3">
                <Form.Label>Amount (Rp)</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  min="0"
                  step="1000"
                  required
                />
              </Form.Group>

              {/* Date */}
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              {/* Payment Method */}
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select 
                  name="paymentMethod" 
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="E-Wallet">E-Wallet</option>
                </Form.Select>
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  rows={2}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer style={{ borderTop: '1px solid #f1f5f9' }}>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="success"
                disabled={modalLoading}
                style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }}
              >
                {modalLoading ? 'Saving...' : 'Save Transaction'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}

export default DashboardPage;