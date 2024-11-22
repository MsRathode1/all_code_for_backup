import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useToast } from '@chakra-ui/react'

export const SignUp = () => {
    const [show, setShow] = React.useState(false)
    const handleClick = () => setShow(!show)
    const [userName, setuserName] = useState("")
    const [userPassword, setuserPassword] = useState("")
    const [userEmail, setuserEmail] = useState("")
    const [loading, setloading] = useState(false)
    const [useProfilePic, setProfilePic] = useState("")
    const toast = useToast()
    const [userConfirmPassword, setuserConfirmPassword] = useState("")

    const sigupUser = () => {
        setloading(true)
        const data = {
            "name": userName,
            "email": userEmail,
            "password": userPassword,
        }
        if (useProfilePic !== "") {
            data.profilePic = useProfilePic
        }
        if (userEmail && userName && userPassword && userConfirmPassword) {
            axios.post('http://localhost:5000/api/user/SignUp', data).then((res) => {
                if (res.data.data.error == null) {
                    setloading(false)
                    toast({
                        title: 'Account created successfuly.',
                        status: 'success',
                        position: 'top-right',
                        duration: 1000,
                    })
                }
            }).catch((err) => {
                setloading(false)
                toast({
                    title: err.response.data.error,
                    status: 'error',
                    position: 'top-right',
                })
            })
        } else {
            setloading(false)
            toast({
                title: 'Please fill all fields!!',
                status: 'info',
                position: 'top-right',
            })
        }
    }

    const uploadProfilePic = (pic) => {
        setloading(true)
        if (pic === undefined) {
            toast({
                title: 'No image found!',
                status: 'error',
                position: 'top-right',
            })
            return
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData()
            data.append('file', pic)
            data.append('upload_preset', 'chat_app')
            data.append("cloud_name", "dbddnm6v1")
            axios.post("https://api.cloudinary.com/v1_1/dbddnm6v1/image/upload", data).then((res) => {
                setProfilePic(res.data.url);
                setloading(false)
            }).catch((err) => {
                console.log("err: ", err);
            })
        }

    }

    return (
        <div>
            <VStack spacing="8px">
                <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder='Enter Name' value={userName} onChange={(e) => {
                        setuserName(e.target.value)
                    }} variant='flushed'></Input>
                </FormControl>
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
                <FormControl isInvalid={(userConfirmPassword !== userPassword && userConfirmPassword !== "")} isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup size='md'>
                        <Input
                            value={userConfirmPassword}
                            variant='flushed'
                            pr='4.5rem'
                            type="password"
                            placeholder='Enter password'
                            onChange={(e) => {
                                setuserConfirmPassword(e.target.value)
                            }}
                        />

                    </InputGroup>
                    <FormErrorMessage>"Not Matched !!"</FormErrorMessage>
                </FormControl>
                <FormControl>
                    <FormLabel>Profile Picture</FormLabel>
                    <Input p='0px' onChange={(e) => {
                        uploadProfilePic(e.target.files[0])
                    }} type='file' accept="image/*"></Input>
                </FormControl>
                <Button isLoading={loading} colorScheme="blue" mt="15px" w="100%" onClick={() => {
                    sigupUser()
                }}>SignUp</Button>
            </VStack>
        </div>
    )
}
