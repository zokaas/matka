import React from "react";
import { format } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  getTargetLine: () => {
    date: string;
    distance: number | null;
    target: number;
    progressStatus?: 'behind' | 'on track' | 'ahead';
  }[];
}

const ProgressChart: React.FC<Props> = ({ getTargetLine }) => {
  // Extract target line data
  const targetLineData = getTargetLine();
  
  // Pyöristä weeklyPerUser näyttöä varten
  
  // Formatoi projectedEndDate

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        Etenemiskaavio
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={targetLineData}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "d.M.")}
          />
          <YAxis domain={[0, 100000]} />
          <Tooltip
            formatter={(value: number) =>
              value ? `${Math.round(value).toLocaleString("fi-FI")} km` : "-"
            }
            labelFormatter={(label) => format(new Date(label), "d.M.yyyy")}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="distance"
            name="Nykyinen"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="target"
            name="Tavoite"
            stroke="#ef4444"
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;