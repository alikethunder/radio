package mailer

import (
	"fmt"
	Types "web_project/types"
)

func SendRequestUpdateEmail(credentials Types.Map) {
	//send verification code (vc) to user (name) email (to)

	subject := "Subject: Email update \n%s\n\n"

	if err := SendEmail("emails/RequestUpdateEmail.html", credentials, []string{credentials["NewEmail"].(string)}, subject); err != nil {
		fmt.Println("[SendVc] error : ", err)
	}

}
