import type { IRuleType, IOperator, IRuleOperator } from "../types/types";

export const OPERATORS: IOperator = {
    containsAny: { id: 1, name: 'contains any' },
    isNot: { id: 2, name: 'is not', },
    equalsAnything: { id: 3, name: 'equals anything', },
    yes: { id: 4, name: 'Yes', },
    no: { id: 5, name: 'No', },
    isEqualOrGreater: { id: 6, name: 'is equal or greater than', },
    isBetween: { id: 7, name: 'is between', },
    isLessThan: { id: 8, name: 'is less than', },
} as const;

export const INCLUSION_OPERATORS = [
    OPERATORS.containsAny.id,
    OPERATORS.equalsAnything.id,
];

export const EXCLUSION_OPERATORS = [
    OPERATORS.isNot.id,
];

export const RULE_TYPES: IRuleType = {
    specificCollections: { id: 1, name: 'Specific Collections' },
    productTags: { id: 2, name: 'Product Tags' },
    specificProducts: { id: 3, name: 'Specific Products' },
    productSubscribed: { id: 4, name: 'Product Subscribed' },
    specificDiscountCodes: { id: 5, name: 'Specific Discount Codes' },
    cartValueRange: { id: 6, name: 'Cart Value Range' },
};

export const RULE_PRIORITY = [
    RULE_TYPES.specificCollections.id,
    RULE_TYPES.productTags.id,
    RULE_TYPES.specificProducts.id,
    RULE_TYPES.productSubscribed.id,
    RULE_TYPES.specificDiscountCodes.id,
    RULE_TYPES.cartValueRange.id,
];

export const MUTUALLY_EXCLUSIVE_RULES = [
    [RULE_TYPES.specificCollections.id, RULE_TYPES.specificProducts.id]
];

export const RULE_OPERATORS: IRuleOperator = {
    [RULE_TYPES.specificCollections.id]: [OPERATORS.containsAny, OPERATORS.isNot],
    [RULE_TYPES.productTags.id]: [OPERATORS.containsAny, OPERATORS.isNot],
    [RULE_TYPES.specificProducts.id]: [OPERATORS.equalsAnything, OPERATORS.containsAny, OPERATORS.isNot],
    [RULE_TYPES.productSubscribed.id]: [OPERATORS.yes, OPERATORS.no],
    [RULE_TYPES.specificDiscountCodes.id]: [],
    [RULE_TYPES.cartValueRange.id]: [OPERATORS.isEqualOrGreater, OPERATORS.isBetween, OPERATORS.isLessThan],
};
