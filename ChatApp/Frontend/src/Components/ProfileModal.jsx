import { Avatar, Button, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

export const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : <Avatar size='sm' name='Kent Dodds' cursor="pointer" src='https://bit.ly/kent-c-dodds' />}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>My Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" alignItems="center" justifyContent="center">
            <Image h="290px" alt='' src={user.profilePic} borderRadius="50%" />
          </ModalBody>

          <ModalFooter display="flex" alignItems="center" justifyContent="center" flexDirection="column">
            <Text fontWeight="bold" fontSize="18px">{user.name}</Text>
            <Text>{user.email}</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
