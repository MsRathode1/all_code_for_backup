import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import BadgeSelectedUser from './BadgeSelectedUser'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setUpdateChatState } from '../Redux/Slices/CurrentState'
import UserCard from './UserCard'


const CreateGroupModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const user = useSelector((store) => store.user.userDetails)
    const toast = useToast()
    const [groupName, setgroupName] = useState("")
    const [searchedUserList, setsearchedUserList] = useState([])
    const [selectedUserToGroup, setselectedUserToGroup] = useState([])
    const [loading, setloading] = useState(false)
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

    const handelAddSelectd = (user) => {
        if (user) {
            const checkPresent = selectedUserToGroup.find((el) => {
                return el === user
            })
            if (checkPresent === undefined) {
                setselectedUserToGroup([...selectedUserToGroup, user])
            }else{
                toast({
                    title: "User already in group!!",
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right'
                })
            }
        }
    }

    const createGroup = (name, userAry) => {
        console.log("userAry: ", userAry);
        console.log("name: ", name);
        const requestConfig = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        }
        axios.post("http://localhost:5000/api/chats/createGroup", {
            "name": name,
            "users": JSON.stringify(userAry)
        }, requestConfig).then((res) => {
            dispatch(setUpdateChatState(res.data))
        }).catch((err) => {
            toast({
                title: err.response.data.error,
                status: 'error',
                duration: 2000,
                isClosable: true,
                position: 'top-right'
            })
        })
    }

    const handleRemoveSelectedUser = (id) => {
        setselectedUserToGroup(selectedUserToGroup.filter((el) => {
            return el._id !== id
        }))
    }

    return (
        <div>
            <span onClick={onOpen}>{children}</span>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setsearchedUserList([])
                    onClose()
                    setselectedUserToGroup([])
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your Group</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input type="text" onChange={(e) => {
                                setgroupName(e.target.value)
                            }} placeholder='Group name' />
                        </FormControl>

                        <FormControl mt={4}>
                            <Input placeholder='Add user by name' onChange={(e) => {
                                handelSearchUser(e.target.value)
                            }} />
                        </FormControl>
                        <Box
                            mt="10px" display="flex" justifyContent="space-evenly">
                            {searchedUserList && selectedUserToGroup.map((el) => {
                                return <BadgeSelectedUser handleRemoveSelectedUser={handleRemoveSelectedUser} id={el._id} name={el.name} profilePic={el.profilePic} />
                            })}
                        </Box>
                        {loading ? <Spinner /> : searchedUserList.map((el) => {
                            return <UserCard selectedUserToGroup={selectedUserToGroup} setselectedUserToGroup={setselectedUserToGroup} handelAddSelected={handelAddSelectd} user={el} profilePic={el.profilePic} name={el.name} />
                        })}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => {
                            createGroup(groupName, selectedUserToGroup)
                        }} colorScheme='blue' mr={3}>
                            Create Group
                        </Button>
                        <Button onClick={() => {
                            setsearchedUserList([])
                            onClose()
                            setselectedUserToGroup([])
                        }}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal></div >
    )
}

export default CreateGroupModal