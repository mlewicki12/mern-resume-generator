
// allow us to use custom properties on requests
declare namespace Express {
  export interface Request {
    name?: string;
    extension?: string;

    folder?: string;
  }
}