package cookies

import (
	"fmt"
	Types "web_project/types"

	"github.com/golang-jwt/jwt"
)

func ParseCookie(tokenString string) Types.Map {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			panic(fmt.Errorf("unexpected signing method: %v", token.Header["alg"]))
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return HmacSampleSecret, nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

		return Types.Map(claims)

	} else {
		fmt.Println("[ParseCookie] invalid auth cookie : ", err)

		return nil
	}

}
