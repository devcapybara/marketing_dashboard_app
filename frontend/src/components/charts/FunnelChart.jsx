const FunnelChart = ({ data }) => {
  const stages = [
    { name: 'Total Leads', value: data?.totalLeads || 0 },
    { name: 'Tidak Ada Balasan', value: data?.noReply || 0 },
    { name: 'Cuma tanya-tanya', value: data?.justAsking || 0 },
    { name: 'Potensial', value: data?.potential || 0 },
    { name: 'Closing', value: data?.closing || 0 },
    { name: 'Retensi', value: data?.retention || 0 },
  ];

  const maxValue = Math.max(...stages.map(s => s.value), 1);
  const maxWidth = 100; // percentage

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-4 text-center">Grafik Funnel</h3>
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const width = maxValue > 0 ? (stage.value / maxValue) * maxWidth : 0;
          const isActive = stage.value > 0;
          return (
            <div key={index}>
              <div className="text-sm text-dark-text-muted text-center mb-2">{stage.name}</div>
              <div className="w-full flex justify-center">
                <div
                  className={`h-8 rounded transition-all ${
                    isActive ? 'bg-primary' : 'bg-dark-surface border border-dark-border'
                  }`}
                  style={{ width: `${width}%` }}
                >
                  {isActive && (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {new Intl.NumberFormat('id-ID').format(stage.value)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {!isActive && (
                <div className="text-center text-xs text-dark-text-muted mt-1">0</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FunnelChart;

