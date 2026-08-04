import { useState, useEffect, useRef } from "react";
import "./AutocompleteTextBox.css";

interface AutocompleteTextBoxProps {
    propertyName: string;
    displayName: string;
    value: string | undefined;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    fetchSuggestions: (value: string) => Promise<any[]>;
    minLength: number;
    className?: string;
}

export const AutocompleteTextBox = ({ propertyName, displayName, value, handleChange, fetchSuggestions, minLength, className }: AutocompleteTextBoxProps) => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
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
                setSuggestions(Array.isArray(results) ? results : []);
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

    const getSuggestionLabel = (suggestion: any): string => {
        if (typeof suggestion === "string") {
            return suggestion;
        }
        if (suggestion && typeof suggestion === "object") {
            if ("street" in suggestion) {
                const prefix = suggestion.prefix ? `${suggestion.prefix} ` : "";
                return `${prefix}${suggestion.street}`;
            }
            if ("name" in suggestion) {
                return String(suggestion.name);
            }
            if ("value" in suggestion) {
                return String(suggestion.value);
            }
            return Object.values(suggestion).filter(Boolean).join(" ");
        }
        return String(suggestion ?? "");
    };

    const getSuggestionValue = (suggestion: any): string => {
        if (typeof suggestion === "string") {
            return suggestion;
        }
        if (suggestion && typeof suggestion === "object") {
            if ("street" in suggestion && typeof suggestion.street === "string") {
                return suggestion.street;
            }
            if ("name" in suggestion && typeof suggestion.name === "string") {
                return suggestion.name;
            }
            if ("value" in suggestion && typeof suggestion.value === "string") {
                return suggestion.value;
            }
        }
        return getSuggestionLabel(suggestion);
    };

    const handleSuggestionClick = (suggestion: any) => {
        const value = getSuggestionValue(suggestion);
        const event = {
            target: {
                name: propertyName,
                value: value
            }
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(event);
        setShowSuggestions(false);
    };

    return (
        <div className={`textbox autocomplete-container ${className ?? ""}`} ref={wrapperRef}>
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
                            {getSuggestionLabel(suggestion)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
