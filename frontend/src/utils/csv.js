export function toCsv(headers, rows) {
  const h = headers.join(',');
  const r = rows.map((row)=> headers.map((k)=> sanitizeCsv(val(row, k))).join(',')).join('\n');
  return `${h}\n${r}`;
}

function val(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur==null) return '';
    cur = cur[p];
  }
  return cur == null ? '' : cur;
}

function sanitizeCsv(v) {
  const s = String(v ?? '');
  if (s.includes(',') || s.includes('\n') || s.includes('"')) {
    return '"' + s.replace(/"/g,'""') + '"';
  }
  return s;
}

export function downloadCsv(filename, csvText) {
  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function parseCsvFile(file) {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l)=>l.trim().length>0);
  if (lines.length === 0) return [];
  const headers = splitLine(lines[0]);
  const rows = [];
  for (let i=1;i<lines.length;i++) {
    const cols = splitLine(lines[i]);
    const row = {};
    for (let j=0;j<headers.length;j++) row[headers[j]] = cols[j] ?? '';
    rows.push(row);
  }
  return rows;
}

function splitLine(line) {
  const res = [];
  let cur = '';
  let inQ = false;
  for (let i=0;i<line.length;i++) {
    const ch = line[i];
    if (inQ) {
      if (ch==='"' && line[i+1]==='"') { cur+='"'; i++; }
      else if (ch==='"') { inQ=false; }
      else { cur+=ch; }
    } else {
      if (ch===',') { res.push(cur); cur=''; }
      else if (ch==='"') { inQ=true; }
      else { cur+=ch; }
    }
  }
  res.push(cur);
  return res.map((s)=>s.trim());
}
