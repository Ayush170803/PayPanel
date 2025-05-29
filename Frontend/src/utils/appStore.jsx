import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import balanceReducer from "./balanceSlice"

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



const appStore = configureStore({
     reducer:{
      user:userReducer,
      balance:balanceReducer,
     },
  preloadedState: {
    user: loadUserFromLocalStorage(), 
    balance:loadBalanceFromLocalStorage()
  },
})
export default appStore;