import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMsgMenu } from '../../redux/reducers/misc';
import { Delete} from '@mui/icons-material';

import { useAsyncMutation } from '../../hooks/hook';
import { useDeleteMsgMutation } from '../../redux/api/api';

const DeleteMsgMenu = ({dispatch,deleteOptionAnchor}) => {
    
    
    const [deleteMsg,_,deleteMsgData]=useAsyncMutation(useDeleteMsgMutation);
    const {isDeleteMsgMenu,selectedDeleteMsg}=useSelector((state)=>state.misc);
  
    
    const closeHandler=()=>{
        dispatch(setIsDeleteMsgMenu(false));
        deleteOptionAnchor.current=null;
    }
    
    const deleteChatHandler=()=>{
        closeHandler();
        deleteMsg("Deleting Msg...",{_id:selectedDeleteMsg._id,chatId:selectedDeleteMsg.chatId});
    }
    
  return (
     <Menu open={isDeleteMsgMenu} onClose={closeHandler} anchorEl={deleteOptionAnchor}>

        <Stack sx={{width:"10rem",padding:"0.5rem",cursor:"pointer"}} direction={"row"} alignItems={"center"} spacing={"0.5rem"} onClick={deleteChatHandler}>
            {<><Delete/><Typography>Delete Msg</Typography></>}
        </Stack>
     </Menu>
  )
}

export default DeleteMsgMenu