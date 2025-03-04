package RadioEndpoints

import (
	"encoding/json"
	"web_project/constants"
	"web_project/db"
	"web_project/functions"

	lzstring "github.com/daku10/go-lz-string"
	"github.com/gofiber/fiber/v2"
)

func GetStation(ctx *fiber.Ctx) error {

	id := ctx.Params("id")

	station, err := db.SelectRow("stations", fiber.Map{"id": id}, constants.Public_Station_Props()[:]...)

	if err == nil {
		marshalled, _ := json.Marshal(station)

		enc := functions.Encrypt(string(marshalled))

		compressed, _ := lzstring.CompressToBase64(enc)

		return ctx.Status(fiber.StatusOK).SendString(compressed)
	}

	return ctx.SendStatus(fiber.StatusNotFound)
}
