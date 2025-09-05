const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  rate: Number,
  amount: Number,
});

const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: {
    name: String,
    logoUrl: String,
    address: String,
  },
  client: {
    name: String,
    address: String,
  },
  invoiceMeta: {
    prefix: String,
    serial: String,
    currency: String,
    invoiceDate: String,
    dueDate: String,
    paymentTerms: String,
    themeColor: String,
  },
  items: [itemSchema],
  additionalNotes: String,
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
