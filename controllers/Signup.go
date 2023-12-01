package controllers

import (
	"fmt"
	"go_react_starter/Users"

	"github.com/gofiber/fiber/v2"
)

func Signup(c *fiber.Ctx) error {
	c.Accepts("application/json")

	u := new(Users.User)
	if err := c.BodyParser(u); err != nil {
		return err
	}
	fmt.Println("Signup user : ", u)

	/* if u, err := Users.Create(*u); err != nil {
		return 403
	} */
	//return 200 and user
	return c.Send(c.Body())
}
