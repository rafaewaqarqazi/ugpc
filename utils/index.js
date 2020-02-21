export const getGrade = marks => {
  let marksObtained = marks.visionDocument ? parseInt(marks.visionDocument) : 0;
  marksObtained += marks.supervisor ? parseInt(marks.supervisor) : 0;
  marksObtained += marks.internal ? parseInt(marks.internal) : 0;
  marksObtained += marks.external ? parseInt(marks.external) : 0;
  if (marksObtained >= 80) {
    return 'A'
  } else if (marksObtained >= 75 && marksObtained < 80) {
    return 'B+'
  } else if (marksObtained >= 70 && marksObtained < 75) {
    return 'B'
  } else if (marksObtained >= 65 && marksObtained < 70) {
    return 'C+'
  } else if (marksObtained >= 60 && marksObtained < 65) {
    return 'C'
  } else if (marksObtained >= 55 && marksObtained < 60) {
    return 'D+'
  } else if (marksObtained >= 50 && marksObtained < 55) {
    return 'D'
  } else if (marksObtained < 50) {
    return 'F'
  }
};