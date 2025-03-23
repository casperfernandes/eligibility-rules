import { useState, type ChangeEvent, type HTMLInputTypeAttribute } from "react";
import styled from "styled-components";

interface ICustomInputProps {
    initValue: number | string,
    placeholder: string,
    onInputChange: (value: string | number) => void,
    type?: HTMLInputTypeAttribute,
}

const CustomInput = (props: ICustomInputProps) => {
    const { initValue, placeholder, onInputChange, type } = props;

    const [inputValue, setInputValue] = useState<number | string>(initValue);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        onInputChange(value)
    };

    return (
        <StyledInput
            type={type}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            min={0}
        />
    );
};

export default CustomInput;

export const StyledInput = styled.input`
    padding: 6px 8px;
    border: 1px solid #8A8A8A;
    border-radius: 8px;
    background: transparent;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
`;