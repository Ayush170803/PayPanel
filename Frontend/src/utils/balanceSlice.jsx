import { createSlice } from "@reduxjs/toolkit";

const balanceSlice = createSlice(
    {
        name:"balance",
        initialState:null,
        reducers:{
            addBalance:(state,action) =>
            {
                return action.payload;
            },
        }
    }
)

export const {addBalance} = balanceSlice.actions;
export default balanceSlice.reducer;