import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { sampleNotifications } from '../constants/sampleData'
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../redux/api/api'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../redux/reducers/misc'
import toast from 'react-hot-toast'
import { tranformImage } from '../lib/features'

const Notifications = () => {
  const dispatch=useDispatch();
  const {isNotification}=useSelector((state)=>state.misc);
  const {isLoading,error,isError,data}=useGetNotificationsQuery();

  const [acceptRequest]=useAsyncMutation(useAcceptFriendRequestMutation);

  const freindRequestHandler=async({_id,accept})=>{
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...",{requestId:_id,accept});
    
  };
  const closeHandler=()=>dispatch(setIsNotification(false));
  useErrors([{error,isError}]);
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{xs:"1rem",sm:"2rem"}} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading? <Skeleton/>:<>
        
          {data?.allRequests?.length>0 ? (data?.allRequests?.map((i)=>(
            <NotificationItem sender={i.sender} _id={i._id} handler={freindRequestHandler} key={i._id}/>
        ))):<Typography textAlign={"center"}>No New Notifications!</Typography>}
        </>}
      </Stack>
    </Dialog>
  )
}

const NotificationItem=memo(({sender,_id,handler})=>{
  const {name,avatar}=sender;
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
            <Avatar src={tranformImage(avatar)}></Avatar>
            <Typography variant='body1' sx={{
                flexGrow:1,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"ellipsis"
            }}>{`${name}send you a friend request.`}</Typography>
            <Stack direction={{
              xs:"column",
              sm:"row",
            }}>
              <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
              <Button color="error" onClick={()=>handler({_id,accept:false})}>Reject</Button>
            </Stack>
        </Stack>
    </ListItem>
  )
});

export default Notifications