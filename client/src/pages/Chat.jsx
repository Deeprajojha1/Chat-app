/**
 * FILE PURPOSE
 * ----------------------------
 * Provides the main chat experience.
 *
 * RESPONSIBILITY
 * ----------------------------
 * Load users/chats/messages and coordinate REST plus Socket.IO events.
 *
 * USED BY
 * ----------------------------
 * App.jsx
 *
 * REQUEST FLOW
 * ----------------------------
 * User selects chat -> REST loads history -> Socket joins room -> messages stream live.
 *
 * INTERVIEW NOTES
 * ----------------------------
 * Real-time apps usually combine HTTP persistence with socket delivery.
 */
import { useEffect, useMemo, useState } from "react";
import { getApiError } from "../api/axios";
import { ChatBox } from "../components/ChatBox";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { SOCKET_EVENTS, useSocket } from "../context/SocketContext";
import { chatService } from "../services/chatService";
import { userService } from "../services/userService";

export const Chat = () => {
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [error, setError] = useState("");

  const selectedReceiver = useMemo(() => {
    if (selectedChat?.isGroupChat) return null;
    return selectedChat?.participants?.find((participant) => participant._id !== user._id);
  }, [selectedChat, user._id]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [usersResponse, chatsResponse] = await Promise.all([userService.list(), chatService.list()]);
        setUsers(usersResponse.data.data.users);
        setChats(chatsResponse.data.data.chats);
      } catch (err) {
        setError(getApiError(err));
      }
    };

    loadInitialData();
  }, []);

  // Join group chat rooms when socket connects
  useEffect(() => {
    if (!socket || chats.length === 0) return;
    
    chats.forEach((chat) => {
      if (chat.isGroupChat) {
        socket.emit(SOCKET_EVENTS.JOIN_CHAT, chat._id);
      }
    });
  }, [socket, chats]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const response = await userService.list(search);
        setUsers(response.data.data.users);
      } catch (err) {
        setError(getApiError(err));
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleMessage = (payload) => {
      const message = payload.message || payload;
      const incomingChat = payload.chat;
      const incomingChatId = message.chat?._id || message.chat || incomingChat?._id;

      if (incomingChat?._id) {
        setChats((current) => {
          const existing = current.find((chat) => chat._id === incomingChat._id);
          const updatedChat = { ...(existing || incomingChat), lastMessage: message };
          return [updatedChat, ...current.filter((chat) => chat._id !== incomingChat._id)];
        });
      } else {
        setChats((current) =>
          current.map((chat) => (chat._id === incomingChatId ? { ...chat, lastMessage: message } : chat))
        );
      }

      if (incomingChatId === selectedChat?._id) {
        setMessages((current) => (current.some((item) => item._id === message._id) ? current : [...current, message]));
      }
    };

    const handleGroupCreated = (chat) => {
      setChats((current) => (current.some((item) => item._id === chat._id) ? current : [chat, ...current]));
      socket.emit(SOCKET_EVENTS.JOIN_CHAT, chat._id);
    };

    const handleGroupDeleted = ({ chatId }) => {
      setChats((current) => current.filter((item) => item._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    };

    const handleTyping = ({ chatId, user: typing }) => {
      if (chatId === selectedChat?._id) setTypingUser(typing);
    };

    const handleStopTyping = ({ chatId }) => {
      if (chatId === selectedChat?._id) setTypingUser(null);
    };

    socket.on(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessage);
    socket.on(SOCKET_EVENTS.GROUP_CREATED, handleGroupCreated);
    socket.on(SOCKET_EVENTS.GROUP_DELETED, handleGroupDeleted);
    socket.on(SOCKET_EVENTS.TYPING, handleTyping);
    socket.on(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_RECEIVED, handleMessage);
      socket.off(SOCKET_EVENTS.GROUP_CREATED, handleGroupCreated);
      socket.off(SOCKET_EVENTS.GROUP_DELETED, handleGroupDeleted);
      socket.off(SOCKET_EVENTS.TYPING, handleTyping);
      socket.off(SOCKET_EVENTS.STOP_TYPING, handleStopTyping);
    };
  }, [socket, selectedChat?._id]);

  const openChat = async (chat) => {
    setSelectedChat(chat);
    socket?.emit(SOCKET_EVENTS.JOIN_CHAT, chat._id);
    const response = await chatService.messages(chat._id);
    setMessages(response.data.data.messages);
    await chatService.markSeen(chat._id);
    socket?.emit(SOCKET_EVENTS.SEEN, { chatId: chat._id, userId: user._id });
  };

  const startChatWithUser = async (participant) => {
    try {
      const response = await chatService.access(participant._id);
      const chat = response.data.data.chat;
      setChats((current) => (current.some((item) => item._id === chat._id) ? current : [chat, ...current]));
      await openChat(chat);
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const createGroupChat = async ({ name, participantIds }) => {
    try {
      const response = await chatService.createGroup({ name, participantIds });
      const chat = response.data.data.chat;
      setChats((current) => [chat, ...current.filter((item) => item._id !== chat._id)]);
      socket?.emit(SOCKET_EVENTS.GROUP_CREATED, chat);
      await openChat(chat);
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const deleteGroupChat = async (chat) => {
    if (!confirm(`Are you sure you want to delete the group "${chat.chatName}"?`)) return;
    
    try {
      await chatService.deleteGroup(chat._id);
      setChats((current) => current.filter((item) => item._id !== chat._id));
      setSelectedChat(null);
      setMessages([]);
      
      // Notify other participants that the group is deleted
      if (socket && chat.participants) {
        chat.participants.forEach((participant) => {
          const participantId = String(participant._id || participant);
          if (participantId !== user._id) {
            socket.emit(SOCKET_EVENTS.GROUP_DELETED, { chatId: chat._id, participantId });
          }
        });
      }
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const handleDraftChange = (value) => {
    setDraft(value);
    if (!selectedChat || !socket) return;

    socket.emit(value ? SOCKET_EVENTS.TYPING : SOCKET_EVENTS.STOP_TYPING, {
      chatId: selectedChat._id,
      user,
    });
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !selectedChat) return;
    if (!selectedChat.isGroupChat && !selectedReceiver) return;

    try {
      const response = await chatService.send({
        chatId: selectedChat._id,
        receiverId: selectedReceiver?._id,
        content: draft,
      });
      const message = response.data.data.message;
      setMessages((current) => [...current, message]);
      setDraft("");
      socket?.emit(SOCKET_EVENTS.STOP_TYPING, { chatId: selectedChat._id, user });
      
      // Ensure sender information is included in the message sent via socket
      const messageWithSender = {
        ...message,
        sender: message.sender || { _id: user._id, name: user.name, email: user.email, avatar: user.avatar }
      };
      
      socket?.emit(SOCKET_EVENTS.PRIVATE_MESSAGE, {
        chatId: selectedChat._id,
        receiverId: selectedReceiver?._id,
        chat: selectedChat,
        message: messageWithSender,
      });
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <section className="chat-page">
      <Sidebar
        users={users}
        chats={chats}
        selectedChat={selectedChat}
        currentUserId={user._id}
        onlineUsers={onlineUsers}
        search={search}
        onSearch={setSearch}
        onSelectUser={startChatWithUser}
        onSelectChat={openChat}
        onCreateGroup={createGroupChat}
      />
      <div className="chat-main">
        {error ? <p className="error">{error}</p> : null}
        <ChatBox
          chat={selectedChat}
          messages={messages}
          currentUser={user}
          draft={draft}
          typingUser={typingUser}
          onDraftChange={handleDraftChange}
          onSend={sendMessage}
          onDeleteGroup={deleteGroupChat}
        />
      </div>
    </section>
  );
};
