import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { memo, useState } from 'react'
import { sampleNotifications,sampleUsers } from '../constants/sampleData'
import UserItem from '../components/shared/UserItem'
import { useDispatch, useSelector } from 'react-redux'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { setIsNewGroup } from '../redux/reducers/misc'
import toast from 'react-hot-toast'
const NewGroup = () => {
  const dispatch=useDispatch();
  const {isNewGroup}=useSelector(state=>state.misc);
  const {isError,isLoading,error,data}=useAvailableFriendsQuery();
  const [newGroup,newGroupLoading]=useAsyncMutation(useNewGroupMutation);
  const [groupName,SetGroupName]=useState("");
  const [selectMembers,setSelectedMembers]=useState([]);
  const errors=[{
    isError:isError,
    error:error,
  }]
  useErrors(errors);
  const selectMemberHandler=(id)=>{
    setSelectedMembers((prev)=>prev.includes(id)?prev.filter((curr)=>{return curr!==id}):[...prev,id]);
  }

  const submitHandler=()=>{
    if(!groupName)return toast.error("Group name is Required");
    if(selectMembers.length<2)
      return toast.error("Please select Atleast 3 Members");
    newGroup("Creating New Group...",{name:groupName,members:selectMembers});
    closeHandler();
  }
  const closeHandler=()=>{
    dispatch(setIsNewGroup(false));
  };
  
  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{xs:"1rem",sm:"3rem"}} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h5'>Create a Group</DialogTitle>
        <TextField label="Group Name" value={groupName} onChange={(e)=>{SetGroupName(e.target.value)}}/>
        <Typography variant='body1'>Members to add:</Typography>
        <Stack>
          {isLoading?<Skeleton/>:data?.friends?.map((user)=>(
              <UserItem user={user} key={user._id} handler={selectMemberHandler} isAdded={selectMembers.includes(user._id)}/>
            ))}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant='contained' color='error' onClick={closeHandler}>Cancel</Button>
          <Button variant='contained' color='success' onClick={submitHandler} disabled={newGroupLoading}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup