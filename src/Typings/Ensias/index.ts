import { Snowflake } from 'discord.js';

export interface ObjType<T> {
	name: T;
	id: Snowflake;
}

export type FiliereNameType = '2IA' | '2SCL' | 'BI&A' | 'GD' | 'GL' | 'IDF' | 'IDSIT' | 'SSE' | 'SSI' | undefined;
type GroupeNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type GroupeNameType = `G${GroupeNumbers}` | undefined;
export type YearNameType = '1A' | '2A' | '3A' | undefined;

export type FiliereType = ObjType<FiliereNameType> | undefined;
export type GroupeType = ObjType<GroupeNameType> | undefined;
export type YearType = ObjType<YearNameType> | undefined;
