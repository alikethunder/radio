package cookies

import (
	"crypto/rand"
	"fmt"
)

const (
	//a week
	MaxAge         = 7 * 86400
	AuthCookieName = "auth"
	UserCookieName = "user"
)

var HmacSampleSecret []byte

func Initialize() {
	HmacSampleSecret = make([]byte, 10)
	_, err := rand.Read(HmacSampleSecret)
	if err != nil {
		fmt.Println("[HmacSampleSecret] error:", err)
		return
	}
	// The slice should now contain random bytes instead of only zeroes.

}
