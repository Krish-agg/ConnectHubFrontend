import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor, orange } from '../constants/color';
import { Send as SendIcon} from '@mui/icons-material';
import { InputBox } from '../components/styles/styledComponents';
import { AttachFile as AttachFileIcon } from '@mui/icons-material';
import FileMenu from '../components/dialog/FileMenu';

import MessageCompo from '../components/shared/MessageCompo';
import { getSocket } from '../socket';
import { ALERT, CHAT_EXITED, CHAT_JOINED, DELETE_MSG, NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import {useInfiniteScrollTop} from "6pp";
import { useDispatch } from 'react-redux';
import { setIsDeleteMsgMenu, setIsFileMenu, setSelectedDeleteMsg } from '../redux/reducers/misc';
import { removeNewMessageAlert } from '../redux/reducers/chat';
import { TypingLoader } from '../components/layout/Loaders';
import { useNavigate } from 'react-router-dom';
import DeleteMsgMenu from '../components/dialog/DeleteMsgMenu';

const Chat = ({chatId,user}) => {
  const containerRef=useRef(null);
  const bottomRef=useRef(null);
  const socket=getSocket();
  const dispatch=useDispatch();

  const [message,setMessage]=useState("");
  const [messages,setMessages]=useState([]);
  const [page,setPage]=useState(1);
  const [fileMenuAnchor,setFileMenuAnchor]=useState(null);
  const [IamTyping,setIamTyping]=useState(false);
  const [userTyping,setUserTyping]=useState(false);
  const typingTimeout=useRef(null);
  const navigate=useNavigate();
  const chatDetails=useChatDetailsQuery({chatId,skip:!chatId});
  const oldMessagesChunk=useGetMessagesQuery({chatId,page});
  const deleteMsgMenuAnchor=useRef(null);

  const {data:oldMessages,setData:setOldMessages}=useInfiniteScrollTop(containerRef,oldMessagesChunk.data?.totalPages,page,setPage,oldMessagesChunk.data?.message);
  const members=chatDetails?.data?.chat?.members;
 
  const errors=[{isError:chatDetails.isError,error:chatDetails.error},{isError:oldMessagesChunk.isError,error:oldMessagesChunk.error}];
  const handleFileOpen=(e)=>{
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }
  const messageChangeHandler=(e)=>{
    setMessage(e.target.value);
    if(!IamTyping){
      socket.emit(START_TYPING,{members,chatId});
      setIamTyping(true);
    }
    if(typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current=setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId});
      setIamTyping(false);
    },[2000])
    
  }
  const submitHandler=(e)=>{
    e.preventDefault();
    if(!message.trim()) return;
    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage("");
  }

  useEffect(()=>{
    socket.emit(CHAT_JOINED,{userId:user._id,members});
    dispatch(removeNewMessageAlert(chatId))
    return()=>{
      setMessage("");
      setMessages([]);
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_EXITED,{userId:user._id,members});
    }
  },[chatId])
  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({behaviour:"smooth"})
  },[messages])
  
  useEffect(()=>{
    if(chatDetails.isError){
      return navigate("/")
    }
  },[chatDetails.isError])

  const newMessageHandler=useCallback((data)=>{
    if(data.chatId!==chatId) return;
    setMessages((prev)=>[...prev,data.message])
  },[chatId])//useCallBack to avoid recreation

  const startTypingListener=useCallback((data)=>{
    if(data.chatId!==chatId) return;
    setUserTyping(true);
    
  },[chatId])

  const stopTypingListener=useCallback((data)=>{
    if(data.chatId!==chatId) return;
    setUserTyping(false);
  },[chatId])

  const alertListener=useCallback((data)=>{
    if(data.chatId!==chatId)return;
    const messageForAlert={
      content:data.message,
      
      sender:{
          _id:"kkk",
          name:"Admin",

      },
      chat:data.chatId,
      createdAt: new Date().toISOString(),
    }
    setMessages((prev)=>[...prev,messageForAlert]);

  },[chatId])

  const handleDeleteMsg=(e,chat,_id)=>{
    deleteMsgMenuAnchor.current=e.currentTarget;
    dispatch(setIsDeleteMsgMenu(true));
    dispatch(setSelectedDeleteMsg({chatId:chat,_id}))
    
  };
  const refetchHandler=()=>{
    window.location.reload();
  }
    
  
  
  const eventHandlers={[ALERT]:alertListener,[NEW_MESSAGE]:newMessageHandler,[START_TYPING]:startTypingListener,[STOP_TYPING]:stopTypingListener,[DELETE_MSG]:refetchHandler};
  useSocketEvents(socket,eventHandlers);
  useErrors(errors);
  
  const allMessages=[...oldMessages,...messages];
  
  return <>
  <DeleteMsgMenu dispatch={dispatch} deleteOptionAnchor={deleteMsgMenuAnchor.current} />
  {chatDetails.isLoading? (<Skeleton/>):(
    <>
      <Stack ref={containerRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor} height={"90%"} sx={{overflowX:"hidden",overflowY:"auto"}}>
        {allMessages.map((i)=>(
          
          <MessageCompo message={i} user={user} key={i._id} handleDeleteMsg={handleDeleteMsg}/>
        ))}
        
        {userTyping && <TypingLoader/>}
        <div ref={bottomRef}/>
      </Stack>
      <form style={{height:"10%"}} onSubmit={submitHandler}>
      <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
        <IconButton sx={{
            position:"absolute",
            left:"1.5rem",
            rotate:"30deg",
          }} onClick={handleFileOpen}>
          <AttachFileIcon ></AttachFileIcon>
        </IconButton>
        <InputBox value={message} onChange={messageChangeHandler} placeholder='Enter Message Here...'/>
        <IconButton type='submit' sx={{
          backgroundColor:orange,
          color:"white",
          marginLeft:"1rem",
          padding:"0.5rem",
          "&:hover":{
            bgcolor:"black"
          }
        }}>
          <SendIcon/>
        </IconButton>
        </Stack>
      </form>
      <FileMenu anchorE={fileMenuAnchor} chatId={chatId}/>
      
    </>
  )}
  </>
}

export default AppLayout()(Chat);