import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import balanceReducer from "./balanceSlice"
import transactionReducer from "./transactionSlice";

const loadUserFromLocalStorage = () => {
  try
  {
    const data=localStorage.getItem("user");
    return data?JSON.parse(data) : null;
  }
  catch(e)
  {
    return null;
  }
};


const loadBalanceFromLocalStorage = () => {
  try
  {
    const data=localStorage.getItem("balance");
    return data?JSON.parse(data):null;
  }
  catch(e)
  {
    return null;
  }
};

const loadTransactionsFromLocalStorage = () => {
  try
  {
    const data=localStorage.getItem("transactions");
    return data?JSON.parse(data):[];
  } 
  catch(e)
  {
    return [];
  }
};

const appStore = configureStore({
     reducer:{
      user:userReducer,
      balance:balanceReducer,
      transactions:transactionReducer,
     },
  preloadedState: {
    user: loadUserFromLocalStorage(), 
    balance:loadBalanceFromLocalStorage(),
    transactions: loadTransactionsFromLocalStorage(),
  },
})
export default appStore;