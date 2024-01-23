import React, { useState, useEffect } from 'react';
import ImagePreview from '../ImagePreview/ImagePreview';
import defaultAiImage from '../../assets/brain-solid.svg';
import './GeneratedImage.css';

interface GeneratedImageProps {
    imageUrl: string;
    isLoading: boolean;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageUrl, isLoading }) => {
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    useEffect(() => {
        if (imageUrl !== defaultAiImage) {
            setGeneratedImage(imageUrl);
        }
    }, [imageUrl]);

    const handleDownload = () => {
        if(generatedImage === null) return;

        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'styled-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>            
            {!generatedImage && <ImagePreview image={defaultAiImage} isLoading={isLoading} imageText='Generated image will appear here' />}
            {generatedImage && <ImagePreview image={generatedImage} isLoading={isLoading}/>}
            <button onClick={handleDownload} className="button" disabled={!generatedImage}>Download Styled</button>
        </div>
    );
};

export default GeneratedImage;
