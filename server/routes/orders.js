const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.zip ||
      !shippingAddress.country
    ) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    const requestedItems = new Map();

    for (const item of items) {
      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Invalid item quantity' });
      }

      const productId = String(item.product);
      requestedItems.set(productId, (requestedItems.get(productId) || 0) + quantity);
    }

    const products = await Product.find({ _id: { $in: [...requestedItems.keys()] } });
    const productsById = new Map(products.map((product) => [String(product._id), product]));

    for (const [productId, quantity] of requestedItems) {
      const product = productsById.get(productId);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: `${product.name} has insufficient stock` });
      }
    }

    const orderItems = [];
    let subtotal = 0;

    for (const [productId, quantity] of requestedItems) {
      const product = productsById.get(productId);
      await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
      orderItems.push({ product: product._id, quantity, price: product.price });
      subtotal += product.price * quantity;
    }

    const totalAmount = Number((subtotal * 1.1).toFixed(2));
    const createdOrder = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    const populatedOrder = await Order.findById(createdOrder._id).populate('items.product');
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Failed to place order' });
  }
});

router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email role')
      .populate('items.product')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'processing', 'shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order status' });
  }
});

module.exports = router;
