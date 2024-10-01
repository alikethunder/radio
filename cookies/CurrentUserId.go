package cookies

import (
	"github.com/gofiber/fiber/v2"
)

func CurrentUserId(ctx *fiber.Ctx) (id string) {

	authCookie := ctx.Cookies(AuthCookieName)

	if authCookie != "" {

		cookie_user := ParseCookie(ctx.Cookies(AuthCookieName))

		return cookie_user["id"].(string)

	}

	return id
}
