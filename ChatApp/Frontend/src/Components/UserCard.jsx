import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserCard = ({ name, profilePic,handelAddSelected,user,chatId }) => {

    return (
        <div><Box onClick={()=>{
            handelAddSelected(user,chatId)
        }} cursor="pointer" boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px" alignItems="center" borderRadius="10px" mt="10px" w="50%" display="flex">
            <Avatar size="md" src={profilePic}></Avatar>
            <Text ml="20px" mt="3px">{name}</Text>
        </Box></div>
    )
}

export default UserCard