import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineSend } from "react-icons/ai";
import { BsChatLeftText } from "react-icons/bs";
import { FiUser } from "react-icons/fi";

const ChatComponent = () => {
  

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {

        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) return;

        setConversations([]);
        setSelectedConversation(null);
        setMessages([]);
  
        


        const userId = await getUserIdFromToken(token); // Wydobądź userId z tokena

        const response = await axios.get(
          "http://localhost:8080/conversations/getAllConversations",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const rawConversations = response.data;

          // Dla każdej konwersacji pobierz dane profilu rozmówcy
          const conversationsWithProfiles = await Promise.all(
            rawConversations.map(async (conversation) => {
              const interlocutorId =
                conversation.user1 === userId
                  ? conversation.user2
                  : conversation.user1;
                

              const profileResponse = await axios.get(
                `http://localhost:8080/getProfile?userId=${interlocutorId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const profileData = profileResponse.data;

              return {
                ...conversation,
                interlocutorName: `${profileData.firstName} ${profileData.lastName}`,
              };
            })
          );

          setConversations(conversationsWithProfiles);
        }
      } catch (error) {
        console.error("Błąd podczas pobierania konwersacji:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [localStorage.getItem("token")]);

  const getUserIdFromToken = async (token) => {
    // Zakładamy, że token jest w formacie JWT i userId jest w payload
    const payload = JSON.parse(atob(token.split(".")[1])); // Dekoduj JWT
    return payload.userId; // Wydobądź userId
  };


  const handleConversationSelect = async (conversationId) => {
    setSelectedConversation(conversationId);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:8080/conversations/${conversationId}/getAllMessagesByConversation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const userId = await getUserIdFromToken(token);

        const messages = response.data.map((msg) => ({
          ...msg,
          isSender: msg.sender === userId,
        }));

        setMessages(messages);
      }

    } catch (error) {
      console.error("Błąd podczas pobierania wiadomości:", error);
    } finally {
      setLoading(false);
    }
  };

  // Symulacja wysyłania wiadomości
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "") {
      try {
        const token = localStorage.getItem("token");
        const userId = await getUserIdFromToken(token);
        
        console.log(selectedConversation)

        const getInterlocutorIdFromConversation = (conversationId) => {
          const conversation = conversations.find(
            (conv) => conv.conversationId === conversationId
          );
          if (conversation) {
            return conversation.user1 === userId ? conversation.user2 : conversation.user1;
          }
          return null;
        };

        const receiverId = getInterlocutorIdFromConversation(selectedConversation);
        if (!receiverId) {
          console.error("Nie udało się znaleźć ID rozmówcy.");
          return;
        }


        const messageDTO = {
          content: newMessage,
          receiver: receiverId,
        };

        const response = await axios.post(
          `http://localhost:8080/conversations/${selectedConversation}/sendMessage`,
          messageDTO,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 201) {
          console.log(response.data);
          setNewMessage("");
          handleConversationSelect(selectedConversation); // Odśwież wiadomości po wysłaniu
        }
      } catch (error) {
        console.error("Błąd podczas wysyłania wiadomości:", error);
      }
    }
  };

  return (
    <div className="mt-16 flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">Conversations</h2>
        <ul>
          {conversations.map((conv) => (
            <li
              key={conv.conversationId}
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${
                selectedConversation === conv.conversationId ? "bg-blue-100" : "hover:bg-gray-200"
              }`}
              onClick={() => handleConversationSelect(conv.conversationId)}
            >
              <FiUser className="text-2xl text-gray-600" />
              <span className="text-gray-700 font-medium">
                {conv.interlocutorName || "Unknown User"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat View */}
      <div className="flex-1 flex flex-col bg-white shadow-lg">
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg max-w-xs mb-2 ${
                    msg.isSender
                      ? "ml-auto bg-blue-500 text-white"
                      : "mr-auto bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center p-4 border-t border-gray-200">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <AiOutlineSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <BsChatLeftText className="text-4xl mr-2" />
            <span>Select a conversation to start chatting</span>
          </div>
        )}
      </div>
    </div>
  );

  // return (
  //   <div className="flex h-screen bg-gray-100">
  //     {/* Sidebar */}
  //     <div className="w-1/4 bg-white shadow-lg p-4">
  //       <h2 className="text-xl font-bold mb-4">Conversations</h2>
  //       <ul>
  //         {conversations.map((conv) => (
  //           <li
  //             key={conv.conversationId}
  //             className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer ${
  //               selectedConversation === conv.conversationId ? "bg-blue-100" : "hover:bg-gray-200"
  //             }`}
  //             onClick={() => handleConversationSelect(conv.conversationId)}
  //           >
  //             <FiUser className="text-2xl text-gray-600" />
  //             <span className="text-gray-700 font-medium"> {conv.interlocutorName || "Unknown User"}</span>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>

  //     {/* Chat View */}
  //     <div className="flex-1 flex flex-col bg-white shadow-lg">
  //       {selectedConversation ? (
  //         <>
  //           {/* Messages */}
  //           <div className="flex-1 overflow-y-auto p-4">
  //             {messages.map((msg) => (
  //               <div
  //                 key={msg.id}
  //                 className={`p-3 rounded-lg max-w-xs mb-2 ${
  //                   msg.sender === "me"
  //                     ? "ml-auto bg-blue-500 text-white"
  //                     : "mr-auto bg-gray-200 text-gray-800"
  //                 }`}
  //               >
  //                 {msg.content}
  //               </div>
  //             ))}
  //           </div>

  //           {/* Input */}
  //           <div className="flex items-center p-4 border-t border-gray-200">
  //             <input
  //               type="text"
  //               className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  //               placeholder="Type your message..."
  //               value={newMessage}
  //               onChange={(e) => setNewMessage(e.target.value)}
  //             />
  //             <button
  //               onClick={handleSendMessage}
  //               className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
  //             >
  //               <AiOutlineSend />
  //             </button>
  //           </div>
  //         </>
  //       ) : (
  //         <div className="flex items-center justify-center h-full text-gray-500">
  //           <BsChatLeftText className="text-4xl mr-2" />
  //           <span>Select a conversation to start chatting</span>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default ChatComponent;
