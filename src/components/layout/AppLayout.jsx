import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from './Header';
import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import ChatList from '../../specific/ChatList';
import { sampleChats } from '../../constants/sampleData';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileCard from '../../specific/ProfileCard';
import { useMyChatsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDeleteMenu, setIsMobileMenuFriend, setSelectedDeleteChat } from '../../redux/reducers/misc';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getSocket } from '../../socket';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../../constants/events';
import { increamentNotification, setNewMessagesAlert } from '../../redux/reducers/chat';
import { getOrSaveFromStorage } from '../../lib/features';
import DeleteChatMenu from '../dialog/DeleteChatMenu';

const AppLayout = () => (WrappedComponent)=>{
    return (props)=>{
        const params=useParams();
        const chatId=params.chatId;
        const deleteMenuAnchor=useRef(null);
        const [onlineUsers,setOnlineUsers]=useState([]);
        const socket=getSocket();
        const navigate=useNavigate();
        const dispatch=useDispatch();
        const {isMobileMenuFriend}=useSelector((state)=>state.misc)
        const {user}=useSelector((state)=>state.auth)
        const {newMessageAlert}=useSelector((state)=>state.chat)

        const {isLoading,data,isError,error,refetch}=useMyChatsQuery("");

        useErrors([{isError,error}]);
        useEffect(()=>{
            getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessageAlert})
        },[newMessageAlert])

        const handleDeleteChat=(e,chatId,groupChat)=>{
            deleteMenuAnchor.current=e.currentTarget;
            dispatch(setIsDeleteMenu(true));
            dispatch(setSelectedDeleteChat({chatId,groupChat}))
            
            
        };
        const handleMobileClose=()=>dispatch(setIsMobileMenuFriend(false));
        const newMessageAlertHandler=useCallback((data)=>{
            if(data.chatId===chatId)return;
            dispatch(setNewMessagesAlert(data)); 
        },[chatId]);
        const newNotificationHandler=useCallback(()=>{
            dispatch(increamentNotification());


        },[dispatch]);
        const refetchHandler=useCallback(()=>{
            refetch();
            navigate("/");


        },[refetch,navigate]);
        const onlineusersHandler=useCallback((data)=>{
            console.log(data);
            setOnlineUsers(data);
        },[]);
        const eventHandlers={[NEW_MESSAGE_ALERT]:newMessageAlertHandler,[NEW_REQUEST]:newNotificationHandler,[REFETCH_CHATS]:refetchHandler,[ONLINE_USERS]:onlineusersHandler};
        useSocketEvents(socket,eventHandlers);


        return(
            <>
                <Title/>
                <Header/>
                <DeleteChatMenu dispatch={dispatch} deleteOptionAnchor={deleteMenuAnchor.current} />
                {isLoading? <Skeleton/>:
                (<Drawer open={isMobileMenuFriend} onClose={handleMobileClose}>
                    <ChatList  w="70vw" chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessageAlert} onlineUsers={onlineUsers}/>
                </Drawer>)}
                <Grid container height={"calc(100vh - 4rem)"}>
                    <Grid item sm={4} md={3} sx={{
                        display:{xs:"none",sm:"block"},

                    }} height={"100%"} >
                        {
                        isLoading? (<Skeleton/>):(<ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessageAlert} onlineUsers={onlineUsers}/>)
                    }</Grid>
                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}><WrappedComponent {...props} chatId={chatId} user={user}/></Grid>
                    <Grid item md={4} lg={3} sx={{
                        display:{xs:"none",md:"block"},
                        padding:"2rem",
                        bgcolor:"rgba(0,0,0,0.85)"

                    }} height={"100%"} ><ProfileCard user={user}/></Grid>
                </Grid>
                
                
            </>
        )
    }
}
  
export default AppLayout;