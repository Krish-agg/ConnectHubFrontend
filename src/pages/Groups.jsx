import { Add, Delete, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon,Menu as MenuIcon } from '@mui/icons-material';
import { Backdrop, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { orange, yellow } from '../constants/color';
import { useNavigate ,useSearchParams} from 'react-router-dom';
import { Link } from '../components/styles/styledComponents';
import AvatarCard from '../components/shared/AvatarCard';
import { sampleChats, sampleUsers } from '../constants/sampleData';
import UserItem from '../components/shared/UserItem';
import { useAddGroupMembersMutation, useChatDetailsQuery, useDeleteGroupMemberMutation, useDeleteGroupMutation, useMyGroupsQuery, useRenameGroupMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { LayoutLoader } from '../components/layout/Loaders';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducers/misc';
const ConfirmDeleteDialog=lazy(()=>import("../components/dialog/ConfirmDeleteDialog"));
const AddMemberDialog=lazy(()=>import("../components/dialog/AddMemberDialog"));

const Groups = () => {


  
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const chatId=useSearchParams()[0].get('group')
  
  const {isAddMember}=useSelector((state)=>state.misc);
  const myGroups=useMyGroupsQuery();
  
  const groupDetails=useChatDetailsQuery({chatId,populate:true},{skip:!chatId});
  const [updateGroup,isLoadingGroupName]=useAsyncMutation(useRenameGroupMutation);
  const [removeGroupMember,isLoadingRemoveGroupMember]=useAsyncMutation(useDeleteGroupMemberMutation);
  const [deleteGroup,isLoadingDeleteGroup]=useAsyncMutation(useDeleteGroupMutation);
 
  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false);
  const [isEdit,setIsEdit]=useState(false);
  const [confirmDeleteDialog,setConfirmDeleteDialog]=useState(false);
  const[groupName,setGroupName]=useState("");
  const[groupNameUpdated,setGroupNameUpdated]=useState("");
  const [members,setMembers]=useState([]);
  const errors=[{
    isError:myGroups.isError,
    error:myGroups.error,
  },{
    isError:groupDetails.isError,
    error:groupDetails.error,
    }
  ]
  
  useEffect(()=>{
    if(groupDetails.data){
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdated(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }
    return ()=>{
      setGroupName("");
      setGroupNameUpdated("");
      setMembers([]);
      setIsEdit(false);
    };
  },[groupDetails.data]);

  const navigateBack=()=>{
    navigate("/");
  }
  const handleMobile=()=>{
    setIsMobileMenuOpen((prev)=>!prev);
  }
  const handleMobileClose=()=>{
    setIsMobileMenuOpen(false);
  }
  const updateGroupName=()=>{
    setIsEdit(false);
    updateGroup("Updating Group Name...",{chatId,name:groupNameUpdated})

  }
  const openConfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(true);
  }
  const closeConfirmDeleteHandler=()=>{
    setConfirmDeleteDialog(false);
  }
  const openAddMemberHandler=()=>{
    dispatch(setIsAddMember(true));
  } 
  const deleteHandler=()=>{
    deleteGroup("Deleting Group...",chatId);
    
    closeConfirmDeleteHandler();
    navigate("/groups");
  }
  const removeMemberHandler=(userId)=>{
    removeGroupMember("Removing Member...",{chatId,userId});
  }

  useErrors(errors)

  const IconBtns=(<>
    <IconButton sx={{display:{
      xs:"block",sm:"none"
    },position:"fixed",right:"1rem",top:"2rem"}} onClick={handleMobile}>
      <MenuIcon></MenuIcon>
    </IconButton>
    <Tooltip title="Back">
      <IconButton sx={{position:"absolute" ,top:"2rem",left:"2rem",bgcolor:"rgb(0,0,0,0.8)",color:"white",":hover":{
        bgcolor:"black"
      }}} onClick={navigateBack}>
        <KeyboardBackspaceIcon/>
      </IconButton>
    </Tooltip>
  </>);

  const GroupName=<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
    {isEdit?<>
      <TextField value={groupNameUpdated} onChange={(e)=>setGroupNameUpdated(e.target.value)}/>
      <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}><DoneIcon/></IconButton>
    </> :
    
    
    <>
      <Typography variant='h4'>{groupName}</Typography>
      <IconButton onClick={()=>{setIsEdit(true)}} disabled={isLoadingGroupName}><EditIcon/></IconButton>
      
      </>}


  </Stack>

  const ButtonGroup=<Stack direction={{
    sm:"row",
    xs:"column-reverse",
  }} spacing={"1rem"} p={{
    xs:"0",
    sm:"1rem",
    md:"1rem 4rem"
  }}>
    <Button size='large' variant='contained' color='error' startIcon={<Delete/>} onClick={openConfirmDeleteHandler}>DELETE GROUP</Button>
    <Button size='large' variant='contained' startIcon={<Add/>} onClick={openAddMemberHandler}>ADD MEMBER</Button>

  </Stack>
  return myGroups.isLoading?(<LayoutLoader/>):(
    <Grid container height={"100vh"}>
      <Grid item sx={{display:{xs:"none",
        sm:"block"
      },bgcolor:orange,color:"black",fontWeight:"600",textAlign:"center"}}  sm={3}><GroupList myGroups={myGroups?.data?.groups} chatId={chatId}/></Grid>
      <Grid item xs={12} sm={9} sx={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",padding:"1rem 3rem",bgcolor:yellow}} >{IconBtns}
        
        {chatId &&<>
        {GroupName}
        <Typography margin={"2rem"} alignSelf={"center"} variant='h6' fontWeight={"600"}>Members</Typography>
        <Stack maxWidth={"35rem"} width={"100%"} border={"2px solid black"} borderRadius={"1rem"} boxSizing={"border-box"} padding={{sm:"1rem",xs:"0", md:"1rem 4rem"}} spacing={"1rem"}
        height={"50vh"} overflow={"auto"}>

          {isLoadingRemoveGroupMember?<CircularProgress/>: members.map((user)=>(
            <UserItem key={user._id} user={user} isAdded styling={{
              boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
              padding:"0.5rem",
              borderRadius:"1rem",
            }} handler={removeMemberHandler}/>
          ))}


        </Stack>

        {ButtonGroup}
        </>}
      </Grid>
      {isAddMember && <Suspense fallback={<Backdrop open/>}><AddMemberDialog chatId={chatId}/></Suspense>}
      {confirmDeleteDialog && (<Suspense fallback={<Backdrop open/>}><ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler}/></Suspense>)}
      <Drawer sx={{display:{xs:"block",sm:"none",}}}open={isMobileMenuOpen} onClose={handleMobileClose}><GroupList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId} /></Drawer>
   
    </Grid>
  )
}
const GroupList=({w="100%",myGroups=[],chatId})=>(
  <Stack width={w} height={"100%"} bgcolor={orange}>
    {myGroups.length > 0 ? (myGroups.map((group)=><GroupListItem group={group} chatId={chatId} key={group._id}  />)):(<Typography textAlign={"center"} padding={"1rem"}>No Groups!</Typography>)}
  </Stack>
);

const GroupListItem=memo(({group,chatId})=>{
  const {name,avatar,_id}=group;
  return (<Link to={`?group=${_id}`} onClick={e=>{ if(chatId===_id) e.preventDefault();}}>
    <Stack direction={"row"}  gap={"1rem"} spacing={"1rem"} alignItems={"center"} justifyContent={"space-between"}>
      <AvatarCard avatar={avatar}/>
        <Typography>{name}</Typography>
     
    </Stack>
  </Link>
);
});

export default Groups;