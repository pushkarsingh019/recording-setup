// function timeDifferenceInSeconds(time1, time2) {
//     const date1 = new Date(`1970-01-01T${time1}Z`);
//     const date2 = new Date(`1970-01-01T${time2}Z`);
    
//     const timeDifference = Math.abs(date2 - date1) / 1000; // Convert milliseconds to seconds
    
//     return timeDifference;
// }

// export default timeDifferenceInSeconds

function timeDifferenceInSeconds(timeStr1, timeStr2) {
    // Convert strings to Date objects
    const time1 = new Date(timeStr1);
    const time2 = new Date(timeStr2);

    // Calculate the difference in seconds
    const timeDifference = Math.abs((time2 - time1) / 1000);

    return timeDifference;
}

export default timeDifferenceInSeconds