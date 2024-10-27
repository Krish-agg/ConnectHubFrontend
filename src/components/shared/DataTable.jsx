import { Container, Paper, Typography } from '@mui/material'
import React, { useState } from 'react'
import {DataGrid} from "@mui/x-data-grid"

const DataTable = ({rows,columns,heading,rowHeight=50}) => {
    const [pageSize,setPageSize]=useState(5);
  return (
    <Container sx={{
        height:"100vh",
    }}>
        <Paper elevation={3} sx={{
            padding:"1rem 4rem",
            borderRadius:"1rem",
            margin:"auto",
            width:"100%",
            overflow:"hidden",
            height:"100%",
            boxShadow:"none"
        }}>
            <Typography textAlign={"center"} variant='h4' sx={{
                margin:"2rem",
                textTransform:"uppercase",
            }}>{heading}</Typography>
            <DataGrid rows={rows} columns={columns}
            rowHeight={rowHeight} style={{
                height:"80%",
            }} sx={{
                border:"none",
                ".table-header":{
                    bgcolor:"black",
                    color:"white",
                }
            }} pageSizeOptions={[5,10,20]}
            
            initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }} />
        </Paper>

    </Container>
  )
}

export default DataTable