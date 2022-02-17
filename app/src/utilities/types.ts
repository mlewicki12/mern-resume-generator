
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
  // will be its own type eventually
  variables: ThemeVariable[];
}

export type ThemeVariable = {
  name: string;
  type: string;
}

export type Component = {
  name: string;
  key: string;
  variables: string[];
};

export type ResumeNode = {
  component: string;
  variables: KeyValues<string | string[]>;
  name: string;
  id: string;
}

export type AssetFile = {
  name: string;
  extension: string;
}
