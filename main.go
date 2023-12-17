package main

import (
	"log"
	"os"

	//"time"

	"go_react_starter/Users"
	"go_react_starter/controllers"
	"go_react_starter/controllers/auth"
	"go_react_starter/db"
	"go_react_starter/functions"
	"go_react_starter/mailer"

	//"go_react_starter/functions"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"

	//"go_react_starter/settings"
	"fmt"

	"github.com/goccy/go-json"
	"github.com/gofiber/contrib/websocket"
	_ "github.com/joho/godotenv/autoload"
)

func init() {
	//initializers.LoadEnvVars()
	Users.Initialize()
	mailer.Initialize()
}

func main() {

	defer functions.Recovery()
	/* err := db.Session.Query(`ALTER TABLE users ADD last_seen text`).Exec()
	fmt.Println(err)
	return */

	fmt.Println("start server")
	defer db.Session.Close()
	defer mailer.C.Quit()

	//fmt.Println(Users.GetAll())
	//fmt.Println(functions.Vc())

	// Load templates
	engine := html.New("./public", ".html")

	// Create app
	app := fiber.New(fiber.Config{
		Views:       engine,
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	// Configure app
	app.Static("/", "./public")

	auth := app.Group("/auth")

	auth.Post("/signup", Auth.Signup)
	auth.Post("/verification", Auth.Verification)
	auth.Post("/signin", Auth.Signin)
	auth.Post("/logout", Auth.Logout)
	auth.Post("/reset-password", Auth.ResetPassword)
	auth.Post("/google-callback", Auth.GoogleCallback)

	app.Use("/reloadws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		//log.Println("connection", c)
		if websocket.IsWebSocketUpgrade(c) {
			//log.Println("upgrade")
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/reloadws", websocket.New(func(c *websocket.Conn) {
		// c.Locals is added to the *websocket.Conn
		//log.Println(c.Locals("allowed"))  // true
		//log.Println(c.Params("id"))       // 123
		//log.Println(c.Query("v"))         // 1.0
		//log.Println(c.Cookies("session")) // ""

		// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index
		var (
			mt  int
			msg []byte
			err error
		)
		for {
			if mt, msg, err = c.ReadMessage(); err != nil {
				log.Println("read:", err)
				break
			}
			log.Printf("recv: %s", msg)

			if err = c.WriteMessage(mt, msg); err != nil {
				log.Println("write:", err)
				break
			}
		}

	}))

	app.Get("*", controllers.Index)

	// Start app
	app.Listen(":" + os.Getenv("PORT"))
}
