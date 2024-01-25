import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ErrorDisplay from './ErrorDisplay';
import { ErrorContext } from '../../context/ErrorContext';

describe('ErrorDisplay', () => {
    let errorMessage: string | null;
    let setErrorMessage: jest.Mock;
  
    beforeEach(() => {
      errorMessage = 'Test error';
      setErrorMessage = jest.fn().mockImplementation((newMessage: string | null) => {
        errorMessage = newMessage;
      });
    });

  test('renders error message and clears it after timeout', async () => {
    jest.useFakeTimers();

    const { queryByText } = render(
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
          <ErrorDisplay />
        </ErrorContext.Provider>
    );

    expect(queryByText('Test error')).toBeInTheDocument();

    // Fast-forward until the error message is hidden
    act(() => {
      jest.advanceTimersByTime(3001);
    });

    expect(queryByText('Test error')).toBeVisible();

    // Fast-forward until the error message is cleared
    act(() => {
      jest.advanceTimersByTime(500);
    });
    // Force a re-render of the ErrorDisplay component
    render(
        <ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
        <ErrorDisplay />
        </ErrorContext.Provider>,
        { container: document.body }
    );
    
    expect(setErrorMessage).toHaveBeenCalledWith('');
    expect(errorMessage).toEqual('');
    expect(queryByText('Test error')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  test('does not render when there is no error message', () => {
    const { container } = render(
      <ErrorContext.Provider value={{ errorMessage: null, setErrorMessage }}>
        <ErrorDisplay />
      </ErrorContext.Provider>
    );

    expect(container.firstChild).toBeNull();
  });
});