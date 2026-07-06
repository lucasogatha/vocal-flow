type ProgressChartDay = {
  label: string;
  count: number;
};

type ProgressChartProps = {
  data: ProgressChartDay[];
};

const BAR_WIDTH = 32;
const GAP = 20;
const CHART_HEIGHT = 120;
const LABEL_HEIGHT = 24;

export function ProgressChart({ data }: ProgressChartProps) {
  const max = Math.max(1, ...data.map((day) => day.count));
  const width = data.length * (BAR_WIDTH + GAP) - GAP;

  return (
    <svg
      viewBox={`0 0 ${width} ${CHART_HEIGHT + LABEL_HEIGHT}`}
      className="h-40 w-full"
      role="img"
      aria-label="Homeworks concluídos nos últimos 7 dias"
    >
      {data.map((day, index) => {
        const rawHeight = (day.count / max) * CHART_HEIGHT;
        const barHeight = day.count > 0 ? Math.max(rawHeight, 6) : 0;
        const x = index * (BAR_WIDTH + GAP);
        const y = CHART_HEIGHT - barHeight;

        return (
          <g key={index}>
            <rect
              x={x}
              y={0}
              width={BAR_WIDTH}
              height={CHART_HEIGHT}
              rx={6}
              className="fill-gray-100"
            />
            {day.count > 0 && (
              <rect
                x={x}
                y={y}
                width={BAR_WIDTH}
                height={barHeight}
                rx={6}
                className="fill-accent"
              />
            )}
            {day.count > 0 && (
              <text
                x={x + BAR_WIDTH / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-gray-500 text-[10px] font-medium"
              >
                {day.count}
              </text>
            )}
            <text
              x={x + BAR_WIDTH / 2}
              y={CHART_HEIGHT + 16}
              textAnchor="middle"
              className="fill-gray-400 text-[10px]"
            >
              {day.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
