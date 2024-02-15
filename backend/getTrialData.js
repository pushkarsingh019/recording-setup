// Create array of conditions
const conditions = [
  { stimulus: "positive", side: "left" },
  { stimulus: "positive", side: "right" },
  { stimulus: "negative", side: "right" },
  { stimulus: "negative", side: "left" },
];

// Shuffle conditions randomly
const shuffledConditions = shuffle(conditions);

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
