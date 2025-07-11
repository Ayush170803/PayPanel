import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../utils/transactionSlice';

const Send = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user);

  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("id");
  const firstName = queryParams.get("name");

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendMoney = async () => {
    if (!amount||isNaN(amount)||Number(amount)<=0)
    {
      return setError("Please enter a valid amount.");
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        { toUserId:userId,amount},
        { withCredentials:true}
      );

      if (res.data && res.data.success)
      {
        const txn={
          id:Date.now().toString(),
          senderId:currentUser?._id, 
          receiver:firstName,
          amount:Number(amount),
          date:new Date().toISOString(),
        };

        dispatch(addTransaction(txn));

        const prev=JSON.parse(localStorage.getItem("transactions")) || [];
        localStorage.setItem("transactions",JSON.stringify([...prev, txn]));

        setSuccess(`₹${amount} sent to ${firstName} successfully.`);
        setError("");
        setAmount("");

        setTimeout(()=>{
          navigate("/");
        }, 2000);
      } else {
        setError(res.data.message||"Transaction failed.");
        setSuccess("");
      }
    } catch(er)
    {
      console.error(er);
      setError(er?.response?.data?.message||"Transaction failed.");
      setSuccess("");
    }
  };

  return (
    <div className="send-container">
      <h2>Send Money to {firstName}</h2>
      {error && <p className="send-error">{error}</p>}
      {success && <p className="send-success">{success}</p>}
      <input type="number" className="inputauth" placeholder="Enter amount" value={amount}  onChange={(e) => setAmount(e.target.value)}/>
      <button className="send-btn" onClick={handleSendMoney}> Send ₹{amount || 0}</button>
    </div>
  );
};

export default Send;
