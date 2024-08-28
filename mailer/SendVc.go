package mailer

import (
	"fmt"
	Types "web_project/types"
)

func SendVc(vc string, to string, name string) {
	//send verification code (vc) to user (name) email (to)

	subject := "Subject: Verification code \n%s\n\n"

	if err := SendEmail("emails/VerificationCode.html", Types.Map{
		"Name":             name,
		"VerificationCode": vc,
	}, []string{to}, subject); err != nil {
		fmt.Println("[SendVc] error : ", err)
	}

}
