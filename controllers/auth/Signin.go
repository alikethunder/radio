package AuthEndpoints

import (
	"encoding/json"
	"fmt"
	"time"

	"sale_platform/Users"
	"sale_platform/cookies"
	"sale_platform/functions"

	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
)

func Signin(c *fiber.Ctx) error {

	c.Accepts("application/json")

	var u Users.UserMap

	json.Unmarshal(c.Body(), &u)

	//fmt.Println("Signup user : ", u)

	user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "password", "name")

	if err != nil {
		fmt.Println("[Signin] GetUserFields error : ", err)
	}

	if user != nil && user["password"] != "" && user["password"] != nil {

		correctPassword := functions.CheckPasswordHash(u["password"].(string), user["password"].(string))

		if correctPassword {

			cookies.SetAuthCookie(Users.UserMap{"email": u["email"], "rememberme": u["rememberme"]}, c)

			//created, _ := gocql.ParseUUID(user["id"].(gocql.UUID))

			tm := time.Now().UTC().String()

			Users.Update(Users.UserMap{"last_seen": tm}, user["id"].(gocql.UUID), u["email"].(string))

			return c.Status(fiber.StatusOK).JSON(Users.UserMap{"id": user["id"], "created": user["id"].(gocql.UUID).Time(), "name": user["name"]})

		} else {
			//wrong password
			return c.SendStatus(fiber.StatusUnauthorized)
		}

	} else {
		//user not exist
		return c.SendStatus(fiber.StatusForbidden)
	}

}
