import fs from 'fs/promises';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

import Trial from './database.js';

const dataFolderPath = path.join(process.cwd(), 'data');
const filePath = path.join(dataFolderPath, 'final_data.csv');

const csvWriter = createObjectCsvWriter({
  path: filePath,
  header: [
    { id: 'stimulus', title: 'Stimulus' },
    { id: 'side', title: 'Side' },
    { id: 'startTiming', title: 'Start Timing' },
    { id: 'endTiming', title: 'End Timing' },
    { id: 'reactionTime', title: 'Reaction Time (seconds)' },
    { id: 'detection', title: 'Detection' },
    { id: 'signalProperty', title: 'Signal' }
  ]
});

async function generateCsv(data) {
  try {
    await fs.mkdir(dataFolderPath, { recursive: true });

    // Write data to the CSV file
    await csvWriter.writeRecords(data);
    // console.log(`CSV file created successfully: ${filePath}`);

    // Clear database after writing to CSV
    // await Trial.deleteMany({});

    return filePath;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
}

export default generateCsv;
