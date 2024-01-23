import { useState, useContext } from 'react';
import uploadImage from '../api/uploadImage';
import { ErrorContext } from '../context/ErrorContext';

const useFileUpload = (onImageUpload: (url: string) => void, setIsLoading: (isLoading: boolean) => void) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { setErrorMessage } = useContext(ErrorContext);

    const processFile = async (file: File | undefined, selectedStyle: string | null) => {
        if (file && selectedStyle) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);

            try {
                const processed_url = await uploadImage(file, selectedStyle);
                onImageUpload(processed_url);
            } catch (error: any) {
                setPreviewImage(null);
                setErrorMessage(error.message);
            }
            setIsLoading(false);
        } else {
            setErrorMessage('No file or no style selected.');
        }
    };

    return { previewImage, processFile };
};

export default useFileUpload;