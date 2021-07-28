const baseTypeColors: Record<ValueType, string> = {
    "Boolean": "#DA8484",
    "String": "#DA84C7",
    "Integer": "#1BA9A9",
    "Float": "#84DA9C",
    "3D Vector": "#FFA115"
};

const referenceTypeColors: Record<ReferenceType, string> = {
    "Boolean Reference": baseTypeColors["Boolean"],
    "String Reference": baseTypeColors["String"],
    "Integer Reference": baseTypeColors["Integer"],
    "Float Reference": baseTypeColors["Float"],
    "3D Vector Reference": baseTypeColors["3D Vector"]
}

const typeColors: Record<Type, string> = Object.assign(baseTypeColors, referenceTypeColors);

export default typeColors;