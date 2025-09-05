const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { userauth } = require('../Middlewares/auth');

router.post('/create', userauth, async (req, res) => {
  try {
    const invoice = new Invoice({ ...req.body, userId: req.userdetails });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save invoice' });
  }
});

router.get('/my-invoices', userauth, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.userdetails }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
});
router.delete('/:id', userauth, async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.userdetails });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found or unauthorized' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete invoice' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoice' });
  }
});

module.exports = router;
