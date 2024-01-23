import { useContext, useEffect, useState } from 'react';
import { ErrorContext } from '../../context/ErrorContext';
import './ErrorDisplay.css';

const ErrorDisplay = () => {
    const { errorMessage, setErrorMessage } = useContext(ErrorContext);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        console.log(errorMessage);

        if (errorMessage) {
            setHidden(false);

            const timer = setTimeout(() => {
                setHidden(true);

                // Wait for the transition to finish before clearing the error message
                setTimeout(() => {
                    setErrorMessage('');
                }, 500);
            }, 3000);

            return () => clearTimeout(timer);
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