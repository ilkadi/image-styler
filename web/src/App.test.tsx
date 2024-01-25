import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import HeaderBar from './components/HeaderBar/HeaderBar';
import HomePage from './pages/HomePage/HomePage';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock('./components/HeaderBar/HeaderBar', () => jest.fn(() => null));
jest.mock('./components/ErrorDisplay/ErrorDisplay', () => jest.fn(() => null));
jest.mock('./pages/HomePage/HomePage', () => jest.fn(() => null));

test('renders child components', () => {
  render(<App />);
  expect(HeaderBar).toBeCalled();
  expect(ErrorDisplay).toBeCalled();
  expect(HomePage).toBeCalled();
});

test('passes handleStyleChange prop to HeaderBar', () => {
  render(<App />);
  expect(HeaderBar).toBeCalledWith(expect.objectContaining({
    handleStyleChange: expect.any(Function),
  }), {});
});

test('passes selectedStyle prop to HomePage', () => {
  render(<App />);
  expect(HomePage).toBeCalledWith(expect.objectContaining({
    selectedStyle: null,
  }), {});
});
