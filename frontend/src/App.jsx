import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import VRTPanel from './components/VRTPanel';
import HeatmapModal from './components/HeatmapModal';
import MessageBubble from './components/MessageBubble';
import { api } from './utils/apiClient';
import './styles/theme.css';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [currentConv, setCurrentConv] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVRTOpen, setIsVRTOpen] = useState(false);

  // Matrix State
  const [showMatrix, setShowMatrix] = useState(false);
  const [matrixData, setMatrixData] = useState(null);

  // Load initial data
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (currentId) loadConversation(currentId);
  }, [currentId]);

  const loadConversations = async () => {
    try {
      const data = await api.listConversations();
      setConversations(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversation = async (id) => {
    try {
      const data = await api.getConversation(id);
      setCurrentConv(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNew = async () => {
    try {
      const newConv = await api.createConversation();
      setConversations([newConv, ...conversations]);
      setCurrentId(newConv.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRename = async (id, title) => {
    try {
      await api.renameConversation(id, title);
      setConversations(conversations.map(c => c.id === id ? { ...c, title } : c));
      if (currentConv?.id === id) setCurrentConv({ ...currentConv, title });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteConversation(id);
      setConversations(conversations.filter(c => c.id !== id));
      if (currentId === id) {
        setCurrentId(null);
        setCurrentConv(null);
      }
      await loadConversations(); // Refresh list
    } catch (e) {
      console.error('Delete failed:', e);
      alert('Failed to delete conversation');
    }
  };

  const handleSendMessage = async (content) => {
    if (!currentId) return;

    setIsLoading(true);

    // Optimistic update
    const userMsg = { role: 'user', content };
    const assistantMsg = {
      role: 'assistant',
      stage1: null, stage2: null, stage3: null,
      loading: { stage1: true, stage2: false, stage3: false }
    };

    setCurrentConv(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg, assistantMsg]
    }));

    try {
      await api.sendMessageStream(currentId, content, (type, data) => {
        setCurrentConv(prev => {
          const msgs = [...prev.messages];
          const last = msgs[msgs.length - 1];

          switch (type) {
            case 'stage1_start': last.loading.stage1 = true; break;
            case 'stage1_complete':
              last.stage1 = data.data;
              last.loading.stage1 = false;
              last.loading.stage2 = true;
              break;
            case 'stage2_start': last.loading.stage2 = true; break;
            case 'stage2_complete':
              last.stage2 = data.data;
              last.metadata = data.metadata;
              last.loading.stage2 = false;
              last.loading.stage3 = true;
              break;
            case 'stage3_start': last.loading.stage3 = true; break;
            case 'stage3_complete':
              last.stage3 = data.data;
              last.loading.stage3 = false;
              break;
            case 'vrt_complete':
              last.vrt = data.vrt;
              break;
            case 'complete':
              setIsLoading(false);
              // Refresh to get full VRT
              loadConversation(currentId);
              break;
          }
          return { ...prev, messages: msgs };
        });
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleShowHeatmap = (vrt) => {
    if (vrt?.similarity_matrix) {
      // Get labels from VRT nodes
      const labels = vrt.nodes
        ?.filter(n => n.type === 'initial_answer')
        ?.map(n => n.role.substring(0, 3).toUpperCase()) || [];

      setMatrixData({
        matrix: vrt.similarity_matrix,
        labels: labels.length > 0 ? labels : ['Sci', 'Cri', 'Exp', 'Str']
      });
      setShowMatrix(true);
    } else {
      alert('No similarity matrix available for this message');
    }
  };

  // Extract VRT from latest message
  const latestVRT = currentConv?.messages?.findLast(m => m.vrt)?.vrt;

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121]">
      <Sidebar
        conversations={conversations}
        currentId={currentId}
        onSelect={setCurrentId}
        onNew={handleNew}
        onRename={handleRename}
        onDelete={handleDelete}
      />

      <div className="flex-1 flex flex-col h-full relative bg-[#212121]">
        {/* Header */}
        {currentConv && (
          <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#212121]/80 backdrop-blur-md sticky top-0 z-10">
            <div className="font-medium text-gray-200 truncate">
              {currentConv.title}
            </div>
            <button
              onClick={() => setIsVRTOpen(!isVRTOpen)}
              className="text-sm px-3 py-1.5 rounded-md bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
            >
              View Reasoning Tree
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          {!currentConv ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-white/5 rounded-full shadow-sm flex items-center justify-center mb-6">
                <span className="text-3xl">🏛️</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                Synapse Council
              </h2>
              <p className="text-gray-400 max-w-md">
                Select a conversation or start a new one to consult the council of experts.
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {currentConv.messages.map((msg, idx) => (
                <MessageBubble
                  key={idx}
                  message={msg}
                  onShowHeatmap={() => handleShowHeatmap(msg.vrt)}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white/5 rounded-2xl px-4 py-3 text-sm text-gray-500">
                    Council is deliberating...
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentConv && (
          <div className="p-4 border-t border-white/10 bg-[#212121]">
            <div className="max-w-3xl mx-auto relative">
              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.message.value;
                if (input.trim() && !isLoading) {
                  handleSendMessage(input);
                  e.target.reset();
                }
              }}>
                <input
                  name="message"
                  placeholder="Ask the council..."
                  className="w-full bg-[#2f2f2f] border border-white/20 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white shadow-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-2 p-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                </button>
              </form>
              <div className="text-center mt-2 text-xs text-gray-500">
                AI can make mistakes. Check important info.
              </div>
            </div>
          </div>
        )}
      </div>

      <VRTPanel
        isOpen={isVRTOpen}
        onClose={() => setIsVRTOpen(false)}
        vrt={latestVRT}
      />

      <HeatmapModal
        isOpen={showMatrix}
        onClose={() => setShowMatrix(false)}
        matrix={matrixData?.matrix}
        labels={matrixData?.labels}
      />
    </div>
  );
}

export default App;
