import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import Trial from './database.js';

function getThreeLetterMonth(month) {
    const monthsAbbreviation = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthsAbbreviation[month - 1];
}

async function generateCsv(data) {
    // Generate dynamic file name based on the current date and time
    const currentDatetime = new Date();
    const monthAbbreviation = getThreeLetterMonth(currentDatetime.getMonth() + 1);

    // Get the directory path using fileURLToPath and dirname
    const currentFilePath = fileURLToPath(import.meta.url);
    const dataFolderPath = path.join(path.dirname(currentFilePath), 'data');

    // Create the data folder if it doesn't exist
    await fs.mkdir(dataFolderPath, { recursive: true });

    const fileName = `data_${currentDatetime.getFullYear()}_${monthAbbreviation}_${currentDatetime.getDate().toString().padStart(2, '0')}_${currentDatetime.getHours().toString().padStart(2, '0')}_${currentDatetime.getMinutes().toString().padStart(2, '0')}.csv`;

    const filePath = path.join(dataFolderPath, fileName);

    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'startTiming', title: 'Start Timing' },
            { id: 'endTiming', title: 'End Timing' },
            { id: 'reactionTime', title: 'Reaction Time' }
        ]
    });

    // Write data to the CSV file
    try {
        await csvWriter.writeRecords(data);
        console.log(`CSV file created successfully: ${filePath}`);
        await Trial.deleteMany({});
    } catch (error) {
        console.error('Error writing CSV:', error);
    }
}

export default generateCsv
