package HistoryEndpoints

import (
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetDate(ctx *fiber.Ctx) error {
	return ctx.Status(fiber.StatusOK).Send([]byte(time.Now().UTC().String()))
}
