export async function getViews(slug) {
  try {
    const res = await fetch(`/api/views?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return 0;
    const { views } = await res.json();
    return views ?? 0;
  } catch {
    return 0;
  }
}

export async function incrementView(slug) {
  try {
    const res = await fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });
    if (!res.ok) return 0;
    const { views } = await res.json();
    return views ?? 0;
  } catch {
    return 0;
  }
}
