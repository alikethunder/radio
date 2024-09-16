package mailer

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func SendVc(vc string, to string, name string) {
	//send verification code (vc) to user (name) email (to)

	subject := "Subject: Verification code \n%s\n\n"

	if err := SendEmail("emails/VerificationCode.html", fiber.Map{
		"Name":             name,
		"VerificationCode": vc,
	}, []string{to}, subject); err != nil {
		fmt.Println("[SendVc] error : ", err)
	}

}
