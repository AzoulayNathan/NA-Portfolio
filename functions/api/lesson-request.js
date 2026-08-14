function requireFields(obj, fields) {
  return fields.filter((f) => {
    const parts = f.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null || cur[p] === undefined || cur[p] === '') return true;
      cur = cur[p];
    }
    return false;
  });
}

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function availabilityMode() {
  return 'generic';
}

async function handleLessonRequest(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { success: false, error: 'Invalid JSON body' });
  }

  const missing = requireFields(body, [
    'requestCategory',
    'contact.firstName',
    'contact.lastName',
    'contact.email',
  ]);
  if (missing.length) {
    return json(400, { success: false, error: 'Missing required fields', missing });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.contact.email))) {
    return json(400, { success: false, error: 'Invalid email' });
  }

  const id = body.id || `lr_${crypto.randomUUID().slice(0, 8)}`;
  const record = {
    ...body,
    id,
    createdAt: body.createdAt || new Date().toISOString(),
    status: 'submitted',
    consent: Boolean(body.consent),
  };

  console.log('[NA Classroom] lesson-request', {
    id,
    email: record.contact?.email,
    category: record.requestCategory,
    pillar: record.learningPath?.pillar,
  });

  return json(200, { success: true, requestId: id, availability: availabilityMode() });
}

export async function onRequestPost(context) {
  return handleLessonRequest(context.request);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
