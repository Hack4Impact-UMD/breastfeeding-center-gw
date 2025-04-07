import {
  constructCategoryColors,
  AvailableChartColors,
  AvailableChartColorsKeys,
  getColorClassName,
} from "../lib/chartUtils";

interface LegendProps {
  data: { name: string; amount: number }[];
}

export const Legend = ({ data }: LegendProps) => {
  // Match the same color mapping logic as DonutChart
  const categories = data.map((item) => item.name);
  const categoryColors = constructCategoryColors(
    categories,
    AvailableChartColors
  );

  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg font-semibold">Legend</p>
      <div className="flex flex-col gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: categoryColors.get(item.name) }}
            />
            <span className="text-xs text-gray-700 dark:text-gray-300">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
