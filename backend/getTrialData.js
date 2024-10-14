// Create array of conditions
const conditions = [
  {distance : 2, ball : 'yes'},
  {distance : 2, ball : 'no'},
  {distance : 4, ball : 'yes'},
  {distance : 4, ball : 'no'},
  {distance : 6, ball : 'yes'},
  {distance : 6, ball : 'no'},
  {distance : 8, ball : 'yes'},
  {distance : 8, ball : 'no'},
  {distance : 10, ball : 'yes'},
  {distance : 10, ball : 'no'},
  {distance : 12, ball : 'yes'},
  {distance : 12, ball : 'no'}
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

  return trialData;
};

export default getTrialData;
