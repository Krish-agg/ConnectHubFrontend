
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { bgGradient } from '../../constants/color'
import { Navigate } from 'react-router-dom';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useGetAdminQuery} from '../../redux/api/adminapi';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { server } from '../../constants/config';
import axios from 'axios';
import { setIsAdmin } from '../../redux/reducers/auth';

const AdminLogin = () => {
    
    const [secretKey,setSecretKey]=useState("");
    const dispatch=useDispatch();
    const {data,isError,error}=useGetAdminQuery();
    const [isLoading,setIsloading]=useState(false);
    const {isAdmin}=useSelector((state)=>state.auth);
    
    useEffect(()=>{
        if(data){
            
            dispatch(setIsAdmin(true));
        }
        
        
    },[dispatch,data])
    
    

    const submitHandler=async(e)=>{
        const config={
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
            }
        };
        const toastId=toast.loading("Logging In...");
        setIsloading(true);
        e.preventDefault();
        try{
            const {data}=await axios.post(`${server}/admin/verify`,{secretKey},config);
            
            dispatch(setIsAdmin(true));
            toast.success(data?.message,{id:toastId});
        }
        catch(e){
            
            toast.error(e?.response?.data?.message || "Something Went Wrong",{id:toastId});
        }
        finally{
            setIsloading(false);
        }
        
    }
    
    
    

    if(isAdmin) return <Navigate to="/admin/dashboard"/>
    
  return (
    <div style={{background:"rgb(34,193,195)",
        background:bgGradient}}>
    <Container component={"main"} maxWidth="xs" sx={{
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        
    }}>
        <Paper elevation={3} sx={{
            padding:4,
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
        }}>
            {<>
            <Typography variant='h5'>Admin Login</Typography>
            <form style={
                {width:"100%",
                    marginTop:"1rem",
                }
            } onSubmit={submitHandler}>
                <TextField required fullWidth label="Secret Key" type="password" margin='normal' variant='outlined' value={secretKey} onChange={(e)=>setSecretKey(e.target.value)}/>
                <Button variant='contained' color='primary' type='submit' fullWidth disabled={isLoading}>Login</Button>
                
            </form>
            
            </>
            
            }
        </Paper>
    </Container>
    </div>
  )
}

export default AdminLogin