import React, { useState, useRef, useEffect } from 'react';
import ImagePreview from '../ImagePreview/ImagePreview';
import defaultImage from '../../assets/upload-solid.svg';
import dropHereImage from '../../assets/circle-down-solid.svg';
import useFileUpload from '../../hooks/useFileUpload';
import useDragAndDrop from '../../hooks/useDragAndDrop';
import './UploadImage.css';

interface UploadImageProps {
    onImageUpload: (url: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    selectedStyle: string | null;
}

const UploadImage: React.FC<UploadImageProps> = ({ onImageUpload, setIsLoading, selectedStyle }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);
    const { previewImage, processFile } = useFileUpload(onImageUpload, setIsLoading);
    const { isDragging, handleDrop, handleDragOver, handleDragLeave } = useDragAndDrop(setImageFile);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageFile(event.target.files?.[0]);
    };

    useEffect(() => {
        if (imageFile && selectedStyle) {
            processFile(imageFile, selectedStyle);
        }
    }, [imageFile, selectedStyle]);

    return (
        <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
            {!isDragging && !previewImage && <ImagePreview image={defaultImage} imageText='Drag an image into this box or choose it using a button below' />}
            {!isDragging && previewImage && <ImagePreview image={previewImage} />}
            {isDragging && <ImagePreview className="dragging" image={dropHereImage} imageText='Drop Image Here'/>}
            
            <div>
                <input ref={fileInputRef} id="file-input" className="file-input" type="file" accept="image/*" onChange={handleImageChange} />
                <label htmlFor="file-input" className="button">
                    {previewImage ? "Choose another image" : "Choose an image"}
                </label>
            </div>
        </div>
    );
};

export default UploadImage;
