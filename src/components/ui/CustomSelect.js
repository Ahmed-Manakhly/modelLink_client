import { useState, useRef, useEffect } from 'react';
import classes from './CustomSelect.module.scss';
import { IoIosArrowDown } from "react-icons/io";

const CustomSelect = ({ options, value, onChange, placeholder = "Select an option", className = "", disabled = false, isWeb = false, flatRight = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Find selected option
    const rawSelectedOption = options.find(opt => opt.value === value)?.label || placeholder;
    const selectedOption = typeof rawSelectedOption === 'string' && rawSelectedOption.length > 40
        ? rawSelectedOption.slice(0, 40) + "..."
        : rawSelectedOption;

    return (
        <div
            ref={wrapperRef}
            className={`${classes.customSelect} ${className} ${isOpen ? classes.open : ''} ${disabled ? classes.disabled : ''} ${isWeb ? classes.web : ''} ${flatRight ? classes.flatRight : ''}`}
        >
            <div className={classes.selectedValue} onClick={() => !disabled && setIsOpen(!isOpen)} tabIndex={disabled ? -1 : 0} >
                <span>{selectedOption}</span>
                <span className={classes.arrow}>
                    <IoIosArrowDown />
                </span>
            </div>
            {isOpen && (
                <div className={classes.dropdown}>
                    {options.map(option => (
                        <div
                            key={option.value}
                            className={`${classes.option} ${value === option.value ? classes.selected : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
