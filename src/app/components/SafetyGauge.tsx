import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SafetyGaugeProps {
  score: number;
}

export function SafetyGauge({ score }: SafetyGaugeProps) {
  const getColor = (score: number) => {
    if (score >= 75) return '#22c55e'; // green
    if (score >= 50) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const getMessage = (score: number) => {
    if (score >= 75) return 'Safe to Use';
    if (score >= 50) return 'Use with Caution';
    return 'Avoid this Product';
  };

  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  const COLORS = [getColor(score), '#e5e7eb'];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="text-4xl" style={{ color: getColor(score) }}>
            {score}
          </div>
          <div className="text-sm text-gray-500">/ 100</div>
        </div>
      </div>
      <div
        className="mt-4 px-6 py-3 rounded-xl text-white text-center"
        style={{ backgroundColor: getColor(score) }}
      >
        {getMessage(score)}
      </div>
    </div>
  );
}
