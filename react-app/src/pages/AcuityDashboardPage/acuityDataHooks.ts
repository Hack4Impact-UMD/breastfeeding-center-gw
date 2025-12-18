import { AcuityAttendanceBreakdown, InstructorDataByClass, normalizeCategory } from "@/lib/acuityUtils";
import { DateTime } from "luxon";
import { useMemo } from "react";

export function useClassAttendanceData(attendanceBreakdown: AcuityAttendanceBreakdown, allClasses: string[], allIntervals: string[], classesToCategory: Map<string, string>, shouldGroupByWeek: boolean) {
  return useMemo(
    () =>
      allClasses.map((className) => {
        return {
          key: className,
          data: allIntervals.map((intervalKey) => {
            const date = shouldGroupByWeek
              ? DateTime.fromISO(intervalKey).toJSDate()
              : DateTime.fromFormat(intervalKey, "yyyy-MM")
                .startOf("month")
                .toJSDate();

            const attendanceForInterval = attendanceBreakdown.get(intervalKey);

            let count = 0;
            const cat =
              normalizeCategory(classesToCategory.get(className)) ?? "UNKNOWN";
            const attendanceForCat = attendanceForInterval?.get(cat);
            const attendanceForClass = attendanceForCat?.get(className);
            for (const instructor of attendanceForClass?.keys() ?? []) {
              const attendance = attendanceForClass?.get(instructor) ?? 0;
              count += attendance;
            }
            return { key: date, data: count };
          }),
        };
      }),
    [
      allClasses,
      allIntervals,
      classesToCategory,
      attendanceBreakdown,
      shouldGroupByWeek,
    ],
  );

}

export function useCategoryAttendanceData(attendanceBreakdown: AcuityAttendanceBreakdown, classFilterOptions: string[], allIntervals: string[], shouldGroupByWeek: boolean) {
  return useMemo(
    () =>
      classFilterOptions
        .filter((cat) => cat !== "ALL CLASSES")
        .map((category) => {
          const normalizedCategory = normalizeCategory(category);
          return {
            key: category,
            data: allIntervals.map((intervalKey) => {
              const date = shouldGroupByWeek
                ? DateTime.fromISO(intervalKey).toJSDate()
                : DateTime.fromFormat(intervalKey, "yyyy-MM")
                  .startOf("month")
                  .toJSDate();

              const attendanceForInterval =
                attendanceBreakdown.get(intervalKey);

              let count = 0;
              const attendanceForCat =
                attendanceForInterval?.get(normalizedCategory);
              for (const className of attendanceForCat?.keys() ?? []) {
                const attendanceForClass = attendanceForCat?.get(className);
                for (const instructor of attendanceForClass?.keys() ?? []) {
                  const attendance = attendanceForClass?.get(instructor) ?? 0;
                  count += attendance;
                }
              }
              return { key: date, data: count };
            }),
          };
        }),
    [allIntervals, classFilterOptions, attendanceBreakdown, shouldGroupByWeek],
  );

}

export function useAllInstructorData(attendanceBreakdown: AcuityAttendanceBreakdown, allInstructors: string[], allIntervals: string[], shouldGroupByWeek: boolean) {
  return useMemo(
    () =>
      allInstructors.map((instructor) => {
        return {
          key: instructor,
          data: allIntervals.map((intervalKey) => {
            const date = shouldGroupByWeek
              ? DateTime.fromISO(intervalKey).toJSDate()
              : DateTime.fromFormat(intervalKey, "yyyy-MM")
                .startOf("month")
                .toJSDate();
            const attendanceForInterval = attendanceBreakdown.get(intervalKey);

            if (!attendanceForInterval) return { key: date, data: 0 };

            let count = 0;
            for (const cat of attendanceForInterval.keys()) {
              const attendanceForCat = attendanceForInterval.get(cat);
              for (const className of attendanceForCat?.keys() ?? []) {
                const attendanceForClass = attendanceForCat?.get(className);
                const attendance = attendanceForClass?.get(instructor) ?? 0;
                count += attendance;
              }
            }

            return { key: date, data: count };
          }),
        };
      }),
    [allInstructors, allIntervals, attendanceBreakdown, shouldGroupByWeek],
  );

}

export function useInstructorTableData(instructorDataByClass: InstructorDataByClass) {
  return useMemo(
    () =>
      Array.from(instructorDataByClass.entries()).map(
        ([className, instructorMap]) => {
          const firstInstructor = Array.from(instructorMap.values())[0];
          const classCategory = firstInstructor?.classCategory || "UNKNOWN";

          const instructors: Array<{
            instructor: string;
            avgAttendance: number;
            numClasses: number;
            totalAttendance: number;
          }> = Array.from(instructorMap.entries()).map(
            ([instructor, stats]) => {
              const numClasses = stats.uniqueSessions.size;
              const avgAttendance =
                numClasses > 0 ? stats.count / numClasses : 0;
              return {
                instructor,
                avgAttendance: Math.round(avgAttendance * 100) / 100,
                numClasses,
                totalAttendance: stats.count,
              };
            },
          );

          const totalAttendance = instructors.reduce(
            (sum, inst) => sum + inst.totalAttendance,
            0,
          );
          const totalClasses = instructors.reduce(
            (sum, inst) => sum + inst.numClasses,
            0,
          );
          const avgAttendance =
            totalClasses > 0 ? totalAttendance / totalClasses : 0;

          return {
            class:
              className.length > 15
                ? className.slice(0, 15) + "..."
                : className,
            category: classCategory,
            avgAttendance: Math.round(avgAttendance * 100) / 100,
            numClasses: totalClasses,
            totalAttendance,
            instructorNames: instructors.map((i) => i.instructor).join(", "),
            instructors,
          };
        },
      ),
    [instructorDataByClass],
  );

}

export function useTrimesterAttendanceData(trimesterAttendance: Map<string, number>, classFilterOptions: string[], trimesterLegend: Array<{ key: string, color: string }>) {
  return useMemo(
    () =>
      classFilterOptions
        .filter((cat) => cat !== "ALL CLASSES")
        .map((category) => {
          const categoryLower = category.toLowerCase();

          return {
            key: category,
            data: trimesterLegend.map((trimester) => ({
              key: trimester.key,
              data:
                trimesterAttendance.get(`${categoryLower} ${trimester.key}`) ??
                0,
            })),
          };
        }),
    [classFilterOptions, trimesterAttendance, trimesterLegend],
  )
}


export function useClassAttendanceByTrimesterData(trimesterAttendance: Map<string, number>, classesToCategory: Map<string, string>, trimesterLegend: Array<{ key: string, color: string }>) {
  return useMemo(
    () =>
      Array.from(classesToCategory.entries()).map(([className]) => {
        const classKey = className.toLowerCase();

        return {
          key: className,
          data: trimesterLegend.map((trimester) => ({
            key: trimester.key,
            data:
              trimesterAttendance.get(`${classKey} ${trimester.key}`) ?? 0,
          })),
        };
      }),
    [
      classesToCategory,
      trimesterAttendance,
      trimesterLegend,
    ],
  );

}

export function useTrimesterTableData(trimesterAttendance: Map<string, number>, classesToCategory: Map<string, string>) {
  return useMemo(
    () =>
      Array.from(classesToCategory.entries()).map(([className, category]) => {
        const classKey = className.toLowerCase();

        const first = trimesterAttendance.get(`${classKey} FIRST TRIM`) ?? 0;
        const second = trimesterAttendance.get(`${classKey} SECOND TRIM`) ?? 0;
        const third = trimesterAttendance.get(`${classKey} THIRD TRIM`) ?? 0;
        const fourth = trimesterAttendance.get(`${classKey} FOURTH TRIM`) ?? 0;
        const fifth = trimesterAttendance.get(`${classKey} FIFTH TRIM`) ?? 0;

        const total = first + second + third + fourth + fifth;

        return {
          class: className.slice(0, 15) + "...",
          category,
          first,
          second,
          third,
          fourth,
          fifth,
          total,
        };
      }),
    [classesToCategory, trimesterAttendance],
  );

}
