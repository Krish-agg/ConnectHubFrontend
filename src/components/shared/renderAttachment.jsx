import React from 'react'
import { tranformImage } from '../../lib/features';
import { FileOpen } from '@mui/icons-material';

const renderAttachment = (file,url) => {
  switch(file){
    case "video":
        return <video src={url} preload='none' width={"200px"} controls></video>;
        
    case "image":
        return <img src={tranformImage(url,200)} alt='Attachment' width={"200px"} height={"150px"} style={{objectFit:"contain"}}></img>
        

    case "audio":
        return <audio src={url} preload='none' controls></audio>;
           
    default:
        return <FileOpen/>;    
        

  }
}

export default renderAttachment