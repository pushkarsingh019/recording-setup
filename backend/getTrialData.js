const getTrialData = () => {
    const random_value = Math.random()
    let trialData = {};
    if (random_value <= 1/4) {
        trialData.stimulus = "positive"
        trialData.side = "left"
    } else if (1/4 < random_value <= 2/4) {
        trialData.stimulus = "positive"
        trialData.side = "right"
    } else if (2/4 < random_value <= 3/4) {
        trialData.stimulus = "negative"
        trialData.side = "right"
    } else if (3/4 < random_value <= 4/4) {
        trialData.stimulus = "negative";
        trialData.side = "left"
    } else {
        console.log("something went horribly wrong")
    }
    return trialData
};

export default getTrialData;