// Tier önceliği: takim > solo > bireysel > free
export const TIER_PRIORITY = { takim: 3, solo: 2, bireysel: 1, free: 0 };
export const higherTier = (a, b) => TIER_PRIORITY[a] >= TIER_PRIORITY[b] ? a : b;

const ENTITLEMENT_ID = 'AlhazenPDF Premium';

export function getTierFromRC(customerInfo) {
  const subs = Array.isArray(customerInfo?.activeSubscriptions)
    ? customerInfo.activeSubscriptions
    : [];

  const hasSub = (...kws) => subs.some(id => {
    const lower = id.toLowerCase();
    return kws.some(kw => lower.includes(kw));
  });

  if (hasSub('takim', 'takım')) return 'takim';
  if (hasSub('solo'))            return 'solo';

  const ent = customerInfo?.entitlements?.active?.[ENTITLEMENT_ID];
  if (ent) {
    const pid = (ent.productIdentifier || '').toLowerCase();
    if (pid.includes('takim') || pid.includes('takım')) return 'takim';
    if (pid.includes('solo'))  return 'solo';
    return 'bireysel';
  }

  return 'free';
}

export function getTierFromSupabase(company) {
  if (!company) return 'free';
  if (company.plan === 'takim')    return 'takim';
  if (company.plan === 'solo')     return 'solo';
  if (company.plan === 'bireysel') return 'bireysel';
  if (company.plan === 'free' && company.trial_ends_at && new Date(company.trial_ends_at) > new Date()) {
    return 'solo';
  }
  return 'free';
}
