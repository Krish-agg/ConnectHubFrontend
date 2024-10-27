import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment from "moment";
import {Face as FaceIcon,AlternateEmail as UserNameIcon,CalendarMonth as CalenderIcon } from "@mui/icons-material";
import { tranformImage } from '../lib/features';
const ProfileCard = ({user}) => {
  return (
    <Stack spacing={"2rem"} alignItems={"center"}>
        <Avatar src={tranformImage(user?.avatar?.url)} sx={{width:"200px", height:"200px", objectFit:"contain", marginBottom:"1rem", border:"5px solid white"} }/>
        <ProfileBlock heading={"Bio"} text={user?.bio}/>
        <ProfileBlock heading={"Username"} text={user?.username} Icon={<UserNameIcon/>}/>
        <ProfileBlock heading={"Name"} text={user?.name} Icon={<FaceIcon/>}/>
        <ProfileBlock heading={"Joined"} text={moment(user?.createdAt).fromNow()} Icon={<CalenderIcon/>}/>
    </Stack>
  )
}
const ProfileBlock=({heading ,text,Icon})=>{
    return(
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} color={"white"}  textAlign={"center"}>
            {Icon && Icon}
            <Stack>
                <Typography variant='body1'> {text}</Typography>
                <Typography color={"grey"}variant='caption'> {heading}</Typography>
            </Stack>
        </Stack>
    )
}

export default ProfileCard