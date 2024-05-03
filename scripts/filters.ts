import { CSVData, CSVDataExt } from "./interfaces";
import { UNIV2_DEADLINE_ROUTER_TYPE, UNIV3_ROUTER_TYPE, UNIV3_DEADLINE_ROUTER_TYPE, UNIV2_ROUTER_TYPE, CURVE_INT128, CURVE_UINT256 } from "./constants";
export function filterAndSortByCount(data: CSVData[], network: string): CSVData[] {
    // Фильтруем данные по указанной сети
    const filteredData = data.filter(item => item.network === network);
    // Сортируем данные по убыванию счетчика (count)
    filteredData.sort((a, b) => b.count - a.count);
    return filteredData;
}

export function filterByRouterType(data: CSVDataExt[]): CSVDataExt[] {
    const order = [
        UNIV2_DEADLINE_ROUTER_TYPE,
        UNIV3_ROUTER_TYPE,
        UNIV3_DEADLINE_ROUTER_TYPE,
        CURVE_INT128,
        CURVE_UINT256,
        UNIV2_ROUTER_TYPE
    ];

    return data.filter(item => order.indexOf(item.routerType) !== -1)
               .sort((a, b) => order.indexOf(a.routerType) - order.indexOf(b.routerType));
}