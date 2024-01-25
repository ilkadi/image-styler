import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import UploadImage from './UploadImage';
import useFileUpload from '../../hooks/useFileUpload';
import useDragAndDrop from '../../hooks/useDragAndDrop';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }));
jest.mock('../../hooks/useFileUpload');
jest.mock('../../hooks/useDragAndDrop');

describe('UploadImage', () => {
  let mockOnImageUpload: jest.Mock<any, any>;
  let mockSetIsLoading: jest.Mock<any, any>;

  beforeEach(() => {
    mockOnImageUpload = jest.fn();
    mockSetIsLoading = jest.fn();

    (useFileUpload as jest.Mock).mockReturnValue({
      previewImage: undefined,
      processFile: mockOnImageUpload,
    });

    (useDragAndDrop as jest.Mock).mockReturnValue({
      isDragging: false,
      handleDrop: jest.fn(),
      handleDragOver: jest.fn(),
      handleDragLeave: jest.fn(),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    render(<UploadImage onImageUpload={mockOnImageUpload} setIsLoading={mockSetIsLoading} selectedStyle="style1" />);
  });

  it('calls onImageUpload and setIsLoading when an image is uploaded', () => {
    const { getByLabelText } = render(<UploadImage onImageUpload={mockOnImageUpload} setIsLoading={mockSetIsLoading} selectedStyle="style1" />);

    const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    const input = getByLabelText('Choose an image');

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnImageUpload).toHaveBeenCalled();
  });

  it('displays default image and text when no image is uploaded', () => {
    const { getByText } = render(<UploadImage onImageUpload={mockOnImageUpload} setIsLoading={mockSetIsLoading} selectedStyle="style1" />);
  
    expect(getByText('Drag an image into this box or choose it using a button below')).toBeInTheDocument();
  });
  
  it('displays "Drop Image Here" text when dragging over', () => {
    (useDragAndDrop as jest.Mock).mockReturnValue({
        isDragging: true,
        handleDrop: jest.fn(),
        handleDragOver: jest.fn(),
        handleDragLeave: jest.fn(),
      });
    const { getByText } = render(<UploadImage onImageUpload={mockOnImageUpload} setIsLoading={mockSetIsLoading} selectedStyle="style1" />);
  
    expect(getByText('Drop Image Here')).toBeInTheDocument();
  });
  
  it('calls setImageFile when an image is dropped', () => {
    const mockHandleDrop = jest.fn();
    (useDragAndDrop as jest.Mock).mockReturnValue({
        isDragging: true,
        handleDrop: mockHandleDrop,
        handleDragOver: jest.fn(),
        handleDragLeave: jest.fn(),
      });
    const { getByText } = render(<UploadImage onImageUpload={mockOnImageUpload} setIsLoading={mockSetIsLoading} selectedStyle="style1" />);
  
    const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    const event = { preventDefault: jest.fn(), dataTransfer: { files: [file] } };
  
    fireEvent.drop(getByText('Drop Image Here'), event);
  
    expect(mockHandleDrop).toHaveBeenCalledWith(expect.objectContaining({
        dataTransfer: { files: [file] }
      }));
  });
  
  it('displays "Choose another image" when an image is already uploaded', async () => {
    const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    (useFileUpload as jest.Mock).mockReturnValue({
      previewImage: file,
      processFile: mockOnImageUpload,
    });
    const { getByText } = render(<UploadImage onImageUpload={mockOnImageUpload} setIsLoading={mockSetIsLoading} selectedStyle="style1" />);
  
    expect(getByText('Choose another image')).toBeInTheDocument();
  });
});