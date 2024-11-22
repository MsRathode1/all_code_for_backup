import React from 'react'
import '../style/Entry.css'
import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react"
import { SignUp } from '../Components/SignUp'
import { Login } from '../Components/Login'


export const Entry = () => {
  return (
    <div className='Entry'>
      <Container maxW="xl" border='0px' p="0px" borderColor="red" centerContent>
        <Box bg="white" display="flex" justifyContent="center" alignItems="center" centerContent h="50px" w="100%" mt="30px" border="0px" borderColor="green" borderRadius="9px" boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px;">
          <Text color="grey" fontSize='3xl' >Chat App</Text>
        </Box>
        <Box boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px;" p="10px" borderRadius="9px" mt="30px" minH="300px" h="auto" w="100%" bg="white" border="0px" borderColor="red">
          <Tabs isFitted variant='soft-rounded'>
            <TabList mb='1em'>
              <Tab>SignUp</Tab>
              <Tab>LogIn</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SignUp />
              </TabPanel>
              <TabPanel>
                <Login />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

      </Container>
    </div>
  )
}
