function orderForm() {
    return {
        user: null,

        products: [],
        discountRules: [],

        cart: [],
        customer: '',
        date: '',
        isEdit: false,
        editId: null,

        form: {
            productId: '',
            unit: '',
            qty: 1,
        },

        async init() {
            this.products = await fetch('data/products.json').then((r) =>
                r.json(),
            );
            this.discountRules = await fetch('data/discount_rules.json').then(
                (r) => r.json(),
            );

            const params = new URLSearchParams(location.search);
            this.editId = params.get('id');

            if (this.editId) {
                this.loadEdit();
            }
        },

        addItem() {
            if (!this.form.productId || !this.form.unit || this.form.qty <= 0) {
                alert('Invalid input');
                return;
            }

            const p = this.products.find(
                (p) => p.product_id == this.form.productId,
            );
            if (!p) return;

            const price = this.form.unit === 'box' ? p.price_box : p.price_unit;

            const exist = this.cart.find(
                (i) =>
                    i.productId === p.product_id && i.unit === this.form.unit,
            );

            if (exist) {
                exist.qty += this.form.qty;
                exist.subtotal = exist.qty * exist.price;
            } else {
                this.cart.push({
                    productId: p.product_id,
                    product: p.name,
                    unit: this.form.unit,
                    qty: this.form.qty,
                    price,
                    subtotal: price * this.form.qty,
                });
            }

            this.form.productId = '';
            this.form.unit = '';
            this.form.qty = 1;
        },

        updateSubtotal(item) {
            if (item.qty <= 0) item.qty = 1;
            item.subtotal = item.price * item.qty;
        },

        removeItem(i) {
            this.cart.splice(i, 1);
        },

        get subtotal() {
            return this.cart.reduce((s, i) => s + i.subtotal, 0);
        },

        get discount() {
            let percent = 0;
            this.discountRules.forEach((r) => {
                if (this.subtotal >= r.minimum_grand_total) {
                    percent = r.discount_percentage;
                }
            });
            return {
                percent,
                value: (this.subtotal * percent) / 100,
            };
        },

        get grandTotal() {
            return this.subtotal - this.discount.value;
        },

        loadEdit() {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const order = orders.find((o) => o.order_id === this.editId);

            if (!order) {
                alert('Order not found');
                location.href = 'index.html';
                return;
            }

            this.isEdit = true;
            this.customer = order.customer;
            this.date = order.date;
            this.cart = JSON.parse(JSON.stringify(order.items));
        },

        saveOrder() {
            if (!this.cart.length) return alert('Cart empty');

            const orders = JSON.parse(localStorage.getItem('orders')) || [];

            const payload = {
                customer: this.customer,
                date: this.date,
                subtotal: this.subtotal,
                discount: this.discount.value,
                grand_total: this.grandTotal,
                items: this.cart,
            };

            if (this.isEdit) {
                const idx = orders.findIndex((o) => o.order_id === this.editId);
                orders[idx] = {
                    ...orders[idx],
                    ...payload,
                };
            } else {
                orders.push({
                    order_id: `ORD${String(orders.length + 1).padStart(
                        3,
                        '0',
                    )}`,
                    status: 'Draft',
                    ...payload,
                });
            }

            localStorage.setItem('orders', JSON.stringify(orders));
            location.href = 'index.html';
        },
    };
}
