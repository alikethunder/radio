package mailer

import (
	"fmt"
	"web_project/translations"

	"github.com/gofiber/fiber/v2"
)

func SendRequestUpdateEmail(credentials fiber.Map, language string) {
	//send verification code (vc) to user (name) email (to)

	subject := translations.Dictionary[language]["email_update"]

	credentials["hello"] = translations.Dictionary[language]["hello"]

	credentials["you_requested_to_update_your_email_address_at"] = translations.Dictionary[language]["you_requested_to_update_your_email_address_at"]

	credentials["to_update_your_email_from"] = translations.Dictionary[language]["to_update_your_email_from"]

	credentials["to"] = translations.Dictionary[language]["to"]

	credentials["please_follow"] = translations.Dictionary[language]["please_follow"]

	credentials["link_to"] = translations.Dictionary[language]["link_to"]

	credentials["if_this_wasnt_you_to_prevent_it"] = translations.Dictionary[language]["if_this_wasnt_you_to_prevent_it"]

	if err := SendEmail("emails/RequestUpdateEmail.html", credentials, []string{credentials["NewEmail"].(string)}, subject); err != nil {
		fmt.Println("[SendRequestUpdateEmail] error : ", err)
	}

}
