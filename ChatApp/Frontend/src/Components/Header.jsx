import React, { useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, HStack, IconButton, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react"
import { GoSearch } from "react-icons/go";
import { FaBell, FaChevronDown } from "react-icons/fa";
import { ProfileModal } from './ProfileModal';
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import CardLoader from './CardLoader';
import Card from './Card';
import { addNotification, clearNotification, removeNotification } from '../Redux/Slices/NotificationSlice';
import { setUpdateChatState, setChatState, setSelectedChat } from '../Redux/Slices/CurrentState';


export const Header = () => {
    const user = useSelector((store) => store.user.userDetails)
    const NotificationBox = useSelector((store) => store.notifications.notifications)
    const chats = useSelector((store) => store.currentState.chat)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [currentSearch, setCurrentSearch] = useState("")
    const [searchedUserList, setsearchedUserList] = useState([])
    const toast = useToast()
    const requestConfig = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    const { isOpen, onOpen, onClose } = useDisclosure()



    const LogoutUser = () => {

        try {
            dispatch(setSelectedChat(""))
            dispatch(setChatState(""))
            dispatch(clearNotification())
            localStorage.removeItem('reduxState')
            navigate("/")
            toast({
                title: "Logout Successfuly!!",
                status: 'success',
                position: 'top-right',
                duration: 1000,
            })

        } catch (error) {
            console.log("error: ", error);
        }
    }

    const handelSearchUser = (search) => {
        if (search === "") {
            toast({
                title: "Please enter somthing to search!!",
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        } else {
            try {
                setloading(true)
                axios.get(`http://localhost:5000/api/user/searchUser?search=${search}`, requestConfig).then((res) => {
                    if (res.status === 200) {
                        setsearchedUserList(res.data.data.filter((el) => {
                            return el._id !== user.id
                        }))
                        setloading(false)
                    } else {
                        toast({
                            title: 'No user found',
                            status: 'info',
                            duration: 1000,
                            isClosable: true,
                            position: 'top-right'
                        })
                        setloading(false)
                    }
                }).catch((err) => {
                    toast({
                        title: err.response.data.error,
                        status: 'error',
                        duration: 1000,
                        isClosable: true,
                    })
                })
            } catch (error) {

                setloading(false)
                console.log("error: ", error);
            }
        }

    }

    const accessChat = (id) => {
        try {
            axios.post("http://localhost:5000/api/chats", {
                "userId": id
            }, requestConfig).then((res) => {
                if (!chats.find(el => el._id === res.data.data._id)) {
                    dispatch(setUpdateChatState(res.data.data))
                }
                onClose()
            }).catch((err) => {
                toast({
                    title: err.response.data.error,
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                })
            })
        } catch (error) {
            console.log("error: ", error);
        }
    }




    return (
        <>
            <Box borderRadius="9px" boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px;" borderWidth="5px" display="flex" alignItems="center" w='100%' border='0px' borderColor="red" h="auto" minH="50px" bg="white" justifyContent="space-between" >
                <Tooltip bg='white' rounded="5px" placement='bottom-end' color='blue.400' label="Search users to chat" hasArrow>
                    <Button onClick={onOpen} ml="1%" variant='ghost' leftIcon={<GoSearch style={{ color: "blue" }} />}>
                        <Text color='blue.400' display={{ base: "none", sm: "none", md: "flex" }} >
                            Search Users
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="x-large">Chat App</Text>
                <div style={{ marginRight: "1%", display: "flex" }}>
                    <Menu>
                        <MenuButton marginRight={"2%"} p="5px">
                            <FaBell style={{ fontSize: "23px", color: "#0BC5EA", }} />
                        </MenuButton>
                        <MenuList>
                            {
                                NotificationBox.lenght !== 0 && NotificationBox.map((el) => {
                                    return <MenuItem onClick={() => {
                                        dispatch(setSelectedChat(el))
                                        dispatch(removeNotification(el))
                                    }}>{
                                            el.isGroupChat === false ? "Message from" + " " + el.users.filter((ele) => {
                                                return ele._id !== user.id
                                            })[0].name : "Message in" + " " + el.chatName
                                        }</MenuItem>
                                })
                            }
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton p="5px" as={Button} >
                            <Avatar size='sm' name={user.name} cursor="pointer" src={user.profilePic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={() => {
                                LogoutUser()
                            }} color="red.400" >Log Out</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            // finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader>Search users..</DrawerHeader>
                    <DrawerBody>
                        <HStack><Input onChange={(e) => {
                            setCurrentSearch(e.target.value)
                        }} placeholder='Search by name and email...' />
                            <Button onClick={() => {
                                handelSearchUser(currentSearch)
                            }} ml="15px"><GoSearch style={{ color: "blue" }} /></Button>
                        </HStack>

                        {
                            loading ? <CardLoader /> : (
                                searchedUserList && searchedUserList.map((el) => {
                                    return <Card accessChat={accessChat} profilePic={el.profilePic} name={el.name} id={el._id} email={el.email} />
                                })
                            )
                        }

                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
