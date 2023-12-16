package Auth

import (
	//"encoding/json"
	"errors"
	"fmt"
	"go_react_starter/Users"
	"go_react_starter/functions"
	"os"
	"strings"

	//"time"

	//"go_react_starter/Users"
	//"go_react_starter/cookies"
	//"go_react_starter/functions"

	//"github.com/gocql/gocql"
	"github.com/goccy/go-json"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func GoogleCallback(c *fiber.Ctx) error {

	//todo: read rememberme from query

	defer functions.Recovery()

	//fmt.Println("Signup user : ", u)
	cookie_g_csrf_token := c.Cookies("g_csrf_token")

	if cookie_g_csrf_token == "" {
		panic(errors.New("no g_csrf_token cookie"))
	}

	if c.FormValue("g_csrf_token") == "" {
		panic(errors.New("no g_csrf_token in body"))
	}

	if c.FormValue("g_csrf_token") != cookie_g_csrf_token {
		panic(errors.New("not equal csrf from body and cookie"))
	}

	type MyClaims struct {
		name  string `json:"name"`
		email string `json:"email"`
		kid   string `json:"kid"`
		jwt.StandardClaims
	}

	token, _, err := new(jwt.Parser).ParseUnverified(c.FormValue("credential"), jwt.MapClaims{})

	if err != nil {
		panic(err)
	}

	if credential, ok := token.Claims.(jwt.MapClaims); ok {
		fmt.Println("credential ", credential)

		if strings.Contains(credential["iss"].(string), "accounts.google.com") {
			panic(errors.New("iss not accounts.google.com"))
		}

		oauth_json_content, err := os.ReadFile("./settings/google_oauth.json")
		if err != nil {
			panic(err)
		}

		var google_oauth Users.UserMap

		err = json.Unmarshal(oauth_json_content, &google_oauth)

		if err != nil {
			panic(err)
		}

		if credential["aud"] != google_oauth["web"].(map[string]interface{})["client_id"] {
			panic("wrong client_id")
		}

		agent := fiber.Get("https://www.googleapis.com/oauth2/v3/certs")

		_, body, errs := agent.Bytes()

		if len(errs) > 0 {
			fmt.Println("googleapis errors : ", errs)
			panic("googleapis errors")
		}

		var google_headers fiber.Map

		err = json.Unmarshal(body, &google_headers)

		if err != nil {
			panic(err)
		}
		fmt.Println("google_headers : ", google_headers)

		id_tokens_equal := false

		for _, key := range google_headers["keys"].([]interface{}) {
			if key.(Users.UserMap)["kid"] == credential["kid"] {
				id_tokens_equal = true
			}
		}

		if !id_tokens_equal {
			panic(errors.New("id tokens not equal"))
		}

		/* user, err :=  */
		Users.Create(Users.UserMap{
			"email": credential["email"],
			"name":  credential["name"],
			"oauth": true,
		})

	}

	return nil

	/* user, err := Users.GetUserFields(Users.UserMap{"email": u["email"]}, "id", "password", "name")

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
	} */

}
