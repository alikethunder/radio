package functions

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"fmt"
	"io"

	"github.com/zenazn/pkcs7pad"
)

func Encrypt(text string) string {
	key := []byte("6368616e676520746869732070617373")
	//iv := []byte("asdasdvcxvdfhert")
	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err)
	}
	plaintext := pkcs7pad.Pad([]byte(text), block.BlockSize())
	// The IV needs to be unique, but not secure. Therefore it's common to
	// include it at the beginning of the ciphertext.
	ciphertext := make([]byte, aes.BlockSize+len(plaintext))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		panic(err)
	}
	bm := cipher.NewCBCEncrypter(block, iv)
	bm.CryptBlocks(ciphertext[aes.BlockSize:], plaintext)
	fmt.Println("iv : ", string(iv))

	return fmt.Sprintf("%x", ciphertext)

}
