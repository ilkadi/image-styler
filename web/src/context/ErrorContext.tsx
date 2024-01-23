import React, { createContext, useState, FunctionComponent, ReactNode } from 'react';

interface ErrorContextType {
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
}

const defaultErrorContextValue: ErrorContextType = {
    errorMessage: null,
    setErrorMessage: () => {},
};

export const ErrorContext = createContext<ErrorContextType>(defaultErrorContextValue);

export const ErrorProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    return (
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
            {children}
        </ErrorContext.Provider>
    );
};