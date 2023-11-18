import { createStore } from '@udecode/zustood'

export const authStore = createStore('app')({
  importedKey: <CryptoKey | null> null,
  name: 'AES-GCM',
  iv: <Uint8Array | null> null,
  signedin: false,
})