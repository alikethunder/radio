package functions

import (
	"github.com/gofiber/fiber/v2"
)

func UpdateMap(m, updates fiber.Map) {
	for k, v := range updates {
		m[k] = v
	}
}
