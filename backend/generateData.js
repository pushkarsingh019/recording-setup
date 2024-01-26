import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';

import Trial from './database.js';

const currentFilePath = fileURLToPath(import.meta.url);
const dataFolderPath = path.join(path.dirname(currentFilePath), 'data');
const filePath = path.join(dataFolderPath, 'final_data.csv');

const csvWriter = createObjectCsvWriter({
  path: filePath,
  header: [
    {id : "stimulus" , title : "Stimulus"},
    {id : "side", title : "Side"},
    {id: 'startTiming', title: 'Start Timing'},
    {id: 'endTiming', title: 'End Timing'}, 
    {id: 'reactionTime', title: 'Reaction Time (seconds)'},
    {id : "detection", title : "detection"},
    {id : "signalProperty", title : "Signal"}
  ]
});

async function generateCsv(data) {

  await fs.mkdir(dataFolderPath, {recursive: true});

  // Write data to the CSV file
  try {
    await csvWriter.writeRecords(data);
    console.log(`CSV file created successfully: ${filePath}`);
    
    // Clear database after writing to CSV
    // await Trial.deleteMany({}); 

  } catch (error) {
    console.error('Error writing CSV:', error);
  }

}

export default generateCsv;