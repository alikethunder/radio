package StationTagsEndpoints

import (
	"web_project/db/StationTags"

	"github.com/gofiber/fiber/v2"
)

func ListTags(ctx *fiber.Ctx) error {

	tags := StationTags.ListTags()

	return ctx.Status(fiber.StatusOK).JSON(tags)

}
