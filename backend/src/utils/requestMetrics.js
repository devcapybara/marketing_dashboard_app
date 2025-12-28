const MAX_SAMPLES = 200;

const routeMetrics = new Map();

function record(routeKey, statusCode, durationMs) {
  let m = routeMetrics.get(routeKey);
  if (!m) {
    m = { count: 0, error: 0, durations: [], sum: 0, max: 0 };
    routeMetrics.set(routeKey, m);
  }
  m.count += 1;
  if (statusCode >= 400) m.error += 1;
  m.sum += durationMs;
  if (durationMs > m.max) m.max = durationMs;
  m.durations.push(durationMs);
  if (m.durations.length > MAX_SAMPLES) m.durations.shift();
}

function percentile(durations, p = 0.95) {
  if (!durations || durations.length === 0) return 0;
  const arr = durations.slice().sort((a, b) => a - b);
  const idx = Math.min(arr.length - 1, Math.floor(p * arr.length) - 1);
  return arr[Math.max(0, idx)];
}

function summary() {
  const routes = [];
  for (const [key, m] of routeMetrics.entries()) {
    const avg = m.count > 0 ? m.sum / m.count : 0;
    routes.push({
      route: key,
      count: m.count,
      errorRate: m.count > 0 ? parseFloat(((m.error / m.count) * 100).toFixed(2)) : 0,
      avgMs: parseFloat(avg.toFixed(2)),
      p95Ms: parseFloat(percentile(m.durations, 0.95).toFixed(2)),
      maxMs: parseFloat(m.max.toFixed(2)),
    });
  }
  routes.sort((a, b) => b.count - a.count);
  const totalCount = routes.reduce((s, r) => s + r.count, 0);
  const totalError = routes.reduce((s, r) => s + Math.round((r.errorRate / 100) * r.count), 0);
  return {
    totalCount,
    totalError,
    routes,
  };
}

module.exports = { record, summary };
