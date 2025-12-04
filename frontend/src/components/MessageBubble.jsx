import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';
import { User, Bot, Layers, BarChart3, Sparkles } from 'lucide-react';
import ModelTag from './ModelTag';

// --- Sub-components for Stages ---

const Stage1Panel = ({ data }) => {
    if (!data) return <div className="text-sm text-gray-400 italic animate-pulse">Council is deliberating...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.map((res, idx) => (
                <div key={idx} className="bg-[#2f2f2f] border border-white/5 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-900/30 flex items-center justify-center text-blue-400 text-xs font-bold">
                                {res.role[0].toUpperCase()}
                            </div>
                            <span className="text-xs font-semibold text-gray-200 uppercase tracking-wide">
                                {res.role}
                            </span>
                        </div>
                        <ModelTag model={res.model} />
                    </div>
                    <div className="text-xs text-gray-300 leading-relaxed max-h-40 overflow-y-auto scrollbar-thin">
                        {res.response}
                    </div>
                </div>
            ))}
        </div>
    );
};

const Stage2Panel = ({ data, metadata, onShowHeatmap }) => {
    if (!data) return <div className="text-sm text-gray-400 italic animate-pulse">Ranking responses...</div>;

    return (
        <div className="space-y-4">
            {/* Summary Table */}
            <div className="overflow-hidden rounded-lg border border-white/5">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#2f2f2f] text-xs uppercase text-gray-400">
                        <tr>
                            <th className="px-4 py-2">Rank</th>
                            <th className="px-4 py-2">Role</th>
                            <th className="px-4 py-2">Model</th>
                            <th className="px-4 py-2">Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 bg-[#212121]">
                        {data.map((item, idx) => {
                            const parsed = item.parsed_ranking || [];
                            const score = parsed.length > 0 ? `${idx + 1}/${data.length}` : '-';
                            return (
                                <tr key={idx} className="hover:bg-white/5">
                                    <td className="px-4 py-2 font-medium text-white">#{idx + 1}</td>
                                    <td className="px-4 py-2 text-gray-300">Response {String.fromCharCode(65 + idx)}</td>
                                    <td className="px-4 py-2"><ModelTag model={item.model} /></td>
                                    <td className="px-4 py-2 text-gray-400">{score}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Heatmap Button */}
            {onShowHeatmap && (
                <button
                    onClick={onShowHeatmap}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                    View Similarity Matrix
                </button>
            )}

            {/* Raw Rankings */}
            <div className="space-y-2">
                {data.map((item, idx) => (
                    <details key={idx} className="group bg-[#2f2f2f] rounded-lg border border-white/5">
                        <summary className="flex items-center justify-between p-3 cursor-pointer list-none">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-gray-500">Ranker:</span>
                                <ModelTag model={item.model} />
                            </div>
                            <span className="text-xs text-blue-500 group-open:rotate-180 transition-transform">▼</span>
                        </summary>
                        <div className="px-3 pb-3 text-xs text-gray-300 whitespace-pre-wrap border-t border-white/5 pt-2 mt-1">
                            {item.ranking}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

const Stage3Panel = ({ data }) => {
    if (!data) return <div className="text-sm text-gray-400 italic animate-pulse">Synthesizing final answer...</div>;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-500 uppercase tracking-wide">Synthesized by</span>
                <ModelTag model={data.model} />
            </div>
            <div className="markdown-content text-gray-100 text-sm leading-relaxed">
                <ReactMarkdown>{data.response}</ReactMarkdown>
            </div>
        </div>
    );
};

// --- Main Bubble Component ---

const MessageBubble = ({ message, onShowHeatmap }) => {
    const isUser = message.role === 'user';
    const [activeTab, setActiveTab] = useState('stage3');

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="bg-[#2f2f32] text-gray-100 px-4 py-3 rounded-2xl rounded-tr-sm shadow-sm border border-white/5 max-w-[85%]">
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                </div>
            </div>
        );
    }

    // Assistant
    return (
        <div className="flex gap-4 max-w-full">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex-shrink-0 flex items-center justify-center text-white shadow-sm">
                <Bot size={18} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="bg-[#2f2f2f] border border-white/10 rounded-xl overflow-hidden shadow-sm">
                    {/* Tabs */}
                    <div className="flex items-center border-b border-white/10 bg-[#212121]/50 px-2 pt-2">
                        <button
                            onClick={() => setActiveTab('stage1')}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2",
                                activeTab === 'stage1'
                                    ? "bg-[#2f2f2f] text-blue-400 border-blue-500"
                                    : "text-gray-500 hover:text-gray-300 border-transparent"
                            )}
                        >
                            <Layers size={14} />
                            Stage 1: Experts
                        </button>
                        <button
                            onClick={() => setActiveTab('stage2')}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2",
                                activeTab === 'stage2'
                                    ? "bg-[#2f2f2f] text-yellow-400 border-yellow-500"
                                    : "text-gray-500 hover:text-gray-300 border-transparent"
                            )}
                        >
                            <BarChart3 size={14} />
                            Stage 2: Ranking
                        </button>
                        <button
                            onClick={() => setActiveTab('stage3')}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-t-lg transition-colors border-b-2",
                                activeTab === 'stage3'
                                    ? "bg-[#2f2f2f] text-teal-400 border-teal-500"
                                    : "text-gray-500 hover:text-gray-300 border-transparent"
                            )}
                        >
                            <Sparkles size={14} />
                            Stage 3: Final
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 min-h-[100px]">
                        {activeTab === 'stage1' && <Stage1Panel data={message.stage1} />}
                        {activeTab === 'stage2' && <Stage2Panel data={message.stage2} metadata={message.metadata} onShowHeatmap={onShowHeatmap} />}
                        {activeTab === 'stage3' && <Stage3Panel data={message.stage3} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
