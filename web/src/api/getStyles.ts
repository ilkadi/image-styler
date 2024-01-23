import axios from 'axios';

const getStyles = async () => {
    const REACT_APP_API_HOST = process.env.REACT_APP_API_HOST || 'localhost';
    const REACT_APP_API_HOST_PORT = process.env.REACT_APP_API_HOST_PORT || '3001';
    const ENDPOINT_PATH = '/v1/styles';
    const ENDPOINT_URL = `http://${REACT_APP_API_HOST}:${REACT_APP_API_HOST_PORT}${ENDPOINT_PATH}`;

    try {
        const response = await axios.get(ENDPOINT_URL);
        return response.data.styles;
    } catch (error) {
        console.error('Failed to fetch styles from server:', error);
        throw new Error('Failed to fetch styles from server');
    }
};

export default getStyles;