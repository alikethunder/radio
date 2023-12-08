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

	//VerificationCode
	address := []string{to}

	if err := SendEmail("emails/VerificationCode.html", struct {
		Name             string
		VerificationCode string
	}{
		Name:             name,
		VerificationCode: vc,
	}, address); err != nil {
		fmt.Println("[SendVc] error : ", err)
	}

}
