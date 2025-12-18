import React from "react";

interface AutoCompleteTextBoxProps {
    lbl: string;
    value: string;
    options: string[];
    onChange: (val: string, isSelect: boolean) => void;
}

export const AutoCompleteTextBox: React.FC<AutoCompleteTextBoxProps> = ({
    lbl,
    value,
    options,
    onChange,
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, false);
    };

    const handleSelect = (val: string) => {
        onChange(val, true);
    };

    return (
        <div style={{ width: "250px", margin: "20px auto" }}>
            <label>{lbl}</label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Wpisz wartość..."
                style={{ width: "100%", padding: "8px" }}
            />
            {options.length > 0 && (
                <ul
                    style={{
                        border: "1px solid #ccc",
                        marginTop: "0",
                        padding: "0",
                        listStyle: "none",
                    }}
                >
                    {options.map((item, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(item)}
                            style={{
                                padding: "8px",
                                cursor: "pointer",
                                background: "#fff",
                            }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};