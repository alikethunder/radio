package main

import (
	"fmt"
	"log"
	"os"

	//"time"

	"web_project/db"
	DBPlans "web_project/db/Plans"
	Users "web_project/db/Users"

	"web_project/controllers"
	AuthEndpoints "web_project/controllers/auth"
	PlansEndpoints "web_project/controllers/plans"
	ProfileEndpoints "web_project/controllers/profile"

	"web_project/functions"
	"web_project/mailer"

	//"web_project/functions"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/template/html/v2"

	//"web_project/settings"

	"github.com/goccy/go-json"
	_ "github.com/joho/godotenv/autoload"
)

func init() {
	//initializers.LoadEnvVars()
	Users.Initialize()
	DBPlans.Initialize()
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

	api := app.Group("/api")
	v1 := api.Group("/v1")

	auth := v1.Group("/auth")

	auth.Post("/signup", AuthEndpoints.Signup)
	auth.Post("/verification", AuthEndpoints.Verification)
	auth.Post("/signin", AuthEndpoints.Signin)
	auth.Post("/logout", AuthEndpoints.Logout)
	auth.Post("/reset-password", AuthEndpoints.ResetPassword)
	auth.Post("/google-callback", AuthEndpoints.GoogleCallback)

	subscriptionPlans := v1.Group("/purchase-plan")

	subscriptionPlans.Get("/get-plans", PlansEndpoints.GetPlans)
	subscriptionPlans.Get("/get-user-plan", PlansEndpoints.GetUserPlan)

	profile_endpoints := v1.Group("/profile")

	profile_endpoints.Post("/update", ProfileEndpoints.Update)

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

	app.Use(compress.New())

	// Configure app
	app.Static("/", "./public")

	app.Get("*", controllers.Index)

	// Start app
	err := app.Listen(":" + os.Getenv("PORT"))
	if err != nil {
		fmt.Println("main error : ", err)
	}
}
