import { useFetchData } from '6pp';
import { Avatar, Box, Skeleton, Stack } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import DataTable from '../../components/shared/DataTable';
import renderAttachment from "../../components/shared/renderAttachment";
import { server } from '../../constants/config';
import { useErrors } from '../../hooks/hook';
import { fileFormat, tranformImage } from '../../lib/features';
const columns=[{
  field:"id",
  headerName:"ID",
  headerClassName:"table-header",
  width:200,
},
{
  field:"attachments",
  headerName:"Attachments",
  headerClassName:"table-header",
  width:200,
  renderCell:(params)=>{
  const {attachments}=params.row;
  return attachments?.length>0? attachments.map(i=>{
    
    const url=i.url;
    const file=fileFormat(url);

    
    return <Box>
      <a href={url} download target='_blank' style={{color:"black"}}>{renderAttachment(file,url)}</a>
    </Box> 
  }):"No Attachments";
  
  return <Avatar alt={params.row.name} src={params.row.avatar}/>}
},
{
  field:"content",
  headerName:"Content",
  headerClassName:"table-header",
  width:400,
},
{
  field:"sender",
  headerName:"SendBy",
  headerClassName:"table-header",
  width:200,
  renderCell:(params)=><Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
    <Avatar alt={params.row.sender.name} src={params.row.sender.avatar}/>
    <span>{params.row.sender.name}</span>
  </Stack>
},
{
  field:"chat",
  headerName:"Chat",
  headerClassName:"table-header",
  width:220,
},
{
  field:"groupChat",
  headerName:"Group Chat",
  headerClassName:"table-header",
  width:100,
  type:"boolean",
},
{
  field:"createdAt",
  headerName:"Time",
  headerClassName:"table-header",
  width:250,
}]
const MessageManagement = () => {
  const {loading,data,error,refetch}=useFetchData(`${server}/admin/messages`,"dashboard-messages");
  useErrors([{isError:error,error}])
  const [rows,setRows]=useState([]);
  useEffect(()=>{
    if(data){
      setRows(data.messages.map((i)=>({...i,id:i._id,sender:{name:i.sender.name,avatar:tranformImage(i.sender.avatar,50)},createdAt:moment(i.createdAt).format("MMMM Do YYYY ,h:mm:ss a"),})))
    }
    
  },[data])
  return (
    <AdminLayout>
        {loading?<Skeleton  height={"100vh"}/>:<DataTable heading={"All Messages"} columns={columns} rows={rows} rowHeight={200} />}
    </AdminLayout>
  )
}

export default MessageManagement

