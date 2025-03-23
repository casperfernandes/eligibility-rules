import { type ChangeEvent, Fragment, type OptionHTMLAttributes, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { OPERATORS, RULE_OPERATORS, RULE_PRIORITY, RULE_TYPES } from "./constants/rules";
import { ALL_COLLECTIONS, ALL_PRODUCTS, ALL_TAGS } from "./constants/collections";
import SearchDropdownWithCheckbox from "./components/SearchDropdownWithCheckbox";
import type { IOperatorValue, IOption, ISelectedRule } from "./types/types";
import { getDisabledOperators } from "./utils/utils";
import CustomSelect from "./components/CustomSelect";
import CustomInput from "./components/CustomInput";


const RuleCreator = () => {
    const [selectedRules, setSelectedRules] = useState<ISelectedRule[]>([]);

    // keeps track of the rules not yet added by the user
    const [availableRuleTypes, setAvailableRuleTypes] = useState<number[]>([]);

    useEffect(() => {
        const selectedRuleIds = selectedRules.map(item => item.ruleId);

        setAvailableRuleTypes(RULE_PRIORITY.filter(id => !selectedRuleIds.includes(id)));
    }, [selectedRules]);

    const ruleTypesById = useMemo(() => {
        const byId: { [key: string]: IOperatorValue } = {};
        Object.keys(RULE_TYPES).forEach(rule => {
            byId[RULE_TYPES[rule].id] = RULE_TYPES[rule]
        });

        return byId;
    }, []);

    // match the collection to the rule
    const collectionsByRuleType = useMemo(() => {
        return {
            [RULE_TYPES.specificCollections.id]: { collection: ALL_COLLECTIONS, placeholder: 'Search Collection' },
            [RULE_TYPES.productTags.id]: { collection: ALL_TAGS, placeholder: 'Search Product Vendors' },
            [RULE_TYPES.specificProducts.id]: { collection: ALL_PRODUCTS, placeholder: 'Select Product' },
        };
    }, []);

    const getRuleTypeOptions = (currentRuleId: number) => {
        // mapping against RULE_PRIORITY to display rule type options by priority order.
        // selected rules are disabled
        return RULE_PRIORITY.map(ruleId => (
            {
                value: ruleId,
                label: ruleTypesById[ruleId].name,
                disabled: ruleId !== currentRuleId && !availableRuleTypes.includes(ruleId),
            }
        )) as OptionHTMLAttributes<HTMLOptionElement>[];
    };

    const getOperatorOptions = (iterator: IOperatorValue[], currentRuleId: number, currentOperatorId?: number) => {
        const disabledOperators = getDisabledOperators(currentRuleId, selectedRules);

        return iterator.map(item => {
            return {
                value: item.id,
                label: item.name,
                disabled: disabledOperators.includes(item.id) && item.id !== currentOperatorId
            }
        }) as OptionHTMLAttributes<HTMLOptionElement>[];
    };

    const handleRuleSelectChange = (event: ChangeEvent<HTMLSelectElement>, index: number) => {
        setSelectedRules(prevState => {
            const updatedState = [...prevState];
            updatedState[index] = {
                ...updatedState[index],
                ruleId: Number(event.target.value),
            };

            // Once a rule type is selected by the user, sort it based on RULE_PRIORITY
            updatedState.sort((a, b) => RULE_PRIORITY.indexOf(a.ruleId) - RULE_PRIORITY.indexOf(b.ruleId));

            return updatedState;
        });
    };

    const handleOperatorSelectChange = (event: ChangeEvent<HTMLSelectElement>, index: number) => {
        setSelectedRules(prevState => {
            const updatedState = [...prevState];
            updatedState[index] = {
                ...updatedState[index],
                operatorId: Number(event.target.value),
            };

            return updatedState;
        });
    };

    const handleOptionClick = (currentRuleIndex: number, option: IOption, isChecked: boolean) => {
        setSelectedRules(prevState => {
            const newRules = [...prevState];
            if (isChecked) {
                newRules?.[currentRuleIndex]?.collection?.push(option);
            } else {
                newRules[currentRuleIndex].collection = newRules?.[currentRuleIndex]?.collection?.filter(item => item.value !== option.value);
            }

            return newRules;
        });
    };

    const handleAddRule = () => {
        const newRuleId = availableRuleTypes[0];

        const newRule: ISelectedRule = {
            ruleId: newRuleId,
            operatorId: RULE_OPERATORS?.[newRuleId]?.[0]?.id,
            collection: [RULE_TYPES.specificCollections.id, RULE_TYPES.productTags.id, RULE_TYPES.specificProducts.id].includes(newRuleId) ? [] : undefined,
            value: [RULE_TYPES.specificDiscountCodes.id, RULE_TYPES.cartValueRange.id].includes(newRuleId) ? '' : undefined,
            additionalValue: [RULE_TYPES.cartValueRange.id].includes(newRuleId) ? '' : undefined,
        };

        setSelectedRules(prevState => {
            const newRules = [...prevState];

            const insertIndex = newRules.findIndex(item => RULE_PRIORITY.indexOf(item.ruleId) > RULE_PRIORITY.indexOf(newRuleId));

            if (insertIndex === -1) {
                newRules.push(newRule);
            } else {
                newRules.splice(insertIndex, 0, newRule);
            }

            return newRules;
        });
    };

    const handleRemoveRule = (currentRuleId: number) => {
        setSelectedRules(prevState => {
            return prevState.filter(item => item.ruleId != currentRuleId);
        });
    };

    console.log(selectedRules);

    return (
        <StyledContainer>
            <div className="title">Show offer if</div>

            {selectedRules.map((rule, index) => {
                const { ruleId, operatorId, collection, value, additionalValue } = rule;

                return (
                    <Fragment key={ruleId}>
                        <div style={{ position: 'relative', paddingBottom: '1.5rem' }}>
                            <div className="rule-container">
                                <div className="rule">
                                    <CustomSelect
                                        value={ruleId}
                                        options={getRuleTypeOptions(ruleId)}
                                        onChange={event => handleRuleSelectChange(event, index)}
                                    />

                                    {/* OPERATOR DISPLAY SECTION */}
                                    {selectedRules[index + 1] ? (
                                        <div className="operator-display">
                                            <span>AND</span>
                                        </div>
                                    ) : null}

                                    {RULE_OPERATORS[ruleId].length ? (
                                        <CustomSelect
                                            value={operatorId}
                                            options={getOperatorOptions(RULE_OPERATORS[ruleId], ruleId, operatorId)}
                                            onChange={event => handleOperatorSelectChange(event, index)}
                                        />
                                    ) : null}

                                    {collectionsByRuleType[ruleId] ? (
                                        <SearchDropdownWithCheckbox
                                            allOptions={collectionsByRuleType[ruleId].collection}
                                            placeholder={collectionsByRuleType[ruleId].placeholder}
                                            onOptionClick={(option: IOption, isChecked: boolean) => handleOptionClick(index, option, isChecked)}
                                            isCheckedHandler={(optionValue: number) => !!collection?.some(item => item.value === optionValue)}
                                        >
                                            <div className="count">{`${collection?.length || 0}/${collectionsByRuleType[ruleId].collection?.length || 0}`}</div>
                                        </SearchDropdownWithCheckbox>
                                    ) : null}

                                    {ruleId === RULE_TYPES.specificDiscountCodes.id ? (
                                        <CustomInput
                                            initValue={value || ''}
                                            placeholder="Enter codes as a comma separated string"
                                            onInputChange={(value) => {
                                                setSelectedRules(prevState => {
                                                    const newRules = [...prevState];
                                                    newRules[index].value = value;

                                                    return newRules;
                                                })
                                            }}
                                        />
                                    ) : null}

                                    {ruleId === RULE_TYPES.cartValueRange.id ? (
                                        <>
                                            <CustomInput
                                                initValue={value || ''}
                                                placeholder="Enter number"
                                                onInputChange={(value) => {
                                                    setSelectedRules(prevState => {
                                                        const newRules = [...prevState];
                                                        newRules[index].value = Number(value);

                                                        return newRules;
                                                    })
                                                }}
                                                type="number"
                                            />

                                            {operatorId === OPERATORS.isBetween.id ? (
                                                <CustomInput
                                                    initValue={additionalValue || ''}
                                                    placeholder="Enter number"
                                                    onInputChange={(value) => {
                                                        setSelectedRules(prevState => {
                                                            const newRules = [...prevState];
                                                            newRules[index].additionalValue = Number(value);

                                                            return newRules;
                                                        })
                                                    }}
                                                    type="number"
                                                />
                                            ) : null}
                                        </>
                                    ) : null}

                                    <button
                                        className="remove-button"
                                        onClick={() => handleRemoveRule(ruleId)}
                                    >
                                        X
                                    </button>
                                </div>
                            </div>

                            {collection?.length ? (
                                <div className="collection-container">
                                    {collection.map(item => {
                                        return (
                                            <div
                                                key={`${item.value}${item.label}`}
                                            >
                                                {item.label}

                                                <span
                                                    onClick={() => {
                                                        setSelectedRules(prevState => {
                                                            const newRules = [...prevState];
                                                            newRules[index].collection = newRules[index].collection?.filter(currentItem => item.value !== currentItem.value);

                                                            return newRules;
                                                        });
                                                    }}
                                                >
                                                    X
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </div>
                    </Fragment>
                );
            })}

            <div className="add-button-section">
                <button
                    onClick={handleAddRule}
                    disabled={!availableRuleTypes.length}
                >
                    + AND
                </button>
            </div>
        </StyledContainer>
    );
};

export default RuleCreator;

export const StyledContainer = styled.div`
    padding-left: 2rem;
    
    .title {
        color: #202223;
        font-size: 14px;
        /* margin-bottom: -1rem; */
    }
    
    .rule-container {
        display: flex;
        
        .rule {
            /* position: relative; */
            display: flex;
            flex-grow: 1;
            gap: 10px;
        }
    }

    .operator-display {
        position: absolute;
        display: grid;
        /* background: red; */
        padding: 10px;
        top: 20px;
        bottom: -10px;
        left: -55px;
        place-content: center;

        span {
            background: white;
        }
        /* position: absolute;
        display: inline-block;
        background:white;
        padding: 10px;
        top: 0;
        bottom: 0; */

        &:after {
            content: "";
            width: 27px;
            /* height: 100px; */
            border: 1px solid black;
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            border-right: 0px;
            z-index: -1;
            /* transform: translatey(-50%);

            /* content: "";
            width: 100px;
            height:100px;
            border-left:1px solid black;
            position: absolute;
            left: 50%;
            top:50%;
            transform:translatey(-50%); */

            /* border-right:0px; */
            /* content: "";
            width: 30px;
            height: 79px;
            border: 1px solid black;
            position: absolute;
            right: 100%;
            top: 130%;
            transform: translatey(-50%);*/
        }
    }

    .remove-button {
        background: transparent;
        outline: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-weight: 600;

        &:hover {
            color: black;
        }
    }

    .collection-container {
        div {
            background: #E3E3E3;
            padding: 2px 6px;
            border-radius: 8px;
            margin: 5px 5px 0 0;
            font-size: 12px;
            display: inline-block;
            color: #303030;
        }

        span {
            margin-left: 10px;
            cursor: pointer;
            color: #8A8A8A;
            font-weight: 600
        }
    }

    .add-button-section {
        text-align: center;

        button {
            background: transparent;
            border: 1px solid grey;
            border-radius: 6px;
            padding: 10px 15px;
            font-size: 14px;
            margin-top: 1.5rem;
            cursor: pointer;

            &:hover {
                border-color: black;
            }

            &:disabled {
                border: 1px solid grey;
                opacity: 0.5;
                cursor: auto;
            }
        }
    }
`;
