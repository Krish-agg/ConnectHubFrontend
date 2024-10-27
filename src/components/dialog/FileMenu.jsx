import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setIsUploadingLoader } from '../../redux/reducers/misc';
import {toast} from "react-hot-toast";
import { Image as ImageIcon ,AudioFile as AudioFileIcon,VideoFile as VideoFileIcon,UploadFile as UploadFileIcon } from '@mui/icons-material';
import { useSendAttachmentsMutation } from '../../redux/api/api';
const FileMenu = ({anchorE,chatId}) => {
  const {isFileMenu}=useSelector((state)=>state.misc)
  const dispatch=useDispatch();
  const imageRef=useRef(null);
  const audioRef=useRef(null);
  const videoRef=useRef(null);
  const fileRef=useRef(null);
  
  const [sendAttachments]=useSendAttachmentsMutation();


  const closeFileMenu=()=>{
    dispatch(setIsFileMenu(false));
  }
  const selectRef=(ref)=>{
    ref.current?.click();
  }
  const fileChangeHandler=async(e,key)=>{
    const files=Array.from(e.target.files);

    if(files.length<=0)return;
    if(files.length>5) return toast.error(`You can only send 5 ${key} at a time.`);
    dispatch(setIsUploadingLoader(true));

    const toastId=toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try{
      const myForm=new FormData();
      myForm.append("chatId",chatId);
      files.forEach((file)=>myForm.append("files",file));
      const res=await sendAttachments(myForm);
      
      if(res.data) toast.success(`${key} sent successfully`,{id:toastId});
      else toast.error(`Failed to send ${key} (${res.error.data.message})`,{id:toastId});
    }
    catch(e){
      toast.error(e,{id:toastId});
    }
    finally{
      dispatch(setIsUploadingLoader(false));
    }


  }
  
  return (
    <Menu anchorEl={anchorE} open={isFileMenu} onClose={closeFileMenu} >
      <div style={{width:"10rem"}}>
      <MenuList>
        <MenuItem onClick={()=>selectRef(imageRef)}>
          <Tooltip title="Image"><ImageIcon/></Tooltip>
          <ListItemText style={{marginLeft:"0.5rem"}}>Image</ListItemText>
          <input type='file'ref={imageRef} multiple accept='image/png,image/gif,image/jpeg' style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"Images")}></input>
        </MenuItem>

        <MenuItem onClick={()=>selectRef(audioRef)}>
          <Tooltip title="Audio"><AudioFileIcon/></Tooltip>
          <ListItemText style={{marginLeft:"0.5rem"}}>Audio</ListItemText>
          <input type='file' ref={audioRef} multiple accept='audio/mpeg,audio/wav' style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"Audios")}></input>
        </MenuItem>

        <MenuItem onClick={()=>selectRef(videoRef)}>
          <Tooltip title="Video"><VideoFileIcon/></Tooltip>
          <ListItemText style={{marginLeft:"0.5rem"}}>Video</ListItemText>
          <input type='file' ref={videoRef} multiple accept='video/mp4,video/webm,video/ogg,video/mp3' style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"Videos")}></input>
        </MenuItem>
        <MenuItem onClick={()=>selectRef(fileRef)}>
          <Tooltip title="File"><UploadFileIcon/></Tooltip>
          <ListItemText style={{marginLeft:"0.5rem"}}>File</ListItemText>
          <input type='file' ref={fileRef} multiple accept='*' style={{display:"none"}} onChange={(e)=>fileChangeHandler(e,"Files")}></input>
        </MenuItem>
      </MenuList>
      </div>
      
    </Menu>
  )
}

export default FileMenu