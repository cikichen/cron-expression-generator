import { useState, useEffect } from 'react';
import parser from 'cron-parser';
import SimpleMode from './SimpleMode';
import AdvancedMode from './AdvancedMode';
import CustomMode from './CustomMode';
import CodeBlock from './CodeBlock';

const CronGenerator = () => {
    const [activeTab, setActiveTab] = useState('simple');
    const [cronExpression, setCronExpression] = useState('* * * * *');
    const [previewTimes, setPreviewTimes] = useState([]);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        try {
            const interval = parser.parseExpression(cronExpression);
            const nextDates = [];
            for (let i = 0; i < 10; i++) {
                nextDates.push(interval.next().toDate());
            }
            setPreviewTimes(nextDates);
        } catch (err) {
            setPreviewTimes([]);
        }
    }, [cronExpression]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(cronExpression);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // 2秒后隐藏提示
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    const tabs = [
        { id: 'simple', name: '简单模式' },
        { id: 'advanced', name: '高级模式' },
        { id: 'custom', name: '自定义模式' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Cron表达式生成器</h1>

            <div className="flex space-x-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="mb-6">
                {activeTab === 'simple' && (
                    <SimpleMode setCronExpression={setCronExpression} />
                )}
                {activeTab === 'advanced' && (
                    <AdvancedMode setCronExpression={setCronExpression} />
                )}
                {activeTab === 'custom' && (
                    <CustomMode setCronExpression={setCronExpression} />
                )}
            </div>

            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">生成的Cron表达式：</h3>
                    </div>
                    <div className="relative" >
                        {/* <pre className="bg-white border rounded-md p-3 font-mono text-gray-800">
                            {cronExpression}
                        </pre> */}
                        <CodeBlock language="java" code={cronExpression} />
                    </div>
                </div>
                {activeTab !== 'custom' && (
                <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="font-bold text-lg mb-3">最近10次执行时间预览：</h4>
                    <div className="space-y-1 font-mono text-sm">
                        {previewTimes.map((time, index) => (
                            <div key={index} className="bg-white border rounded p-2">
                                {time.toLocaleString('zh-CN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })}
                            </div>
                        ))}
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CronGenerator;