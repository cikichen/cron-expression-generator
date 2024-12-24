import React, { useEffect, useRef, useState } from 'react';
import hljs from './highlight';
import Clipboard from 'clipboard';

import 'highlight.js/styles/github.css';

export default function CodeBlock({ language, code }) {
    const preRef = useRef(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (preRef.current) {
            hljs.highlightBlock(preRef.current);

            // 创建 clipboard 实例并保存到变量中
            const clipboard = new Clipboard(`#${language}copy_btn`, {
                text: () => code,
            });

            // 监听复制成功事件
            clipboard.on('success', () => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });

            // 销毁 clipboard 实例
            return () => {
                clipboard.destroy();
            };
        }
    }, [code]);

    return (
        <div className="code-block relative mt-2">
            <pre>
                <code id={language} ref={preRef} className={language}>
                    {code}
                </code>
            </pre>
            <button
                id={`${language}copy_btn`}
                className={`absolute top-2 right-2 px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                transition duration-200`}
                data-clipboard-target={`#${language}`}
                disabled={!preRef.current}
            >
                {copied ? '已复制' : '复制'}
            </button>
        </div>
    );
}
