import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { pageService } from '../../services/pageService';

const defaultPage = {
  title: '',
  slug: '',
  sections: [],
  isPublished: false,
};

const PageBuilder = () => {
  const [page, setPage] = useState(defaultPage);
  const [saving, setSaving] = useState(false);
  const [savedPage, setSavedPage] = useState(null);

  const updateField = (field, value) => {
    setPage((p) => ({ ...p, [field]: value }));
  };

  const addSection = () => {
    setPage((p) => ({ ...p, sections: [...p.sections, { widgets: [], style: {} }] }));
  };

  const addWidget = (sectionIndex, type) => {
    const widgetDefaults = {
      heading: { text: 'Judul', size: 'text-3xl', align: 'text-center', color: 'text-dark-text' },
      text: { text: 'Teks konten', align: 'text-center', color: 'text-dark-text-muted' },
      button: { label: 'Aksi', href: '#', variant: 'primary' },
    };
    setPage((p) => {
      const sections = [...p.sections];
      const widgets = [...sections[sectionIndex].widgets, { type, props: widgetDefaults[type] }];
      sections[sectionIndex] = { ...sections[sectionIndex], widgets };
      return { ...p, sections };
    });
  };

  const updateWidgetProps = (sectionIndex, widgetIndex, key, value) => {
    setPage((p) => {
      const sections = [...p.sections];
      const w = { ...sections[sectionIndex].widgets[widgetIndex] };
      const props = { ...w.props, [key]: value };
      sections[sectionIndex].widgets[widgetIndex] = { ...w, props };
      return { ...p, sections };
    });
  };

  const save = async () => {
    setSaving(true);
    const payload = { title: page.title, slug: page.slug, sections: page.sections, isPublished: page.isPublished };
    const res = await pageService.create(payload);
    setSavedPage(res?.data || null);
    setSaving(false);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Page Builder</h1>
          <p className="text-dark-text-muted">Buat halaman baru atau edit konten landing secara section & widget.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card md:col-span-2">
            <div className="mb-4 grid md:grid-cols-2 gap-4">
              <input className="input" placeholder="Judul halaman" value={page.title} onChange={(e) => updateField('title', e.target.value)} />
              <input className="input" placeholder="Slug (mis: home, promo)" value={page.slug} onChange={(e) => updateField('slug', e.target.value)} />
            </div>

            <button className="btn-secondary mb-4" onClick={addSection}>+ Tambah Section</button>

            <div className="space-y-6">
              {page.sections.map((section, sIdx) => (
                <div key={sIdx} className="border border-dark-border rounded-lg p-4">
                  <div className="flex gap-2 mb-3">
                    <button className="btn-secondary" onClick={() => addWidget(sIdx, 'heading')}>Heading</button>
                    <button className="btn-secondary" onClick={() => addWidget(sIdx, 'text')}>Text</button>
                    <button className="btn-secondary" onClick={() => addWidget(sIdx, 'button')}>Button</button>
                  </div>

                  <div className="space-y-4">
                    {section.widgets.map((w, wIdx) => (
                      <div key={wIdx} className="grid md:grid-cols-3 gap-4">
                        {w.type === 'heading' && (
                          <>
                            <input className="input" value={w.props.text} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'text', e.target.value)} />
                            <select className="input" value={w.props.size} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'size', e.target.value)}>
                              <option value="text-2xl">Kecil</option>
                              <option value="text-3xl">Sedang</option>
                              <option value="text-5xl">Besar</option>
                            </select>
                            <select className="input" value={w.props.align} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'align', e.target.value)}>
                              <option value="text-left">Kiri</option>
                              <option value="text-center">Tengah</option>
                              <option value="text-right">Kanan</option>
                            </select>
                          </>
                        )}
                        {w.type === 'text' && (
                          <>
                            <textarea className="input md:col-span-2" rows={3} value={w.props.text} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'text', e.target.value)} />
                            <select className="input" value={w.props.align} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'align', e.target.value)}>
                              <option value="text-left">Kiri</option>
                              <option value="text-center">Tengah</option>
                              <option value="text-right">Kanan</option>
                            </select>
                          </>
                        )}
                        {w.type === 'button' && (
                          <>
                            <input className="input" placeholder="Label" value={w.props.label} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'label', e.target.value)} />
                            <input className="input" placeholder="Link" value={w.props.href} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'href', e.target.value)} />
                            <select className="input" value={w.props.variant} onChange={(e) => updateWidgetProps(sIdx, wIdx, 'variant', e.target.value)}>
                              <option value="primary">Primary</option>
                              <option value="secondary">Secondary</option>
                            </select>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-dark-text-muted">Publikasikan</span>
              <input type="checkbox" checked={page.isPublished} onChange={(e) => updateField('isPublished', e.target.checked)} />
            </div>
            <button className="btn-primary w-full" disabled={saving} onClick={save}>{saving ? 'Menyimpan...' : 'Simpan Halaman'}</button>
            {savedPage && (
              <div className="mt-4 text-sm">
                <div>Disimpan: {savedPage.title}</div>
                <div>URL publik: /p/{savedPage.slug}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PageBuilder;
