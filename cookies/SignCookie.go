package cookies

import (
	"fmt"

	"github.com/golang-jwt/jwt"
	"web_project/types"
)

func SignCookie(m Types.Map) string {
	// Create a new token object, specifying signing method and the claims
	// you would like it to contain.
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims(m))

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString(HmacSampleSecret)

	if err != nil {
		fmt.Println("[SignCookie] error : ", err)
	}
	return tokenString
}
