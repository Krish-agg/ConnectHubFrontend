import { Stack } from '@mui/material';
import React from 'react'
import ChatItem from '../components/shared/ChatItem';

const ChatList = ({w="100%",chats=[],chatId,onlineUsers=[],newMessagesAlert=[{chatId:"",count:0,}],
    handleDeleteChat}) => {
  return (
    <Stack width={w} direction={"column"} overflow={"auto"} height={"100%"}>
        
        {
            
            chats?.map((data,idx)=>{
              const {avatar,_id,name,groupChat,members}=data;
              const newMessage=newMessagesAlert.find(
                ({chatId})=>chatId===_id
              );
              const isOnline=members?.some((member)=>onlineUsers.includes(member));
                return <ChatItem index={idx} newMessageAlert={newMessage} isOnline={isOnline} name={name} avatar={avatar} _id={_id} key={_id}  
                groupChat={groupChat} sameSender={chatId===_id} handleDeleteChat={handleDeleteChat}/>
            })
        }
    </Stack>
  )
}

export default ChatList;