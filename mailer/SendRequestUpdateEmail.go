package mailer

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func SendRequestUpdateEmail(credentials fiber.Map) {
	//send verification code (vc) to user (name) email (to)

	subject := "Subject: Email update \n%s\n\n"

	if err := SendEmail("emails/RequestUpdateEmail.html", credentials, []string{credentials["NewEmail"].(string)}, subject); err != nil {
		fmt.Println("[SendVc] error : ", err)
	}

}
