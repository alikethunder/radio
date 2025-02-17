package RadioEndpoints

import (
	"fmt"
	"slices"
	"strconv"

	"github.com/goccy/go-json"

	"web_project/db"

	"github.com/gofiber/fiber/v2"
)

func UpdateLikes(ctx *fiber.Ctx) error {

	id := ctx.Params("id")

	var body fiber.Map

	json.Unmarshal(ctx.Body(), &body)

	fmt.Println("[RadioEndpoints.Update] body :", body)

	if body["uuid"] != "" && body["uuid"] != nil {

		station, _ := db.SelectRow(
			"stations",
			fiber.Map{
				"id": id,
			},
			"likes",
		)

		if station != nil {

			if (body["likes"] == "+1" && !slices.Contains(station["likes"].([]string), body["uuid"].(string))) || (body["likes"] == "-1" && slices.Contains(station["likes"].([]string), body["uuid"].(string))) {

				var likes []string

				if body["likes"] == "+1" {
					likes = append(station["likes"].([]string), body["uuid"].(string))
				} else {
					likes = slices.DeleteFunc(station["likes"].([]string), func(e string) bool {
						return e == body["uuid"]
					})
				}

				db.Update(
					"stations",
					fiber.Map{
						"likes": likes,
					},
					fiber.Map{
						"id": id,
					},
				)

				db.UpdateCounters(
					"station_counters",
					fiber.Map{
						"likes": body["likes"],
					},
					fiber.Map{
						"id": id,
					},
					//true,
				)

				station, err := db.SelectRow("station_counters", fiber.Map{"id": id}, "likes")

				if err == nil {
					likes := station["likes"].(int64)
					return ctx.Status(fiber.StatusOK).Send([]byte(strconv.FormatInt(likes, 10)))
				}

				return ctx.SendStatus(fiber.StatusOK)
			}
		}
	}

	return ctx.SendStatus(fiber.StatusUnauthorized)
}
