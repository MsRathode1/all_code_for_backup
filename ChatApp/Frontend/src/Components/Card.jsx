import { Avatar, Badge, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

const Card = ({ profilePic, email, name, accessChat, id }) => {
    return (
        <>
            <Box onClick={() => {
                accessChat(id)
            }} boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;" borderRadius="10px">
                <Flex mt="8%" p="8px"  >
                    <Avatar size='lg' src={profilePic} />
                    <Box ml='3'>
                        <Text fontWeight='bold'>
                            {name}
                        </Text>
                        <Text fontSize='sm'>{email}</Text>
                    </Box>
                </Flex>
            </Box>
        </>
    )
}

export default Card