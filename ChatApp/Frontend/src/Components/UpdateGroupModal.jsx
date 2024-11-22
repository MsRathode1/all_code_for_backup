import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import BadgeSelectedUser from './BadgeSelectedUser'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setSelectedChat } from '../Redux/Slices/CurrentState'
import UserCard from './UserCard'
import { RxExit } from "react-icons/rx";
import { IoMdPersonAdd } from "react-icons/io";
import { MdEditSquare } from "react-icons/md";

const UpdateGroupModal = ({ children, setfetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const user = useSelector((store) => store.user.userDetails)
    const toast = useToast()
    const selec = useSelector((store) => store.currentState.selectedChat)
    const [groupName, setgroupName] = useState("")
    const [searchedUserList, setsearchedUserList] = useState([])
    const [selectedUserToGroup, setselectedUserToGroup] = useState([...selec.users])
    const [loading, setloading] = useState(false)
    const requestConfig = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }
    const dispatch = useDispatch()



    const handelSearchUser = (search) => {
        const requestConfig = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        if (search === "") {
            toast({
                title: "Please enter somthing to search!!",
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
            setsearchedUserList([])
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

    const handelAddSelectd = (user, chatId) => {
        if (user) {
            const checkPresent = selectedUserToGroup.find((el) => {
                return el === user
            })
            if (checkPresent === undefined) {
                setselectedUserToGroup([...selectedUserToGroup, user])
            } else {
                toast({
                    title: "User already in group!!",
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right'
                })
            }
            axios.put("http://localhost:5000/api/chats/addToGroup", {
                "chatId": chatId,
                "userId": user._id
            }, requestConfig).then((res) => {
                setfetchAgain(true)
            }).catch((err) => {
                if (err.response.status == 401) {
                };
            })

        }
    }


    const handleRemoveSelectedUser = (id, chatId) => {

        axios.put("http://localhost:5000/api/chats/removeGroup", {
            "chatId": chatId,
            "userId": id
        }, requestConfig).then((res) => {
            setselectedUserToGroup(selectedUserToGroup.filter((el) => {
                return el._id !== id
            }))
            dispatch(setSelectedChat(""))
            setfetchAgain(true)
            onClose()
            setsearchedUserList([])
        }).catch((err) => {
            console.log("err: ", err);
        })
    }

    const handleRemaeGroup = (chatId) => {
        axios.put("http://localhost:5000/api/chats/renameGroup", {
            "userId": chatId,
            "chatName": groupName
        }, requestConfig).then((res) => {
            setfetchAgain(true)
        }).catch((err) => {
            console.log("err: ", err);
        })
    }

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose()
                    selectedUserToGroup([])
                    searchedUserList([])
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display="flex" justifyContent="space-between">{selec.chatName}<Button onClick={() => {
                        handleRemoveSelectedUser(user.id, selec._id)
                    }} leftIcon={<RxExit style={{ fontSize: "20px", color: "red" }} />} color="red" variant="ghost" marginLeft="10px">Leave</Button></ModalHeader>

                    <ModalBody pb={6}>
                        <FormControl display="flex">
                            <Input type="text" onChange={(e) => {
                                setgroupName(e.target.value)
                            }} placeholder='Edit Group name' />
                            <Button onClick={() => {
                                handleRemaeGroup(selec._id)
                            }}><MdEditSquare style={{ fontSize: "25px", color: "hsla(217, 100%, 50%, 1)" }} /></Button>
                        </FormControl>

                        <FormControl display="flex" mt={4}>
                            <Input placeholder='Add user by name' onChange={(e) => {
                                handelSearchUser(e.target.value)
                            }} />
                            <Button><IoMdPersonAdd style={{ fontSize: "25px", color: "hsla(217, 100%, 50%, 1)" }} /></Button>
                        </FormControl>
                        <Box
                            w='auto'
                            height="auto"
                            mt="10px" display="flex" overflowY="auto" >
                            {searchedUserList && selectedUserToGroup.map((el) => {
                                return <BadgeSelectedUser chatId={selec._id} handleRemoveSelectedUser={handleRemoveSelectedUser} id={el._id} name={el.name} profilePic={el.profilePic} />
                            })}
                        </Box>
                        {loading ? <Spinner /> : searchedUserList.map((el) => {
                            return <UserCard chatId={selec._id} selectedUserToGroup={selectedUserToGroup} setselectedUserToGroup={setselectedUserToGroup} handelAddSelected={handelAddSelectd} user={el} profilePic={el.profilePic} name={el.name} />
                        })}
                    </ModalBody>
                </ModalContent>
            </Modal></div>
    )
}

export default UpdateGroupModal