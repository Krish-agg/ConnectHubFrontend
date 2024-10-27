import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React,{memo} from 'react'
import{AddCircle as AddIcon} from "@mui/icons-material"
import {Remove as RemoveIcon} from '@mui/icons-material';
import { orange, pink } from '@mui/material/colors';
import { tranformImage } from '../../lib/features';
const UserItem = ({user,handler,handlerIsLoading,isAdded=false,styling={}}) => {
    const {name,_id,avatar}=user;
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} {...styling}>
            
            <Avatar src={tranformImage(avatar.toString())}></Avatar>
            <Typography variant='body1' sx={{
                flexGrow:1,display:"-webkit-box",WebkitBoxOrient:"vertical",WebkitLineClamp:1,overflow:"hidden",textOverflow:"ellipsis"
            }}>{name}</Typography>
            <IconButton size='small' sx={{bgcolor:isAdded?"error.main":"primay",color:"black","&:hover":isAdded?{bgcolor:"error.dark"}:{bgcolor:orange[500]}}} onClick={()=>handler(_id)} disabled={handlerIsLoading}>{isAdded?<RemoveIcon/> :<AddIcon/>}</IconButton>
        </Stack>
    </ListItem>
  )
}

export default memo(UserItem);