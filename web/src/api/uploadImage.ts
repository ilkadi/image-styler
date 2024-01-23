import axios from 'axios';

const uploadImage = async (file: File, style: string) => {
    const REACT_APP_API_HOST = process.env.REACT_APP_API_HOST || 'localhost';
    const REACT_APP_API_HOST_PORT = process.env.REACT_APP_API_HOST_PORT || '3001';
    const ENDPOINT_PATH = `/v1/stylecise/${style}`;
    const ENDPOINT_URL = `http://${REACT_APP_API_HOST}:${REACT_APP_API_HOST_PORT}${ENDPOINT_PATH}`;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(ENDPOINT_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
            timeout: 10000,
        });

        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error : any) {
        console.error('Error styling an image:', error);

        // If the request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response) {
            throw new Error(`HTTP error: ${error.response.status} - ${error.response.data}`);
        }

        // If the request was made but no response was received or request timed out
        if (error.request || error.code === 'ECONNABORTED') {
            throw new Error('Network error: Failed to upload image or request timed out.');
        }

        throw error;
    }
};

export default uploadImage;