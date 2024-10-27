import { useFetchData } from '6pp';
import { Avatar, Skeleton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import AvatarCard from "../../components/shared/AvatarCard";
import DataTable from '../../components/shared/DataTable';
import { server } from '../../constants/config';
import { useErrors } from '../../hooks/hook';
import { tranformImage } from '../../lib/features';
const columns=[{
  field:"id",
  headerName:"ID",
  headerClassName:"table-header",
  width:200,
},
{
  field:"avatar",
  headerName:"Icon",
  headerClassName:"table-header",
  width:150,
  renderCell:(params)=><AvatarCard avatar={params.row.avatar}/>
},
{
  field:"name",
  headerName:"Name",
  headerClassName:"table-header",
  width:300,
},
{
  field:"groupChat",
  headerName:"IsGroup",
  headerClassName:"table-header",
  width:100,
},
{
  field:"totalMembers",
  headerName:"Total Members",
  headerClassName:"table-header",
  width:120,
},
{
  field:"members",
  headerName:"Members",
  headerClassName:"table-header",
  width:400,
  renderCell:(params)=><AvatarCard max={100} avatar={params.row.members}/>
},
{
  field:"totalMessages",
  headerName:"Total Messages",
  headerClassName:"table-header",
  width:120,
},
{
  field:"creator",
  headerName:"Created By",
  headerClassName:"table-header",
  width:250,
  renderCell:(params)=>(
    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
      <Avatar alt={params.row.creator.name} src={params.row.creator.avatar}/>
      <span>{params.row.creator.name}</span>
    </Stack>
  )
}

];
const ChatManagement = () => {
  const {loading,data,error,refetch}=useFetchData(`${server}/admin/chats`,"dashboard-chats");
  useErrors([{isError:error,error}])
  const [rows,setRows]=useState([]);

  useEffect(()=>{
    if(data){
      setRows(data.transformedChats.map((user,index)=>({...user,id:user._id,avatar:user.avatar.map((i)=>tranformImage(i,50)),members:user.members.map((i)=>tranformImage(i.avatar,50)),creator:{name:user.creator.name,avatar:tranformImage(user.creator.avatar,50),}})))
    }
  },[data])
  return (
    <AdminLayout>
        {loading?<Skeleton  height={"100vh"}/>:<DataTable heading={"All Chats"} columns={columns} rows={rows}/>}
    </AdminLayout>
  )
}


export default ChatManagement