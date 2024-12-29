import { useEffect, useState } from 'react';

const ChatComponent = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const ws = new WebSocket(`ws://localhost:8080/ws?token=${token}`);
        
        ws.onopen = () => console.log('Połączenie WebSocket otwarte');
        
        ws.onmessage = (event) => {
            console.log('Otrzymano wiadomość: ', event.data);
            setMessages((prev) => [...prev, event.data]);
        };
        
        ws.onerror = (error) => console.error('Błąd WebSocket: ', error);
        
        ws.onclose = () => console.log('Połączenie WebSocket zamknięte');
        
        setSocket(ws);

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
            <button onClick={() => sendMessage('Hello WebSocket!')}>
                Wyślij wiadomość
            </button>
        </div>
    );
};

export default ChatComponent;
