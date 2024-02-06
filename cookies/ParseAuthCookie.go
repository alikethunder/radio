package cookies

import (
	"fmt"

	"sale_platform/Users"

	"github.com/golang-jwt/jwt"
)

func ParseAuthCookie(tokenString string) Users.UserMap {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			panic(fmt.Errorf("unexpected signing method: %v", token.Header["alg"]))
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return HmacSampleSecret, nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

		return Users.UserMap(claims)
	} else {
		panic(err)
	}

}
