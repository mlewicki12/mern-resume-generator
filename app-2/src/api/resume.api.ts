
import axios from 'axios';
import { getCatch } from '../utils/promise';

export function GetAllResumes() {
  return new Promise<any[]>((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/resume`)
      .then(res => {
        console.log(res);
        resolve(res.data);
      })
      .catch(getCatch(reject))
  });
};

export function GenerateResume(id: string, theme: string = 'default') {
  return new Promise<string>((resolve, reject) => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/resume/${id}/${theme}`)
      .then(res => resolve(res.data))
      .catch(getCatch(reject));
  });
}

export function DeleteResume(id: string) {
  return new Promise<void>((resolve, reject) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/api/resume/${id}`)
      .then(res => resolve(res.data))
      .catch(getCatch(reject));
  });
}

export default {
  GetAllResumes,
  GenerateResume
};