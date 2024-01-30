function timeDifferenceInSeconds(time1, time2) {
    const date1 = new Date(`1970-01-01T${time1}Z`);
    const date2 = new Date(`1970-01-01T${time2}Z`);
    
    const timeDifference = Math.abs(date2 - date1) / 1000; // Convert milliseconds to seconds
    
    return timeDifference;
}

export default timeDifferenceInSeconds