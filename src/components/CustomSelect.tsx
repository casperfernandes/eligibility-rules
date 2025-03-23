import {
    type ChangeEventHandler,
    type OptionHTMLAttributes,
    type SelectHTMLAttributes
} from 'react';
import styled from 'styled-components';

interface ICustomSelect {
    options: OptionHTMLAttributes<HTMLOptionElement>[];
    onChange: ChangeEventHandler<HTMLSelectElement>;
    value?: SelectHTMLAttributes<HTMLSelectElement>['value'];
}

const CustomSelect = (props: ICustomSelect) => {
    const { value, options, onChange } = props;

    return (
        <StyledSelect value={value} onChange={onChange}>
            {options.map(option => (
                <option
                    key={`${option.label}${option.value}`}
                    value={option.value}
                    disabled={option.disabled}
                >
                    {option.label}
                </option>
            ))}
        </StyledSelect>
    );
};

export default CustomSelect;

const StyledSelect = styled.select`
    padding: 6px 8px;
    border: 1px solid #8A8A8A;
    border-radius: 8px;
    background: transparent;
    width: 192px;
    height: 36px;
    flex-grow: 1;
`;
