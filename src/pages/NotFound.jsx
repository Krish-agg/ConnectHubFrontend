import React from 'react'
import {Error as ErrorIcon} from "@mui/icons-material"
import { Container, Link, Stack, Typography } from '@mui/material'
const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{height:"100vh"}}>
      <Stack alignItems={"center"} spacing={"1rem"} justifyContent={"center"} height={"100%"}>
        <ErrorIcon sx={{fontSize:'8rem'}}/>
        <Typography variant='h1'>404</Typography>
        <Typography variant='h3'>Not Found</Typography>
        <Link href="/">Go Back to Home</Link>
      </Stack>
    </Container>
  )
}

export default NotFound