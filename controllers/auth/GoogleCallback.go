package AuthEndpoints

import (
	"fmt"
	"os"
	"strings"
	"web_project/cookies"
	Users "web_project/db/Users"

	"github.com/getsentry/sentry-go"
	"github.com/goccy/go-json"
	"github.com/gocql/gocql"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

func GoogleCallback(c *fiber.Ctx) error {

	//state from google button
	var state fiber.Map

	//fmt.Println("GoogleCallback c.Body() : ", c.Body())

	json.Unmarshal([]byte(c.FormValue("state")), &state)

	//fmt.Println("GoogleCallback state: ", state)

	cookie_g_csrf_token := c.Cookies("g_csrf_token")

	if cookie_g_csrf_token == "" {
		sentry.CaptureMessage("no g_csrf_token cookie")
	}

	if c.FormValue("g_csrf_token") == "" {
		sentry.CaptureMessage("no g_csrf_token in body")
	}

	if c.FormValue("g_csrf_token") != cookie_g_csrf_token {
		sentry.CaptureMessage("not equal csrf from body and cookie")
	}

	token, _, err := new(jwt.Parser).ParseUnverified(c.FormValue("credential"), jwt.MapClaims{})

	if err != nil {
		sentry.CaptureException(err)
	}

	if credential, ok := token.Claims.(jwt.MapClaims); ok {
		//fmt.Println("credential ", credential)

		if !strings.Contains(credential["iss"].(string), "accounts.google.com") {
			sentry.CaptureMessage("iss not accounts.google.com")
		}

		oauth_json_content, err := os.ReadFile(os.Getenv("TEMPL_PATH") + "/settings/google_oauth_" + os.Getenv("ENV") + ".json")
		if err != nil {
			sentry.CaptureException(err)
		}

		var google_oauth fiber.Map

		err = json.Unmarshal(oauth_json_content, &google_oauth)

		if err != nil {
			sentry.CaptureException(err)
		}

		if credential["aud"] != google_oauth["web"].(map[string]interface{})["client_id"] {
			sentry.CaptureMessage("wrong client_id")
		}

		agent := fiber.Get("https://www.googleapis.com/oauth2/v3/certs")

		_, body, errs := agent.Bytes()

		if len(errs) > 0 {
			fmt.Println("googleapis errors : ", body, errs)
			sentry.CaptureMessage("googleapis errors")
		}

		var google_headers fiber.Map

		err = json.Unmarshal(body, &google_headers)

		if err != nil {
			sentry.CaptureException(err)
		}
		//fmt.Println("google_headers : ", google_headers)

		if google_headers["keys"] != nil {
			id_tokens_equal := false

			for _, key := range google_headers["keys"].([]interface{}) {
				if key.(map[string]interface{})["kid"] == token.Header["kid"] {
					id_tokens_equal = true
				}
			}

			if !id_tokens_equal {
				sentry.CaptureMessage("id tokens not equal")
			}
		}

		user, err := Users.Create(fiber.Map{
			"email": credential["email"],
			"name":  credential["name"],
			"oauth": true,
			"admin": false,
		})

		if err != nil {
			sentry.CaptureException(err)
		}

		_, rememberme := state["rememberme"]

		auth_cookie := cookies.SetAuthCookie(fiber.Map{"email": credential["email"], "rememberme": rememberme, "id": user["id"]}, c)

		user["created"] = user["id"].(gocql.UUID).Time()
		cookies.SetUserCookie(user, c)

		fmt.Println("[GoogleCallback] auth cookie : ", auth_cookie.Value)

		if state["redirect_to"] != nil {
			return c.Redirect(state["redirect_to"].(string) + "?auth=" + auth_cookie.Value)
		}
		return c.Redirect("/?auth=" + auth_cookie.Value)
	}

	return nil

}
