import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'
import { tranformImage } from '../../lib/features'

const AvatarCard = ({avatar=[],max=4}) => {
  return (
    
    <Stack direction={"row"} spacing={0.5}>
        
        <AvatarGroup max={max} sx={{position:"relative"}}>
            <Box width={"5rem"} height={"3rem"}>

            {avatar.map((i,ind)=>(
                
                <Avatar key={ind} src={tranformImage(i)} alt={`Avatar ${ind}`} sx={{
                    width:"3rem",
                    height:"3rem",
                    position:"absolute",
                    left:{
                        xs:`${1+ind}rem`,
                        sm:`${ind}rem`,
                    }
                }}/>
                
            ))}
            </Box>
        </AvatarGroup>

    </Stack>
  )
}

export default AvatarCard