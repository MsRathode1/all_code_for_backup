import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../Redux/Slices/UserSlice'


export const Login = () => {
    const [show, setShow] = React.useState(false)
    const navigate = useNavigate()
    const handleClick = () => setShow(!show)
    const [userPassword, setuserPassword] = useState("")
    const [userEmail, setuserEmail] = useState("")
    const toast = useToast()
    const [loading, setloading] = useState(false)
    const dispatch = useDispatch()



    const loginUser = () => {
        setloading(true)
        if (userEmail && userPassword) {
            axios.post("http://localhost:5000/api/user/login", {
                email: userEmail,
                password: userPassword
            }).then((res) => {
                if (res.data.error == null) {
                    setloading(false)
                    toast({
                        title: res.data.message,
                        status: 'success',
                        position: 'top-right',
                        duration: "1000"
                    })
                    navigate("/chats")
                    dispatch(setUserDetails(res.data.data))
                }
            }).catch((err) => {
                setloading(false)
                toast({
                    title: err.response.data.error,
                    status: 'error',
                    position: 'top-right',
                    duration: "1000"
                })
            })
        } else {
            setloading(false)
            toast({
                title: "Please fill all fields!!",
                status: 'info',
                position: 'top-right',
                duration: "1000"
            })
        }

    }

    return (
        <div><VStack spacing="8px">
            <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Email' value={userEmail} onChange={(e) => {
                    setuserEmail(e.target.value)
                }} variant='flushed' type='email'></Input>
            </FormControl>
            <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                    <Input
                        value={userPassword}
                        variant='flushed'
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter password'
                        onChange={(e) => {
                            setuserPassword(e.target.value)
                        }}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button isLoading={loading} onClick={() => {

                loginUser()
            }} colorScheme="blue" mt="15px" w="100%">LogIn</Button>
        </VStack></div>
    )
}
