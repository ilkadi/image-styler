import { useState } from 'react';

const useDragAndDrop = (setImageFile: (file: File) => void) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImageFile(file);
        setIsDragging(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    };

    return { isDragging, handleDrop, handleDragOver, handleDragLeave };
};

export default useDragAndDrop;