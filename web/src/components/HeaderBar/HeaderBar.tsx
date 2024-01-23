import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import logo from '../../logo.svg';
import './HeaderBar.css';
import useStyles from '../../hooks/useStyles';
import spinnerImage from '../../assets/spinner-solid.svg';

interface HeaderBarProps {
    handleStyleChange: (style: string | null) => void;
}

const HeaderBar:  React.FC<HeaderBarProps> = ({ handleStyleChange }) => {
    const { styles, isLoading } = useStyles();
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const options = styles.map(style => ({ value: style, label: style }));

    const handleChange = (newStyle: string) => {
        setSelectedStyle(newStyle);
        handleStyleChange(newStyle);
    };

    useEffect(() => {
        handleChange(styles[0]);
    }, [styles]);


    return (
        <header className="header-bar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <div className="dropdown-container">
                <span className="style-label">Conversion Style:</span>
                <Select
                    className="style-select"
                    value={options.find(option => option.value === selectedStyle)}
                    onChange={option => handleChange(option!.value)}
                    options={options}
                    placeholder='Loading styles...'
                    />
                {isLoading && <img src={spinnerImage} className="bar-spinner" />}
            </div>
        </header>
    );
};

export default HeaderBar;
