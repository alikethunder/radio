//import { Entries } from 'type-fest'

declare global {
  interface Window {
    secret?: string;
    key?: string;
    user?: string;
    google?: any;
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
  | 'updated'
  ]: string;
} & {
  rememberme: boolean;
} & {
  id: number;
} & {
    [key in 'verification_code'// 8-digit verification code
    | 'verification_code_created'
    ]?: string | null;
  }

export type FrontUser = (Pick<User, 'name' | 'email' | 'created' | 'updated'>) & {id: number | null}

export type VerificationUser = (Pick<User, 'verification_code' | 'name' | 'email' | 'created'>) & {id: number | null}