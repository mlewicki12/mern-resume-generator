
export type RejectFunction = (reason?: any) => void;

export function getCatch(reject?: RejectFunction) {
  return (err: any) => {
    console.error(err);
    reject && reject(err);
  }
}

export default {
  getCatch,
}