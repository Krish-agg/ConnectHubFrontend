import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import {Search as SearchIcon} from "@mui/icons-material";
import UserItem from '../components/shared/UserItem';
import { sampleUsers } from '../constants/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../redux/reducers/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../redux/api/api';
import toast from 'react-hot-toast';
import { useAsyncMutation } from '../hooks/hook';

const SearchDialog = () => {
  const dispatch=useDispatch();
  const {isSearch}=useSelector((state)=>state.misc);
  const[searchUser]=useLazySearchUserQuery();
  const[sendFriendRequest,isLoadingSendFriendReq]=useAsyncMutation(useSendFriendRequestMutation);
  const [users,setUsers]=useState([]);
  const [search,SetSearch]=useState("");
  
  const addFriendHandler=async(id)=>{
    await sendFriendRequest("Sending Friend request...",{userId:id});
    
  }
  const searchCloseHandler=()=>{
    dispatch(setIsSearch(false));
  }
  useEffect(()=>{
    const timeOutId=setTimeout(()=>{
      searchUser(search).then(({data})=>setUsers(data.message))
      .catch((e)=>{});
    },1000);
    return()=>{
      clearTimeout(timeOutId);
    }
  },[search])
  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField label="" onChange={(e)=>SetSearch(e.target.value)} value={search} variant='outlined' 
        size="small" InputProps={{startAdornment:(<InputAdornment position='start'><SearchIcon/></InputAdornment>)}}/>

        <List>
          {users.map((user)=>(
            <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendReq}/>
          ))}
        </List>
      </Stack>
    </Dialog>
  )
}

export default SearchDialog