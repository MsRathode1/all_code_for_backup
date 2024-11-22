import React, { useEffect, useState } from 'react'
import "../style/Chats.css"
import { Header } from '../Components/Header'
import MiddleSection from '../Components/MiddleSection'



export const Chats = () => {
    const [disableBackButtonState, setDisableBackButton] = useState(false);


    useEffect(() => {
        const disableBackButton = (event) => {
            event.preventDefault();
            return false;
        };

        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', disableBackButton);

        if (disableBackButtonState === true) {
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        }
        setDisableBackButton(true)

        return () => {
            window.removeEventListener('popstate', disableBackButton);
            // clearTimeout(timed)
        };

    }, [setDisableBackButton])

    return (
        <div className='chats_page'>
            <Header />
            <MiddleSection />
        </div>
    )
}
