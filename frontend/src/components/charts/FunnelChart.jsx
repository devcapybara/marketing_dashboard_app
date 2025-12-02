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
      <h3 className="text-lg font-semibold mb-4">Simulasi Grafik Funnel</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-dark-border"></div>
        
        {/* Stages */}
        <div className="space-y-6 pl-12">
          {stages.map((stage, index) => {
            const width = maxValue > 0 ? (stage.value / maxValue) * maxWidth : 0;
            const isActive = stage.value > 0;
            
            return (
              <div key={index} className="relative flex items-center">
                {/* Stage label */}
                <div className="absolute -left-12 text-sm text-dark-text-muted min-w-[120px]">
                  {stage.name}
                </div>
                
                {/* Circle on line */}
                <div className={`absolute -left-10 w-4 h-4 rounded-full border-2 ${
                  isActive 
                    ? 'bg-primary border-primary' 
                    : 'bg-dark-surface border-dark-border'
                } flex items-center justify-center`}>
                  {isActive && (
                    <span className="text-xs text-white font-bold">{stage.value}</span>
                  )}
                </div>
                
                {/* Bar */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className={`h-8 rounded transition-all ${
                        isActive 
                          ? 'bg-primary' 
                          : 'bg-dark-surface border border-dark-border'
                      }`}
                      style={{ width: `${width}%` }}
                    >
                      {isActive && (
                        <div className="h-full flex items-center justify-end pr-2">
                          <span className="text-xs text-white font-medium">
                            {new Intl.NumberFormat('id-ID').format(stage.value)}
                          </span>
                        </div>
                      )}
                    </div>
                    {!isActive && (
                      <span className="text-xs text-dark-text-muted">0</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Horizontal axis */}
        <div className="mt-8 pt-4 border-t border-dark-border">
          <div className="flex justify-between text-xs text-dark-text-muted px-12">
            <span>-1.0</span>
            <span>0.0</span>
            <span>1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;

