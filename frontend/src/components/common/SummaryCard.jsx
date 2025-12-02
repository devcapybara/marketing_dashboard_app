const SummaryCard = ({ title, value, subtitle, icon, trend }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-dark-text">{value}</p>
          {subtitle && (
            <p className="text-xs text-dark-text-muted mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs mt-1 ${trend.type === 'up' ? 'text-green-400' : trend.type === 'down' ? 'text-red-400' : 'text-dark-text-muted'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-4xl opacity-50">{icon}</div>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;

