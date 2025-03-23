export interface IOperatorValue {
    id: number,
    name: string,
};

export interface IOperator {
    [key: string]: IOperatorValue
};

export interface IRuleType {
    [key: string]: {
        id: number,
        name: string,
    }
};

export interface IRuleOperator {
    [key: string]: IOperatorValue[],
}

export interface IOption {
    value: number,
    label: string,
};

/**
 * ruleId => id corresponding to the rule type
 * 
 * operatorId => id corresponding to the rule operator
 * 
 * collection => valid for rule types with a collection associated to them
 * 
 * value => valid for rule types with a single value
 * 
 * additionalValue => valid for rule types that need an additional data to the 'value'
 * **/
export interface ISelectedRule {
    ruleId: number,
    operatorId?: number,
    collection?: IOption[],
    value?: string | number,
    additionalValue?: string | number,
};
