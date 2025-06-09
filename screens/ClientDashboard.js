// Inside computeNextAvailableDates
function computeNextAvailableDates(availabilityMap) {
  const today = new Date();
  const dates = [];
  let cursor = new Date(today);

  while (dates.length < 7) {
    const weekdayIndex = cursor.getDay();
    const foundDayKey = Object.keys(availabilityMap).find((dayName) => {
      return weekdayToIndex[dayName.toLowerCase()] === weekdayIndex;
    });

    if (foundDayKey) {
      const startTimeStr = availabilityMap[foundDayKey].startTime || '09:00';
      const [hours, minutes] = startTimeStr.split(':').map(Number);
      const dateWithTime = new Date(cursor);
      dateWithTime.setHours(hours, minutes, 0, 0);
      dates.push(dateWithTime.toISOString());
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  setAvailableDates(dates);
  if (dates.length > 0) {
    setSelectedDate(dates[0]);
  }
  setLoading(false);
}

