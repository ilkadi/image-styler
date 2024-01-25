// FILEPATH: /c:/Projects/ovms/web/src/api/uploadImage.test.ts
import axios from 'axios';
import uploadImage from './uploadImage';

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
  }));

describe('uploadImage', () => {

  it('returns image URL when upload succeeds', async () => {
    URL.createObjectURL = jest.fn(() => 'http://mockurl.com');
    const mockFile = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    (axios.post as jest.Mock).mockResolvedValue({
        data: { fileUrl: 'http://mockurl.com' },
      });

    const url = await uploadImage(mockFile, 'style1');
    expect(url).toEqual('http://mockurl.com');
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/v1/stylecise/style1'), expect.any(FormData), expect.any(Object));
  });

  it('throws an error when upload fails', async () => {
    const mockFile = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    (axios.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(uploadImage(mockFile, 'style1')).rejects.toThrow('Network error');
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/v1/stylecise/style1'), expect.any(FormData), expect.any(Object));
  });
});