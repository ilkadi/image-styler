import axios from 'axios';
import getStyles from './getStyles';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }));

describe('getStyles', () => {
  it('returns styles when request succeeds', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { styles: ['style1', 'style2'] } });

    const styles = await getStyles();

    expect(styles).toEqual(['style1', 'style2']);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/v1/styles'));
  });

  it('throws an error when request fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(getStyles()).rejects.toThrow('Failed to fetch styles from server');
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/v1/styles'));
  });
});