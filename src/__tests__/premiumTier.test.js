import {
  getTierFromRC,
  getTierFromSupabase,
  higherTier,
  TIER_PRIORITY,
} from '../utils/tierUtils';

// ─── higherTier ───────────────────────────────────────────────────────────────
describe('higherTier', () => {
  test('takim > solo', () => expect(higherTier('takim', 'solo')).toBe('takim'));
  test('solo > bireysel', () => expect(higherTier('solo', 'bireysel')).toBe('solo'));
  test('bireysel > free', () => expect(higherTier('bireysel', 'free')).toBe('bireysel'));
  test('takim > free', () => expect(higherTier('takim', 'free')).toBe('takim'));
  test('eşit tier: a döner', () => expect(higherTier('solo', 'solo')).toBe('solo'));
  test('free vs free', () => expect(higherTier('free', 'free')).toBe('free'));
});

// ─── TIER_PRIORITY ────────────────────────────────────────────────────────────
describe('TIER_PRIORITY sıralaması', () => {
  test('takim en yüksek', () => {
    expect(TIER_PRIORITY.takim).toBeGreaterThan(TIER_PRIORITY.solo);
    expect(TIER_PRIORITY.solo).toBeGreaterThan(TIER_PRIORITY.bireysel);
    expect(TIER_PRIORITY.bireysel).toBeGreaterThan(TIER_PRIORITY.free);
  });
});

// ─── getTierFromRC ────────────────────────────────────────────────────────────
describe('getTierFromRC', () => {
  test('null/undefined → free', () => {
    expect(getTierFromRC(null)).toBe('free');
    expect(getTierFromRC(undefined)).toBe('free');
    expect(getTierFromRC({})).toBe('free');
  });

  test('boş abonelik listesi → free', () => {
    expect(getTierFromRC({ activeSubscriptions: [] })).toBe('free');
  });

  // Temel Play Store ID formatları
  test('takim_aylik → takim', () => {
    expect(getTierFromRC({ activeSubscriptions: ['takim_aylik'] })).toBe('takim');
  });

  test('solo_aylik → solo', () => {
    expect(getTierFromRC({ activeSubscriptions: ['solo_aylik'] })).toBe('solo');
  });

  // Yeni PSPB formatı: com.paket:base-plan-id
  test('PSPB formatı takim — takim_aylik:base-plan-id → takim', () => {
    expect(getTierFromRC({ activeSubscriptions: ['takim_aylik:base-plan-id'] })).toBe('takim');
  });

  test('PSPB formatı solo — solo_yillik:base-plan-id → solo', () => {
    expect(getTierFromRC({ activeSubscriptions: ['solo_yillik:base-plan-id'] })).toBe('solo');
  });

  // Türkçe karakter varyantı
  test('takım (Türkçe ı) → takim', () => {
    expect(getTierFromRC({ activeSubscriptions: ['takım_aylik'] })).toBe('takim');
  });

  // Büyük harf normalizasyonu
  test('büyük harf ID → normalleştirilmeli (küçük harf lower ile)', () => {
    expect(getTierFromRC({ activeSubscriptions: ['TAKIM_AYLIK'] })).toBe('takim');
  });

  // Entitlement fallback: activeSubscriptions boş ama entitlement aktif
  test('entitlement fallback — solo productIdentifier', () => {
    const info = {
      activeSubscriptions: [],
      entitlements: {
        active: {
          'AlhazenPDF Premium': { productIdentifier: 'solo_aylik' },
        },
      },
    };
    expect(getTierFromRC(info)).toBe('solo');
  });

  test('entitlement fallback — takim productIdentifier', () => {
    const info = {
      activeSubscriptions: [],
      entitlements: {
        active: {
          'AlhazenPDF Premium': { productIdentifier: 'takim_yillik' },
        },
      },
    };
    expect(getTierFromRC(info)).toBe('takim');
  });

  test('entitlement fallback — bilinmeyen productIdentifier → bireysel', () => {
    const info = {
      activeSubscriptions: [],
      entitlements: {
        active: {
          'AlhazenPDF Premium': { productIdentifier: 'bireysel_aylik' },
        },
      },
    };
    expect(getTierFromRC(info)).toBe('bireysel');
  });

  test('activeSubscriptions array değilse → entitlement fallback', () => {
    const info = {
      activeSubscriptions: null,
      entitlements: {
        active: {
          'AlhazenPDF Premium': { productIdentifier: 'solo_yillik' },
        },
      },
    };
    expect(getTierFromRC(info)).toBe('solo');
  });
});

// ─── getTierFromSupabase ──────────────────────────────────────────────────────
describe('getTierFromSupabase', () => {
  test('null company → free', () => expect(getTierFromSupabase(null)).toBe('free'));
  test('undefined → free', () => expect(getTierFromSupabase(undefined)).toBe('free'));

  test('plan takim → takim', () => expect(getTierFromSupabase({ plan: 'takim' })).toBe('takim'));
  test('plan solo → solo', () => expect(getTierFromSupabase({ plan: 'solo' })).toBe('solo'));
  test('plan bireysel → bireysel', () => expect(getTierFromSupabase({ plan: 'bireysel' })).toBe('bireysel'));
  test('plan free → free', () => expect(getTierFromSupabase({ plan: 'free' })).toBe('free'));

  test('geçerli trial_ends_at → solo (geriye dönük uyumluluk)', () => {
    const future = new Date(Date.now() + 5 * 86400000).toISOString();
    expect(getTierFromSupabase({ plan: 'free', trial_ends_at: future })).toBe('solo');
  });

  test('süresi geçmiş trial_ends_at → free', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(getTierFromSupabase({ plan: 'free', trial_ends_at: past })).toBe('free');
  });

  test('trial_ends_at yok + plan free → free', () => {
    expect(getTierFromSupabase({ plan: 'free' })).toBe('free');
  });
});
