package mailer

import (
	"fmt"
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func SendVc(vc string, to string, name string, language string) {
	//send verification code (vc) to user (name) email (to)

	subject := translations.Dictionary[language]["verification_code"]

	if err := SendEmail("emails/VerificationCode.html", fiber.Map{
		"Name":                               name,
		"VerificationCode":                   vc,
		"hello":                              translations.Dictionary[language]["hello"],
		"here_is_your_verification_code_for": translations.Dictionary[language]["here_is_your_verification_code_for"],
	}, []string{to}, subject); err != nil {
		fmt.Println("[SendVc] error : ", err)
	}

}
