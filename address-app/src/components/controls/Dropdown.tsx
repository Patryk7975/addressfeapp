import { type ChangeEvent } from "react";
import styled from "styled-components";

const DropdownWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const DropdownLabel = styled.label`
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-muted, #888);
    letter-spacing: 0.03em;
    text-transform: uppercase;
`;

const DropdownSelect = styled.select`
    display: block;
    width: 100%;
    padding: 7px 32px 7px 10px;
    border: 1.5px solid var(--border, #d0d5dd);
    border-radius: var(--radius-md, 6px);
    font-size: 0.9rem;
    font-family: var(--font-body, inherit);
    color: var(--text-primary, #1a1a2e);
    background-color: var(--surface, #fff);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.06));
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    outline: none;
    box-sizing: border-box;

    &:focus {
        border-color: var(--primary, #4f6ef7);
        box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.12);
    }
`;

interface DropdownOption {
    label: string;
    value: number | string;
}

interface DropdownProps {
    id: string;
    label: string;
    value: number | string | null;
    options: DropdownOption[];
    onChange: (value: number | null) => void;
    placeholder?: string;
}

export const Dropdown = ({
    id,
    label,
    value,
    options,
    onChange,
    placeholder = "Select",
}: DropdownProps) => {
    const getSelectedValue = () => {
        if (value === null || value === undefined || value === "") {
            return "";
        }
        
        const stringVal = String(value);
        if (options.some(opt => String(opt.value) === stringVal)) {
            return stringVal;
        }
        
        const lowerVal = stringVal.toLowerCase();
        const matchedOption = options.find(opt => opt.label.toLowerCase() === lowerVal);
        if (matchedOption) {
            return String(matchedOption.value);
        }
        
        return "";
    };

    return (
        <DropdownWrapper>
            <DropdownLabel htmlFor={id}>{label}</DropdownLabel>
            <DropdownSelect
                id={id}
                value={getSelectedValue()}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    onChange(event.target.value === "" ? null : Number(event.target.value))
                }
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.label} value={String(opt.value)}>
                        {opt.label}
                    </option>
                ))}
            </DropdownSelect>
        </DropdownWrapper>
    );
};
