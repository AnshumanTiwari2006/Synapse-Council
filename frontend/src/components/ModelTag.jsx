import React from 'react';
import { clsx } from 'clsx';

const ModelTag = ({ model }) => {
    const name = model.split('/').pop();

    // Color mapping based on model family
    const getColor = (m) => {
        if (m.includes('deepseek')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        if (m.includes('llama')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
        if (m.includes('mistral')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        if (m.includes('qwen')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    return (
        <span className={clsx("px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide uppercase", getColor(name))}>
            {name}
        </span>
    );
};

export default ModelTag;
