import { ethers } from 'ethers';
import { CSVData, CSVDataExt } from './interfaces';
import { 
    none, 
    uniV2type, 
    uniV3type, 
    curveType,
    UNIV2_DEADLINE_ROUTER_TYPE, 
    UNIV3_ROUTER_TYPE, 
    UNIV3_DEADLINE_ROUTER_TYPE, 
    UNIV2_ROUTER_TYPE,
    CURVE_INT128,
    CURVE_UINT256
} from './constants';

export async function checkFactoryType(factoryAddresses: string[], provider: ethers.AbstractProvider): Promise<string[]> {
    // const provider = ethers.getDefaultProvider("polygon", {alchemy: '17WWhpb9XbTK2L0jTR8KJVGB03k1R2fg'});
    const UNISWAPV2_CREATE_PAIR = 'c9c65396';
    const UNISWAPV3_CREATE_PAIR = 'a1671295';
    const CURVE_ADDRESS = '0xC145E000000000000000000000000000000C145E';
    let types = [];
    for (let i = 0; i < factoryAddresses.length; i++) {
        try {
            if ((await provider.getCode(factoryAddresses[i])).includes(UNISWAPV2_CREATE_PAIR)) types.push(uniV2type);
            else if ((await provider.getCode(factoryAddresses[i])).includes(UNISWAPV3_CREATE_PAIR)) types.push(uniV3type);
            else if (factoryAddresses[i] == CURVE_ADDRESS) types.push(curveType);
            else types.push(none);
        } catch (err) {
            console.log(err);
        }
    }

    return types;
}
export async function checkRouterType(routerAddresses: string[], poolTypes: string[], provider: ethers.AbstractProvider): Promise<string[]> {
    
    const EXACT_INPUT_SELECTOR = 'b858183f';
    const EXACT_INPUT_SINGLE_SELECTOR = '04e45aaf';

    const EXACT_INPUT_DEADLINE_SELECTOR = 'c04b8d59';
    const EXACT_INPUT_SINGLE_DEADLINE_SELECTOR = '414bf389';

    const SWAP_EXACT_TOKENS_DEADLINE_SELECTOR = '38ed1739';
    const SWAP_TOKENS_FOR_EXACT_DEADLINE_SELECTOR = '8803dbee';
    
    const SWAP_EXACT_TOKENS_SELECTOR = '472b43f3';
    const SWAP_TOKENS_FOR_EXACT_SELECTOR = '42712a67';

    const EXCHANGE_UINT256_SELECTOR = '5b41b908';
    const EXCHANGE_INT128_SELECTOR = '3df02124';

    let routerTypes = [];
    for (let i = 0; i < routerAddresses.length; i++) {
        const bytecode = await provider.getCode(routerAddresses[i]);
        if (poolTypes[i] == uniV3type) {
            try {
                if (
                    bytecode.includes(EXACT_INPUT_SELECTOR) && 
                    bytecode.includes(EXACT_INPUT_SINGLE_SELECTOR)
                ) routerTypes.push(UNIV3_ROUTER_TYPE);
                else if (
                    bytecode.includes(EXACT_INPUT_DEADLINE_SELECTOR) && 
                    bytecode.includes(EXACT_INPUT_SINGLE_DEADLINE_SELECTOR)
                ) routerTypes.push(UNIV3_DEADLINE_ROUTER_TYPE);
                else routerTypes.push(none);
            } catch (error) {
                console.log(error);
            }
        } else if (poolTypes[i] == uniV2type) {
            try {
                if (
                    bytecode.includes(SWAP_EXACT_TOKENS_SELECTOR) &&
                    bytecode.includes(SWAP_TOKENS_FOR_EXACT_SELECTOR)
                ) routerTypes.push(UNIV2_ROUTER_TYPE);
                else if (
                    bytecode.includes(SWAP_EXACT_TOKENS_DEADLINE_SELECTOR) &&
                    bytecode.includes(SWAP_TOKENS_FOR_EXACT_DEADLINE_SELECTOR)
                ) routerTypes.push(UNIV2_DEADLINE_ROUTER_TYPE);
                else routerTypes.push(none);
            } catch (error) {
                console.log(error);
            }
        } else if (poolTypes[i] == curveType) {
            try {
                if (bytecode.includes(EXCHANGE_INT128_SELECTOR)) routerTypes.push(CURVE_INT128);
                else if (bytecode.includes(EXCHANGE_UINT256_SELECTOR)) routerTypes.push(CURVE_UINT256);
                else routerTypes.push(none);
            } catch (error) {
                console.log(error);
            }
        } else routerTypes.push(none);
    }

    return routerTypes;
}

export function getClearData(uniquePools: string[], data: CSVDataExt[]): CSVDataExt[] {
    let clearData: CSVDataExt[] = [];
    for (const i in uniquePools) {
        for (const j in data) {
            if ([CURVE_INT128, CURVE_UINT256].includes(data[j].routerType)) {
                clearData.push({
                    address: data[j].address,
                    routerType: data[j].routerType,
                    poolAddress: data[j].poolAddress,
                    factoryType: data[j].factoryType,
                    count: data[j].count,
                    network: data[j].network
                });
                continue;
            }
            if (uniquePools[i] === data[j].poolAddress && data[j].routerType !== none) {
                clearData.push({ 
                    address: data[j].address,
                    routerType: data[j].routerType,
                    poolAddress: data[j].poolAddress,
                    factoryType: data[j].factoryType,
                    count: data[j].count,
                    network: data[j].network
                })
                break;
            }
        }
    }

    return clearData;
}

export function extendCSVData(data: CSVData[], routerType: string[], factoryType: string[]): CSVDataExt[] {
    let extendedData: CSVDataExt[] = [];

    data.forEach((item, index) => {
        extendedData.push({ 
            address: item.address,
            poolAddress: item.poolAddress,
            count: item.count,
            network: item.network,
            routerType: routerType[index],
            factoryType: factoryType[index]
        });
    })
    return extendedData;
}

export function getUniquePoolAddresses(data: CSVData[]): string[] {
    const uniquePoolAddressesSet = new Set<string>();
    data.forEach(item => {
        uniquePoolAddressesSet.add(item.poolAddress);
    });
    return Array.from(uniquePoolAddressesSet);
}