package RadioEndpoints

import (
	"strconv"
	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func GetLikes(ctx *fiber.Ctx) error {

	id := ctx.Params("id")

	station, err := db.SelectRow("station_counters", fiber.Map{"id": id}, "likes")

	if err == nil {
		likes := station["likes"].(int64)
		return ctx.Status(fiber.StatusOK).Send([]byte(strconv.FormatInt(likes, 10)))
	}

	return ctx.SendStatus(fiber.StatusNotFound)
}
