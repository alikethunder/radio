package AuthEndpoints

import (
	"fmt"

	"github.com/goccy/go-json"

	Users "web_project/db/Users"

	"github.com/gofiber/fiber/v2"
)

func Signup(ctx *fiber.Ctx) error {

	ctx.Accepts("application/json")

	language := ctx.Query("language")

	var u fiber.Map

	json.Unmarshal(ctx.Body(), &u)

	//fmt.Println("Signup user : ", u)

	if user, err := Users.Create(u, language); err != nil {

		fmt.Println("[Signup] error : ", err)

		return ctx.SendStatus(fiber.StatusForbidden)

	} else {
		fmt.Println("user created : ", user)
		return ctx.Status(fiber.StatusOK).JSON(user)
	}
}
