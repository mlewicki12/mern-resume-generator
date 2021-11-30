
import express from 'express';

export type Controller = Endpoint[];

export type Endpoint = {
  route: string;
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  callback: express.RequestHandler<{}, any, any, /* QueryString.ParsedQs */ any, Record<string, any>> |
            express.RequestHandler<{}, any, any, /* QueryString.ParsedQs */ any, Record<string, any>>[];
}