
import express from 'express';

export type Controller = Endpoint[];

export type Endpoint = {
  route: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  callback: express.RequestHandler<any, any, any, /* QueryString.ParsedQs */ any, Record<string, any>> |
            express.RequestHandler<any, any, any, /* QueryString.ParsedQs */ any, Record<string, any>>[];

  upload?: any; // used for multer, only needed for post request, doesn't have a specific type
}

export type KeyValues<T> = {
  [key: string]: T
}

export type Theme = {
  name: string;
  path: string;
  components: KeyValues<ThemeNode>;
}

export type ThemeNode = {
  name: string;
  liquid: string;
  // will be its own type eventually
  variables: string[];
}

export type ThemeVariableOptions = {
  optional?: boolean;
  multiple?: boolean;
  image?: boolean;
}

export type ResumeRequest = {
  theme: string;
  components: Component[];
}

export type Component = {
  component: string;
  variables: KeyValues<string>
};

export type LiquidFile = {
  name: string;
  liquid: string;
}

export type AssetFile = {
  name: string;
  extension: string;
}

export type GenerateOperation = {
  op: 'import';
  file?: string;
  pre?: string;
}