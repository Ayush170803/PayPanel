import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const Send = () => {
  const location=useLocation();
  const navigate=useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const userId=queryParams.get("id");
  const firstName=queryParams.get("name");

  const [amount,setAmount]=useState("");
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");

  const handleSendMoney = async() =>
    {
    if(!amount||isNaN(amount)||Number(amount)<=0)
    {
      return setError("Please enter a valid amount.");
    }

   try {
      const res = await axios.post("http://localhost:3000/api/v1/account/transfer",{ toUserId: userId, amount },{ withCredentials: true });
      if(res.data&&res.data.success)
        {
        setSuccess(`₹${amount} sent to ${firstName} successfully.`);
        setError("");
        setAmount("");
        setTimeout(()=>{
          window.location.href = "/";
        }, 2000);
      }
      else 
      {
        setError(res.data.message || "Transaction failed.");
        setSuccess("");
      }
    }
    catch(er)
    {
      console.error(er);
      setError(er?.response?.data?.message || "Transaction failed.");
      setSuccess("");
    }
  };

  return (
    <div className="send-container">
      <h2>Send Money to {firstName}</h2>
      {error && <p className="send-error">{error}</p>}
      {success && <p className="send-success">{success}</p>}
      <input type="number" className="inputauth" placeholder="Enter amount" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
      <button className="send-btn" onClick={handleSendMoney}> Send ₹{amount || 0} </button>
    </div>
  );
};

export default Send;
