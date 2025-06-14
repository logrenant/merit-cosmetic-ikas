import React, { createContext, useContext, useState } from 'react';

interface FilterContextType {
    isOutOfStockSelected: boolean;
    setIsOutOfStockSelected: (value: boolean) => void;
}

// Create a default context value
const defaultContextValue: FilterContextType = {
    isOutOfStockSelected: false,
    setIsOutOfStockSelected: () => { }, // No-op function as default
};

export const FilterContext = createContext<FilterContextType>(defaultContextValue);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOutOfStockSelected, setIsOutOfStockSelected] = useState(false);

    return (
        <FilterContext.Provider value={{ isOutOfStockSelected, setIsOutOfStockSelected }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = () => {
    return useContext(FilterContext);
};
