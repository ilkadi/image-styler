import React, { useState }  from 'react';
import UploadImage from '../../components/UploadImage/UploadImage';
import GeneratedImage from '../../components/GeneratedImage/GeneratedImage';
import defaultImage from '../../assets/brain-solid.svg';

interface HomePageProps {
    selectedStyle: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ selectedStyle }) => {
    const [styledImage, setStyledImage] = useState<string>(defaultImage);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleImageUpload = (url: string) => {
        setStyledImage(url);
        setIsLoading(false);
    };

    return (
        <div>
            <div className="container">
                <div>
                    <UploadImage onImageUpload={handleImageUpload} setIsLoading={setIsLoading} selectedStyle={selectedStyle}/>
                </div>
                <div>
                    <GeneratedImage imageUrl={styledImage} isLoading={isLoading}/>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
