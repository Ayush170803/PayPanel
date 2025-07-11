import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice(
{
  name:"transactions",
  initialState:[],
  reducers:
  {
    addTransaction:(state, action) => 
    {
      state.push(action.payload);
    },
    setTransactions:(state, action) => 
    {
      return action.payload;
    },
  },
});

export const {addTransaction,setTransactions}=transactionSlice.actions;
export default transactionSlice.reducer;
