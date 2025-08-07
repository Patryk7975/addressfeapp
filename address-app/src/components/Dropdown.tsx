interface DropdownProps {
  propertyName: string,
  displayName: string,
  value: string | undefined,
  options: string[],
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const Dropdown = ({ propertyName, displayName, value, options, handleChange }: DropdownProps) => {

return <div className="dropdown">
        {displayName.length > 0 && <label htmlFor={propertyName} >{displayName}</label>}
        <select
          id={propertyName}
          name={propertyName}
          value={value}
          onChange={handleChange}
          required
        >
          {options.filter(e => e == value).map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
                    {options.filter(e => e != value).map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>
}