import styled from "styled-components";

const StyledButton = styled.button<ButtonProps>`
    padding: ${({ size }) => {
        switch (size) {
            case "small":
                return "6px 12px";
            case "large":
                return "14px 28px";
            default:
                return "0.5rem 1.5rem";
        }
    }};
    background-color: ${({ color = "primary" }) => {
        switch (color) {
            case "secondary":
                return "var(--secondary)";
            case "danger":
                return "var(--danger)";
            default:
                return "var(--primary)";
        }
    }};  
font-weight: ${({ size }) => {
        switch (size) {
            case "small":
                return "300";
            case "large":
                return "700";
            default:
                return "500";
        }
    }};
   font-size: ${({ size }) => {
        switch (size) {
            case "small":
                return "0.85rem";
            case "large":
                return "1rem";
            default:
                return "0.9rem";
        }
    }}; 
  color: white;
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.2s ease;
  margin: 5px;
    &:hover {
        background-color: ${({ color = "primary" }) => {
        switch (color) {
            case "secondary":
                return "var(--primary-hover))";
            case "danger":
                return "var(--danger)";
            default:
                return "var(--primary)";
        }
    }}; 
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
`;

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    size?: "small" | "medium" | "large";
    color?: "primary" | "secondary" | "danger";
}

export const Button = ({
    children,
    onClick,
    disabled,
    size = "medium",
    color = "primary"
}: ButtonProps) => {
    return (
        <StyledButton
            size={size}
            color={color}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </StyledButton>
    );
};