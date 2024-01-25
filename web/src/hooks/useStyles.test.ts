import { renderHook } from '@testing-library/react-hooks';
import getStyles from '../api/getStyles';
import useStyles from './useStyles';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }));
jest.mock('../api/getStyles');

describe('useStyles', () => {
  it('fetches styles and sets them when successful', async () => {
    const mockStyles = ['style1', 'style2', 'style3'];
    (getStyles as jest.Mock).mockResolvedValue(mockStyles);

    const { result, waitForNextUpdate } = renderHook(() => useStyles());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.styles).toEqual(mockStyles);
  });

  it('fetches styles and does sets default message when empty', async () => {
    (getStyles as jest.Mock).mockResolvedValue([]);

    const { result, waitForNextUpdate } = renderHook(() => useStyles());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.styles).toEqual(['Zero styles found']);
  });

  it('sets error when fetching styles fails', async () => {
    const mockError = new Error('Network error');
    (getStyles as jest.Mock).mockRejectedValue(mockError);

    const { result, waitForNextUpdate } = renderHook(() => useStyles());

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toEqual(mockError);
  });
});