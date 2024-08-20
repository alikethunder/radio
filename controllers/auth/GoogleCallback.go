package AuthEndpoints

import (
	"errors"
	"fmt"
	"os"
	"strings"
	"web_project/cookies"
	Users "web_project/db/Users"
	Types "web_project/types"

	"github.com/goccy/go-json"
	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func GoogleCallback(c *fiber.Ctx) error {

	//state from google button
	var state Types.Map

	//fmt.Println("GoogleCallback c.Body() : ", c.Body())

	json.Unmarshal([]byte(c.FormValue("state")), &state)

	//fmt.Println("GoogleCallback state: ", state)

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

	token, _, err := new(jwt.Parser).ParseUnverified(c.FormValue("credential"), jwt.MapClaims{})

	if err != nil {
		panic(err)
	}

	if credential, ok := token.Claims.(jwt.MapClaims); ok {
		//fmt.Println("credential ", credential)

		if !strings.Contains(credential["iss"].(string), "accounts.google.com") {
			panic(errors.New("iss not accounts.google.com"))
		}

		oauth_json_content, err := os.ReadFile("./settings/google_oauth.json")
		if err != nil {
			panic(err)
		}

		var google_oauth Types.Map

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
			fmt.Println("googleapis errors : ", body, errs)
			panic("googleapis errors")
		}

		var google_headers fiber.Map

		err = json.Unmarshal(body, &google_headers)

		if err != nil {
			panic(err)
		}
		//fmt.Println("google_headers : ", google_headers)

		id_tokens_equal := false

		for _, key := range google_headers["keys"].([]interface{}) {
			if key.(map[string]interface{})["kid"] == token.Header["kid"] {
				id_tokens_equal = true
			}
		}

		if !id_tokens_equal {
			panic(errors.New("id tokens not equal"))
		}

		user, err := Users.Create(Types.Map{
			"email": credential["email"],
			"name":  credential["name"],
			"oauth": true,
		})

		if err != nil {
			panic(err)
		}

		_, rememberme := state["rememberme"]

		cookies.SetAuthCookie(Types.Map{"email": credential["email"], "rememberme": rememberme, "id": user["id"]}, c)

		user["created"] = user["id"].(gocql.UUID).Time()
		cookies.SetUserCookie(user, c)

		return c.Redirect(state["redirect_to"].(string))
	}

	return nil

}
