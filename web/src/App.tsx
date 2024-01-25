import React, { useState } from 'react';
import './App.css';
import HeaderBar from './components/HeaderBar/HeaderBar';
import ErrorDisplay from './components/ErrorDisplay/ErrorDisplay';
import HomePage from './pages/HomePage/HomePage';
import { ErrorProvider } from './context/ErrorContext';

function App() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleStyleChange = (style: string | null) => {
    setSelectedStyle(style);
  };

  return (
    <div className="App" data-testid="app">
      <ErrorProvider>
        <HeaderBar handleStyleChange={handleStyleChange} />
        <ErrorDisplay />
        <HomePage selectedStyle={selectedStyle} />
      </ErrorProvider>
    </div>
  );
}

export default App;
