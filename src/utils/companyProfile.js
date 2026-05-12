import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@alhazen_company_profile';

export const loadCompanyProfile = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveCompanyProfile = async ({ name, logoUri, logoBase64 }) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify({ name, logoUri, logoBase64 }));
  } catch {}
};
