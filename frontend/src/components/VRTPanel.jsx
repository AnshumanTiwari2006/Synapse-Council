import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X } from 'lucide-react';
import { formatVRT } from '../utils/formatVRT';

const VRTPanel = ({ isOpen, onClose, vrt }) => {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => formatVRT(vrt), [vrt]);

    // We use key to force re-render when VRT changes, simple way to reset layout
    const flowKey = useMemo(() => JSON.stringify(vrt), [vrt]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-white dark:bg-[#111113] border-l border-gray-200 dark:border-white/10 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="h-14 border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#18181b]">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <span className="text-lg">🌳</span>
                    Reasoning Tree
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            {/* Graph Area */}
            <div className="flex-1 relative bg-gray-50 dark:bg-[#09090b]">
                {vrt ? (
                    <ReactFlow
                        key={flowKey}
                        defaultNodes={initialNodes}
                        defaultEdges={initialEdges}
                        fitView
                        attributionPosition="bottom-left"
                    >
                        <Background color="#4b5563" gap={16} size={1} variant="dots" />
                        <Controls className="bg-white dark:bg-[#18181b] border-gray-200 dark:border-white/10 fill-gray-500" />
                        <MiniMap
                            className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10"
                            nodeColor={() => '#3b82f6'}
                        />
                    </ReactFlow>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No reasoning tree available.
                    </div>
                )}
            </div>

            {/* Footer / Legend */}
            <div className="p-3 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#111113] text-xs text-gray-500 dark:text-gray-400 flex gap-4 justify-center">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> Answer
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div> Critique
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Ranking
                </div>
            </div>
        </div>
    );
};

export default VRTPanel;
