
import axios from 'axios';
import { getCatch } from '../utils/promise';

export function GetThemes() {
  return new Promise<string[]>((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/themes`)
      .then(response => resolve(response.data))
      .catch(getCatch(reject));
  })
}