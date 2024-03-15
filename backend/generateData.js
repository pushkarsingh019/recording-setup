import fs from 'fs/promises';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

import Trial from './database.js';

async function generateCsv(data) {
  try {

    const dataFolderPath = path.join(process.cwd(), 'data');
    const filePath = path.join(dataFolderPath, 'final_data.csv');
    
    const fileExists = await fs.access(filePath)
      .then(() => true)
      .catch(() => false);

    // If the file exists, delete it
    if (fileExists) {
      await fs.unlink(filePath);
      console.log(`Deleted existing file: ${filePath}`);
    }


const csvWriter = createObjectCsvWriter({
  path: filePath,
  header: [
    {id : "fish", title : "fish"},
    { id: 'distance', title: 'distance' },
    { id: 'side', title: 'Side' },
    { id: 'startTiming', title: 'Start Timing' },
    { id: 'endTiming', title: 'End Timing' },
    { id: 'reactionTime', title: 'Reaction Time (seconds)' },
    { id: 'detection', title: 'Detection' },
  ]
});

    await fs.mkdir(dataFolderPath, { recursive: true });


    // Write data to the CSV file
    await csvWriter.writeRecords(data);
    console.log(`CSV file created successfully: ${filePath}`);

    // Clear database after writing to CSV
    // await Trial.deleteMany({});

    return filePath;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
}

export default generateCsv;
