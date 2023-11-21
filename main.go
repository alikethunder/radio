package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"go_react_starter/controllers"
	//"go_react_starter/settings"
	"fmt"
	"github.com/gofiber/contrib/websocket"
	_ "github.com/joho/godotenv/autoload"
	"go_react_starter/db"
)

func init() {
	//initializers.LoadEnvVars()
}

func main() {

	fmt.Println(db.Cluster)

	// Load templates
	engine := html.New("./public", ".html")

	// Create app
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Configure app
	app.Static("/", "./public")

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

	app.Get("*", controllers.Home)

	// Start app
	app.Listen(":" + os.Getenv("PORT"))
}
