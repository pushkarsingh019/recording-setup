// Create array of conditions
const conditions = [
  {distance : 2, stimulus : 'Yes'},
  {distance : 2, stimulus : 'No'},
  {distance : 4, stimulus : 'Yes'},
  {distance : 4, stimulus : 'No'},
  {distance : 6, stimulus : 'Yes'},
  {distance : 6, stimulus : 'No'},
  {distance : 8, stimulus : 'Yes'},
  {distance : 8, stimulus : 'No'},
  {distance : 10, stimulus : 'Yes'},
  {distance : 10, stimulus : 'No'},
  {distance : 12, stimulus : 'Yes'},
  {distance : 12, stimulus : 'No'},
  {distance : 14, stimulus : "Yes"},
  {distance : 14, stimulus : "No"},
];

// Shuffle conditions randomly
let shuffledConditions = shuffle(conditions);

// Function to shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let currentIndex = 0;

const getTrialData = () => {
  // Get next condition
  const trialData = shuffledConditions[currentIndex];

  // Increment index for next trial
  currentIndex++;
  if (currentIndex >= shuffledConditions.length) {
    currentIndex = 0;

    // Reshuffle occasionally
    shuffledConditions = shuffle(conditions);
  }
  console.log(trialData)
  return trialData;
};

export default getTrialData;
