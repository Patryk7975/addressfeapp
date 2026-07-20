import { type ChangeEvent } from "react";
import styled from "styled-components";

const DatepickerWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const DatepickerLabel = styled.label`
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-muted, #888);
    letter-spacing: 0.03em;
    text-transform: uppercase;
`;

const DatepickerInput = styled.input`
    display: block;
    width: 100%;
    padding: 7px 10px;
    border: 1.5px solid var(--border, #d0d5dd);
    border-radius: var(--radius-md, 6px);
    font-size: 0.9rem;
    font-family: var(--font-body, inherit);
    color: var(--text-primary, #1a1a2e);
    background: var(--surface, #fff);
    box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.06));
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    outline: none;
    box-sizing: border-box;
    cursor: pointer;

    &:focus {
        border-color: var(--primary, #4f6ef7);
        box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.12);
    }

    /* Calendar icon color (Chrome/Edge) */
    &::-webkit-calendar-picker-indicator {
        opacity: 0.5;
        cursor: pointer;
        transition: opacity 0.15s ease;
    }

    &::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
    }
`;

interface DatepickerProps {
    id: string;
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
}

export const Datepicker = ({
    id,
    label,
    value,
    onChange,
}: DatepickerProps) => {
    return (
        <DatepickerWrapper>
            <DatepickerLabel htmlFor={id}>{label}</DatepickerLabel>
            <DatepickerInput
                id={id}
                type="date"
                value={value ?? ""}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onChange(event.target.value === "" ? null : event.target.value)
                }
            />
        </DatepickerWrapper>
    );
};
