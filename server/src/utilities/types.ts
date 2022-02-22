
import express from 'express';

export type Controller = Endpoint[];

export type Endpoint = {
  route: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  callback: express.RequestHandler;

  middleware?: express.RequestHandler[];
}

export type KeyValues<T> = {
  [key: string]: T
}

export type Theme = {
  name: string;
  path: string;
  components: KeyValues<ThemeNode>;
  layout?: string;
  types?: ThemeType[];
}

export type ThemeType = {
  name: string;
  key: string;
  variables: KeyValues<ThemeVariable>;
}

export type ThemeVariable = {
  name: string;
  type: string;
}

export type ThemeNode = {
  name: string;
  liquid: string;
  // will be its own type eventually
  variables: ThemeVariable[];
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
  op: 'import' | 'compile';
  from?: string;
  file?: string;
  out?: string;
  pre?: string;
}