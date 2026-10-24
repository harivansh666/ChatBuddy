import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { mockMoodHistory } from "@/lib/mockData";
import { Card } from "@/components/ui/card";

const MoodChartCard = () => {
  const avg = (mockMoodHistory.reduce((s, m) => s + m.mood, 0) / mockMoodHistory.length).toFixed(1);

  return (
    <Card className="p-4 bg-card border-border rounded-2xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Mood This Week</h3>
        <span className="text-xs text-muted-foreground">avg: {avg}/5</span>
      </div>

      {/* Emoji row */}
      <div className="flex justify-between px-2">
        {mockMoodHistory.map((m) => (
          <div key={m.date} className="flex flex-col items-center gap-1">
            <span className="text-lg">{m.emoji}</span>
            <span className="text-[10px] text-muted-foreground">{m.date}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockMoodHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 18%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: "hsl(220 10% 55%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(225 18% 11%)",
                border: "1px solid hsl(225 15% 18%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="hsl(170 65% 45%)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(170 65% 45%)", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "hsl(170 65% 45%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MoodChartCard;
