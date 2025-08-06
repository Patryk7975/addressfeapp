import { useState } from "react"

interface CheckBoxProps {
  propertyName: string,
  displayName: string,
  value: boolean
  handleChange: (name: string, value: boolean) => void
}

export const CheckBox = ({ propertyName, displayName, value, handleChange }: CheckBoxProps) => {

  const [isChecked, setIsChecked] = useState(value);

  const onClick = () => {
    handleChange(propertyName, !isChecked);
    setIsChecked(prev => !prev);
  }

  return <div className="checkbox">
    <label htmlFor={propertyName}>{displayName}</label>
    <input
      type="checkbox"
      id={propertyName}
      name={propertyName}
      defaultChecked={isChecked}
      onChange={onClick}
      required
    />
  </div>
}