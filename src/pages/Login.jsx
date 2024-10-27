import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import {CameraAlt as CameraAltIcon} from"@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/styledComponents';
import {useFileHandler} from '6pp';
import { bgGradient } from '../constants/color';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../redux/reducers/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
    const [isLogin,setIsLogin]=useState(true);
    const [isLoading,setIsloading]=useState(false);
    const[name,setName]=useState("");
    const[bio,setBio]=useState("");
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const avatar=useFileHandler("single");
    
    const toggleLogin=()=>{
        setIsLogin((prev)=>!prev);
    }
    const dispatch=useDispatch();
    const handleLogin=async(e)=>{
        e.preventDefault();
        const toastId=toast.loading("Logging In...");
        setIsloading(true);
        const config={
            withCredentials:true,
            headers:{
                "Content-Type":"application/json",
            }
        };
        try{
            const {data}=await axios.post(`${server}/user/login`,{username:username,password:password},config);
            dispatch(userExists(data.user));
            toast.success(data.message,{id:toastId});

        }
        catch(e){
            console.log(e);
            toast.error(e?.response?.data?.message || "Something Went Wrong",{id:toastId});
        }finally{
            setIsloading(false);
        }
        
    }

    
    const handleSignUp=async(e)=>{
        const config={withCredentials:true,headers:{"Content-Type":"multipart/form-data"}};
        e.preventDefault();
        const toastId=toast.loading("Signing Up...");
        const formData=new FormData();
        setIsloading(true);
        formData.append("avatar",avatar.file);
        formData.append("name",name);
        formData.append("bio",bio);
        formData.append("username",username);
        formData.append("password",password);

        try{
            const {data}=await axios.post(`${server}/user/new`,formData,config);
            dispatch(userExists(data.user));
            toast.success(data.message,{id:toastId});
        }
        catch(e){
            console.log(e);
            toast.error(e?.response?.data?.message || "Something Went Wrong",{id:toastId});
        }
        finally{
            setIsloading(false);
        }
    }
  return (
    <div style={{background:"rgb(34,193,195)",
        background:bgGradient}}>
    <Container component={"main"} maxWidth="xs" sx={{
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"black"
    }}>
        <Paper elevation={3} sx={{
            padding:4,
            display:"flex",
            flexDirection:"column",
            alignItems:"center",
        }}>
            {isLogin? <>
            <Typography variant='h5'>Login</Typography>
            <form style={
                {width:"100%",
                    marginTop:"1rem",
                }
            } onSubmit={handleLogin}>
                <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                <TextField required fullWidth label="Password" type="password" margin='normal' variant='outlined' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <Button variant='contained' color='primary' type='submit' fullWidth disabled={isLoading}>Login</Button>
                <Typography textAlign={"center"} margin={"1rem"} sx={{fontWeight:"bold"}}>OR</Typography>
                <Button fullWidth variant='text' color='secondary' onClick={toggleLogin} disabled={isLoading}>
                    SignUp
                </Button>
            </form>
            
            </>:
            <>
            <Typography variant='h5'>Sign Up</Typography>
            <form style={
                {width:"100%",
                    marginTop:"1rem",
                }

            } onSubmit={handleSignUp}>
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                    <Avatar sx={{
                    width:"10rem",
                    height:"10rem",
                    objectFit:"contain"
                    }} src={avatar.preview}/>
                    
                    <IconButton sx={{
                        position:"absolute",
                        bottom:0,
                        right:0,
                        color:"white",
                        bgcolor:"rgba(0,0,0,0.5)",
                        ":hover":{
                            bgcolor:"rgba(0,0,0,0.7)"
                        }
                        
                    }} component="label">
                        <>
                            <CameraAltIcon/>
                            <VisuallyHiddenInput type='file' onChange={avatar.changeHandler}></VisuallyHiddenInput>
                        </>    
                    
                    </IconButton>
                </Stack>
                {avatar.error && (
                    <Typography color={error} m={"1rem auto"} width={"fit-content"} display={"block"} variant='caption'>{avatar.error}</Typography>
                )}
                <TextField required fullWidth label="Name" margin='normal' variant='outlined' value={name} onChange={(e)=>{setName(e.target.value)}}/>
                <TextField required fullWidth label="Bio" margin='normal' variant='outlined' value={bio} onChange={(e)=>{setBio(e.target.value)}}/>
                <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
                <TextField required fullWidth label="Password" type="password" margin='normal' variant='outlined' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <Button variant='contained' color='primary' type='submit' fullWidth disabled={isLoading}>Sign Up</Button>
                <Typography textAlign={"center"} margin={"1rem"}sx={{fontWeight:"bold"}}>OR</Typography>
                <Button fullWidth variant='text' color='secondary' onClick={toggleLogin} disabled={isLoading}>
                    Login
                </Button>
            </form>
            
            </>
            }
        </Paper>
    </Container>
    </div>
  );
}

export default Login