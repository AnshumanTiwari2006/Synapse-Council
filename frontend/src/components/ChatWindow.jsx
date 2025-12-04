import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import { Send } from 'lucide-react';

const ChatWindow = ({ conversation, onSendMessage, isLoading, onToggleVRT }) => {
    const [input, setInput] = React.useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation?.messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };

    if (!conversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#212121]">
                <div className="w-16 h-16 bg-white/5 rounded-full shadow-sm flex items-center justify-center mb-6">
                    <span className="text-3xl">🏛️</span>
                </div>
                <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                    LLM Council 
                </h2>
                <p className="text-gray-400 max-w-md">
                    Select a conversation or start a new one to consult the council of experts.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full relative bg-[#212121]">
            {/* Header */}
            <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#212121]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="font-medium text-gray-200 truncate">
                    {conversation.title}
                </div>
                <button
                    onClick={onToggleVRT}
                    className="text-sm px-3 py-1.5 rounded-md bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                >
                    View Reasoning Tree
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-6">
                    {conversation.messages.map((msg, idx) => (
                        <MessageBubble key={idx} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-white/5 rounded-2xl px-4 py-3 text-sm text-gray-500">
                                Council is deliberating...
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#212121]">
                <div className="max-w-3xl mx-auto relative">
                    <form onSubmit={handleSubmit}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask the council..."
                            className="w-full bg-[#2f2f2f] border border-white/20 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white shadow-sm"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                    <div className="text-center mt-2 text-xs text-gray-500">
                        AI can make mistakes. Check important info.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
