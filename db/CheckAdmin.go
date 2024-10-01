package db

import (
	"web_project/cookies"

	"github.com/gofiber/fiber/v2"
)

func CheckRootAdmin(ctx *fiber.Ctx) bool {

	current_user_id := cookies.CurrentUserId(ctx)

	if current_user_id != "" {

		db_user, _ := SelectRow("users", fiber.Map{"id": current_user_id}, "admin")

		return db_user["admin"].(bool)

	}
	return false
}
