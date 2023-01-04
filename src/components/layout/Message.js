import { useState, useEffect } from 'react';
import styles from './Message.module.css';

function Message({type, message, execAfterMessage}) {
    const [visible, setVisible] = useState(false);

    useEffect(()=>{

        if(!message){
            setVisible(false)
            return
        }

        setVisible(true)

        const timer = setTimeout(()=>{
            setVisible(false)
            execAfterMessage()
        }, 3000)

        return () => {
            clearTimeout(timer)
        };

    }, [message, execAfterMessage])

    return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>{message}</div>
            )}
        </>) 
}

export default Message;
