import { Box, Typography } from '@mui/material';
import React, { memo } from 'react'
import { orange } from '../../constants/color';
import moment from 'moment';
import { fileFormat } from '../../lib/features';
import renderAttachment from './renderAttachment';
import {motion} from "framer-motion";

const MessageCompo = ({message,user,handleDeleteMsg}) => {
    const {sender,content,attachments=[],createdAt,chat,_id}=message;
    const sameSender=sender?._id===user?._id;
    const timeAgo=moment(createdAt).fromNow();
    return (
        <motion.div initial={{opacity:0,x:"-100%"}} whileInView={{opacity:1,x:0}}style={{alignSelf:sameSender?"flex-end":"flex-start",
            backgroundColor:"black",
            color:"white",
            borderRadius:"5px",
            padding:"0.5rem",
            width:"fit-content"
        }} onContextMenu={(e)=>handleDeleteMsg(e,chat,_id)}>
            {!sameSender && <Typography color={orange} fontWeight={"600"} variant='caption'>{sender.name}</Typography>}
            {content && <Typography>{content}</Typography>}
            {attachments.length>0 && attachments.map((attachment,idx)=>{
                const url=attachment.url;
                const file=fileFormat(url);
                
                return <Box key={idx}>
                    <a href={url} target="_blank" download style={{color:"cyan"}}>{renderAttachment(file,url)}</a>
                </Box>
            }) }
            <Typography variant='caption' color={"white"}>{timeAgo}</Typography>
        </motion.div>
    )
}

export default memo(MessageCompo);