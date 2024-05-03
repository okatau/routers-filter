import * as fs from 'fs';
import csvParser from 'csv-parser';
import { CSVData, CSVDataExt } from "./interfaces";

export function readCSV(filePath: string): Promise<CSVData[]> {
    return new Promise((resolve, reject) => {
        const results: CSVData[] = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data: any) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error: any) => {
                reject(error);
            });
    });
}

export function readCSVExt(filePath: string): Promise<CSVDataExt[]> {
    return new Promise((resolve, reject) => {
        const results: CSVDataExt[] = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data: any) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error: any) => {
                reject(error);
            });
    });
}

export function writeCSV(data: CSVDataExt[], outputFilePath: string): void {
    const writeStream = fs.createWriteStream(outputFilePath);
    writeStream.write('address,routerType,poolAddress,factoryType,count,network,verified\n'); // Заголовок CSV файла
    data.forEach(item => {
        writeStream.write(`${item.address},${item.routerType},${item.poolAddress},${item.factoryType},${item.count},${item.network}\n`);
    });
    writeStream.end();
    console.log(`Data has been written to ${outputFilePath}`);
}

export function writeCSVShort(data: CSVData[], outputFilePath: string): void {
    const writeStream = fs.createWriteStream(outputFilePath);
    writeStream.write('address,poolAddress,count,network,verified\n'); // Заголовок CSV файла
    data.forEach(item => {
        writeStream.write(`${item.address},${item.poolAddress},${item.count},${item.network}\n`);
    });
    writeStream.end();
    console.log(`Data has been written to ${outputFilePath}`);
}

export function writeCSVUniquePools(data: string[], outputFilePath: string): void {
    const writeStream = fs.createWriteStream(outputFilePath);
    writeStream.write('uniquePool\n'); // Заголовок CSV файла
    data.forEach(item => {
        writeStream.write(`${item}\n`);
    });
    writeStream.end();
    console.log(`Data has been written to ${outputFilePath}`);
}

export function convertToJSON(data: CSVData[], outputPath: string): void {
    const jsonData: { [key: string]: Partial<CSVData> } = {};

    data.forEach(item => {
        const { poolAddress, ...rest } = item;
        jsonData[poolAddress] = rest;
    });

    const jsonString = JSON.stringify(jsonData, null, 2);

    fs.writeFile(outputPath, jsonString, err => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log(`Data has been written to ${outputPath}`);
        }
    });
}