
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
  variables: string[];
}

export type ThemeVariableOptions = {
  optional?: boolean;
  multiple?: boolean;
  image?: boolean;
}

export type Component = {
  component: string;
  variables: string[];
  id: string;
};

export type AssetFile = {
  name: string;
  extension: string;
}
