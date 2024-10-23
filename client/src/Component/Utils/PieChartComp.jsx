import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import AffairSelect from './AffairSelection';

const PieChartComp = ({ data, deptStats, title }) => { // Correct destructuring of props
    console.log(data);
    return (

        <>
            <h2 className="text-2xl font-bold ">{title}</h2>
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                    >
                        {data.map((entry, index) => ( // data.map will work now
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        <Label
                            value={`Total Entries: ${Object.values(deptStats).reduce((acc, val) => acc + val, 0)}`}
                            position="center"
                            fill="#000"
                            style={{ fontSize: "16px", fontWeight: "bold" }}
                        />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-left space-x-4 mt-4">
                <div className="w-60 p-2 bg-gray-100 rounded-lg mt-4">
                    <div className="flex flex-wrap"> {/* This wraps the content horizontally */}
                        {data.map((entry, index) => (
                            <div key={`legend-${index}`} className="flex items-center mb-2 mr-4"> {/* Added mr-4 for horizontal spacing */}
                                <div
                                    className="w-3 h-3 mr-2"
                                    style={{ backgroundColor: entry.color }}
                                ></div>
                                <span>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>

    );
};

export default PieChartComp;
