import { useState, useEffect } from 'react';
import { orderApi } from '../utils/api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    orderId: '',
    orderDate: '',
    orderTotalAmount: 0,
    status: 'PENDING',

    orderItems: [{ orderItemId: `ITEM-${Date.now()}`, itemDescription: 'Default Item', itemQuantity: 1, unitPrice: 10 }]
  });

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getAll();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders. Is the backend running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await orderApi.create(formData);
      alert('Order created successfully!');
      fetchOrders(); // Refresh list
      // Reset form
      setFormData({ orderId: '', orderDate: '', orderTotalAmount: 0, status: 'PENDING', orderItems: [{ orderItemId: `ITEM-${Date.now()}`, itemDescription: 'Default Item', itemQuantity: 1, unitPrice: 10 }] });
    } catch (err) {
      alert('Error creating order: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderApi.delete(id);
        fetchOrders(); // Refresh list
      } catch (err) {
        alert('Error deleting order');
      }
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
      <div className="page-container">
        <h2>Manage Orders</h2>

        {error && <p className="error-msg">{error}</p>}

        {/* Create Order Form */}
        <div className="card">
          <h3>Create New Order</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <input type="text" name="orderId" placeholder="Order ID" value={formData.orderId} onChange={handleInputChange} required />
            <input type="text" name="orderDate" placeholder="Date (YYYY-MM-DD)" value={formData.orderDate} onChange={handleInputChange} required />
            <input type="number" name="orderTotalAmount" placeholder="Total Amount" value={formData.orderTotalAmount} onChange={handleInputChange} required />
            <select name="status" value={formData.status} onChange={handleInputChange}>
              <option value="PENDING">PENDING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <button type="submit" className="btn-primary">Create Order</button>
          </form>
        </div>

        {/* Orders List */}
        <div className="card">
          <h3>Order List</h3>
          <table className="data-table">
            <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {orders.length === 0 ? (
                <tr><td colSpan="5">No orders found.</td></tr>
            ) : (
                orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.orderDate}</td>
                      <td>${order.orderTotalAmount}</td>
                      <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                      <td>
                        <button onClick={() => handleDelete(order.orderId)} className="btn-danger">Delete</button>
                      </td>
                    </tr>
                ))
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
}

export default OrdersPage;