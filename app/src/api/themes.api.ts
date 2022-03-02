
import axios from 'axios';
import { getCatch } from '../utils/promise';
import { KeyValues } from '../utils/types';

export type ThemeVariable = {
  name: string;
  type: string;
}

export type ThemeNode = {
  name: string;
  variables: ThemeVariable[];
}

export type ThemeType = {
  name: string;
  key: string;
  variables: KeyValues<ThemeVariable>;
}

export type Theme = {
  name: string;
  components: KeyValues<ThemeNode>;
  types?: ThemeType[];
}

export function GetThemes() {
  return new Promise<string[]>((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/themes`)
      .then(response => resolve(response.data))
      .catch(getCatch(reject));
  })
}

export function LoadTheme(theme: string) {
  return new Promise<Theme>((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/themes/${theme}`)
      .then(response => resolve(response.data))
      .catch(getCatch(reject));
  });
}