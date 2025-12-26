const PageRenderer = ({ page }) => {
  if (!page || !Array.isArray(page.sections)) return null;
  return (
    <div>
      {page.sections.map((section, sIdx) => (
        <div key={sIdx} className="mb-8">
          <div>
            {Array.isArray(section.widgets) && section.widgets.map((w, wIdx) => {
              if (w.type === 'heading') {
                const size = w.props.size || 'text-3xl';
                const align = w.props.align || 'text-center';
                const color = w.props.color || 'text-dark-text';
                return (
                  <h2 key={wIdx} className={`${size} ${align} ${color} font-bold mb-4`}>{w.props.text || ''}</h2>
                );
              }
              if (w.type === 'text') {
                const align = w.props.align || 'text-center';
                const color = w.props.color || 'text-dark-text-muted';
                return (
                  <p key={wIdx} className={`${align} ${color} max-w-2xl mx-auto mb-4`}>{w.props.text || ''}</p>
                );
              }
              if (w.type === 'button') {
                const variant = w.props.variant === 'secondary' ? 'btn-secondary' : 'btn-primary';
                const href = w.props.href || '#';
                return (
                  <div key={wIdx} className="text-center mb-4">
                    <a href={href} className={`${variant}`}>{w.props.label || 'Button'}</a>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PageRenderer;
