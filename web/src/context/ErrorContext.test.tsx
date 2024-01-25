import React, { useContext } from 'react';
import { render, act } from '@testing-library/react';
import { ErrorProvider, ErrorContext } from './ErrorContext';

describe('ErrorProvider', () => {
  it('provides default values', () => {
    let contextValues: { errorMessage: string | null, setErrorMessage: (message: string | null) => void };
    render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    function TestComponent() {
      contextValues = useContext(ErrorContext);
      return null;
    }
    // @ts-ignore TS2454
    expect(contextValues.errorMessage).toBeNull();
    // @ts-ignore TS2454
    expect(typeof contextValues.setErrorMessage).toBe('function');
  });

  it('updates errorMessage when setErrorMessage is called', () => {
    let contextValues: { errorMessage: string | null, setErrorMessage: (message: string | null) => void };
    const { rerender } = render(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );

    function TestComponent() {
      contextValues = useContext(ErrorContext);
      return null;
    }

    act(() => {
      contextValues.setErrorMessage('Test error message');
    });

    rerender(
      <ErrorProvider>
        <TestComponent />
      </ErrorProvider>
    );
    // @ts-ignore TS2454
    expect(contextValues.errorMessage).toBe('Test error message');
  });
});