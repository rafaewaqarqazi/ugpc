export const  getStudentsCount = students => {
    let count = 0;
    students.map(student => {
        count += parseInt(student.students)
    });
    return count;
};
export const getVisionDocsCount = visionDocs => {
    let count = 0;
    visionDocs.map(visionDoc => {
        count += parseInt(visionDoc.visionDocs)
    });
    return count;
};