export const UNIV3_DEADLINE_ROUTER_TYPE = 'UNIV3_DEADLINE_ROUTER_TYPE';
export const UNIV3_ROUTER_TYPE = 'UNIV3_ROUTER_TYPE';
export const UNIV2_DEADLINE_ROUTER_TYPE = 'UNIV2_DEADLINE_ROUTER_TYPE';
export const UNIV2_ROUTER_TYPE = 'UNIV2_ROUTER_TYPE';
export const CURVE_UINT256 = 'CURVE_UINT256';
export const CURVE_INT128 = 'CURVE_INT128';

export const uniV2type = 'UNISWAP_V2_TYPE';
export const uniV3type = 'UNISWAP_V3_TYPE';
export const curveType = 'CURVE_TYPE';
export const none = 'NONE';

export const network = 'base'; // Укажите желаемую сеть

// Путь к исходной таблице.
export const inputFilePath = 'scripts/routerInfo_short.csv'; // Путь к вашему CSV файлу
export const outputFilePath = `scripts/${network}/filteredContractData.csv`; // Путь к файлу для записи отфильтрованных данных
export const outputFilePathUnique = `scripts/${network}/uniquePools.csv`; 
export const outputFilePathJson = `scripts/${network}/data.json`;