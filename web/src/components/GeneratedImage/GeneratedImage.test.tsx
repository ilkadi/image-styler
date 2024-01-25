import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GeneratedImage from './GeneratedImage';
import defaultAiImage from '../../assets/brain-solid.svg';
import ImagePreview from '../ImagePreview/ImagePreview';

jest.mock('../ImagePreview/ImagePreview', () => jest.fn(() => null));

describe('GeneratedImage', () => {
  const imageUrl = 'http://example.com/image.jpg';

  it('renders ImagePreview with default image when imageUrl is default', () => {
    render(<GeneratedImage imageUrl={imageUrl} isLoading={false} />);
    expect(ImagePreview).toHaveBeenCalledWith(expect.objectContaining({
      image: imageUrl,
      isLoading: false,
    }), {});
  });

  it('renders ImagePreview with generated image when imageUrl is not default', () => {
    render(<GeneratedImage imageUrl={imageUrl} isLoading={false} />);
    expect(ImagePreview).toHaveBeenCalledWith(expect.objectContaining({
      image: imageUrl,
      isLoading: false,
    }), {});
  });

  it('renders disabled download button when imageUrl is default', () => {
    const { getByText } = render(<GeneratedImage imageUrl={defaultAiImage} isLoading={false} />);
    expect(getByText('Download Styled')).toBeDisabled();
  });

  it('renders enabled download button when imageUrl is not default', () => {
    const { getByText } = render(<GeneratedImage imageUrl={imageUrl} isLoading={false} />);
    expect(getByText('Download Styled')).not.toBeDisabled();
  });

  it('triggers download when download button is clicked', () => {
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    const { getByText } = render(<GeneratedImage imageUrl={imageUrl} isLoading={false} />);
    fireEvent.click(getByText('Download Styled'));

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});