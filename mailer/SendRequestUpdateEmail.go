package mailer

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func SendRequestUpdateEmail(credentials fiber.Map) {
	//send verification code (vc) to user (name) email (to)

	subject := "Email update"

	if err := SendEmail("emails/RequestUpdateEmail.html", credentials, []string{credentials["NewEmail"].(string)}, subject); err != nil {
		fmt.Println("[SendRequestUpdateEmail] error : ", err)
	}

}
