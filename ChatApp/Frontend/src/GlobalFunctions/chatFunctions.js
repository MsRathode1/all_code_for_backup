

export const isSameSender = (messages, index, currentMessage, userId) => {
    return (
        index < messages.length - 1 && (messages[index + 1].sender._id !== currentMessage.sender._id || messages[index + 1] === undefined) && messages[index].sender._id !== userId
    )
}


export const isLastMessage = (messages, index, userId) => {
    return (
        (index === messages.length - 1 && messages[messages.length - 1].sender._id !== userId) 
    )
}

