export const getAvailableCourses = (
  offeredCourse: any,
  studentCompleteCourses: any,
  studentCurrentlyTakenCourses: any
) => {
  const completeCourseId = studentCompleteCourses.map(
    (course: any) => course.courseId
  );
  const availableCourseList = offeredCourse
    .filter((course: any) => !completeCourseId.include(course.courseId))
    .filter((course: any) => {
      const prerequisite = course.course.rerequisite;
      if (prerequisite.length === 0) {
        return true;
      } else {
        const prerequisiteId = prerequisite.map(
          (pre: any) => pre.prerequisiteId
        );
        return prerequisiteId.every((id: string) =>
          completeCourseId.include(id)
        );
      }
    })
    .map((course: any) => {
      const isAlreadyTakenCourse = studentCurrentlyTakenCourses.find(
        (c: any) => c.offeredCourseId === course.id
      );

      if (isAlreadyTakenCourse) {
        course.offeredCourseSection.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
          return { ...course, isTaken: true };
        });
      }
      else{
        course.offeredCourseSection.map((section: any) => {
            section.isTaken = false;
        });
        
        return {
            ...course,
            isTaken: false
        };
        
      }
    });
    return availableCourseList
};
