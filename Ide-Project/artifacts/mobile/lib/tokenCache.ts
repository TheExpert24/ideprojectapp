// Web token cache — uses localStorage
export const tokenCache = {
  async getToken(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // silently fail
    }
  },
};
