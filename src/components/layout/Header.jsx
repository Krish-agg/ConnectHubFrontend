import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useState } from 'react'
import { orange } from '../../constants/color'
import {Add as AddIcon,Menu as MenuIcons,Search as SearchIcon,Group as GroupIcon,Logout as LogOutIcon,Notifications as NotificationsIcon} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth.js';
import { server } from '../../constants/config';
import { setIsMobileMenuFriend, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/reducers/misc.js';
import { resetNotification } from '../../redux/reducers/chat.js';

const SearchDialog=lazy(()=>import('../../specific/SearchDialog'));
const NewGroupDialog=lazy(()=>import('../../specific/NewGroup'));
const NotificationsDialog=lazy(()=>import('../../specific/Notifications'));
const Header = () => {
    
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {isSearch,isNotification,isNewGroup}=useSelector((state)=>state.misc);
    const {notificationCount}=useSelector((state)=>state.chat);
    

    
    
    const handleMobile=()=>{
        dispatch(setIsMobileMenuFriend(true));
    }
    const openSearch=()=>
        dispatch(setIsSearch(true));
        
    
    const openNewGroup=()=>{
        dispatch(setIsNewGroup(true));
    }
    const openNotification=()=>{
        dispatch(setIsNotification(true));
        dispatch(resetNotification());
    }
    const navigateToGroup=()=>{
        navigate("/groups");
    }
    const handleLogOut=async()=>{
        try{
            const {data}=await axios.get(`${server}/user/logout`,{withCredentials:true});
            dispatch(userNotExists());
            toast.success(data.message);

        }
        catch(e){
           
            toast.error(e?.response?.data?.message || "Something Went Wrong");
        }
    }
  return (
    <>
    <Box sx={{flexGrow:1}} height={"4rem"}>
        <AppBar position='static' sx={{
            bgcolor:orange,
        }}>
            <Toolbar>
                <Typography variant='h6' sx={{display:{xs:"none",sm:"block"}}}>ConnectHub</Typography>
                <Box sx={{display:{xs:"block",sm:"none"}}}>
                    <IconButton color='inherit' onClick={handleMobile}><MenuIcons/></IconButton>
                </Box>
                <Box sx={{flexGrow:1}}/>
                <Box>
                    <Tooltip title='Search'>
                        <IconButton color='inherit' size='large' onClick={openSearch}><SearchIcon /></IconButton>
                    </Tooltip>
                    
                    
                    <Tooltip title='New Group'>
                        <IconButton color='inherit' size='large' onClick={openNewGroup} ><AddIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title='Manage Groups'>
                        <IconButton color='inherit' size='large' onClick={navigateToGroup}><GroupIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title='Notifications'>
                        <IconButton color='inherit' size='large' onClick={openNotification}>
                            
                            {notificationCount ?(<Badge badgeContent={notificationCount} color='error'><NotificationsIcon /></Badge>):(<NotificationsIcon />)}
                        </IconButton>
                    </Tooltip>
                    <Tooltip title='LogOut'>
                        <IconButton color='inherit' size='large' onClick={handleLogOut}><LogOutIcon /></IconButton>
                    </Tooltip>
                </Box>
            </Toolbar>
        </AppBar>
    </Box>


    {isSearch && <Suspense fallback={<Backdrop open/>}><SearchDialog/></Suspense>}
    {isNotification && <Suspense fallback={<Backdrop open/>}><NotificationsDialog/></Suspense>}
    {isNewGroup && <Suspense fallback={<Backdrop open/>}><NewGroupDialog/></Suspense>}
    </>
  )
}

export default Header