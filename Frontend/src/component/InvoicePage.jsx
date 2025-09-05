import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import './invoice.css';

const InvoicePage = () => {
  const [data,setData]=useState({
    company: { name: '', address: '', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/87/PayPanel.png' },
    client: { name: '', address: '' },
    invoiceMeta: { prefix: 'INV-001', serial: '',currency: '₹',invoiceDate: '',dueDate: '',paymentTerms: '',themeColor: '#007BFF',},
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    additionalNotes: '',
  });

  const handleChange = (section, field, value) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateItem=(index,field,value) =>
  {
    const newItems=[...data.items];
    newItems[index][field]=field === 'description' ? value:parseFloat(value||0);
    newItems[index].amount = newItems[index].quantity*newItems[index].rate;
    setData({ ...data,items: newItems});
  };

  const addItem=()=>
  {
    setData({...data,items:[...data.items,{description:'',quantity:1,rate:0,amount:0}]});
  };
const generatePDF=async ()=>
{
  const original=document.querySelector('.invoice-preview');
  if (!original) return;

  const clone = original.cloneNode(true);

  clone.style.width = '794px';
  clone.style.height = '559px'; 
  clone.style.backgroundColor = '#ffffff';
  clone.style.color = '#000000';
  clone.style.boxShadow = 'none';
  clone.style.border = 'none';

  clone.querySelectorAll('*').forEach((el) => {
    el.style.backgroundColor = '#ffffff';
    el.style.color = '#000000';
    el.style.borderColor = '#ccc';
  });


  clone.style.position = 'fixed';
  clone.style.top = '-10000px';
  clone.style.zIndex = '-1';
  document.body.appendChild(clone);

  const images = clone.querySelectorAll('img');
  await Promise.all(
    Array.from(images).map(img => {
      return new Promise((res) => {
        if (img.complete) res();
        else img.onload = img.onerror = res;
      });
    })
  );

  const canvas = await html2canvas(clone, {
    backgroundColor: '#ffffff',
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
  pdf.save('invoice.pdf');

  document.body.removeChild(clone);
};

  const saveToBackend = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/invoice/create`,data,{withCredentials: true,});
      alert("Invoice saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save invoice");
    }
  };

  return (
    <div className="invoice-container">
      <div className="invoice-form">
        <h2>Create Invoice</h2>

        <label>Logo URL: <input value={data.company.logoUrl} onChange={e => handleChange('company', 'logoUrl', e.target.value)} /></label>
        <label>Company Name: <input value={data.company.name} onChange={e => handleChange('company', 'name', e.target.value)} /></label>
        <label>Company Address: <input value={data.company.address} onChange={e => handleChange('company', 'address', e.target.value)} /></label>

        <label>Client Name: <input value={data.client.name} onChange={e => handleChange('client', 'name', e.target.value)} /></label>
        <label>Client Address: <input value={data.client.address} onChange={e => handleChange('client', 'address', e.target.value)} /></label>

        <label>Invoice Prefix: <input value={data.invoiceMeta.prefix} onChange={e => handleChange('invoiceMeta', 'prefix', e.target.value)} /></label>
        <label>Serial No.: <input value={data.invoiceMeta.serial} onChange={e => handleChange('invoiceMeta', 'serial', e.target.value)} /></label>
        <label>Currency: <input value={data.invoiceMeta.currency} onChange={e => handleChange('invoiceMeta', 'currency', e.target.value)} /></label>
        <label>Invoice Date: <input type="date" value={data.invoiceMeta.invoiceDate} onChange={e => handleChange('invoiceMeta', 'invoiceDate', e.target.value)} /></label>
        <label>Due Date: <input type="date" value={data.invoiceMeta.dueDate} onChange={e => handleChange('invoiceMeta', 'dueDate', e.target.value)} /></label>
        <label>Theme Color: <input type="color" value={data.invoiceMeta.themeColor} onChange={e => handleChange('invoiceMeta', 'themeColor', e.target.value)} /></label>

        <hr />
        <h3>Invoice Items</h3>
        {data.items.map((item, i) => (
          <div key={i} className="invoice-item">
            <input placeholder="Description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} />
            <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)} />
            <input type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)} />
            <span>{item.amount.toFixed(2)}</span>
          </div>
        ))}
        <button onClick={addItem}>+ Add Item</button>

        <label>Additional Notes: <textarea value={data.additionalNotes} onChange={e => setData({ ...data, additionalNotes: e.target.value })} /></label>

        <button onClick={saveToBackend}>Save Invoice</button>
        <button onClick={generatePDF}>Download PDF</button>
      </div>

      <div className="invoice-preview" id="invoice-preview" style={{backgroundColor: '#121212', color: 'white',padding: '30px',width: '100%',minHeight: 'auto',}}>
        <img src={data.company.logoUrl} alt="Logo" style={{ maxHeight: 50 }} />
        <h2 style={{ color: data.invoiceMeta.themeColor }}>{data.company.name}</h2>
        <p>{data.company.address}</p>
        <hr />
        <p><strong>Bill To:</strong> {data.client.name }  {data.client.address}</p>
        <p>Invoice #: {data.invoiceMeta.prefix}- {data.invoiceMeta.serial}</p>
        <p>Date: {data.invoiceMeta.invoiceDate} | Due: {data.invoiceMeta.dueDate}</p>
        <table>
          <thead>
            <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
          </thead>
            <tbody>
            {data.items.map((item, i) => (
                <tr key={i}>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.rate}</td>
                <td>{item.amount.toFixed(2)}</td>
                </tr>
            ))}
            <tr className="total-row">
                <td colSpan="3" style={{ textAlign: 'right' }}><strong>Total</strong></td>
                <td><strong>{data.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong></td>
            </tr>
            </tbody>
        </table>
        <p><strong>Notes:</strong> {data.additionalNotes}</p>
      </div>
    </div>
  );
};

export default InvoicePage;
