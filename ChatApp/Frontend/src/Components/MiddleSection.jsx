import { Avatar, AvatarGroup, Box, Button, Card, CardBody, CardFooter, HStack, Heading, Image, Spinner, Stack, Text, Tooltip, VStack } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import ChatCard from './ChatCard'
import { MdGroupAdd } from "react-icons/md";
import "../style/Chats.css"
import { useDispatch, useSelector } from 'react-redux'
import ChatLoader from './ChatLoader';
import MessaageLoader from './MessaageLoader';
import CreateGroupModal from './CreateGroupModal';
import axios from "axios"
import { setChatState } from '../Redux/Slices/CurrentState';
import { PiChatsBold } from "react-icons/pi";
import { HiOutlineChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import UpdateGroupModal from './UpdateGroupModal';
import { io } from "socket.io-client"
import MessageContent from './MessageContent';
import ViewProfilePic from './ViewProfilePic';


const MiddleSection = () => {
    const chats = useSelector((store) => store.currentState.chat)
    const user = useSelector((store) => store.user.userDetails)
    const selec = useSelector((store) => store.currentState.selectedChat)
    const dispatch = useDispatch()
    const [socketConnected, setsocketConnected] = useState(false)
    const ENDPOINT = "http://localhost:5000"
    const [Messages, setMessages] = useState([])
    const [fetchAgain, setfetchAgain] = useState(false)
    const socket = io(ENDPOINT);
    const [messageLoading, setmessageLoading] = useState(false)

    const requestConfig = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    const [selectChat, setselectedChat] = useState(false)


    useEffect(() => {
        socket.emit("setup", user)
        socket.on("connected", () => {
            setsocketConnected(true)
        })
    })



    useEffect(() => {
        socket.on("message recieved", () => {
            if (selec === "") {
                fetchChats()
            }
        })
        fetchChats()
    }, [fetchAgain === true, setfetchAgain])




    const fetchChats = () => {
        axios.get("http://localhost:5000/api/chats/fetchChats", requestConfig).then((res) => {
            dispatch(setChatState(res.data.data))
        }).catch((err) => {
            console.log("err: ", err);
        })
    }



    const fetchMessages = (chatId) => {
        setmessageLoading(true)
        axios.get(`http://localhost:5000/api/userMessage/fetchSingle/${chatId}`, requestConfig).then((res) => {
            setMessages(res.data.data)
            setmessageLoading(false)

        }).catch((err) => {
            setmessageLoading(false)
            console.log("err: ", err);
        })

    }


    return <Box overflow="hidden" display="flex" border="0px" mt="1%" borderColor="red" h="90vh" >
        <VStack id='chat_row' overflowY="scroll" bgColor="white" m="10px" border="0px" borderRadius="10px" h="97%" w="25%" >
            <Box display="flex" justifyContent="space-between" w="100%" >
                <text style={{ fontWeight: "bold", color: 'hsla(217, 90%, 50%, 2)', fontSize: "26px", padding: "7px" }}>
                    Chats
                </text>
                <Tooltip label="Add Group" bg='white' rounded="5px" placement='bottom-end' color='blue.400' hasArrow>
                    <CreateGroupModal> <Button variant="host"><MdGroupAdd style={{ color: 'hsla(217, 90%, 50%, 0.8)', fontSize: "25px" }} /></Button></CreateGroupModal>
                </Tooltip>
            </Box>
            {
                chats ? (chats.map((el) => {
                    const chatUser = el.users.filter((el) => {
                        return el._id !== user.id
                    })
                    return <ChatCard socket={socket} fetchMessages={fetchMessages} setselectedChat={setselectedChat} selectChat={selectChat} currentChat={el} chatName={el.chatName} chatUser={chatUser[0]} />
                })) : <ChatLoader />

            }
        </VStack>
        <Box display={{ base: "none", md: "block" }} w="72%" h="97%" m="10px" borderRadius="10px" bgColor="white">
            {
                selec ? <>
                    <Box display="flex" justifyContent="space-between" alignItems="center" margin="auto" height="50px" w="95%">
                        <Text fontSize='2xl' p="5px">{selec.isGroupChat === false ? selec.users.filter((el) => {
                            return el._id !== user.id
                        })[0].name : selec.chatName}</Text>
                        {selec.isGroupChat === false ? <ViewProfilePic profilePic={selec.users.filter((el) => {
                            return el._id !== user.id
                        })[0].profilePic}> <Avatar size="sm" cursor="pointer" src={selec.users.filter((el) => {
                            return el._id !== user.id
                        })[0].profilePic} /></ViewProfilePic> :
                            <UpdateGroupModal setfetchAgain={setfetchAgain} fetchAgain={fetchAgain} >
                                <AvatarGroup size='sm' max={2}>
                                    {selec.users.map((el) => {
                                        return <Avatar key={el._id} cursor="pointer" src={el.profilePic} />
                                    })}
                                </AvatarGroup>
                            </UpdateGroupModal>}
                    </Box>
                    <Box borderRadius="10px" bgColor='blue.50' margin="auto" w="95%" height="90%" >
                        {messageLoading === false ? <MessageContent socketConnected={socketConnected} setMessages={setMessages} socket={socket} fetchChats={fetchChats} setfetchAgain={setfetchAgain} Messages={Messages} /> : <MessaageLoader />}
                    </Box>
                </> : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                    <div style={{ border: "0px solid red", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: 'center' }}><PiChatsBold style={{ fontSize: "100px", color: "hsla(217, 100%, 50%, 1)" }} />
                        <span style={{ display: "flex", fontSize: "18px", marginTop: "10px" }}>Start Chating with your loved once...<HiOutlineChatBubbleOvalLeftEllipsis /></span>
                    </div>
                </div>
            }
        </Box>
    </Box >

}

export default MiddleSection