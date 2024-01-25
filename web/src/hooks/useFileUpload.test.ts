import { renderHook, act } from '@testing-library/react-hooks';
import uploadImage from '../api/uploadImage';
import useFileUpload from './useFileUpload';
import { ErrorContext } from '../context/ErrorContext';

const setErrorMessage = jest.fn();
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }));
jest.mock('../api/uploadImage');

describe('useFileUpload', () => {
  const onImageUpload = jest.fn();
  const setIsLoading = jest.fn();
  const mockFile = new File(['dummy content'], 'dummy.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('processes file and calls onImageUpload when upload succeeds', async () => {
    (uploadImage as jest.Mock).mockResolvedValue('http://mockurl.com');

    const { result } = renderHook(() => useFileUpload(onImageUpload, setIsLoading));

    await act(() => result.current.processFile(mockFile, 'style1'));

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(onImageUpload).toHaveBeenCalledWith('http://mockurl.com');
  });

  it('sets error message when upload fails', async () => {
    const mockError = new Error('Network error');
    (uploadImage as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFileUpload(onImageUpload, setIsLoading));

    await act(() => result.current.processFile(mockFile, 'style1'));

    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(false);
    expect(onImageUpload).not.toHaveBeenCalled();
  });

  it('sets error message when no file or no style selected', async () => {
    const { result } = renderHook(() => useFileUpload(onImageUpload, setIsLoading));

    await act(() => result.current.processFile(undefined, null));

    expect(setIsLoading).not.toHaveBeenCalled();
    expect(onImageUpload).not.toHaveBeenCalled();
  });
});