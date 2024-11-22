import { Avatar, Button } from '@chakra-ui/react';
import axios, { all } from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import "../style/Chats.css"
import { isLastMessage, isSameSender } from '../GlobalFunctions/chatFunctions';
import { addNotification } from '../Redux/Slices/NotificationSlice';

const MessageContent = ({ socketConnected, socket, Messages, setfetchAgain, fetchChats }) => {
    const [newMessage, setnewMessage] = useState("")
    const user = useSelector((store) => store.user.userDetails)
    const NotificationBox = useSelector((store) => store.notifications.notifications)
    const [isTyping, setisTyping] = useState(false)
    const [Typing, setTyping] = useState(false)
    const [latestNotifications, setlatestNotifications] = useState([])
    const dispatch = useDispatch()
    const [allMessages, setallMessages] = useState(Messages)
    const requestConfig = {
        headers: {
            Authorization: `Bearer ${user.token} `
        }
    }
    const scroll = useRef(null)

    const selec = useSelector((store) => store.currentState.selectedChat)

    useEffect(() => {
        socket.on("message recieved", (newMessage) => {
            if (selec === "" || selec._id !== newMessage.chat._id) {
                setlatestNotifications([...latestNotifications, newMessage.chat
                ])
            } else {
                setallMessages([...allMessages, newMessage])
                fetchChats()
            }
        })
    })

    useEffect(() => {
        scrollToBottom()
    },)

    useEffect(() => {
        if (latestNotifications.length !== 0) {
            dispatch(addNotification(latestNotifications))
            fetchChats()
        } else {
            fetchChats()
        }

    }, [latestNotifications, setlatestNotifications])

    useEffect(() => {
        socket.on("typing", () => {
            setisTyping(true)
        })
        socket.on("stop typing", () => {
            setisTyping(false)
        })
    },)

    useEffect(() => {
        if (selec !== "") {
            fetchMessages(selec._id)
        }
    }, [setfetchAgain, selec])


    const handelTyping = (e) => {
        setnewMessage(e.target.value)
        if (!socketConnected) return

        if (!Typing) {
            setTyping(true)
            socket.emit("typing", selec._id)
        }

        const lastTypeTime = new Date().getTime()
        const timmer = 3000
        setTimeout(() => {
            const timeNow = new Date().getTime()
            const differTime = timeNow - lastTypeTime
            if (differTime >= timmer && Typing) {
                socket.emit("stop typing", selec._id)
                setTyping(false)
            }
        }, timmer);

    }



    const fetchMessages = (chatId) => {
        axios.get(`http://localhost:5000/api/userMessage/fetchSingle/${chatId}`, requestConfig).then((res) => {
            setallMessages(res.data.data)
            fetchChats()
        }).catch((err) => {
            console.log("err: ", err);
        })
    }

    const handelSendMessage = (chatId, message) => {
        socket.emit("stop typing", selec._id)
        axios.post("http://localhost:5000/api/userMessage/sendMessage", {
            "chatId": chatId,
            "content": message
        }, requestConfig).then((res) => {
            socket.emit("new message", res.data.data)
        }).catch((err) => {
            console.log("err: ", err);
        })
    }


    function scrollToBottom() {
        if (scroll) {
            scroll.current.scrollTop = scroll.current.scrollHeight
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", border: "0px solid red", borderRadius: "15px" }}>
            <div ref={scroll} id='message_box' style={{ height: "83%", overflowY: "scroll", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", width: "95%", margin: "auto", border: "0px solid red", height: "fit-content", minHeight: "90%", justifyContent: "flex-end" }}>
                    {allMessages && allMessages.map((el, i) => {
                        console.log("el: ", selec);
                        return <div style={{ border: "0px solid red", display: "flex", justifyContent: el.sender._id === user.id ? "flex-end" : "flex-start" }}>
                            {isSameSender(allMessages, i, el, user.id) || isLastMessage(allMessages, i, user.id) ? <Avatar style={{ marginTop: "5px" }}
                                src={selec.groupChat === false ? selec.users.filter((el) => {
                                    return el._id !== user.id
                                })[0].profilePic : el.sender.profilePic} size='sm' /> : <></>}
                            <div style={{ backgroundColor: el.sender._id !== user.id ? "#318ce7" : "#00cccc", borderRadius: "20px", maxWidth: "40%", fontWeight: "500", color: "white", width: "fit-content", border: "0px solid blue", padding: "6px", marginLeft: isSameSender(allMessages, i, el, user.id) || isLastMessage(allMessages, i, user.id) === true ? "3px" : "33px", marginTop: "5px", textAlign: "start" }}>
                                <span style={{ border: "0px solid red", margin: '7px' }}>{el.content}</span>
                            </div>
                        </div>
                    })}

                </div>
            </div>
            <div style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", width: "96%", borderRadius: "5px", display: "flex", justifyContent: "space-between", border: "0px solid red", backgroundColor: "#21abcd", margin: "auto" }}>
                <input value={newMessage} onChange={(e) => {
                    handelTyping(e)
                }} id='chat_message_input' placeholder='Type message...' style={{ outline: "none", padding: "10px", borderRadius: "15px", backgroundColor: "#21abcd", width: "90%", minHight: "100%", color: 'white', height: "auto", fontWeight: "400" }} />
                {
                    newMessage !== "" ? <Button onClick={() => {
                        handelSendMessage(selec._id, newMessage)
                        fetchMessages(selec._id)
                        setnewMessage("")
                    }} style={{ borderRadius: "50%", height: "40px", backgroundColor: "#21abcd", marginRight: "5px" }}><IoSend style={{ fontSize: "20px", margin: "auto", color: "white" }} /></Button> : <></>
                }
            </div>
        </div >
    )
}

export default MessageContent