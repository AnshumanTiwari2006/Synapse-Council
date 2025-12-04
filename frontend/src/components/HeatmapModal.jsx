import React, { useState } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

const HeatmapModal = ({ isOpen, onClose, matrix, labels, type = 'similarity' }) => {
    if (!isOpen || !matrix) return null;

    // Color scale helper
    const getColor = (val) => {
        // 0 to 1
        const intensity = Math.round(val * 255);
        if (type === 'similarity') {
            // Green scale
            return `rgba(16, 185, 129, ${val})`;
        } else {
            // Red scale (contradiction)
            return `rgba(239, 68, 68, ${val})`;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] backdrop-blur-sm">
            <div className="bg-white dark:bg-[#18181b] rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                        {type} Matrix
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2"></th>
                                {labels.map((l, i) => (
                                    <th key={i} className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 rotate-45 origin-bottom-left translate-x-4">
                                        {l}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, i) => (
                                <tr key={i}>
                                    <td className="p-2 text-xs font-medium text-gray-500 dark:text-gray-400 text-right whitespace-nowrap">
                                        {labels[i]}
                                    </td>
                                    {row.map((val, j) => (
                                        <td key={j} className="p-1">
                                            <div
                                                className="w-12 h-12 rounded flex items-center justify-center text-xs font-medium transition-transform hover:scale-110"
                                                style={{
                                                    backgroundColor: getColor(val),
                                                    color: val > 0.5 ? '#fff' : (document.documentElement.classList.contains('dark') ? '#fff' : '#000')
                                                }}
                                                title={`${labels[i]} vs ${labels[j]}: ${val.toFixed(2)}`}
                                            >
                                                {val.toFixed(2)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HeatmapModal;
