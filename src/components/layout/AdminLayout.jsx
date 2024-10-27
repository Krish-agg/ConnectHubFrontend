import { Close as CloseIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from "@mui/icons-material";
import { Box, Drawer, Grid, IconButton, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { grayColor, orange } from '../../constants/color';

import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from 'react-redux';
import { LinkA } from '../styles/styledComponents';

import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../../constants/config';
import { setIsAdmin } from '../../redux/reducers/auth';



const Sidebar=({w="100%"})=>{
    const adminTabs=[{
        name:"DashBoard",
        path:"/admin/dashboard",
        icon:<DashboardIcon/>
    },{
        name:"Users",
        path:"/admin/users",
        icon:<ManageAccountsIcon/>
    },{
        name:"Chats",
        path:"/admin/chats",
        icon:<GroupsIcon/>
    },{
        name:"Messages",
        path:"/admin/messages",
        icon:<MessageIcon/>
    },]

    const dispatch=useDispatch();
    const location=useLocation();
    const logoutHandler=async()=>{
        try{
            const {data}=await axios.get(`${server}/admin/logout`,{withCredentials:true});
            dispatch(setIsAdmin(false));
            toast.success(data.message);

        }
        catch(e){
           
            toast.error(e?.response?.data?.message || "Something Went Wrong");
        }
    }
    return(
     <Stack width={w} p={"3rem"} spacing={"3rem"} bgcolor={orange} height={"100%"}>
        <Typography variant='h4' >ConnectHub</Typography>
        <Stack spacing={"1rem"}>
            {adminTabs.map((tab)=>(
                <LinkA key={tab.path} to={tab.path} sx={
                    location.pathname === tab.path && {bgcolor:"black", color:"white",":hover":{color:"white"}}
                }>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        {tab.icon}
                        <Typography>{tab.name}</Typography>
                    </Stack>
                </LinkA>
            ))}
        </Stack>
        <LinkA onClick={logoutHandler}>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                <ExitToAppIcon/>
                <Typography>Logout</Typography>
            </Stack>
        </LinkA>

     </Stack>   
    )
}

const AdminLayout = ({children}) => {
    const {isAdmin}=useSelector((state)=>state.auth);
    const [isMobile,setIsMobile]=useState(false);
    const handleMobile=()=>{
        setIsMobile((prev)=>!prev);
    }
    const handleClose=()=>{
        setIsMobile(false);
    }
    if(!isAdmin) return<Navigate to={"/admin"}/>
  return (
    <Grid container minHeight={"100vh"}>
        <Box sx={{
            display:{xs:"block",md:"none"},
            position:"fixed",
            right:"3rem",
            top:"4.3rem",
        }}>
            <IconButton onClick={handleMobile}>{isMobile?<CloseIcon/>:<MenuIcon/>}</IconButton>

        </Box>
        <Grid item md={4} lg={3} sx={{display:{xs:"none",md:"block"},bgcolor:orange}}>
            <Sidebar/>
        </Grid>
        <Grid item xs={12} md={8} lg={9} sx={{
            bgcolor:grayColor,
        }}>
            {children}
        </Grid>
        <Drawer open={isMobile} onClose={handleClose}>
            <Sidebar w={"50vw"}/>
        </Drawer>
    </Grid>
  )
}

export default AdminLayout