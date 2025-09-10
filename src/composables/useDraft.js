export function useDraft(keyOrGetter) {
  const keyOf = (typeof keyOrGetter === 'function') ? keyOrGetter : () => keyOrGetter;

  function load() {
    try {
      const raw = localStorage.getItem(keyOf());
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function save(obj) {
    localStorage.setItem(keyOf(), JSON.stringify(obj));
  }

  function clear() {
    localStorage.removeItem(keyOf());
  }

  return { load, save, clear };
}
