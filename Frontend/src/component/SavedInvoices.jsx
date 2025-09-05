import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const SavedInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/my-invoices`, {
        withCredentials: true,
      });
      setInvoices(res.data);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
    }
  };

  const deleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/${id}`, {
        withCredentials: true,
      });
      fetchInvoices();
    } catch (err) {
      console.error('Failed to delete invoice', err);
    }
  };

  const downloadInvoice = async (invoice) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 landscape width in px at 96dpi
    container.style.padding = '30px';
    container.style.backgroundColor = 'white';
    document.body.appendChild(container);

    container.innerHTML = `
      <div style="font-family: sans-serif; color: black;">
        <img src="${invoice.company.logoUrl}" style="max-height: 50px;" />
        <h2 style="color: ${invoice.invoiceMeta.themeColor}; margin: 10px 0;">${invoice.company.name}</h2>
        <p>${invoice.company.address}</p>
        <hr/>
        <p><strong>Bill To:</strong> ${invoice.client.name}, ${invoice.client.address}</p>
        <p>Invoice #: ${invoice.invoiceMeta.prefix}-${invoice.invoiceMeta.serial}</p>
        <p>Date: ${invoice.invoiceMeta.invoiceDate} | Due: ${invoice.invoiceMeta.dueDate}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000;">Description</th>
              <th style="border: 1px solid #000;">Qty</th>
              <th style="border: 1px solid #000;">Rate</th>
              <th style="border: 1px solid #000;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td style="border: 1px solid #000;">${item.description}</td>
                <td style="border: 1px solid #000;">${item.quantity}</td>
                <td style="border: 1px solid #000;">${item.rate}</td>
                <td style="border: 1px solid #000;">${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold;">
              <td colspan="3" style="text-align: right; border: 1px solid #000;">Total</td>
              <td style="border: 1px solid #000;">${invoice.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <p style="margin-top: 20px;"><strong>Notes:</strong> ${invoice.additionalNotes || '-'}</p>
      </div>
    `;

    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for rendering
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`invoice-${invoice.invoiceMeta.serial}.pdf`);

    document.body.removeChild(container); // Clean up
  };


  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="saved-invoices-page" style={{ padding: '30px', color: '#f1f1f1' }}>
      <h2>Your Saved Invoices</h2>
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <table style={{ width: '100%', marginTop: '20px', background: '#1a1a1a', color: '#f1f1f1', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#333', color: '#7ed957' }}>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Client</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Total</th>
              <th style={{ padding: '10px', border: '1px solid #444' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(inv => (
              <tr key={inv._id}>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{inv.client.name}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>{inv.invoiceMeta.invoiceDate}</td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  {inv.items.reduce((acc, item) => acc + item.amount, 0)} {inv.invoiceMeta.currency}
                </td>
                <td style={{ padding: '10px', border: '1px solid #444' }}>
                  <button id="download" onClick={() => downloadInvoice(inv)} style={{ marginRight: '10px' }}>Download</button>
                  <button id="delete" onClick={() => deleteInvoice(inv._id)} >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SavedInvoices;
