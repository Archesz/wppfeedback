import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PolarAngleAxis, RadarChart, Radar, PolarGrid, PolarRadiusAxis } from "recharts";

export default function ScoreCard({ scores = {}, confidence }) {
  const keys = scores ? Object.keys(scores) : [];

  const barData = keys.map(k => ({ name: k.charAt(0).toUpperCase() + k.slice(1), score: scores[k] ?? 0 }));

  const radarData = keys.map(k => ({ subject: k.charAt(0).toUpperCase() + k.slice(1), A: scores[k] ?? 0, fullMark: 10 }));

  return (
    <div className="card score-card">
      <h3>Indicadores</h3>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <XAxis type="number" domain={[0, 10]} />
            <YAxis type="category" dataKey="name" width={120} />
            <Tooltip />
            <Bar dataKey="score" fill="#3b82f6" barSize={16} radius={[6, 6, 6, 6]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="radar-wrap">
        <ResponsiveContainer width="100%" height={240}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar name="Score" dataKey="A" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.3} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="confidence">
        <span>Confiança: </span>
        <strong className={`chip ${confidence || "unknown"}`}>{confidence || "unknown"}</strong>
      </div>
    </div>
  );
}
