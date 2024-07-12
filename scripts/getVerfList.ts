import { writeCSV, writeCSVUniquePools, readCSVExt, convertToJSON } from './readWrite';
import { CSVData, CSVDataExt } from './interfaces';
import { inputFilePath, outputFilePath, outputFilePathUnique, outputFilePathJson } from './constants';
import { filterAndSortByCount } from './filters';
import { ethers } from 'ethers';
import { 
    none, 
    UNIV2_DEADLINE_ROUTER_TYPE, 
    UNIV3_ROUTER_TYPE, 
    UNIV3_DEADLINE_ROUTER_TYPE, 
    UNIV2_ROUTER_TYPE,
    CURVE_INT128,
    CURVE_UINT256
} from './constants';
import { network } from 'hardhat';
import { getUniquePoolAddresses } from './utils';

// Эта функция создает список из первых подходящих роутеров для каждой фабрики. После добавления роутера для фабрики,
// все остальный роутеры будут проигрнорированы.
async function getClearData(data: CSVData[], provider: ethers.AbstractProvider): Promise<[CSVDataExt[], string[]]> {
    let clearData: CSVDataExt[] = [];
    let uniquePools = new Set<string>();

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

    for (let i in data) {
        let routerType;
        if (uniquePools.has(data[i].poolAddress)) continue;
        const bytecode = await provider.getCode(data[i].address);
        let [address, poolAddress] = [data[i].address, data[i].poolAddress];
        try {
            if (
                bytecode.includes(SWAP_EXACT_TOKENS_DEADLINE_SELECTOR) &&
                bytecode.includes(SWAP_TOKENS_FOR_EXACT_DEADLINE_SELECTOR)
            ) {routerType = UNIV2_ROUTER_TYPE;}
            else if (
                bytecode.includes(SWAP_EXACT_TOKENS_SELECTOR) &&
                bytecode.includes(SWAP_TOKENS_FOR_EXACT_SELECTOR)
            ) routerType = UNIV2_DEADLINE_ROUTER_TYPE;
            else if (
                bytecode.includes(EXACT_INPUT_SELECTOR) && 
                bytecode.includes(EXACT_INPUT_SINGLE_SELECTOR)
            ) routerType = UNIV3_ROUTER_TYPE;
            else if (
                bytecode.includes(EXACT_INPUT_DEADLINE_SELECTOR) && 
                bytecode.includes(EXACT_INPUT_SINGLE_DEADLINE_SELECTOR)
            ) routerType = UNIV3_DEADLINE_ROUTER_TYPE;
            else if (bytecode.includes(EXCHANGE_INT128_SELECTOR) && poolAddress == '0xC145E000000000000000000000000000000C145E') {
                routerType = CURVE_INT128;
                [address, poolAddress] = [data[i].address, data[i].address];
            }
            else if (bytecode.includes(EXCHANGE_UINT256_SELECTOR) && poolAddress == '0xC145E000000000000000000000000000000C145E') {
                routerType = CURVE_UINT256;
                [address, poolAddress] = [data[i].address, data[i].address];
            }
            else {
                continue;
            }

            clearData.push({
                address: address,
                poolAddress: poolAddress,
                routerType: routerType,
                factoryType: none,
                count: data[i].count,
                network: data[i].network
            });

            uniquePools.add(poolAddress);
            console.log(i, poolAddress)
        } catch (error) {
            console.log(error);
        }
    }
    return [clearData, Array.from(uniquePools)];
}

// Вызываем функцию чтения данных из CSV файла
readCSVExt(inputFilePath)
    .then(async (data: CSVData[]) => {
        console.log('Testovaya versiya');
        console.log(inputFilePath);
        console.log(outputFilePath);
        console.log(outputFilePathUnique);
        const provider = ethers.getDefaultProvider(network.config.url);
        // Фильтруем данные по указанной сети
        const filteredDataByCount = filterAndSortByCount(data, network.name);

        const [clearData, uniquePools] = await getClearData(filteredDataByCount, provider);
        // const filteredData = filterAndSortByCount(data, network.name);
        // const uniquePools = getUniquePoolAddresses(filteredData);
        writeCSVUniquePools(uniquePools, outputFilePathUnique);
        writeCSV(clearData, outputFilePath);
        convertToJSON(clearData, outputFilePathJson)
    })
    .catch((error: any) => {
        console.error('An error occurred:', error);
    });