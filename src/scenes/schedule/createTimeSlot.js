function createTimeSlot(duration, gap = 0) {
    const startHour = 6; // 6 AM
    const endHour = 23; // 11 PM
    const slots = [];

    // Convert duration and gap to milliseconds (both are in minutes)
    const durationMs = duration * 60 * 1000;
    const gapMs = gap * 60 * 1000;

    // Create date objects for start and end times
    let currentTime = new Date();
    currentTime.setHours(startHour, 0, 0, 0);

    let endTime = new Date();
    endTime.setHours(endHour, 0, 0, 0);

    // Loop through the time range and create time slots
    while (currentTime < endTime) {
        let nextTime = new Date(currentTime.getTime() + durationMs);
        
        if (nextTime > endTime) break; // Stop if the next slot is beyond the end time

        slots.push({
            start: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
            end: nextTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        });

        // Move to the next slot, considering the gap
        currentTime = new Date(nextTime.getTime() + gapMs);
    }

    return slots;
}

// Example usage:
console.log(createTimeSlot(30, 15)); // Creates 30-minute slots with 15-minute gap between them


export default createTimeSlot;