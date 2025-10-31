import { useState, useMemo } from "react";
import {
  LineChart,
  LineSeries,
  StackedBarChart,
  StackedBarSeries,
  Bar,
  BarChart,
  BarSeries,
  Gradient,
  GradientStop,
  RangeLines,
  GuideBar,
} from "reaviz";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Header from "../../components/Header";
import { exportAsSvg } from "@/components/Exportable";
import {
  DateRangePicker,
  defaultPresets,
  defaultDateRange,
} from "@/components/DateRangePicker/DateRangePicker";
import { DataTable } from "@/components/DataTable/DataTable";
import {
  TrimesterAttendance,
  trimesterColumns,
  InstructorAttendance,
  instructorColumns,
} from "./AcuityTableColumns";

export default function AcuityDashboardPage() {
  const [navBarOpen, setNavBarOpen] = useState<boolean>(true);
  const [attendanceDisplay, setAttendanceDisplay] = useState<string>("graph");
  const [classPopularityDisplay, setClassPopularityDisplay] =
    useState<string>("graph");
  const [instructorPopularityDisplay, setInstructorPopularityDisplay] =
    useState<string>("graph");

  const [selectedClass, setSelectedClass] = useState("ALL CLASSES");

  const trimesterAttendanceData = [
    {
      key: "Postpartum Classes",
      data: [
        { key: "FIRST TRIM", data: 10 },
        { key: "SECOND TRIM", data: 15 },
        { key: "THIRD TRIM", data: 20 },
        { key: "FOURTH TRIM", data: 5 },
        { key: "FIFTH TRIM", data: 5 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: "FIRST TRIM", data: 7 },
        { key: "SECOND TRIM", data: 1 },
        { key: "THIRD TRIM", data: 2 },
        { key: "FOURTH TRIM", data: 10 },
        { key: "FIFTH TRIM", data: 3 },
      ],
    },
    {
      key: "Infant Massage",
      data: [
        { key: "FIRST TRIM", data: 1 },
        { key: "SECOND TRIM", data: 4 },
        { key: "THIRD TRIM", data: 3 },
        { key: "FOURTH TRIM", data: 7 },
        { key: "FIFTH TRIM", data: 10 },
      ],
    },
    {
      key: "Parent Groups",
      data: [
        { key: "FIRST TRIM", data: 9 },
        { key: "SECOND TRIM", data: 6 },
        { key: "THIRD TRIM", data: 19 },
        { key: "FOURTH TRIM", data: 4 },
        { key: "FIFTH TRIM", data: 7 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: "FIRST TRIM", data: 13 },
        { key: "SECOND TRIM", data: 16 },
        { key: "THIRD TRIM", data: 21 },
        { key: "FOURTH TRIM", data: 0 },
        { key: "FIFTH TRIM", data: 0 },
      ],
    },
  ];

  const allClassData = [
    {
      key: "Postpartum Classes",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 30 },
        { key: new Date("2025-03-12"), data: 25 },
        { key: new Date("2025-03-19"), data: 15 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 18 },
        { key: new Date("2025-03-19"), data: 12 },
      ],
    },
    {
      key: "Infant Massage",
      data: [
        { key: new Date("2025-02-19"), data: 1 },
        { key: new Date("2025-02-26"), data: 2 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 4 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
    {
      key: "Parent Groups",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 20 },
        { key: new Date("2025-03-05"), data: 7 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 2 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 12 },
        { key: new Date("2025-03-05"), data: 4 },
        { key: new Date("2025-03-12"), data: 5 },
        { key: new Date("2025-03-19"), data: 6 },
      ],
    },
  ];

  const allClassAttendanceData = [
    {
      key: "Postpartum Classes",
      data: [
        { key: "Optimizing Sleep, Prenatal", data: 10 },
        { key: "Perinatal Rights at Work", data: 12 },
        { key: "Pumping Strategies + RTW", data: 8 },
        { key: "Starting Solids - Feeding 101", data: 15 },
        { key: "Feeding 102 - Overcoming Challenges in Feeding", data: 6 },
        { key: "Postpartum Nutrition", data: 3 },
        { key: "Rose PT Postpartum Pelvic Health", data: 3 },
        { key: "Bottles & Other Feeding Tools", data: 3 },
      ],
    },
    {
      key: "Prenatal Classes",
      data: [
        { key: "Breastfeeding + Pumping Basics", data: 7 },
        { key: "Baby Care", data: 9 },
        { key: "Babywearing 101", data: 14 },
        { key: "Financial Planning for Baby", data: 5 },
        { key: "Rose PT Prenatal Pelvic Health", data: 11 },
        { key: "Bottles & Other Feeding Tools", data: 2 },
      ],
    },
    {
      key: "Infant Massage",
      data: [{ key: "Infant Massage", data: 7 }],
    },
    {
      key: "Parent Groups",
      data: [
        { key: "Navigating Perinatal Stress", data: 7 },
        { key: "Feeding + Postpartum with 0-4m Olds", data: 9 },
        { key: "Feeding + Postpartum with 4-12m Olds", data: 14 },
        { key: "Feeding + Postpartum with Toddlers", data: 5 },
      ],
    },
    {
      key: "Childbirth Classes",
      data: [
        { key: "Childbirth Express", data: 7 },
        { key: "Natural Childbirth", data: 9 },
        { key: "Doula Meet + Greet", data: 14 },
        { key: "Comfort, Communication & Positions", data: 5 },
        { key: "Evening Lamaze Series", data: 11 },
        { key: "Prep for Postpartum Recovery", data: 2 },
      ],
    },
  ];

  const trimesterData: TrimesterAttendance[] = [
    {
      class: "Prenatal R...",
      category: "Postpartum",
      first: 11,
      second: 17,
      third: 7,
      fourth: 2,
      fifth: 17,
      total: 10,
    },
    {
      class: "Baby Care",
      category: "Prenatal",
      first: 7,
      second: 3,
      third: 3,
      fourth: 3,
      fifth: 3,
      total: 3,
    },
    {
      class: "Postpartum...",
      category: "Postpartum",
      first: 12,
      second: 5,
      third: 11,
      fourth: 3,
      fifth: 3,
      total: 9,
    },
    {
      class: "Bottles & O...",
      category: "Postpartum",
      first: 4,
      second: 7,
      third: 21,
      fourth: 8,
      fifth: 1,
      total: 3,
    },
    {
      class: "Starting S...",
      category: "Postpartum",
      first: 17,
      second: 11,
      third: 5,
      fourth: 0,
      fifth: 2,
      total: 1,
    },
  ];

  const instructorData: InstructorAttendance[] = [
    {
      class: "Prenatal R...",
      category: "Postpartum",
      total_attendance: 30,
      instructor1_attendance: 11,
      instructor2_attendance: 11,
    },
    {
      class: "Baby Care",
      category: "Prenatal",
      total_attendance: 15,
      instructor1_attendance: 7,
      instructor2_attendance: 7,
    },
    {
      class: "Postpartum...",
      category: "Postpartum",
      total_attendance: 32,
      instructor1_attendance: 17,
      instructor2_attendance: 10,
    },
    {
      class: "Bottle & O...",
      category: "Postpartum",
      total_attendance: 22,
      instructor1_attendance: 1,
      instructor2_attendance: 19,
    },
    {
      class: "Starting S...",
      category: "Postpartum",
      total_attendance: 32,
      instructor1_attendance: 13,
      instructor2_attendance: 15,
    },
  ];

  const centerItemsInDiv = "flex justify-between items-center";
  const transparentGrayButtonStyle =
    "bg-transparent hover:bg-bcgw-gray-light text-gray border-2 border-gray py-1 px-6 rounded-full cursor-pointer";
  const graphTableButtonStyle =
    "py-1 px-4 text-center shadow-sm bg-[#f5f5f5] hover:shadow-md text-black cursor-pointer";

  const filteredClassData =
    selectedClass === "ALL CLASSES"
      ? allClassData
      : allClassData.filter((item) => item.key === selectedClass);

  const filteredClassBars =
    selectedClass === "ALL CLASSES"
      ? []
      : allClassAttendanceData.filter((c) => c.key === selectedClass);

  const barData = filteredClassBars[0]?.data ?? [];

  const [selectedInstructor, setSelectedInstructor] = useState("ALL CLASSES");

  const allInstructorData = [
    {
      key: "Sarah Johnson",
      data: [
        { key: new Date("2025-02-19"), data: 15 },
        { key: new Date("2025-02-26"), data: 18 },
        { key: new Date("2025-03-05"), data: 22 },
        { key: new Date("2025-03-12"), data: 20 },
        { key: new Date("2025-03-19"), data: 17 },
      ],
    },
    {
      key: "Emily Chen",
      data: [
        { key: new Date("2025-02-19"), data: 12 },
        { key: new Date("2025-02-26"), data: 15 },
        { key: new Date("2025-03-05"), data: 18 },
        { key: new Date("2025-03-12"), data: 16 },
        { key: new Date("2025-03-19"), data: 14 },
      ],
    },
    {
      key: "Maria Rodriguez",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 10 },
        { key: new Date("2025-03-05"), data: 12 },
        { key: new Date("2025-03-12"), data: 11 },
        { key: new Date("2025-03-19"), data: 9 },
      ],
    },
    {
      key: "Jennifer Taylor",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 12 },
        { key: new Date("2025-03-05"), data: 15 },
        { key: new Date("2025-03-12"), data: 13 },
        { key: new Date("2025-03-19"), data: 11 },
      ],
    },
    {
      key: "Lisa Anderson",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 7 },
        { key: new Date("2025-03-05"), data: 9 },
        { key: new Date("2025-03-12"), data: 8 },
        { key: new Date("2025-03-19"), data: 6 },
      ],
    },
  ];

  const postpartumInstructors = [
    {
      key: "Sarah Johnson",
      data: [
        { key: new Date("2025-02-19"), data: 10 },
        { key: new Date("2025-02-26"), data: 12 },
        { key: new Date("2025-03-05"), data: 15 },
        { key: new Date("2025-03-12"), data: 13 },
        { key: new Date("2025-03-19"), data: 11 },
      ],
    },
    {
      key: "Emily Chen",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 10 },
        { key: new Date("2025-03-05"), data: 12 },
        { key: new Date("2025-03-12"), data: 11 },
        { key: new Date("2025-03-19"), data: 9 },
      ],
    },
  ];

  const prenatalInstructors = [
    {
      key: "Maria Rodriguez",
      data: [
        { key: new Date("2025-02-19"), data: 8 },
        { key: new Date("2025-02-26"), data: 10 },
        { key: new Date("2025-03-05"), data: 12 },
        { key: new Date("2025-03-12"), data: 11 },
        { key: new Date("2025-03-19"), data: 9 },
      ],
    },
    {
      key: "Jennifer Taylor",
      data: [
        { key: new Date("2025-02-19"), data: 7 },
        { key: new Date("2025-02-26"), data: 9 },
        { key: new Date("2025-03-05"), data: 11 },
        { key: new Date("2025-03-12"), data: 1 },
        { key: new Date("2025-03-19"), data: 8 },
      ],
    },
  ];

  const infantMassageInstructors = [
    {
      key: "Lisa Anderson",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 7 },
        { key: new Date("2025-03-05"), data: 9 },
        { key: new Date("2025-03-12"), data: 8 },
        { key: new Date("2025-03-19"), data: 1 },
      ],
    },
  ];

  const parentGroupInstructors = [
    {
      key: "Sarah Johnson",
      data: [
        { key: new Date("2025-02-19"), data: 5 },
        { key: new Date("2025-02-26"), data: 6 },
        { key: new Date("2025-03-05"), data: 3 },
        { key: new Date("2025-03-12"), data: 7 },
        { key: new Date("2025-03-19"), data: 6 },
      ],
    },
    {
      key: "Emily Chen",
      data: [
        { key: new Date("2025-02-19"), data: 4 },
        { key: new Date("2025-02-26"), data: 5 },
        { key: new Date("2025-03-05"), data: 6 },
        { key: new Date("2025-03-12"), data: 5 },
        { key: new Date("2025-03-19"), data: 5 },
      ],
    },
  ];

  const childbirthInstructors = [
    {
      key: "Maria Rodriguez",
      data: [
        { key: new Date("2025-02-19"), data: 6 },
        { key: new Date("2025-02-26"), data: 8 },
        { key: new Date("2025-03-05"), data: 10 },
        { key: new Date("2025-03-12"), data: 9 },
        { key: new Date("2025-03-19"), data: 7 },
      ],
    },
    {
      key: "Jennifer Taylor",
      data: [
        { key: new Date("2025-02-19"), data: 3 },
        { key: new Date("2025-02-26"), data: 3 },
        { key: new Date("2025-03-05"), data: 4 },
        { key: new Date("2025-03-12"), data: 3 },
        { key: new Date("2025-03-19"), data: 3 },
      ],
    },
  ];

  const filteredInstructorData =
    selectedInstructor === "ALL CLASSES"
      ? allInstructorData
      : selectedInstructor === "Postpartum Classes"
        ? postpartumInstructors
        : selectedInstructor === "Prenatal Classes"
          ? prenatalInstructors
          : selectedInstructor === "Infant Massage"
            ? infantMassageInstructors
            : selectedInstructor === "Parent Groups"
              ? parentGroupInstructors
              : selectedInstructor === "Childbirth Classes"
                ? childbirthInstructors
                : allInstructorData;

  const typeToCategory: Record<string, string> = {
    "Postpartum Classes": "Postpartum",
    "Prenatal Classes": "Prenatal",
    "Infant Massage": "Infant Massage",
    "Parent Groups": "Parent Groups",
    "Childbirth Classes": "Childbirth",
  };

  const instructorTableRows = useMemo(() => {
    if (selectedInstructor === "ALL CLASSES") return instructorData;
    const cat = typeToCategory[selectedInstructor] ?? selectedInstructor;
    return instructorData.filter((r) => r.category === cat);
  }, [selectedInstructor, instructorData]);



  function buildStackedBarSVG(
    data: Array<{
      key: string;
      data: Array<{ key: string; data: number }>;
    }>,
    width = 1000,
    height = 400
  ) {

    const trimesterColors = ["#F4D7A6", "#FF9900", "#5DB9FF", "#1E5A8E", "#0A1929"];
    const paddingLeft = 80;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 80;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const classNames = data.map((d) => d.key);
    // const trimesters = data[0]?.data || [];
    const numBars = classNames.length;
    const barWidth = chartWidth / numBars * 0.6;
    const barSpacing = chartWidth / numBars;

    let maxStack = 0;
    classNames.forEach((className) => {
      const series = data.find((d) => d.key === className);
      if (series) {
        const total = series.data.reduce((sum, point) => sum + point.data, 0);
        maxStack = Math.max(maxStack, total);
      }
    });

    const yMax = Math.ceil(maxStack / 10) * 10;
    const scale = (val: number) => (val / yMax) * chartHeight;

    const parts: string[] = [];


    parts.push(
      `<rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF"/>`
    );

    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = paddingTop + (chartHeight / gridLines) * i;
      const value = yMax - (yMax / gridLines) * i;

      parts.push(
        `<line x1="${paddingLeft}" y1="${y}" x2="${paddingLeft + chartWidth}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`
      );

      parts.push(
        `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" font-size="12" font-family="system-ui, -apple-system, sans-serif" fill="#6B7280">${value}</text>`
      );
    }

    parts.push(
      `<text x="${15}" y="${paddingTop + chartHeight / 2}" text-anchor="middle" font-size="14" font-weight="600" font-family="system-ui, -apple-system, sans-serif" fill="#374151" transform="rotate(-90, 15, ${paddingTop + chartHeight / 2})">Participants</text>`
    );

    classNames.forEach((className, classIndex) => {
      const centerX = paddingLeft + classIndex * barSpacing + barSpacing / 2;
      let stackY = paddingTop + chartHeight;

      const series = data.find((d) => d.key === className);
      if (series) {
        series.data.forEach((point, trimIndex) => {
          if (point.data > 0) {
            const barHeight = scale(point.data);
            const barX = centerX - barWidth / 2;
            const barY = stackY - barHeight;

            parts.push(
              `<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="${trimesterColors[trimIndex % trimesterColors.length]}" stroke="none"/>`
            );

            stackY = barY;
          }
        });
      }

      const labelX = centerX;
      const labelY = paddingTop + chartHeight + 20;

      const displayName = className.replace(" Classes", "").replace("Infant ", "");

      parts.push(
        `<text x="${labelX}" y="${labelY}" text-anchor="middle" font-size="11" font-family="system-ui, -apple-system, sans-serif" fill="#374151">${displayName}</text>`
      );
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join("")}</svg>`;
  }

  function buildBarChartSVG(
    data: Array<{ key: string; data: number }>,
    width = 1000,
    height = 400
  ) {
    const paddingLeft = 60;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 80;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const numBars = data.length;
    const barWidth = chartWidth / numBars * 0.6;
    const barSpacing = chartWidth / numBars;

    const maxVal = Math.max(...data.map((d) => d.data));
    const yMax = Math.ceil(maxVal / 10) * 10;
    const scale = (val: number) => (val / yMax) * chartHeight;

    const parts: string[] = [];

    parts.push(
      `<rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF"/>`
    );


    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = paddingTop + (chartHeight / gridLines) * i;
      const value = yMax - (yMax / gridLines) * i;

      parts.push(
        `<line x1="${paddingLeft}" y1="${y}" x2="${paddingLeft + chartWidth}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`
      );

      parts.push(
        `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" font-size="12" fill="#6B7280">${value}</text>`
      );
    }


    parts.push(
      `<text x="${15}" y="${paddingTop + chartHeight / 2}" text-anchor="middle" font-size="14" font-weight="600" fill="#374151" transform="rotate(-90, 15, ${paddingTop + chartHeight / 2})">Participants</text>`
    );

    data.forEach((item, index) => {
      const centerX = paddingLeft + index * barSpacing + barSpacing / 2;
      const barHeight = scale(item.data);
      const barX = centerX - barWidth / 2;
      const barY = paddingTop + chartHeight - barHeight;

      parts.push(
        `<rect x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" fill="#F4BB47" />`
      );

      parts.push(
        `<text x="${centerX}" y="${barY - 5}" text-anchor="middle" font-size="12" font-weight="600" fill="#374151">${item.data}</text>`
      );

      const labelWords = item.key.split(' ');
      let line1 = '';
      let line2 = '';

      if (labelWords.length > 3) {
        line1 = labelWords.slice(0, 3).join(' ');
        line2 = labelWords.slice(3).join(' ');
      } else {
        line1 = item.key;
      }

      parts.push(
        `<text x="${centerX}" y="${paddingTop + chartHeight + 15}" text-anchor="middle" font-size="10" fill="#374151">${line1}</text>`
      );

      if (line2) {
        parts.push(
          `<text x="${centerX}" y="${paddingTop + chartHeight + 28}" text-anchor="middle" font-size="10" fill="#374151">${line2}</text>`
        );
      }
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join("")}</svg>`;
  }

  function buildLineChartSVG(
    data: Array<{
      key: string;
      data: Array<{ key: Date; data: number }>;
    }>,
    width = 1000,
    height = 400
  ) {
    const palette = ["#F4BB47", "#EF4444", "#3B82F6", "#05182A", "#10B981"];
    const paddingLeft = 60;
    const paddingRight = 40;
    const paddingTop = 40;
    const paddingBottom = 60;
    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    if (!data || data.length === 0 || !data[0]?.data) {
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect fill="#FFFFFF" width="${width}" height="${height}"/><text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#6B7280">No data available</text></svg>`;
    }

    const allDates = data[0].data.map((d) => d.key);
    const maxVal = Math.max(...data.flatMap((s) => s.data.map((d) => d.data)));
    const yMax = Math.ceil(maxVal / 10) * 10;

    const scaleX = (index: number) =>
      paddingLeft + (index / Math.max(1, allDates.length - 1)) * chartWidth;
    const scaleY = (val: number) =>
      paddingTop + chartHeight - (val / yMax) * chartHeight;

    const parts: string[] = [];


    parts.push(
      `<rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF"/>`
    );


    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = paddingTop + (chartHeight / gridLines) * i;
      const value = yMax - (yMax / gridLines) * i;

      parts.push(
        `<line x1="${paddingLeft}" y1="${y}" x2="${paddingLeft + chartWidth}" y2="${y}" stroke="#E5E7EB" stroke-width="1"/>`
      );

      parts.push(
        `<text x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" font-size="12" fill="#6B7280">${value}</text>`
      );
    }

    allDates.forEach((_, index) => {
      const x = scaleX(index);
      parts.push(
        `<line x1="${x}" y1="${paddingTop}" x2="${x}" y2="${paddingTop + chartHeight}" stroke="#E5E7EB" stroke-width="1"/>`
      );
    });

    parts.push(
      `<text x="${15}" y="${paddingTop + chartHeight / 2}" text-anchor="middle" font-size="14" font-weight="600" fill="#374151" transform="rotate(-90, 15, ${paddingTop + chartHeight / 2})">Participants</text>`
    );

    data.forEach((series, seriesIndex) => {
      const points = series.data
        .map((point, index) => `${scaleX(index)},${scaleY(point.data)}`)
        .join(" ");

      parts.push(
        `<polyline points="${points}" fill="none" stroke="${palette[seriesIndex % palette.length]}" stroke-width="2.5" />`
      );

      series.data.forEach((point, index) => {
        parts.push(
          `<circle cx="${scaleX(index)}" cy="${scaleY(point.data)}" r="4" fill="${palette[seriesIndex % palette.length]}" stroke="#FFFFFF" stroke-width="2"/>`
        );
      });
    });

    allDates.forEach((date, index) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const label = `${month}/${day}`;

      parts.push(
        `<text x="${scaleX(index)}" y="${paddingTop + chartHeight + 20}" text-anchor="middle" font-size="11" fill="#374151">${label}</text>`
      );
    });

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join("")}</svg>`;
  }

  const handleExportAttendance = async () => {
    const svgString =
      selectedClass === "ALL CLASSES"
        ? buildStackedBarSVG(trimesterAttendanceData, 900, 400)
        : buildBarChartSVG(barData, 1000, 400);

    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    let legend = null;
    if (selectedClass === "ALL CLASSES") {
      const trimesterLabels = ["Trimester 1", "Trimester 2", "Trimester 3", "Trimester 4", "Trimester 5"];
      const palette = ["#FCD484", "#FFAA00", "#5DB9FF", "#1661A9", "#05182A"];

      legend = (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#F9FAFB",
            border: "1px solid #D1D5DB",
            borderRadius: "8px",
            padding: "12px 16px",
            gap: "10px",
            minWidth: "200px",
          }}
        >
          {trimesterLabels.map((label, idx) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: "20px",
                  height: "12px",
                  backgroundColor: palette[idx % palette.length],
                  borderRadius: "2px",
                }}
              />
              <span style={{ fontSize: "13px", color: "#374151" }}>{label}</span>
            </div>
          ))}
        </div>
      );
    }

    const exportContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          gap: "30px",
          padding: "20px",
        }}
      >
        <img
          src={dataUri}
          width={selectedClass === "ALL CLASSES" ? 900 : 1000}
          height={400}
          alt="Class Attendance"
          style={{ display: "block" }}
        />
        {legend}
      </div>
    );

    await exportAsSvg({
      content: exportContent,
      title: "Class Attendance By Trimester, 2/19/25 - 3/19/25",
      dateRange: null,
      selectedFilters: { Class: selectedClass },
      legend: null,
      width: 1200,
      height: 760,
      filename: "acuity-class-attendance",
      backgroundColor: "#FFFFFF",
    });
  };


  const handleExportClassPopularity = async () => {
    const svgString = buildLineChartSVG(filteredClassData, 900, 400);
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    const palette = ["#F4BB47", "#EF4444", "#3B82F6", "#05182A", "#10B981"];
    const legend = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F9FAFB",
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          padding: "12px 16px",
          gap: "10px",
          minWidth: "200px",
        }}
      >
        {filteredClassData.map((series, idx) => (
          <div
            key={series.key}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "20px",
                height: "12px",
                backgroundColor: palette[idx % palette.length],
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "13px", color: "#374151" }}>
              {series.key}
            </span>
          </div>
        ))}
      </div>
    );

    const exportContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          gap: "30px",
          padding: "20px",
        }}
      >
        <img
          src={dataUri}
          width={900}
          height={400}
          alt="Class Attendance"
          style={{ display: "block" }}
        />
        {legend}
      </div>
    );

    await exportAsSvg({
      content: exportContent,
      title: "Class Attendance Over Time, 2/19/25 - 3/19/25",
      dateRange: null,
      selectedFilters: { Class: selectedClass },
      legend: null,
      width: 1200,
      height: 760,
      filename: "acuity-class-popularity",
      backgroundColor: "#FFFFFF",
    });
  };

  const handleExportInstructorPopularity = async () => {
    const svgString = buildLineChartSVG(filteredInstructorData, 900, 400);
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

    const palette = ["#F4BB47", "#EF4444", "#3B82F6", "#05182A", "#10B981"];
    const legend = (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#F9FAFB",
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          padding: "12px 16px",
          gap: "10px",
          minWidth: "200px",
        }}
      >
        {filteredInstructorData.map((series, idx) => (
          <div
            key={series.key}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <div
              style={{
                width: "20px",
                height: "12px",
                backgroundColor: palette[idx % palette.length],
                borderRadius: "2px",
              }}
            />
            <span style={{ fontSize: "13px", color: "#374151" }}>
              {series.key}
            </span>
          </div>
        ))}
      </div>
    );

    const exportContent = (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          gap: "30px",
          padding: "20px",
        }}
      >
        <img
          src={dataUri}
          width={900}
          height={400}
          alt="Instructor Popularity"
          style={{ display: "block" }}
        />
        {legend}
      </div>
    );

    await exportAsSvg({
      content: exportContent,
      title: "Instructor Popularity Over Time, 2/19/25 - 3/19/25",
      dateRange: null,
      selectedFilters: { Class: selectedInstructor },
      legend: null,
      width: 1200,
      height: 760,
      filename: "acuity-instructor-popularity",
      backgroundColor: "#FFFFFF",
    });
  };

  const classAttendanceTableExtras = (
    <div className="w-full flex justify-end">
      <select
        className="h-9 rounded-md border bg-white px-3 text-sm"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option>ALL CLASSES</option>
        {allClassData.map((c) => (
          <option key={c.key}>{c.key}</option>
        ))}
      </select>
    </div>
  );

  const classPopularityTableExtras = (
    <div className="w-full flex justify-end">
      <select
        className="border bg-white h-9 rounded-md px-2 py-1 text-sm"
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        <option>ALL CLASSES</option>
        {allClassData.map((c) => (
          <option key={c.key}>{c.key}</option>
        ))}
      </select>
    </div>
  );

  const instructorPopularityTableExtras = (
    <div className="w-full flex justify-end">
      <select
        className="h-9 rounded-md border bg-white px-3 text-sm"
        value={selectedInstructor}
        onChange={(e) => setSelectedInstructor(e.target.value)}
      >
        <option>ALL CLASSES</option>
        <option>Postpartum Classes</option>
        <option>Prenatal Classes</option>
        <option>Infant Massage</option>
        <option>Parent Groups</option>
        <option>Childbirth Classes</option>
      </select>
    </div>
  );

  return (
    <>
      <NavigationBar navBarOpen={navBarOpen} setNavBarOpen={setNavBarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-200 ease-in-out bg-gray-200 min-h-screen overflow-x-hidden flex flex-col ${navBarOpen ? "ml-[250px]" : "ml-[60px]"
          }`}
      >
        <Header />
        <div className="flex flex-col p-8 pr-20 pl-20 space-y-5">
          <div className={centerItemsInDiv}>
            <div>
              <h1 className="font-bold">ACUITY</h1>
            </div>
            {/*date picker*/}
            <div className="w-60">
              <DateRangePicker
                enableYearNavigation
                defaultValue={defaultDateRange}
                presets={defaultPresets}
                className="w-60"
              />
            </div>
          </div>
          <div className={`${centerItemsInDiv} pt-4`}>
            <div className="flex flex-row">
              <button
                className={`${graphTableButtonStyle} ${attendanceDisplay == "graph"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
                  }`}
                onClick={() => setAttendanceDisplay("graph")}
              >
                Graph
              </button>
              <button
                className={`${graphTableButtonStyle} ${attendanceDisplay == "table"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
                  }`}
                onClick={() => setAttendanceDisplay("table")}
              >
                Table
              </button>
            </div>
            <button
              className={transparentGrayButtonStyle}
              disabled={attendanceDisplay !== "graph"}
              onClick={handleExportAttendance}
            >
              Export
            </button>
          </div>

          {/* Attendance Bar Chart */}
          <div
            className={
              attendanceDisplay === "graph"
                ? "bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black"
                : ""
            }
          >
            <div className="flex justify-between items-center space-x-4">
              <div className="text-2xl font-semibold">
                Class Attendance By Trimester{" "}
                {attendanceDisplay === "graph" ? <br /> : <></>}2/19/25 -
                3/19/25
              </div>
              {attendanceDisplay === "graph" ? (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium"></label>
                  <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option>ALL CLASSES</option>
                    {allClassData.map((c) => (
                      <option key={c.key}>{c.key}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <></>
              )}
            </div>

            {attendanceDisplay === "graph" ? (
              <div className="w-full h-96">
                {selectedClass === "ALL CLASSES" ? (
                  <StackedBarChart
                    height={350}
                    data={trimesterAttendanceData}
                    series={
                      <StackedBarSeries
                        bar={
                          <Bar
                            width={100}
                            rx={0}
                            ry={0}
                            gradient={
                              <Gradient
                                stops={[
                                  <GradientStop
                                    offset="5%"
                                    stopOpacity={1.0}
                                    key="start"
                                  />,
                                  <GradientStop
                                    offset="90%"
                                    stopOpacity={1.0}
                                    key="end"
                                  />,
                                ]}
                              />
                            }
                            rangeLines={
                              <RangeLines position="top" strokeWidth={3} />
                            }
                            guide={<GuideBar />}
                          />
                        }
                        colorScheme={[
                          "#FCD484",
                          "#FFAA00",
                          "#5DB9FF",
                          "#1661A9",
                          "#05182A",
                        ]}
                      />
                    }
                  />
                ) : (
                  <BarChart
                    height={350}
                    data={barData}
                    series={
                      <BarSeries
                        padding={0.1}
                        colorScheme={"#F4BB47"}
                        bar={<Bar rx={0} ry={0} style={{ fill: "#F4BB47" }} />}
                      />
                    }
                  />
                )}
              </div>
            ) : (
              <DataTable
                columns={trimesterColumns}
                data={trimesterData}
                tableType="default"
                tableHeaderExtras={classAttendanceTableExtras}
              />
            )}
          </div>

          <div className={`${centerItemsInDiv} pt-8`}>
            <div className="flex flex-row">
              <button
                className={`${graphTableButtonStyle} ${classPopularityDisplay == "graph"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
                  }`}
                onClick={() => setClassPopularityDisplay("graph")}
              >
                Graph
              </button>
              <button
                className={`${graphTableButtonStyle} ${classPopularityDisplay == "table"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
                  }`}
                onClick={() => setClassPopularityDisplay("table")}
              >
                Table
              </button>
            </div>
            <button
              className={transparentGrayButtonStyle}
              disabled={classPopularityDisplay !== "graph"}
              onClick={handleExportClassPopularity}
            >
              Export
            </button>
          </div>

          {/* Class Popularity Over Time */}
          <div
            className={
              classPopularityDisplay === "graph"
                ? "bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black"
                : ""
            }
          >
            <div className="flex justify-between items-center space-x-4">
              <div className="text-2xl font-semibold">
                {classPopularityDisplay === "graph" ? (
                  <span>Class Attendance Over Time</span>
                ) : (
                  <span>Class Attendance</span>
                )}
                {classPopularityDisplay === "graph" ? <br /> : <></>} 2/19/25 -
                3/19/25
              </div>

              {classPopularityDisplay === "graph" ? (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium"></label>
                  <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option>ALL CLASSES</option>
                    {allClassData.map((c) => (
                      <option key={c.key}>{c.key}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium"></label>
                  <select
                    className="border rounded-md px-2 py-1 text-sm"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option>ALL CLASSES</option>
                    {allClassData.map((c) => (
                      <option key={c.key}>{c.key}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {classPopularityDisplay === "graph" ? (
              <div className="w-full h-96">
                <LineChart
                  height={300}
                  data={filteredClassData}
                  series={<LineSeries type="grouped" />}
                />
              </div>
            ) : (
              <DataTable
                columns={instructorColumns}
                data={instructorData}
                tableType="default"
                tableHeaderExtras={classPopularityTableExtras}
              />
            )}
          </div>

          <div className={`${centerItemsInDiv} pt-8`}>
            <div className="flex flex-row">
              <button
                className={`${graphTableButtonStyle} ${instructorPopularityDisplay == "graph"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
                  }`}
                onClick={() => setInstructorPopularityDisplay("graph")}
              >
                Graph
              </button>
              <button
                className={`${graphTableButtonStyle} ${instructorPopularityDisplay == "table"
                  ? "bg-bcgw-gray-light"
                  : "bg-[#f5f5f5]"
                  }`}
                onClick={() => setInstructorPopularityDisplay("table")}
              >
                Table
              </button>
            </div>
            <button
              className={transparentGrayButtonStyle}
              disabled={instructorPopularityDisplay !== "graph"}
              onClick={handleExportInstructorPopularity}
            >
              Export
            </button>
          </div>

          {/* Instructor Popularity Over Time */}
          <div
            className={
              instructorPopularityDisplay === "graph"
                ? "bg-white rounded-2xl shadow p-6 space-y-6 border-2 border-black"
                : ""
            }
          >
            <div className="flex justify-between items-center space-x-4">
              <div className="text-2xl font-semibold">
                {instructorPopularityDisplay === "graph" ? (
                  <span>Class Attendance by Instructor Over Time</span>
                ) : (
                  <span>Class Attendance by Instructor</span>
                )}
                {instructorPopularityDisplay === "graph" ? <br /> : <></>}{" "}
                2/19/25 - 3/19/25
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium"></label>
                <select
                  className="border rounded-md px-2 py-1 text-sm"
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                >
                  <option>ALL CLASSES</option>
                  <option>Postpartum Classes</option>
                  <option>Prenatal Classes</option>
                  <option>Infant Massage</option>
                  <option>Parent Groups</option>
                  <option>Childbirth Classes</option>
                </select>
              </div>
            </div>

            {instructorPopularityDisplay === "graph" ? (
              <div className="w-full h-96">
                <LineChart
                  height={300}
                  data={filteredInstructorData}
                  series={<LineSeries type="grouped" />}
                />
              </div>
            ) : (
              <DataTable
                columns={instructorColumns}
                data={instructorTableRows}
                tableType="default"
                tableHeaderExtras={instructorPopularityTableExtras}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
