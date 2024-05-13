import React, { createContext, useState } from 'react';

export const DataContext = createContext(null);

// @ts-ignore
export const DataProvider = ({ children }) => {
    const [data, setData] = useState('');

    // @ts-ignore
    const updateData = (newData) => {
        setData(newData);
        console.log("Data updated in context:", newData);
    };

    return (
        // @ts-ignore
        <DataContext.Provider value={{ data, updateData }}>
            {children}
        </DataContext.Provider>
    );
};
