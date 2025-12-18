import { AcuityAppointment } from "@/types/AcuityType";
import { DateTime } from "luxon";

export function computeTrimesterAttendance(
  appointmentData: AcuityAppointment[],
) {
  const trimesterAttendance: Map<string, number> = new Map();
  for (const appt of appointmentData ?? []) {
    // skip babies with no due dates
    if (appt.babyDueDatesISO.length === 0) {
      continue;
    }
    const apptTime = DateTime.fromISO(appt.datetime);
    // get date that is closest to the appt date
    let timeDiff = Math.abs(
      DateTime.fromISO(appt.babyDueDatesISO[0]).diff(apptTime, "weeks").weeks,
    );
    // set chosen baby date as first in array
    let chosenDate = DateTime.fromISO(appt.babyDueDatesISO[0]);
    // if there are multiple dates in the array, check for each
    for (let i = 1; i < appt.babyDueDatesISO.length; i++) {
      // get difference between curr date and appt time
      const currDiff = Math.abs(
        DateTime.fromISO(appt.babyDueDatesISO[i]).diff(apptTime, "weeks").weeks,
      );
      // if the time difference is less than the curr min, update
      chosenDate =
        currDiff < timeDiff
          ? DateTime.fromISO(appt.babyDueDatesISO[i])
          : chosenDate;
      timeDiff = Math.min(timeDiff, currDiff);
    }

    // calculate trimester
    // if the date has already passed, assume that it's a birth date
    if (chosenDate < apptTime) {
      const diff = apptTime.diff(chosenDate, "weeks").weeks;
      // first three months is fourth trimester
      if (diff <= 12) {
        trimesterAttendance.set(
          `${appt.classCategory?.toLowerCase()} FOURTH TRIM`,
          trimesterAttendance.has(
            `${appt.classCategory?.toLowerCase()} FOURTH TRIM`,
          )
            ? trimesterAttendance.get(
                `${appt.classCategory?.toLowerCase()} FOURTH TRIM`,
              )! + 1
            : 1,
        );
        trimesterAttendance.set(
          `${appt.class?.toLowerCase()} FOURTH TRIM`,
          trimesterAttendance.has(`${appt.class?.toLowerCase()} FOURTH TRIM`)
            ? trimesterAttendance.get(
                `${appt.class?.toLowerCase()} FOURTH TRIM`,
              )! + 1
            : 1,
        );
      } else {
        trimesterAttendance.set(
          `${appt.classCategory?.toLowerCase()} FIFTH TRIM`,
          trimesterAttendance.has(
            `${appt.classCategory?.toLowerCase()} FIFTH TRIM`,
          )
            ? trimesterAttendance.get(
                `${appt.classCategory?.toLowerCase()} FIFTH TRIM`,
              )! + 1
            : 1,
        );
        trimesterAttendance.set(
          `${appt.class?.toLowerCase()} FIFTH TRIM`,
          trimesterAttendance.has(`${appt.class?.toLowerCase()} FIFTH TRIM`)
            ? trimesterAttendance.get(
                `${appt.class?.toLowerCase()} FIFTH TRIM`,
              )! + 1
            : 1,
        );
      }
    } else {
      // if not, it is a due date
      // pregnancy typically 40 weeks, find "start" of pregnancy
      const pregnancyStart = chosenDate.minus({ weeks: 40 });
      // subtract start date from due date and round
      const weeksIntoPregnancy = Math.floor(
        apptTime.diff(pregnancyStart, "weeks").weeks,
      );
      if (weeksIntoPregnancy >= 29) {
        trimesterAttendance.set(
          `${appt.classCategory?.toLowerCase()} THIRD TRIM`,
          trimesterAttendance.has(
            `${appt.classCategory?.toLowerCase()} THIRD TRIM`,
          )
            ? trimesterAttendance.get(
                `${appt.classCategory?.toLowerCase()} THIRD TRIM`,
              )! + 1
            : 1,
        );
        trimesterAttendance.set(
          `${appt.class?.toLowerCase()} THIRD TRIM`,
          trimesterAttendance.has(`${appt.class?.toLowerCase()} THIRD TRIM`)
            ? trimesterAttendance.get(
                `${appt.class?.toLowerCase()} THIRD TRIM`,
              )! + 1
            : 1,
        );
      } else if (weeksIntoPregnancy >= 15) {
        // 15-18 is second
        trimesterAttendance.set(
          `${appt.classCategory?.toLowerCase()} SECOND TRIM`,
          trimesterAttendance.has(
            `${appt.classCategory?.toLowerCase()} SECOND TRIM`,
          )
            ? trimesterAttendance.get(
                `${appt.classCategory?.toLowerCase()} SECOND TRIM`,
              )! + 1
            : 1,
        );
        trimesterAttendance.set(
          `${appt.class?.toLowerCase()} SECOND TRIM`,
          trimesterAttendance.has(`${appt.class?.toLowerCase()} SECOND TRIM`)
            ? trimesterAttendance.get(
                `${appt.class?.toLowerCase()} SECOND TRIM`,
              )! + 1
            : 1,
        );
      } else {
        trimesterAttendance.set(
          `${appt.classCategory?.toLowerCase()} FIRST TRIM`,
          trimesterAttendance.has(
            `${appt.classCategory?.toLowerCase()} FIRST TRIM`,
          )
            ? trimesterAttendance.get(
                `${appt.classCategory?.toLowerCase()} FIRST TRIM`,
              )! + 1
            : 1,
        );
        trimesterAttendance.set(
          `${appt.class?.toLowerCase()} FIRST TRIM`,
          trimesterAttendance.has(`${appt.class?.toLowerCase()} FIRST TRIM`)
            ? trimesterAttendance.get(
                `${appt.class?.toLowerCase()} FIRST TRIM`,
              )! + 1
            : 1,
        );
      }
    }
  }
  return trimesterAttendance;
}

export function computeInstructorDataByClass(
  filteredAppointmentsForPopularity: AcuityAppointment[],
) {
  const instructorDataByClass = new Map<
    string,
    Map<
      string,
      {
        count: number;
        uniqueSessions: Set<string>;
        classCategory: string;
      }
    >
  >();

  for (const appt of filteredAppointmentsForPopularity) {
    if (!appt.datetime) continue;

    const apptDate = DateTime.fromISO(appt.datetime);
    if (!apptDate.isValid) continue;

    const classCategory = normalizeCategory(appt.classCategory) || "UNKNOWN";
    const className = appt.class || "UNKNOWN";
    const instructor = appt.instructor || "UNKNOWN";

    if (!instructorDataByClass.has(className)) {
      instructorDataByClass.set(className, new Map());
    }
    const classInstructorMap = instructorDataByClass.get(className)!;
    if (!classInstructorMap.has(instructor)) {
      classInstructorMap.set(instructor, {
        count: 0,
        uniqueSessions: new Set<string>(),
        classCategory: classCategory,
      });
    }
    const instructorStats = classInstructorMap.get(instructor)!;
    instructorStats.count += 1;
    const sessionKey = `${appt.datetime}`;
    instructorStats.uniqueSessions.add(sessionKey);
  }

  return instructorDataByClass;
}

export function computeAttendanceBreakdown(
  appt: AcuityAppointment[],
  shouldGroupByWeek: boolean,
) {
  // <interval, <classCategory, <class, <instructor, attendance>>>
  const instructorAttendanceByInterval = new Map<
    string,
    Map<string, Map<string, Map<string, number>>>
  >();

  appt.forEach((appt) => {
    if (!appt.datetime) return;

    const apptDate = DateTime.fromISO(appt.datetime);
    if (!apptDate.isValid) return;

    const intervalKey = getIntervalKey(apptDate, shouldGroupByWeek);
    const classCategory = normalizeCategory(appt.classCategory) || "UNKNOWN";
    const className = appt.class || "UNKNOWN";
    const instructor = appt.instructor || "UNKNOWN";

    const attendanceForInterval =
      instructorAttendanceByInterval.get(intervalKey) ?? new Map();
    const attendanceForCategory =
      attendanceForInterval.get(classCategory) ?? new Map();
    const attendanceForClass =
      attendanceForCategory.get(className) ?? new Map();
    const attendanceForInstructor = attendanceForClass.get(instructor) ?? 0;

    attendanceForClass.set(instructor, attendanceForInstructor + 1);
    attendanceForCategory.set(className, attendanceForClass);
    attendanceForInterval.set(classCategory, attendanceForCategory);
    instructorAttendanceByInterval.set(intervalKey, attendanceForInterval);
  });

  return instructorAttendanceByInterval;
}

export const normalizeCategory = (
  category: string | null | undefined,
): string => {
  if (!category) return "";
  return category.toUpperCase().trim();
};

export const getIntervalKey = (
  date: DateTime,
  shouldGroupByWeek: boolean,
): string => {
  if (shouldGroupByWeek) {
    const weekStart = date.startOf("week");
    return weekStart.toISODate() || "";
  } else {
    return date.toFormat("yyyy-MM");
  }
};
