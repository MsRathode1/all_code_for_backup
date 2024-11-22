import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const CardLoader = () => {
    return (
        <div><Stack>
            <Skeleton height='50px' mt="15px" />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
            <Skeleton height='50px' />
        </Stack></div>
    )
}

export default CardLoader