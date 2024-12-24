import { useState, useEffect } from 'react';

const SimpleMode = ({ setCronExpression }) => {
    const [frequency, setFrequency] = useState('1');

    const frequencies = [
        { value: '1', label: '每分钟', cron: '* * * * *' },
        { value: '2', label: '每小时', cron: '0 * * * *' },
        { value: '3', label: '每天', cron: '0 0 * * *' },
        { value: '4', label: '每周', cron: '0 0 * * 0' },
        { value: '5', label: '每月', cron: '0 0 1 * *' }
    ];

    useEffect(() => {
        const selectedFreq = frequencies.find(f => f.value === frequency);
        setCronExpression(selectedFreq.cron);
    }, [frequency]);

    return (
        <div className="space-y-4">
            <div>
                <label className="block font-bold mb-2">执行频率：</label>
                <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full p-2 border rounded-md"
                >
                    {frequencies.map(freq => (
                        <option key={freq.value} value={freq.value}>
                            {freq.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SimpleMode;