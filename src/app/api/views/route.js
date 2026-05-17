import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  if (!slug) return NextResponse.json({ views: 0 });

  const client = getClient();
  if (!client) return NextResponse.json({ views: 0 });

  try {
    const { data, error } = await client
      .from('post_views')
      .select('views')
      .eq('slug', slug)
      .single();
    if (error || !data) return NextResponse.json({ views: 0 });
    return NextResponse.json({ views: data.views ?? 0 });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}

export async function POST(request) {
  const { slug } = await request.json().catch(() => ({}));
  if (!slug) return NextResponse.json({ views: 0 });

  const client = getClient();
  if (!client) return NextResponse.json({ views: 0 });

  try {
    const { data, error } = await client.rpc('increment_post_view', { post_slug: slug });
    if (!error) {
      return NextResponse.json({ views: typeof data === 'number' ? data : 0 });
    }

    const { data: upserted, error: upsertError } = await client
      .from('post_views')
      .upsert(
        { slug, views: 1, updated_at: new Date().toISOString() },
        { onConflict: 'slug', ignoreDuplicates: false },
      )
      .select('views')
      .single();

    if (upsertError || !upserted) return NextResponse.json({ views: 0 });
    return NextResponse.json({ views: upserted.views ?? 0 });
  } catch {
    return NextResponse.json({ views: 0 });
  }
}
