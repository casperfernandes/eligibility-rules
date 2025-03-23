import { EXCLUSION_OPERATORS, INCLUSION_OPERATORS, MUTUALLY_EXCLUSIVE_RULES } from "../constants/rules";
import type { ISelectedRule } from "../types/types";


/**
    Gets the operators(INCLUSION_OPERATORS/EXCLUSION_OPERATORS) that are available to use for a particular rule type,
    based on the MUTUALLY_EXCLUSIVE_RULES
**/
export const getDisabledOperators = (ruleId: number, selectedRules: ISelectedRule[]) => {
    // Find if this rule type is part of a mutually exclusive group
    const mutualGroup = MUTUALLY_EXCLUSIVE_RULES.find((group) => group.includes(ruleId))

    if (!mutualGroup) return []

    // Check if any other rule in the same group exists
    const relatedRules = selectedRules.filter(rule => mutualGroup.includes(rule.ruleId) && rule.ruleId !== ruleId)

    if (relatedRules.length === 0) return []

    // If any related rule uses an inclusion operator, disable inclusion operators for this rule
    // If any related rule uses an exclusion operator, disable exclusion operators for this rule
    const relatedUsesInclusion = relatedRules.some(rule => rule.operatorId && INCLUSION_OPERATORS.includes(rule.operatorId))
    const relatedUsesExclusion = relatedRules.some(rule => rule.operatorId && EXCLUSION_OPERATORS.includes(rule.operatorId))

    if (relatedUsesInclusion) return INCLUSION_OPERATORS
    if (relatedUsesExclusion) return EXCLUSION_OPERATORS

    return []
};
