package functions

import (
	"crypto/aes"
	"crypto/cipher"
	"fmt"

	"github.com/zenazn/pkcs7pad"
)

func Encrypt(text string) string {
	key := []byte("6368616e676520746869732070617373")
	iv := []byte("e0332fc2a9743e4f")
	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}
	plaintext := pkcs7pad.Pad([]byte(text), aes.BlockSize)

	ciphertext := make([]byte, len(plaintext))

	bm := cipher.NewCBCEncrypter(block, iv)
	bm.CryptBlocks(ciphertext, plaintext)

	return fmt.Sprintf("%x", ciphertext)

}
