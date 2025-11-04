'use client';
import React, { useState } from 'react';

function getStoredWebhook() {
  if (typeof window === 'undefined') return '';
  try { return localStorage.getItem('webhookUrl') || ''; } catch { return ''; }
}

export default function Page() {
  const [webhookUrl, setWebhookUrl] = useState<string>(getStoredWebhook());
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [busy, setBusy] = useState(false);

  const platformList = ['youtube', 'x', 'linkedin', 'instagram', 'tiktok', 'facebook'];

  function togglePlatform(p: string) {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('');
    const form = e.currentTarget as HTMLFormElement & { elements: any };
    const fileInput = form.elements.namedItem('video') as HTMLInputElement;
    if (!webhookUrl) { setStatus('Please set webhook URL.'); return; }
    if (!fileInput?.files || fileInput.files.length === 0) { setStatus('Choose a video file.'); return; }
    const data = new FormData(form);
    data.set('platforms', platforms.join(','));
    setBusy(true);
    try {
      localStorage.setItem('webhookUrl', webhookUrl);
      const res = await fetch(webhookUrl, { method: 'POST', body: data });
      const text = await res.text();
      setStatus(`${res.status} ${res.statusText} - ${text}`.slice(0, 2000));
    } catch (err: any) {
      setStatus(err?.message || 'Request failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <h1>Multi-Platform Video Uploader (n8n)</h1>
      <p>Provide your local n8n webhook URL and upload one video to multiple platforms in one go.</p>

      <label style={{ display: 'block', marginTop: 16, fontWeight: 600 }}>Webhook URL</label>
      <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="http://localhost:5678/webhook/agentic-multi-upload" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <label style={{ display: 'block', fontWeight: 600 }}>Video file</label>
        <input name="video" type="file" accept="video/*" />

        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
          {platformList.map(p => (
            <label key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, border: '1px solid #ddd', borderRadius: 8 }}>
              <input type="checkbox" checked={platforms.includes(p)} onChange={() => togglePlatform(p)} />
              <span style={{ textTransform: 'capitalize' }}>{p}</span>
            </label>
          ))}
        </div>

        <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>Title</label>
        <input name="title" placeholder="Title" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />

        <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>Description</label>
        <textarea name="description" rows={5} placeholder="Description" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />

        <label style={{ display: 'block', marginTop: 12, fontWeight: 600 }}>Tags (comma-separated)</label>
        <input name="tags" placeholder="tag1,tag2" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }} />

        <button type="submit" disabled={busy} style={{ marginTop: 16, padding: '10px 16px', borderRadius: 8, background: '#111827', color: 'white', border: 0 }}>
          {busy ? 'Sending...' : 'Send to n8n'}
        </button>
      </form>

      {status && (
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f4f6', padding: 12, borderRadius: 8, marginTop: 16 }}>{status}</pre>
      )}
    </main>
  );
}
