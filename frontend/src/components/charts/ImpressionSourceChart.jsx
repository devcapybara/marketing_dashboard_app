import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ImpressionSourceChart = ({ data }) => {
  // Transform data untuk chart
  const chartData = [
    {
      name: 'Google Ads',
      value: data?.googleAds || 0,
    },
    {
      name: 'Meta Ads',
      value: data?.metaAds || 0,
    },
    {
      name: 'TikTok Ads',
      value: data?.tiktokAds || 0,
    },
  ];

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
          />
          <Legend />
          <Bar 
            dataKey="value" 
            fill="#3B82F6" 
            name="Google Ads"
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey="value" 
            fill="#EF4444" 
            name="Meta Ads"
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey="value" 
            fill="#F59E0B" 
            name="TikTok Ads"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-dark-text-muted">Google Ads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-dark-text-muted">Meta Ads</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span className="text-sm text-dark-text-muted">TikTok Ads</span>
        </div>
      </div>
    </div>
  );
};

export default ImpressionSourceChart;

