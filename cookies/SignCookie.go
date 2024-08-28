package cookies

import (
	"fmt"

	Types "web_project/types"

	"encoding/base64"

	"github.com/golang-jwt/jwt"
)

func SignCookie(m Types.Map) string {
	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims(m))

	fmt.Println("HmacSampleSecret : ", base64.URLEncoding.EncodeToString(HmacSampleSecret))
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString(HmacSampleSecret)

	if err != nil {
		fmt.Println("[SignCookie] error : ", err)
	}
	return tokenString
}
