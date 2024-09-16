package functions

import (
	"bytes"
	"fmt"
	"io"

	"github.com/gofiber/fiber/v2"
)

func ParseForm(ctx *fiber.Ctx, fields []string, files []string) fiber.Map {

	result := fiber.Map{}

	for _, field := range fields {
		result[field] = ctx.FormValue(field)
	}

	for _, file := range files {

		blob, err := ctx.FormFile(file)

		if err != nil {
			fmt.Println("[ParseForm] FormFile error : ", err)
		}

		if blob != nil {
			bts := bytes.NewBuffer(nil)

			file_bts, err := blob.Open()

			if err != nil {
				fmt.Println("[ParseForm] photo.Open error : ", err)
			}

			if _, err := io.Copy(bts, file_bts); err != nil {
				fmt.Println("[ParseForm] io.Copy error : ", err)
			}

			result[file] = bts.Bytes()
		}

	}

	return result
}
