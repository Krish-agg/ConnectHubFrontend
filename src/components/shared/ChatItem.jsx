import React, { memo } from 'react'
import { Link } from '../styles/styledComponents';
import { Box, Stack, Typography } from '@mui/material';
import AvatarCard from './AvatarCard';
import { motion } from 'framer-motion';

const ChatItem = ({avatar=[],name,_id,groupChat=false,sameSender,isOnline,newMessageAlert,index=0,
    handleDeleteChat}) => {
    
  return (
    <Link sx={{padding:"0"}} to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}>
        <motion.div initial={{opacity:0,y:"-100%"}} whileInView={{opacity:1,y:0}} transition={{delay:index*0.2}}style={{
            display:"flex",
            gap:"1rem",
            alignItems:"center",
            padding:"1rem",
            backgroundColor:sameSender?"black":"unset",
            color:sameSender?"white":"unset",
            justifyContent:"space-between",
        }}>
            <AvatarCard avatar={avatar}/>
            <Stack>
                <Typography>{name}</Typography>
                {newMessageAlert && (<Typography>{newMessageAlert.count} New Messages</Typography>)}
            </Stack>
            {
                isOnline && <Box sx={{
                    width:"10px",
                    height:"10px",
                    borderRadius:"50%",
                    backgroundColor:"green",
                    top:"50%",
                    right:"1rem",
                    transform:"translateY(-50%)"
                }}></Box>
            }
        </motion.div>
    </Link>
  )
}

export default memo(ChatItem);
