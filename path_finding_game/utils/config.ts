import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

export const API_BASE_URL: string = extra?.apiUrl ?? 'https://algograph.io';
