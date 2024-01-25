import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import UploadImage from '../../components/UploadImage/UploadImage';
import GeneratedImage from '../../components/GeneratedImage/GeneratedImage';

jest.mock('../../components/UploadImage/UploadImage', () => jest.fn());
jest.mock('../../components/GeneratedImage/GeneratedImage', () => jest.fn());

describe('HomePage', () => {
  beforeEach(() => {
    (UploadImage as jest.Mock).mockImplementation(({ onImageUpload, setIsLoading }) => {
        return <input data-testid="upload" onChange={() => { onImageUpload('new-image-url'); setIsLoading(false); }} />;
    });  

    (GeneratedImage as jest.Mock).mockImplementation(({ imageUrl, isLoading }) => {
      return <div><img data-testid="generated" src={imageUrl} /><p>{isLoading}</p></div>;
    });
  });

  it('renders UploadImage and GeneratedImage components', () => {
    const { getByTestId } = render(<HomePage selectedStyle="style1" />);

    expect(getByTestId('upload')).toBeInTheDocument();
    expect(getByTestId('generated')).toBeInTheDocument();
  });

  it('updates the styledImage and isLoading state when an image is uploaded', async () => {
    const { getByTestId, rerender } = render(<HomePage selectedStyle="style1" />);
    const event = { target: { value: 'dummy' } };  
  
    fireEvent.change(getByTestId('upload'), event);
  
    // Force a re-render of the HomePage component
    rerender(<HomePage selectedStyle="style1" />);
  
    await waitFor(() => {
      expect(getByTestId('generated').getAttribute('src')).toEqual('new-image-url');
    });
  });
});