import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import HeaderBar from './HeaderBar';
import useStyles from '../../hooks/useStyles';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock('../../hooks/useStyles');
jest.mock("react-select", () => ({ options, value, onChange }: { options: any[], value: any, onChange: any }) => {
  function handleChange(event: { currentTarget: { value: any; }; }) {
    const option = options.find(
      option => option.value === event.currentTarget.value
    );
    onChange(option);
  }
  return (
    <select data-testid="select" value={value} onChange={handleChange}>
    <option disabled>{'Loading styles...'}</option>
      {options.map((style) => (
      <option key={style.value} value={style.value}>
        {style.label}
      </option>
      ))}
    </select>
  );
});

describe('HeaderBar with Styles', () => {
  const handleStyleChange = jest.fn();

  beforeEach(async () => {
    (useStyles as jest.Mock).mockReturnValue({
      styles: ['style1', 'style2'],
      isLoading: false,
    });
    render(<HeaderBar handleStyleChange={handleStyleChange} />);
    // Wait for the useEffect hook to run
    await waitFor(() => expect(handleStyleChange).toHaveBeenCalledWith('style1'));
    handleStyleChange.mockClear();
  });

  test('renders HeaderBar component with styles available', () => {
    // Check if the logo is displayed
    const logo = screen.getByAltText('Logo');
    expect(logo).toBeInTheDocument();

    // Check if the spinner image is displayed
    const spinner = screen.queryByRole('img', { name: /bar-spinner/i });
    expect(spinner).not.toBeInTheDocument();
  });

  test('sets selectedStyle to the first style on mount', async () => {
    // Simulate clicking the select to open the dropdown
    userEvent.click(screen.getByRole('combobox'));
  
    // Wait for the options to appear in the DOM
    const options = await screen.findAllByRole('option');
  
    expect(options[1]).toHaveTextContent('style1');
  });

  test('updates selectedStyle and calls handleStyleChange when a new style is selected', async () => {
    userEvent.selectOptions(screen.getByTestId('select'), ['style2']);
    
    const options = await screen.findAllByRole('option');
    
    await waitFor(() => expect(handleStyleChange).toHaveBeenCalledWith('style2'));
  });

  test('renders correct number of style options', async () => {
    // Simulate clicking the select to open the dropdown
    userEvent.click(screen.getByRole('combobox'));
    
    // Wait for the options to appear in the DOM
    const options = await screen.findAllByRole('option');
    
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveTextContent('style1');
    expect(options[2]).toHaveTextContent('style2');
  });
});

describe('HeaderBar with Styles unavailable', () => {
  const handleStyleChange = jest.fn();

  beforeEach(() => {
    (useStyles as jest.Mock).mockReturnValue({
      styles: [],
      isLoading: true,
    });
    handleStyleChange.mockClear();
  });

  test('renders HeaderBar component while styles are loading', async () => {
    render(<HeaderBar handleStyleChange={handleStyleChange} />);

    const logo = await screen.findByAltText('Logo');
    expect(logo).toBeInTheDocument();

    const spinner = await screen.findByAltText('Spinner');
    expect(spinner).toBeInTheDocument();

    const select = screen.getByRole('combobox');
    expect(select).toHaveTextContent('Loading styles...');
  });
});

describe('HeaderBar with unusual style names', () => {
  const handleStyleChange = jest.fn();

  beforeEach(() => {
    (useStyles as jest.Mock).mockReturnValue({
      styles: ['style1@#$', 'style2'],
      isLoading: false,
    });
    handleStyleChange.mockClear();
  });

  test('renders style options with unusual names', async () => {
    render(<HeaderBar handleStyleChange={handleStyleChange} />);

    // Simulate clicking the select to open the dropdown
    userEvent.click(screen.getByRole('combobox'));

    // Wait for the options to appear in the DOM
    const options = await screen.findAllByRole('option');

    expect(options[1]).toHaveTextContent('style1@#$');
  });
});