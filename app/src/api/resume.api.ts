
import axios from 'axios';
import { getCatch } from '../utils/promise';
import { KeyValues, MongooseDocument } from '../utils/types';

export type ResumeComponent = {
  component: string;
  variables: KeyValues<string>;
}

export type Resume = {
  name: string;
  theme: string;
  components: ResumeComponent[];
};

export type ResumeDocument = Resume & MongooseDocument;

export function GetAllResumes() {
  return new Promise<ResumeDocument[]>((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/resume`)
      .then(res => {
        console.log(res);
        resolve(res.data);
      })
      .catch(getCatch(reject))
  });
};

export function GenerateResume(id: string, theme: string = 'default') {
  return new Promise<Buffer>((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/resume/${id}/${theme}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'application/pdf'
      }
    }).then(res => resolve(res.data))
      .catch(getCatch(reject));
  });
}

export function GetResume(id: string) {
  return new Promise<Resume>((resolve, reject) => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/resume/${id}`)
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