import React, { useState } from 'react';
import { Plus, MessageSquare, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ conversations, currentId, onSelect, onNew, onRename, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const startEdit = (conv) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEdit = async () => {
    if (editingId && editTitle.trim()) {
      await onRename(editingId, editTitle);
    }
    setEditingId(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      await onDelete(id);
    }
  };

  return (
    <div className="w-[260px] bg-black text-gray-100 flex flex-col h-full border-r border-white/10">
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-md border border-white/20 hover:bg-white/10 transition-colors text-sm text-white"
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
        <div className="text-xs font-medium text-gray-500 px-3 py-2">Today</div>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={clsx(
              "group relative flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer text-sm transition-colors",
              conv.id === currentId ? "bg-white/10" : "hover:bg-white/5"
            )}
          >
            <MessageSquare size={16} className="text-gray-400" />

            {editingId === conv.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                className="bg-transparent border border-blue-500 rounded px-1 w-full outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex-1 truncate pr-6">{conv.title}</div>
            )}

            {/* Hover Actions */}
            {conv.id === currentId && !editingId && (
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); startEdit(conv); }}
                  className="p-1 hover:text-white text-gray-400"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={(e) => handleDelete(e, conv.id)}
                  className="p-1 hover:text-red-400 text-gray-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Profile / Footer */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
            AI
          </div>
          <div className="text-sm font-medium">Synapse Council</div>
          <MoreHorizontal size={16} className="ml-auto text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
