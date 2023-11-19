package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"go_react_starter/controllers"
	"go_react_starter/settings"
	//"fmt"
)

func init() {
	initializers.LoadEnvVars()
}

func main() {

	//fmt.Println("start go")

	// Load templates
	engine := html.New("./frontend/client/dist", ".html")

	// Create app
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Configure app
	app.Static("/", "./frontend/client/dist")

	app.Get("*", controllers.Home)

	// Start app
	app.Listen(":" + os.Getenv("PORT"))
}
