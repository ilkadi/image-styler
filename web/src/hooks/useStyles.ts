import { useState, useEffect, useContext } from 'react';
import getStyles from '../api/getStyles';
import { ErrorContext } from '../context/ErrorContext';

const useStyles = () => {
    const [styles, setStyles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [error, setError] = useState<Error | null>(null);
    const { setErrorMessage } = useContext(ErrorContext);
    const retryInterval = 30000; 

    useEffect(() => {
        const fetchStyles = async () => {
            setIsLoading(true);
            try {
                const styles = await getStyles();
                if (styles.length > 0) {
                    setIsLoading(false);
                    setStyles(styles);
                    clearInterval(intervalId);
                } else {
                    setStyles(['Loading styles']);
                }
            } catch (error : any) {
                console.error('Error loading a style:', error);
                setError(error);
                setErrorMessage(error.message);
                setIsLoading(true);
            }
        };

        fetchStyles();
        const intervalId = setInterval(fetchStyles, retryInterval);
        return () => clearInterval(intervalId);
    }, []);

    return { styles, isLoading, error };
};

export default useStyles;