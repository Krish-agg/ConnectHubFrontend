import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const adminapi=createApi({
    reducerPath:"adminapi",
    baseQuery:fetchBaseQuery({baseUrl:`${server}/admin`}),
    tagTypes:["Admin"],
    endpoints:(builder)=>({
        getAdmin:builder.query({
            query:()=>({
                url:"/",
                credentials:"include",
                
            }),
            
        }),
        

    })

})


export default adminapi;
export const {useGetAdminQuery}=adminapi;