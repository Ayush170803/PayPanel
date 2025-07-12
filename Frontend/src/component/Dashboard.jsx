import { useEffect, useState } from "react"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addBalance } from "../utils/balanceSlice";
import Users from "./Users";
const Dashboard = () => {
  const [error,setError] = useState("");
 

  const dispatch = useDispatch();
  const userBalance = useSelector(store => store.balance);

  const getBalance = async ()=>
    {
      try
      {
        const res = await axios.get("http://localhost:3000/api/v1/account/balance",{withCredentials:true});
         if (!res || !res.data || res.data.balance == null) {
        setError("Invalid response from server");
        return;
         }
          dispatch(addBalance(res.data.balance));
         localStorage.setItem("balance", JSON.stringify(res.data.balance));
      }
      catch(er)
      {
      setError("Failed to fetch balance");
      console.error(er.message);
      }
    } 

  useEffect(()=>{getBalance()},[]);

  return (
    <div>
    <div className="balance-card">
    <p className="balance-title">Your Balance</p>
    {error ? (
      <p className="balance-error">{error}</p>
    ) : (
      <p className="balance-amount">₹ {Number(userBalance).toFixed(3)}</p>
    )}
  </div>
    <Users/>
    </div>
  )
}

export default Dashboard
