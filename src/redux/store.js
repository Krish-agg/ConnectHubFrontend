import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../redux/reducers/auth.js";
import api from "./api/api.js";
import miscSlice from "./reducers/misc.js";
import chatSlice from "./reducers/chat.js";
import adminapi from "./api/adminapi.js";

const store=configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [miscSlice.name]:miscSlice.reducer,
        [chatSlice.name]:chatSlice.reducer,
        [api.reducerPath]:api.reducer,
        [adminapi.reducerPath]:adminapi.reducer
    },
    middleware:(defaultMiddleWare)=>[...defaultMiddleWare(),api.middleware,adminapi.middleware],

});


export default store;