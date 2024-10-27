import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Box, Button, Container, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Group as GroupIcon, Message as MessageIcon, Person as PersonIcon} from '@mui/icons-material'
import moment from "moment";
import { SearchField } from '../../components/styles/styledComponents';
import { DoughnutChart, LineChart } from '../../specific/Charts';
import { useFetchData } from '6pp';
import { LayoutLoader } from '../../components/layout/Loaders';
import { useErrors } from '../../hooks/hook';
import { server } from '../../constants/config';


const Dashboard = () => {
    const {loading,data,error,refetch}=useFetchData(`${server}/admin/stats`,"dashboard-stats");
    const {stats}=data || {};
    
    useErrors([{isError:error,error}])

    const Appbar=<Paper elevation={3} sx={{padding:"2rem",margin:"2rem 0",borderRadius:"1rem"}}>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <AdminPanelSettingsIcon sx={{fontSize:"3rem"}}/>
            <SearchField placeholder='Search...'/>
            <Button variant="contained" >Search</Button>
            <Box flexGrow={1}/>
            <Typography display={{xs:"none" ,lg:"block"}} textAlign={"center"} fontWeight={"700"}>{moment().format('dddd,D MMMM YYYY,h:mm:ss a')}</Typography>

        </Stack>
    </Paper>

    const Widgets=<Stack direction={{xs:"column",sm:"row"}} spacing={"2rem"} justifyContent={"space-between"} alignItems={"center"} margin={"2rem 0"}>
        <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon/>}/>
        <Widget title={"Chats"} value={stats?.totalChatsCount} Icon={<GroupIcon/>}/>
        <Widget title={"Messages"} value={stats?.messageCount} Icon={<MessageIcon/>}/>
    </Stack>
  return (
    <AdminLayout>
        {loading?<Skeleton height={"100vh"}/>:<Container component={"main"}>
            {Appbar}
            <Stack direction={{xs:"column",xl:"row"}} spacing={"2rem"} flexWrap={"wrap"} >
                <Paper elevation={3} sx={{
                    padding:"2rem 3.5rem",
                    borderRadius:"3rem",
                    width:"100%",
                    maxWidth:"40rem",
                    }}>
                    <Typography margin={"2rem 0"} variant='h4' >Last 7-Days Messages</Typography>
                    <LineChart value={stats?.messagesChart ||[]}/>
                </Paper>
                <Paper elevation={3} sx={{
                    padding:"1rem",
                    borderRadius:"1rem",
                    width:{xs:"100%",sm:"50%"},
                    maxWidth:"25rem",
                    position:"relative",
                    alignItems:"center",
                    justifyContent:"center",
                    display:"flex"
                }}>
                    <DoughnutChart labels={["Single Chats","Group Chats"]} value={[stats?.totalChatsCount-stats?.groupCount,stats?.groupCount]}/>

                    <Stack position={"absolute"}
                        direction={"row"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        spacing={"0.5rem"}
                        width={"100%"}
                        height={"100%"}
                    
                    >
                        <GroupIcon/>
                        <Typography >Vs</Typography>
                        <PersonIcon/>

                    </Stack>
                </Paper>
                
            </Stack>
            {Widgets}
        </Container>}
    </AdminLayout>
  )
}

const Widget=({title,value,Icon})=>(
    <Paper sx={{
        padding:"2rem",
        margin:"2rem 0",
        borderRadius:"1.5rem",
        width:"20rem"
    }} elevation={3}>
        <Stack alignItems={"center"} spacing={"1rem"}>
            <Typography sx={{
                borderRadius:"50%",
                color:"rgba(0,0,0,0.7)",
                border:"5px solid rgba(0,0,0,0.9)",
                width:"5rem",
                height:"5rem",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
            }}>{value}</Typography>
            <Stack direction={"row"} spacing={"1rem"}>
                {Icon}
                <Typography>{title}</Typography>
            </Stack>
        </Stack>
    </Paper>
)


export default Dashboard