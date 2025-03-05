//import { Entries } from 'type-fest'

import type { read as Read, Reader, Config } from '@types/jsmediatags'

declare global {
  interface Window {
    secret?: string;
    key?: string;
    user?: string;
    google?: any;
    settings: {

    };
    jsmediatags: {
      read: Read;
      Reader: Reader;
      Config: Config;
    };
    PWAInstallEvent: any;
    yaContextCb: any;
    Ya: any;
    dataLayer: any[];
    user_ip: string;
  }
  interface ObjectConstructor {
    entries<T extends {}>(o: T): ReadonlyArray<Entry<T>>
  }
}

type Entry<T> = { [K in keyof T]: [K, T[K]] }[keyof T]

export type User = {
  [key in 'name'
  | 'email'
  | 'password'
  | 'created'
  | 'id'
  | 'photo'
  ]: string;
} & {
  rememberme: boolean;
} & {
  [
  key in 'verification_code'// 8-digit verification code
  ]?: string | null;
}

export type FrontUser = (Pick<User, 'name' | 'email' | 'created' | 'photo'>) & { id: string | null } & { favorite_stations: string[] }

export type VerificationUser = (Pick<User, 'verification_code' | 'name' | 'email' | 'created'>) & { id: string | null }

export type { Station } from './station'
export type { StationTag } from './StationTag'
export type { StationLanguage } from './StationLanguage'
export type { StationGenre } from './StationGenre'
export type { StationCountry } from './StationCountry'
export type { Language } from './Language'
export type { HistoryRecord } from './HistoryRecord'