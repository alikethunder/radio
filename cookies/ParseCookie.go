package cookies

import (
	"fmt"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func ParseCookie(tokenString string) fiber.Map {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			sentry.CaptureException(fmt.Errorf("unexpected signing method: %v", token.Header["alg"]))
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return HmacSampleSecret, nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

		return fiber.Map(claims)

	} else {
		fmt.Println("[ParseCookie] invalid auth cookie : ", err)

		return nil
	}

}
