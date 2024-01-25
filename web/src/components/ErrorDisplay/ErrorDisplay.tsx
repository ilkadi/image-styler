import React, { useContext, useEffect, useState } from 'react';
import { ErrorContext } from '../../context/ErrorContext';
import './ErrorDisplay.css';

const ErrorDisplay = () => {
    const { errorMessage, setErrorMessage } = useContext(ErrorContext);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        let timer1: NodeJS.Timeout;
        let timer2: NodeJS.Timeout;
        console.log(errorMessage);

        if (errorMessage) {
            setHidden(false);

            timer1 = setTimeout(()  => {
                setHidden(true);

                // Wait for the transition to finish before clearing the error message
                timer2 = setTimeout(() => {
                    setErrorMessage('');
                }, 500);
            }, 3000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [errorMessage, setErrorMessage]);

    if (!errorMessage) {
        return null;
    }

    return (
        <div className={`error-display ${hidden ? 'hidden' : ''}`}>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default ErrorDisplay;