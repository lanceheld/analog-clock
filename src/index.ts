import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import get from 'lodash/fp/get';
import join from 'lodash/fp/join';

const timeRegex = /^([01]?\d|2[0-3]):([0-5]?\d)(:\d{2})?$/;
const angleRegex = /^([0-9]+(\.[0-9]+)?)$/;

const getHourAngle = (hours: number, minutes: number, seconds: number): number => {
  // Normalize hours to 12-hour format
  const normalizedHours = hours % 12;
  // Calculate the angle of the hour hand
  return (normalizedHours + (minutes / 60) + (seconds / 3600)) * (360 / 12);
};

const getMinuteAngle = (minutes: number, seconds: number): number => {
  // Calculate the angle of the minute hand
  return (minutes + (seconds / 60)) * (360 / 60);
};

const parseTime = (time: string): { hours: number; minutes: number; seconds: number } => {
  const [hourPart, minutePart, secondPart] = time.split(":");
  return {
    hours: parseInt(hourPart, 10),
    minutes: parseInt(minutePart, 10),
    seconds: secondPart ? parseInt(secondPart, 10) : 0,
  };
};

const getInteriorAngle = (hourAngle: number, minuteAngle: number): number => {
  // Calculate the absolute difference between the two angles
  const angleDifference = Math.abs(hourAngle - minuteAngle);
  // The interior angle is the smaller of the two possible angles
  return Math.min(angleDifference, 360 - angleDifference);
};

const getTimeWhereInteriorAngleIs = (angle: number, exact?: boolean): { time: string, angle: number }[] => {
  const times: { time: string, angle: number }[] = [];
  // Iterate through all possible times to find the one with the specified interior angle
  for (let hours = 0; hours < 12; hours++) {
    for (let minutes = 0; minutes < 60; minutes++) {
      for (let seconds = 0; seconds < 60; seconds++) {
        const hourAngle = getHourAngle(hours, minutes, seconds);
        const minuteAngle = getMinuteAngle(minutes, seconds);
        const interiorAngle = getInteriorAngle(hourAngle, minuteAngle);
        const difference = Math.abs(interiorAngle - angle);
        if (exact ? difference === 0 : difference < 0.045) {
          // Format the time as HH:MM:SS
          const time = `${String(hours || 12).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
          times.push({ time, angle: interiorAngle });
        }
      }
    }
  }
  return times;
}

if (timeRegex.test(process.argv[2])) {
  const { hours, minutes, seconds } = parseTime(process.argv[2]);
  const hourAngle = getHourAngle(hours, minutes, seconds);
  const minuteAngle = getMinuteAngle(minutes, seconds);
  const interiorAngle = getInteriorAngle(hourAngle, minuteAngle);
  console.log(`The interior angle between the hour and minute hands at ${hours}:${minutes} is ${interiorAngle} degrees.`);
} else if (angleRegex.test(process.argv[2])) {
  const angle = parseFloat(process.argv[2]);
  const times = getTimeWhereInteriorAngleIs(angle);
  if (times.length > 0) {
    console.log(`Times where the interior angle is approximately ${angle} degrees:`);
    times.forEach(time => console.log(time));
  } else {
    console.log(`No times found where the interior angle is approximately ${angle} degrees.`);
  }
} else if (process.argv[2] === 'exact') {
  console.log('Times where the interior angle is an integer:');
  let times: { time: string, angle: number }[] = [];
  for (let angle = 0; angle <= 180; angle++) {
    const angleTimes = getTimeWhereInteriorAngleIs(angle, true);
    if (angleTimes.length > 0) {
      times.push(...angleTimes);
    }
  }
  const groupedTimes = groupBy('angle', times);
  map((timeGroup: { time: string, angle: number }[]) => {
    const angle = timeGroup[0].angle;
    const angleTimes = map(get('time'), timeGroup);
    console.log(`${String(angle).padStart(3, ' ')}° - ${join(' and ', angleTimes)}`);
  }, groupedTimes);
} else {
  console.error("Invalid time format. Please use HH:MM format.");
  process.exit(1);
}
