import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { grayColor } from '../constants/color';


const Home = () => {
  return (
  
    <Box height={"100%"} bgcolor={grayColor}>
      <Typography p={"2rem"} variant='h5' textAlign={"center"}>Select a friend to chat!</Typography>
    </Box>
    
    
  )
}

export default AppLayout()(Home);