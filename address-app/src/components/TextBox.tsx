interface TextBoxProps {
  propertyName: string,
  displayName: string,
  value: string | undefined,
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  className?: string
}

export const TextBox = ({ propertyName, displayName, value, handleChange, className }: TextBoxProps) => {

    return <div className={`textbox ${className ?? ""}`}>
        <label htmlFor={propertyName}>{displayName}</label>
        <input
          type="text"
          id={propertyName} 
          name={propertyName} 
          value={value}
          onChange={handleChange}
          required
        />
      </div>
}