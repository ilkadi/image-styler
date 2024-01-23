import React from 'react';
import spinnerImage from '../../assets/yin-yang-solid.svg';
import './ImagePreview.css';

interface ImagePreviewProps {
    image: string;
    imageText?: string;
    isLoading?: boolean;
    className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, imageText, isLoading, className }) => {
    return (
        <div className={`image-container ${className}`}>
        {!isLoading && (
            <>
                <img src={image} />
                {imageText && <p>{imageText}</p>}
            </>
        )}
            {isLoading && <img src={spinnerImage} className="spinner" />}
        </div>
    );
};

export default ImagePreview;
