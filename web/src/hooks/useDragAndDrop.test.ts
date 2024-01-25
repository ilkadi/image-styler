import { renderHook, act } from '@testing-library/react-hooks';
import useDragAndDrop from './useDragAndDrop';

describe('useDragAndDrop', () => {
  it('handles drag and drop events correctly', () => {
    const setImageFile = jest.fn();
    const { result } = renderHook(() => useDragAndDrop(setImageFile));

    // Mock file for drop event
    const file = new File(['dummy content'], 'dummy.png', { type: 'image/png' });
    const dropEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        files: [file],
      },
    };

    // Mock drag event
    const dragEvent = {
      preventDefault: jest.fn(),
    };

    // Test drag over event
    act(() => {
      // @ts-ignore TS2454
      result.current.handleDragOver(dragEvent);
    });
    expect(result.current.isDragging).toBe(true);

    // Test drag leave event
    act(() => {
      // @ts-ignore TS2454
      result.current.handleDragLeave(dragEvent);
    });
    expect(result.current.isDragging).toBe(false);

    // Test drop event
    act(() => {
      // @ts-ignore TS2454
      result.current.handleDrop(dropEvent);
    });
    expect(setImageFile).toHaveBeenCalledWith(file);
    expect(result.current.isDragging).toBe(false);
  });
});