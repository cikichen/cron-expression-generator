import { useState, useEffect } from 'react';

const AdvancedMode = ({ setCronExpression }) => {
    const [intervals, setIntervals] = useState({
        minute: '',
        hour: '',
        day: ''
    });

    const [specificTimes, setSpecificTimes] = useState({
        minute: '',
        hour: '',
        dayOfMonth: ''
    });

    const [selectedWeekDays, setSelectedWeekDays] = useState([]);

    const weekDays = [
        { value: '0', label: '周日' },
        { value: '1', label: '周一' },
        { value: '2', label: '周二' },
        { value: '3', label: '周三' },
        { value: '4', label: '周四' },
        { value: '5', label: '周五' },
        { value: '6', label: '周六' }
    ];

    useEffect(() => {
        const generateCronExpression = () => {
            let cronParts = ['*', '*', '*', '*', '*'];

            const hasIntervals = intervals.minute || intervals.hour || intervals.day;

            if (hasIntervals) {
                if (intervals.day) {
                    cronParts = ['0', '0', `*/${intervals.day}`, '*', '*'];
                } else if (intervals.hour) {
                    cronParts = ['0', `*/${intervals.hour}`, '*', '*', '*'];
                } else if (intervals.minute) {
                    cronParts = [`*/${intervals.minute}`, '*', '*', '*', '*'];
                }
            } else {
                if (specificTimes.minute !== '') {
                    cronParts[0] = specificTimes.minute;
                }
                if (specificTimes.hour !== '') {
                    if (cronParts[0] === '*') {
                        cronParts[0] = '0';
                    }
                    cronParts[1] = specificTimes.hour;
                }
                if (specificTimes.dayOfMonth !== '') {
                    if (cronParts[0] === '*') cronParts[0] = '0';
                    if (cronParts[1] === '*') cronParts[1] = '0';
                    cronParts[2] = specificTimes.dayOfMonth;
                }

                if (selectedWeekDays.length > 0) {
                    if (cronParts[0] === '*') cronParts[0] = '0';
                    if (cronParts[1] === '*') cronParts[1] = '0';
                    cronParts[2] = '*';
                    cronParts[4] = selectedWeekDays.join(',');
                }
            }

            return cronParts.join(' ');
        };

        const newCronExpression = generateCronExpression();
        setCronExpression(newCronExpression);
    }, [intervals, specificTimes, selectedWeekDays]);

    const clearIntervals = () => {
        setIntervals({
            minute: '',
            hour: '',
            day: ''
        });
    };

    const clearSpecificTimes = () => {
        setSpecificTimes({
            minute: '',
            hour: '',
            dayOfMonth: ''
        });
        setSelectedWeekDays([]);
    };

    const handleIntervalChange = (type, value) => {
        clearSpecificTimes();
        const newIntervals = {
            minute: '',
            hour: '',
            day: ''
        };
        newIntervals[type] = value;
        setIntervals(newIntervals);
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">间隔设置（选择其中一项）</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">分钟：</label>
                            <input
                                type="number"
                                min="1"
                                max="59"
                                value={intervals.minute}
                                onChange={(e) => {
                                    const value = e.target.value ?
                                        Math.min(Math.max(parseInt(e.target.value), 1), 59).toString() :
                                        '';
                                    handleIntervalChange('minute', value);
                                }}
                                className="w-full p-2 border rounded-md"
                                placeholder="每多少分钟"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">小时：</label>
                            <input
                                type="number"
                                min="1"
                                max="23"
                                value={intervals.hour}
                                onChange={(e) => {
                                    const value = e.target.value ?
                                        Math.min(Math.max(parseInt(e.target.value), 1), 23).toString() :
                                        '';
                                    handleIntervalChange('hour', value);
                                }}
                                className="w-full p-2 border rounded-md"
                                placeholder="每多少小时"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">天：</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={intervals.day}
                                onChange={(e) => {
                                    const value = e.target.value ?
                                        Math.min(Math.max(parseInt(e.target.value), 1), 31).toString() :
                                        '';
                                    handleIntervalChange('day', value);
                                }}
                                className="w-full p-2 border rounded-md"
                                placeholder="每多少天"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">具体时间设置</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block font-medium mb-1">具体时间（小时）：</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={specificTimes.hour}
                                onChange={(e) => {
                                    clearIntervals();
                                    const value = e.target.value ?
                                        Math.min(Math.max(parseInt(e.target.value), 0), 23).toString() :
                                        '';
                                    setSpecificTimes(prev => ({ ...prev, hour: value }));
                                }}
                                className="w-full p-2 border rounded-md"
                                placeholder="小时（0-23）"
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">具体时间（分钟）：</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={specificTimes.minute}
                                onChange={(e) => {
                                    clearIntervals();
                                    const value = e.target.value ?
                                        Math.min(Math.max(parseInt(e.target.value), 0), 59).toString() :
                                        '';
                                    setSpecificTimes(prev => ({ ...prev, minute: value }));
                                }}
                                className="w-full p-2 border rounded-md"
                                placeholder="分钟（0-59）"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">每周执行的星期几</h3>
                <div className="flex flex-wrap gap-4">
                    {weekDays.map(day => (
                        <label
                            key={day.value}
                            className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedWeekDays.includes(day.value)}
                                onChange={() => {
                                    setSelectedWeekDays(prev => {
                                        if (prev.includes(day.value)) {
                                            return prev.filter(d => d !== day.value);
                                        } else {
                                            return [...prev, day.value];
                                        }
                                    });
                                    clearIntervals();
                                }}
                                className="rounded"
                            />
                            <span className="whitespace-nowrap">{day.label}</span>
                        </label>
                    ))}
                </div>
            </div>


            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-bold text-lg mb-4">每月执行的日期</h3>
                <div>
                    <label className="block font-medium mb-1">日期（1-31）：</label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        value={specificTimes.dayOfMonth}
                        onChange={(e) => {
                            clearIntervals();
                            const value = e.target.value ?
                                Math.min(Math.max(parseInt(e.target.value), 1), 31).toString() :
                                '';
                            setSpecificTimes(prev => ({ ...prev, dayOfMonth: value }));
                        }}
                        className="w-full p-2 border rounded-md"
                        placeholder="日期（1-31）"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdvancedMode;