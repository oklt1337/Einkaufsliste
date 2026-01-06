import { describe, expect, it, vi } from 'vitest';

const setNavigatorLanguage = (value: string) => {
  Object.defineProperty(window.navigator, 'language', {
    value,
    configurable: true,
  });
};

describe('i18n', () => {
  it('uses German strings for de locales', async () => {
    vi.resetModules();
    setNavigatorLanguage('de-DE');

    const { strings } = await import('../i18n');

    expect(strings.addButton).toBe('Hinzufügen');
    expect(strings.empty).toContain('Füge');
  });

  it('uses ASCII fallback for non-de locales', async () => {
    vi.resetModules();
    setNavigatorLanguage('en-US');

    const { strings } = await import('../i18n');

    expect(strings.addButton).toBe('Add');
    expect(strings.empty).toContain('Add your first');
  });
});
