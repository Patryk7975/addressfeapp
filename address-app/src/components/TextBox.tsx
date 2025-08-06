interface TextBoxProps {
  propertyName: string,
  displayName: string,
  value: string | undefined,
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const TextBox = ({ propertyName, displayName, value, handleChange }: TextBoxProps) => {

    return <div className="textbox">
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