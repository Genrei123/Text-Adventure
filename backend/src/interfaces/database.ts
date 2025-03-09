// src/interfaces/database.ts
export interface QueryResult {
  rows: Array<{ [key: string]: any }>;
  rowCount: number;
}