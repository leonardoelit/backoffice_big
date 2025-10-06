import { useCallback, useEffect, useMemo, useState } from "react";
import { MessageType, PlayerMessage, SendMessageRequest } from "../constants/types";
import { deletePlayerMessage, getPlayersMessages, sendMessage } from "../lib/api";
import { showToast } from "@/utils/toastUtil";
import NoteCell from "../tables/NoteCell";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import { SortAscIcon } from "lucide-react";

const MessageTypeBadge = ({ type }: { type: MessageType }) => {
    const typeMap = {
        [MessageType.InApp]: { text: 'In-App', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>, bg: 'bg-blue-100', textColor: 'text-blue-800' },
        [MessageType.Mail]: { text: 'Mail', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, bg: 'bg-yellow-100', textColor: 'text-yellow-800' },
        [MessageType.Sms]: { text: 'SMS', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3H7a2 2 0 0 0-2 2v14l4-4h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path></svg>, bg: 'bg-green-100', textColor: 'text-green-800' },
    };
    const { text, icon, bg, textColor } = typeMap[type];
    return <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${textColor}`}>{icon}{text}</div>;
};

const SkeletonRow = ({ columns }: { columns: number }) => (
    <TableRow className="border-b border-gray-100">
        {Array.from({ length: columns }).map((_, i) => (
            <TableCell key={i}>
                <div className="h-5 bg-gray-200 rounded-md animate-pulse"></div>
            </TableCell>
        ))}
    </TableRow>
);


// --- MAIN COMPONENT ---

const PlayerCommunications = ({ playerId }: { playerId: number }) => {
  const [messages, setMessages] = useState<PlayerMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Sorting and Pagination State
  const [sortBy, setSortBy] = useState<keyof PlayerMessage>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Form state
  const [newMessage, setNewMessage] = useState({
      type: MessageType.InApp,
      title: '',
      message: '',
      isGlobal: false,
  });

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPlayersMessages(playerId);
      if (response.isSuccess && response.playersMessages) {
        setMessages(response.playersMessages);
      } else {
        setError(response.message || "Failed to fetch messages.");
        showToast(response.message || "Could not load messages.", "error");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      showToast("An unexpected error occurred.", "error");
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  }, [playerId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSort = (column: keyof PlayerMessage) => {
    if (sortBy === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const sortedMessages = useMemo(() => {
    return [...messages].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue === undefined || bValue === undefined) return 0;

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [messages, sortBy, sortDirection]);

  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedMessages.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedMessages, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(messages.length / rowsPerPage);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.title || !newMessage.message) {
        showToast("Title and message are required.", "error");
        return;
    }

    setIsSending(true);
    const requestBody: SendMessageRequest = {
        playerId: newMessage.isGlobal ? 1 : playerId,
        type: newMessage.type,
        title: newMessage.title,
        message: newMessage.message
    };

    const response = await sendMessage(requestBody);
    if(response.isSuccess) {
        showToast(response.message || "Message sent!", "success");
        setIsModalOpen(false);
        setNewMessage({ type: MessageType.InApp, title: '', message: '', isGlobal: false });
        fetchMessages(); // Refresh message list
    } else {
        showToast(response.message || "Failed to send message.", "error");
    }
    setIsSending(false);
  };
  
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    const response = await deletePlayerMessage(id);
    if(response.isSuccess){
        showToast(response.message || "Message deleted!", "success");
        setMessages(prev => prev.filter(msg => msg.id !== id));
    } else {
        showToast(response.message || "Could not delete message.", "error");
    }
    setDeletingId(null);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Player Communications</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Send Message
        </button>
      </div>

      <Table className="w-full">
        <TableHeader className="border-b border-gray-200 bg-gray-50">
            <TableRow>
            <TableCell
                isHeader
                className="w-[17%] font-semibold text-gray-600 text-left uppercase tracking-wide text-xs py-3"
            >
                Type
            </TableCell>
            <TableCell
                isHeader
                className="w-[17%] font-semibold text-gray-600 text-left uppercase tracking-wide text-xs py-3"
            >
                Title
            </TableCell>
            <TableCell
                isHeader
                className="w-[22%] font-semibold text-gray-600 text-left uppercase tracking-wide text-xs py-3"
            >
                Message
            </TableCell>
            <TableCell
                isHeader
                className="w-[17%] font-semibold text-gray-600 text-left uppercase tracking-wide text-xs py-3"
            >
                Sent By
            </TableCell>
            <TableCell
                isHeader
                className="w-[17%] font-semibold text-gray-600 text-left uppercase tracking-wide text-xs py-3 cursor-pointer select-none"
                onClick={() => handleSort('createdAt')}
            >
                <div className="flex items-center gap-1">
                <span>Date</span>
                <SortAscIcon direction={sortBy === 'createdAt' ? sortDirection : 'none'} />
                </div>
            </TableCell>
            <TableCell
                isHeader
                className=" w-[10%] font-semibold text-gray-600 text-right uppercase tracking-wide text-xs py-3"
            >
                Actions
            </TableCell>
            </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-gray-100">
            {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} columns={6} />)
            ) : error ? (
            <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-red-500">
                {error}
                </TableCell>
            </TableRow>
            ) : paginatedMessages.length === 0 ? (
            <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-gray-500">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Messages</h3>
                <p className="mt-1 text-sm text-gray-500">
                    This player has not received any messages yet.
                </p>
                </TableCell>
            </TableRow>
            ) : (
            paginatedMessages.map((msg) => (
                <TableRow
                key={msg.id}
                className="hover:bg-gray-50 transition-colors"
                >
                <TableCell className="text-left">
                    <MessageTypeBadge type={msg.type} />
                </TableCell>
                <TableCell className="text-left font-medium text-gray-800">
                    {msg.title}
                </TableCell>
                <TableCell className="text-left font-medium text-gray-800">
                    <NoteCell note={msg.message} />
                </TableCell>
                <TableCell className="text-left text-gray-600">
                    {msg.employeeName}
                </TableCell>
                <TableCell className="text-left text-gray-500">
                    {new Date(msg.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                    <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deletingId === msg.id}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
                    >
                    {deletingId === msg.id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    )}
                    </button>
                </TableCell>
                </TableRow>
            ))
            )}
        </TableBody>
        </Table>

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
        </div>
      )}

      {/* Send Message Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999999] transition-opacity">
              <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Send New Message</h3>
                <form onSubmit={handleSendMessage}>
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="type"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Type
                            </label>
                            <div className="relative">
                                <select
                                id="type"
                                value={newMessage.type}
                                onChange={(e) =>
                                    setNewMessage({ ...newMessage, type: Number(e.target.value) })
                                }
                                className="block w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-800
                                            shadow-sm hover:shadow-md transition-all duration-200 ease-in-out
                                            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none appearance-none"
                                >
                                <option className="text-gray-800" value={MessageType.InApp}>
                                    In-App
                                </option>
                                <option className="text-gray-800" value={MessageType.Mail}>
                                    Mail
                                </option>
                                <option className="text-gray-800" value={MessageType.Sms}>
                                    SMS
                                </option>
                                </select>

                                <svg
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" id="title" value={newMessage.title} onChange={e => setNewMessage({...newMessage, title: e.target.value})} className="mt-1 block w-full py-2 px-3 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea id="message" value={newMessage.message} onChange={e => setNewMessage({...newMessage, message: e.target.value})} rows={4} className="mt-1 block w-full px-3 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                id="isGlobal"
                                name="isGlobal"
                                type="checkbox"
                                checked={newMessage.isGlobal}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setNewMessage(prev => ({ ...prev, isGlobal: e.target.checked }))
                                }
                                className="block shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <label htmlFor="isGlobal" className="select-none">Is Global</label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSending} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center">
                            {isSending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                            {isSending ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default PlayerCommunications;