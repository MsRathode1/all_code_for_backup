import { Avatar, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react'
import React from 'react'

const BadgeSelectedUser = ({ name, profilePic, handleRemoveSelectedUser, id,chatId }) => {
    return (
        <Tag m="5px" size='sm' colorScheme='blue' borderRadius='full'>
            <Avatar
                src={profilePic}
                size='xs'
                name={name}
                ml={-1}
                mr={2}
            />
            <TagLabel>{name}</TagLabel>
            <TagCloseButton onClick={() => {
                handleRemoveSelectedUser(id,chatId)
            }} />
        </Tag>
    )
}

export default BadgeSelectedUser