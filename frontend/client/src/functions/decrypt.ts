import CryptoJS from "crypto-js"

export const decrypt = (data: string) => {

  const iv = CryptoJS.enc.Utf8.parse('e0332fc2a9743e4f')
  const ciphertext = CryptoJS.enc.Hex.parse(data)
  const key = CryptoJS.enc.Utf8.parse("6368616e676520746869732070617373")
  // @ts-ignore !!!!!!!! IMPORTANT IF YOU USE TYPESCRIPT COMPILER
  const decrypted = CryptoJS.AES.decrypt({ciphertext}, key, {
    mode: CryptoJS.mode.CBC,
    iv,
    padding: CryptoJS.pad.Pkcs7,
  })
  
  return decrypted.toString(CryptoJS.enc.Utf8)
}