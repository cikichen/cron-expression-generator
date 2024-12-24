import { useState, useEffect } from 'react';
import parser from 'cron-parser';

const CustomMode = ({ setCronExpression }) => {
    const [customCron, setCustomCron] = useState('* * * * *');
    const [isValid, setIsValid] = useState(true);
    const [previewTimes, setPreviewTimes] = useState([]);

    const validateCronExpression = (cron) => {
        try {
            parser.parseExpression(cron);
            return true;
        } catch (err) {
            return false;
        }
    };

    useEffect(() => {
        const isValidCron = validateCronExpression(customCron);
        setIsValid(isValidCron);

        if (isValidCron) {
            setCronExpression(customCron);

            // 计算预览时间
            try {
                const interval = parser.parseExpression(customCron);
                const nextDates = [];
                for (let i = 0; i < 10; i++) {
                    nextDates.push(interval.next().toDate());
                }
                setPreviewTimes(nextDates);
            } catch (err) {
                setPreviewTimes([]);
            }
        } else {
            setPreviewTimes([]);
        }
    }, [customCron]);

    return (
        <div className="space-y-6">
            <div>
                <label className="block font-bold mb-2">
                    输入Cron表达式：
                </label>
                <input
                    type="text"
                    value={customCron}
                    onChange={(e) => setCustomCron(e.target.value)}
                    className={`w-full p-2 font-mono text-lg border rounded-md ${!isValid ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="* * * * *"
                />
            </div>

            {!isValid && (
                <div className="text-red-500 text-sm">
                    无效的Cron表达式
                </div>
            )}

            {isValid && previewTimes.length > 0 && (
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

            <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-bold mb-2">Cron表达式基本格式：</h4>
                    <pre className="text-sm text-gray-500">
                        * * * * *
                        {'\n'}│ │ │ │ │
                        {'\n'}│ │ │ │ └── 星期几 (0-6)
                        {'\n'}│ │ │ └──── 月份 (1-12)
                        {'\n'}│ │ └────── 日期 (1-31)
                        {'\n'}│ └──────── 小时 (0-23)
                        {'\n'}└────────── 分钟 (0-59)
                    </pre>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-bold mb-2">字段说明：</h4>
                <div className="space-y-4 text-sm text-gray-600">
                    <div>
                        <h5 className="font-semibold">分钟（0-59）：</h5>
                        <ul className="list-disc list-inside ml-4">
                            <li>* 表示每分钟</li>
                            <li>*/5 表示每5分钟</li>
                            <li>1,15,30,45 表示在第1、15、30和45分钟时</li>
                            <li>1-15 表示从第1到第15分钟之间的每分钟</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold">小时（0-23）：</h5>
                        <ul className="list-disc list-inside ml-4">
                            <li>* 表示每小时</li>
                            <li>*/2 表示每2小时</li>
                            <li>9-17 表示上午9点到下午5点之间的每小时</li>
                            <li>9,13,18 表示上午9点、下午1点和下午6点</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold">日期（1-31）：</h5>
                        <ul className="list-disc list-inside ml-4">
                            <li>* 表示每天</li>
                            <li>1,15 表示每月的1号和15号</li>
                            <li>1-5 表示每月的1号到5号</li>
                            <li>*/5 表示每5天</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold">月份（1-12）：</h5>
                        <ul className="list-disc list-inside ml-4">
                            <li>* 表示每月</li>
                            <li>1,6,12 表示一月、六月和十二月</li>
                            <li>1-6 表示从一月到六月</li>
                            <li>*/3 表示每三个月</li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-semibold">星期几（0-6，0表示周日）：</h5>
                        <ul className="list-disc list-inside ml-4">
                            <li>* 表示每天</li>
                            <li>1-5 表示周一到周五</li>
                            <li>0,6 表示周六和周日</li>
                            <li>1,3,5 表示周一、周三和周五</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-bold mb-2">特殊字符说明：</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li><span className="font-semibold">*</span> - 表示任意值或每个值</li>
                    <li><span className="font-semibold">/</span> - 表示间隔（步长）</li>
                    <li><span className="font-semibold">-</span> - 表示范围</li>
                    <li><span className="font-semibold">,</span> - 表示列表</li>
                    <li><span className="font-semibold">?</span> - 不指定具体值（仅用于日期和星期字段）</li>
                </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-bold mb-2">常用示例：</h4>
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h5 className="font-semibold">基础示例：</h5>
                            <ul className="list-disc list-inside ml-4">
                                <li>* * * * * : 每分钟执行</li>
                                <li>0 * * * * : 每小时整点执行</li>
                                <li>0 0 * * * : 每天午夜执行</li>
                                <li>0 0 1 * * : 每月1号午夜执行</li>
                                <li>0 0 * * 0 : 每周日午夜执行</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold">高级示例：</h5>
                            <ul className="list-disc list-inside ml-4">
                                <li>*/15 * * * * : 每15分钟执行</li>
                                <li>0 9-17 * * * : 朝九晚五每小时执行</li>
                                <li>0 0 * * 1-5 : 每个工作日午夜执行</li>
                                <li>0 8 1,15 * * : 每月1号和15号早八点执行</li>
                                <li>0 8-18/2 * * * : 早8点到晚6点每2小时执行</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-bold mb-2">注意事项：</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>日期和星期几字段通常不会同时使用具体值</li>
                    <li>使用范围时，确保起始值小于结束值</li>
                    <li>使用列表时，值需要用逗号分隔，且不能有空格</li>
                    <li>使用间隔时，确保间隔值在合理范围内</li>
                    <li>月份和星期几的值都是从0或1开始，注意区分</li>
                </ul>
            </div>
        </div>
    );
};

export default CustomMode;