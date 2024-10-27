import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'

import UserItem  from "../shared/UserItem";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducers/misc';
const AddMemberDialog = ({chatId}) => {
    const dispatch=useDispatch();
    
    const {isError,error,isLoading,data}=useAvailableFriendsQuery(chatId);
    const [selectedMembers,setSelectedMembers]=useState([]);
    const {isAddMember}=useSelector((state)=>state.misc);
    const [addGroupMembers,isLoadingAddGroupMembers]=useAsyncMutation(useAddGroupMembersMutation);

    
    const selectMemberHandler=(id)=>{
        setSelectedMembers((prev)=>prev.includes(id)?prev.filter((curr)=>{return curr!==id}):[...prev,id]);
    }  
  
  const addMemberSubmitHandler=()=>{
    addGroupMembers("Adding Members...",{members:selectedMembers,chatId});
    closeHandler();
  }
  const closeHandler=()=>{
    dispatch(setIsAddMember(false));
  }
  useErrors([{isError,error}]);
    return (
    <Dialog open={isAddMember} onClose={closeHandler}>
        <Stack p={"2rem"} width={"20rem"} spacing={"1rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack spacing={"1rem"} >
                {
                    isLoading?<Skeleton/>: data?.friends?.length>0 ? data?.friends?.map((i)=>(
                        <UserItem key={i._id} user={i} handler={selectMemberHandler} isAdded={selectedMembers.includes(i._id)} />
                    )):<Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
            <Button color='error' onClick={closeHandler}>Cancel</Button>
            <Button variant='contained' disabled={isLoadingAddGroupMembers} onClick={addMemberSubmitHandler}>Submit</Button>
        </Stack>

    </Dialog>
  )
}

export default AddMemberDialog