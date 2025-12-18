import { AcuityAppointment } from "@/types/AcuityType";
import { DateTime } from "luxon";

function getTrimester(appt: AcuityAppointment): string | null {
  // skip babies with no due dates
  if (appt.babyDueDatesISO.length === 0) {
    return null;
  }
  const apptTime = DateTime.fromISO(appt.datetime);
  // get date that is closest to the appt date
  let chosenDate = DateTime.fromISO(appt.babyDueDatesISO[0]);
  let timeDiff = Math.abs(chosenDate.diff(apptTime, "weeks").weeks);

  // if there are multiple dates in the array, check for each
  for (let i = 1; i < appt.babyDueDatesISO.length; i++) {
    const currentDate = DateTime.fromISO(appt.babyDueDatesISO[i]);
    // get difference between curr date and appt time
    const currDiff = Math.abs(currentDate.diff(apptTime, "weeks").weeks);
    // if the time difference is less than the curr min, update
    if (currDiff < timeDiff) {
      chosenDate = currentDate;
      timeDiff = currDiff;
    }
  }

  // calculate trimester
  // if the date has already passed, assume that it's a birth date
  if (chosenDate < apptTime) {
    const diff = apptTime.diff(chosenDate, "weeks").weeks;
    // first three months is fourth trimester
    if (diff <= 12) {
      return "FOURTH TRIM";
    } else {
      return "FIFTH TRIM";
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
      return "THIRD TRIM";
    } else if (weeksIntoPregnancy >= 15) {
      // 15-28 is second
      return "SECOND TRIM";
    } else {
      return "FIRST TRIM";
    }
  }
}

export function computeTrimesterBreakdownByCategory(
  appointmentData: AcuityAppointment[],
) {
  const trimesterAttendance: Map<string, number> = new Map();
  for (const appt of appointmentData ?? []) {
    const trimester = getTrimester(appt);
    if (trimester) {
      const key = `${appt.classCategory?.toLowerCase()} ${trimester}`;
      trimesterAttendance.set(key, (trimesterAttendance.get(key) ?? 0) + 1);
    }
  }
  return trimesterAttendance;
}

export function computeTrimesterBreakdownByClass(
  appointmentData: AcuityAppointment[],
) {
  const trimesterAttendance: Map<string, number> = new Map();
  for (const appt of appointmentData ?? []) {
    const trimester = getTrimester(appt);
    if (trimester) {
      const key = `${appt.class?.toLowerCase()} ${trimester}`;
      trimesterAttendance.set(key, (trimesterAttendance.get(key) ?? 0) + 1);
    }
  }
  return trimesterAttendance;
}
export type InstructorDataByClass = Map<
  string,
  Map<
    string,
    {
      count: number;
      uniqueSessions: Set<string>;
      classCategory: string;
    }
  >
>;

export function computeInstructorDataByClass(
  filteredAppointmentsForPopularity: AcuityAppointment[],
): InstructorDataByClass {
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

export type AcuityAttendanceBreakdown = Map<
  string,
  Map<string, Map<string, Map<string, number>>>
>;

export function computeAttendanceBreakdown(
  appts: AcuityAppointment[],
  shouldGroupByWeek: boolean,
) {
  // <interval, <classCategory, <class, <instructor, attendance>>>
  const instructorAttendanceByInterval: AcuityAttendanceBreakdown = new Map<
    string,
    Map<string, Map<string, Map<string, number>>>
  >();

  appts.forEach((appt) => {
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
