import { useState, useEffect, useRef } from "react";
import "./AutocompleteTextBox.css";

interface AutocompleteTextBoxProps {
    propertyName: string;
    displayName: string;
    value: string | undefined;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    fetchSuggestions: (value: string) => Promise<string[]>;
    minLength: number
}

export const AutocompleteTextBox = ({ propertyName, displayName, value, handleChange, fetchSuggestions, minLength }: AutocompleteTextBoxProps) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const onInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        const inputValue = e.target.value;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            getValues(inputValue);
        }, 300);
    };

    const onInputClick = async (e: React.MouseEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;
        
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            getValues(inputValue);
        }, 300);
    }

    const getValues = async (inputValue: string) => {
        if (inputValue.length >= minLength) {
            try {
                const results = await fetchSuggestions(inputValue);
                setSuggestions(results);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Error fetching suggestions", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        const event = {
            target: {
                name: propertyName,
                value: suggestion
            }
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(event);
        setShowSuggestions(false);
    };

    return (
        <div className="textbox autocomplete-container" ref={wrapperRef}>
            <label htmlFor={propertyName}>{displayName}</label>
            <input
                type="text"
                id={propertyName}
                name={propertyName}
                value={value}
                onChange={onInputChange}
                onClick={onInputClick}
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
