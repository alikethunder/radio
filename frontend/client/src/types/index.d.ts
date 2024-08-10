//import { Entries } from 'type-fest'

declare global {
  interface Window {
    secret?: string;
    key?: string;
    user?: string;
    google?: any;
    settings: {
      
    };
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
  ]: string;
} & {
  rememberme: boolean;
} & {
  id: string;
} & {
    [
    key in 'verification_code'// 8-digit verification code
    ]?: string | null;
  }

export type FrontUser = (Pick<User, 'name' | 'email' | 'created'>) & { id: string | null }

export type VerificationUser = (Pick<User, 'verification_code' | 'name' | 'email' | 'created'>) & { id: string | null }