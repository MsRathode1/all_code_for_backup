import { Avatar, Box, Flex, Input, Skeleton, Stack } from '@chakra-ui/react'


const MessaageLoader = () => {
    return (
        <>
            <Flex direction="column" h="100vh">

                {/* Chat messages */}
                <Box flex="1" overflowY="auto" p={4}>
                    {/* Sender's message */}
                    <Flex justify="flex-start" mb={4}>

                        <Box ml={2}>
                            <Skeleton height="20px" width="100px" />
                            <Skeleton height="20px" mt="3px" width="200px" />
                        </Box>
                    </Flex>

                    {/* Receiver's message */}
                    <Flex justify="flex-end" mb={4}>
                        <Box mr={2}>
                            <Skeleton height="20px" width="200px" />
                            <Skeleton height="20px" mt="3px" width="100px" />
                        </Box>
                    </Flex>

                    {/* Another example message */}
                    <Flex justify="flex-start" mb={4}>

                        <Box ml={2}>
                            <Skeleton height="20px" width="100px" />
                            <Skeleton height="20px" mt="3px" width="200px" />
                        </Box>
                    </Flex>
                    <Flex justify="flex-end" mb={4}>
                        <Box mr={2}>
                            <Skeleton height="20px" width="200px" />
                            <Skeleton height="20px" mt="3px" width="100px" />
                        </Box>
                    </Flex>

                    <Flex justify="flex-start" mb={4}>

                        <Box ml={2}>
                            <Skeleton height="20px" width="100px" />
                            <Skeleton height="20px" mt="3px" width="200px" />
                        </Box>
                    </Flex>

                    <Flex justify="flex-end" mb={4}>
                        <Box mr={2}>
                            <Skeleton height="20px" width="200px" />
                            <Skeleton height="20px" mt="3px" width="100px" />
                        </Box>
                    </Flex>

                    <Flex justify="flex-start" mb={4}>

                        <Box ml={2}>
                            <Skeleton height="20px" width="100px" />
                            <Skeleton height="20px" mt="3px" width="200px" />
                        </Box>
                    </Flex>

                    <Flex justify="flex-end" mb={4}>
                        <Box mr={2}>
                            <Skeleton height="20px" width="200px" />
                            <Skeleton height="20px" mt="3px" width="100px" />
                        </Box>
                    </Flex>

                    <Flex justify="flex-start" mb={4}>
                        <Box ml={2}>
                            <Skeleton height="20px" width="100px" />
                            <Skeleton height="20px" mt="3px" width="200px" />
                        </Box>
                    </Flex>
                </Box>
            </Flex>

        </>

    )
}

export default MessaageLoader