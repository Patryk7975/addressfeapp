import { type ChangeEvent } from "react";
import styled from "styled-components";

const TextboxWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const TextboxLabel = styled.label`
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-muted, #888);
    letter-spacing: 0.03em;
    text-transform: uppercase;
`;

const TextboxInput = styled.input`
    display: block;
    width: 100%;
    padding: 7px 10px;
    border: 1.5px solid var(--border, #d0d5dd);
    border-radius: var(--radius-md, 6px);
    font-size: 0.9rem;
    font-family: var(--font-body, inherit);
    color: var(--text-primary, #1a1a2e);
    background: var(--surface, #fff);
    box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.06));
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    outline: none;
    box-sizing: border-box;

    &:focus {
        border-color: var(--primary, #4f6ef7);
        box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.12);
    }

    &::placeholder {
        color: var(--text-muted, #aaa);
    }

    /* Remove browser default number arrows */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    &[type=number] {
        -moz-appearance: textfield;
    }
`;

interface TextboxProps {
    id: string;
    label: string;
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
}

export const Textbox = ({
    id,
    label,
    value,
    onChange,
    placeholder = "",
}: TextboxProps) => {
    return (
        <TextboxWrapper>
            <TextboxLabel htmlFor={id}>{label}</TextboxLabel>
            <TextboxInput
                id={id}
                type="text"
                value={value ?? ""}
                placeholder={placeholder}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    onChange(event.target.value)
                }
            />
        </TextboxWrapper>
    );
};