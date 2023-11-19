package main

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
	"go_react_starter/controllers"
	//"go_react_starter/settings"
	//"fmt"
	_ "github.com/joho/godotenv/autoload"
)

func init() {
	//initializers.LoadEnvVars()
}

func main() {

	//fmt.Println("start go")

	// Load templates
	engine := html.New("./build/public", ".html")

	// Create app
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	// Configure app
	app.Static("/", "./build/public")

	app.Get("*", controllers.Home)

	// Start app
	app.Listen(":" + os.Getenv("PORT"))
}
