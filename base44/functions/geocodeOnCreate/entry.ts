import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Geocode a single address using Nominatim
async function geocodeAddress(address) {
  if (!address) return null;

  // Normalize: strip suite/unit noise, lowercase state abbrev, etc.
  const simplify = (addr) => addr
    .replace(/\b(suite|ste|unit|apt|#|floor|fl|building|bldg|room|rm)\s*[\w\d-]*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const attempts = [address, simplify(address)];

  for (const attempt of attempts) {
    const encoded = encodeURIComponent(attempt);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=1&countrycodes=us`;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'StartupStateApp/1.0 (startupstate@utah.gov)' }
    });

    if (!res.ok) continue;

    const data = await res.json();
    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        city: data[0].address?.city || data[0].address?.town || data[0].address?.village || null,
        county: data[0].address?.county?.replace(' County', '') || null,
      };
    }

    // Respect Nominatim rate limit between attempts
    await new Promise(r => setTimeout(r, 1100));
  }

  return null;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { event, data } = body;

    // Only act on create events for Startup entity
    if (event?.type !== 'create' || event?.entity_name !== 'Startup') {
      return Response.json({ skipped: true, reason: 'Not a Startup create event' });
    }

    const startup = data;

    // Skip if already geocoded
    if (startup.latitude && startup.longitude) {
      return Response.json({ skipped: true, reason: 'Already has coordinates' });
    }

    if (!startup.address && !startup.city) {
      return Response.json({ skipped: true, reason: 'No address to geocode' });
    }

    const queryAddress = startup.address
      ? `${startup.address}, Utah`
      : `${startup.city}, Utah`;

    const result = await geocodeAddress(queryAddress);

    if (!result) {
      console.log(`[geocodeOnCreate] Could not geocode: ${queryAddress}`);
      return Response.json({ skipped: true, reason: 'Geocoding failed', address: queryAddress });
    }

    const update = { latitude: result.latitude, longitude: result.longitude };
    if (!startup.city && result.city) update.city = result.city;
    if (!startup.county && result.county) update.county = result.county;

    await base44.asServiceRole.entities.Startup.update(startup.id, update);

    console.log(`[geocodeOnCreate] Geocoded ${startup.company_name}: ${result.latitude}, ${result.longitude}`);
    return Response.json({ success: true, company: startup.company_name, ...result });

  } catch (error) {
    console.error('[geocodeOnCreate] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});