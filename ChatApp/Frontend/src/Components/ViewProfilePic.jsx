import { Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'


const ViewProfilePic = ({ children, profilePic }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <>
            <span onClick={onOpen}>{children}</span>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bgColor="rgba(255, 255, 255, 0)" boxShadow="none">
                    <ModalBody display="flex" alignItems="center" justifyContent="center">
                        <Image h="290px" alt='' src={profilePic} borderRadius="60%" />
                    </ModalBody>
                </ModalContent>
            </Modal></>
    )
}

export default ViewProfilePic