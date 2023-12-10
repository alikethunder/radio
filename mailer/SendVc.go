package mailer

import (
	"fmt"
)

const (
	textBodyTemplate = ` Hello {{}}
	`
)

func SendVc(vc string, to string, name string) {
	//send verification code (vc) to user (name) email (to)

	subject := "Subject: Verification code \n%s\n\n"

	if err := SendEmail("emails/VerificationCode.html", struct {
		Name             string
		VerificationCode string
	}{
		Name:             name,
		VerificationCode: vc,
	}, []string{to}, subject); err != nil {
		fmt.Println("[SendVc] error : ", err)
	}

}
