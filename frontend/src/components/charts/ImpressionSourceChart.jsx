import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ImpressionSourceChart = ({ data }) => {
  const platformLabel = (p) => {
    if (p === 'GOOGLE') return 'Google Ads';
    if (p === 'META') return 'Meta Ads';
    if (p === 'TIKTOK') return 'TikTok Ads';
    if (p === 'X') return 'X Ads';
    if (p === 'LINKEDIN') return 'LinkedIn Ads';
    if (p === 'OTHER') return 'Other';
    return p || 'Unknown';
  };
  const platformColor = (p) => {
    if (p === 'GOOGLE') return '#3B82F6';
    if (p === 'META') return '#EF4444';
    if (p === 'TIKTOK') return '#F59E0B';
    if (p === 'X') return '#8B5CF6';
    if (p === 'LINKEDIN') return '#0EA5E9';
    if (p === 'OTHER') return '#10B981';
    return '#6B7280';
  };

  let chartData = [];
  if (Array.isArray(data)) {
    chartData = data.map((pm) => ({
      name: platformLabel(pm._id),
      value: pm.impressions || 0,
      color: platformColor(pm._id),
    }));
  } else {
    chartData = [
      { name: 'Google Ads', value: data?.googleAds || 0, color: '#3B82F6' },
      { name: 'Meta Ads', value: data?.metaAds || 0, color: '#EF4444' },
      { name: 'TikTok Ads', value: data?.tiktokAds || 0, color: '#F59E0B' },
    ];
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4">Sumber Impression</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            label={{ value: 'Jumlah Impression', position: 'insideBottom', offset: -5 }}
            stroke="#9CA3AF"
          />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={100}
            stroke="#9CA3AF"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
            formatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
            labelFormatter={(label) => label}
          />
          <Bar 
            dataKey="value" 
            radius={[0, 4, 4, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {chartData.map((c) => (
          <div key={c.name} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: c.color }}></div>
            <span className="text-sm text-dark-text-muted">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpressionSourceChart;
