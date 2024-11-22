import { Avatar, Box, HStack, Image } from '@chakra-ui/react'
import "../style/Chats.css"
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedChat } from '../Redux/Slices/CurrentState'
import ViewProfilePic from './ViewProfilePic'


const ChatCard = ({ socket, fetchMessages, chatUser, chatName, currentChat, setselectedChat, selectChat }) => {
    const dispatch = useDispatch()
    const selec = useSelector((store) => store.currentState.selectedChat)
    return (
        <HStack cursor="pointer" bgColor={selectChat === currentChat || currentChat._id === selec._id ? 'hsla(217, 90%, 50%, 0.8)' : "blue.100"} color={selectChat === currentChat || currentChat._id === selec._id ? 'white' : "black"} borderRadius="15px" border="0px" mt="10px" w="95%" minH="70px" borderColor="orange">
            <Box ml="2%">
                <ViewProfilePic profilePic={currentChat.isGroupChat === false ? chatUser?.profilePic : ""}><Avatar name={currentChat.isGroupChat === true ? chatName : chatUser.name} ml="2%" mr="2%" src={currentChat.isGroupChat === false ? chatUser?.profilePic : ""} /></ViewProfilePic>
            </Box>
            <Box onClick={() => {
                setselectedChat(currentChat)
                socket.emit("join chat", currentChat._id)
                dispatch(setSelectedChat(currentChat))
                fetchMessages(currentChat._id)
            }} display="flex" flexDirection="column" w="82%" border="0px" borderColor="blue" h="70%">
                <Box display="flex" justifyContent="space-between"><text style={{ fontWeight: "bolder", }}>{currentChat.isGroupChat === true ? chatName : chatUser.name}</text> <text style={{ marginRight: "3%", fontWeight: "400" }}></text></Box>
                <Box display="flex" justifyContent="space-between"><text style={{ textOverflow: "ellipsis", }}>{currentChat.latestMessage?.content === undefined ? "last message" : currentChat.latestMessage.content} </text></Box>
            </Box>
        </HStack>
    )
}

export default ChatCard