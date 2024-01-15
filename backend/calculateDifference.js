function timeDifferenceInSeconds(timeStr1, timeStr2) {
    console.log("time diffeence function")
    console.log("start time -> " , timeStr1)
    console.log("end time -> " , timeStr2)
    // Convert strings to Date objects
    const time1 = new Date(timeStr1);
    const time2 = new Date(timeStr2);

    // Calculate the difference in seconds
    const timeDifference = Math.abs((time2 - time1) / 1000);

    return timeDifference;
}

export default timeDifferenceInSeconds