function orderList() {
    return {
        orders: [],

        init() {
            const savedOrders = localStorage.getItem('orders');
            this.orders = savedOrders ? JSON.parse(savedOrders) : [];
        },

        async loadDummy() {
            const response = await fetch('data/orders.json');
            const data = await response.json();

            this.orders = data;
            localStorage.setItem('orders', JSON.stringify(data));
        },

        edit(id) {
            location.href = `order.html?id=${id}`;
        },

        remove(id) {
            if (!confirm('Delete this order?')) return;

            this.orders = this.orders.filter((o) => o.order_id !== id);
            localStorage.setItem('orders', JSON.stringify(this.orders));
        },

        changeStatus(id) {
            const order = this.orders.find((o) => o.order_id === id);
            if (!order) return;

            const newStatus = order.status === 'Draft' ? 'Approved' : 'Draft';

            if (confirm(`Change status to ${newStatus}?`)) {
                order.status = newStatus;
                localStorage.setItem('orders', JSON.stringify(this.orders));
                this.orders = [...this.orders];
            }
        },

        print(id) {
            const order = this.orders.find((o) => o.order_id === id);
            if (!order) return;

            const win = window.open('', '', 'width=800,height=600');

            win.document.write(`
<!doctype html>
<html>
<head>
  <title>Invoice ${order.order_id}</title>
  <style>
    body { font-family: Arial; padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    td, th { border: 1px solid #333; padding: 8px; }
    h1 { text-align: center; }
  </style>
</head>
<body>
  <h1>SALES INVOICE</h1>

  <p><b>Order ID:</b> ${order.order_id}</p>
  <p><b>Customer:</b> ${order.customer}</p>
  <p><b>Date:</b> ${order.date}</p>
  <p><b>Status:</b> ${order.status}</p>

  <table>
    <tr>
      <th>Product</th>
      <th>Unit</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Subtotal</th>
    </tr>

    ${order.items
        .map(
            (i) => `
      <tr>
        <td>${i.product}</td>
        <td>${i.unit.toUpperCase()}</td>
        <td>${i.qty}</td>
        <td>${i.price.toLocaleString()}</td>
        <td>${i.subtotal.toLocaleString()}</td>
      </tr>
    `,
        )
        .join('')}
  </table>

  <p><b>Subtotal:</b> ${order.subtotal.toLocaleString()}</p>
  <p><b>Discount:</b> ${order.discount.toLocaleString()}</p>
  <h2>Grand Total: ${order.grand_total.toLocaleString()}</h2>

  <script>
    window.print();
    window.onafterprint = () => window.close();
  <\/script>
</body>
</html>
      `);

            win.document.close();
        },
    };
}
