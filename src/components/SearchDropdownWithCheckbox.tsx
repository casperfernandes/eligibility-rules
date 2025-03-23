import { type ChangeEvent, type JSX, useEffect, useRef, useState } from "react";

import type { IOption } from "../types/types";
import { StyledInput } from "./CustomInput";
import styled from "styled-components";

interface ISearchDropdownWithCheckbox {
    allOptions: IOption[],
    placeholder: string,
    onOptionClick:  (option: IOption, isChecked: boolean) => void,
    isCheckedHandler: (optionValue: number) => boolean,
    children: JSX.Element,
}

const SearchDropdownWithCheckbox = (props: ISearchDropdownWithCheckbox) => {
    const { allOptions, placeholder, onOptionClick, isCheckedHandler, children } = props;

    const [searchString, setSearchString] = useState<string>('');
    const [searchOptions, setSearchOptions] = useState<IOption[]>(allOptions);
    const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);

    const targetElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close the dropdown when clicked anywhere outside it
        const abortController = new AbortController();

        if (isShowDropdown) {
            const handleClickOutside = (event: MouseEvent) => {
                if (!targetElement?.current?.contains?.(event.target as Node)) {
                    setSearchString('');
                    setSearchOptions(allOptions);
                    setIsShowDropdown(false);
                }
            };

            addEventListener('click', handleClickOutside, { signal: abortController.signal })
        }

        return () => {
            abortController.abort();
        };
    }, [isShowDropdown, allOptions]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const searched = event.target.value;
        setSearchString(searched);
        const newOptions = allOptions.filter(item => item.label.toLowerCase().includes(searched.trim().toLowerCase()));
        setSearchOptions(newOptions);
    };

    return (
        <StyledContainer ref={targetElement}>
            <StyledInput
                value={searchString}
                placeholder={placeholder}
                onChange={handleInputChange}
                onClick={() => setIsShowDropdown(true)}
            />

            {isShowDropdown ? (
                <div className="dropdown">
                    <div className="inner-dropdown">
                        {searchOptions.map(option => {
                            return (
                                <label
                                    key={`${option.value}${option.label}`}

                                >
                                    <input
                                        type="checkbox"
                                        checked={isCheckedHandler(option.value)}
                                        onChange={(event) => onOptionClick(option, event.target.checked)}
                                    />

                                    {option.label}
                                </label>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {children}
        </StyledContainer>
    );
};

export default SearchDropdownWithCheckbox;

const StyledContainer = styled.div`
    position: relative;
    flex-grow: 1;

    .dropdown {
        position: absolute;
        top: 41px;
        border: 1px solid grey;
        border-radius: 12px;
        background: white; 
        padding: 6px;
        padding-right: 0;
        z-index: 1;
        box-sizing: border-box;
        width: 100%;
    }
    .inner-dropdown {
        max-height: 200px;
        overflow: auto;
        scrollbar-width: thin;

        label {
            height: 40px;
            line-height: 40px;
            border-radius: 8px;
            display: block;
            font-size: 14px;

            &:hover {
                background: #F1F1F1;
            }

            input {
                accent-color: black;
            }
        }
    }

    .count {
        position: absolute;
        top: 10px;
        right: 6px;
        color: #616161;
        font-size: 14px;
    }
`;
