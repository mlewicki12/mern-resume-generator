
export type MongooseDocument = {
  _id: string;

  createdAt: Date;
  updatedAt: Date;
}

export type KeyValues<T> = {
  [key: string]: T;
}