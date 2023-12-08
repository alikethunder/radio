package mailer

import (
	"bytes"
	"fmt"
	"html/template"
	"net/smtp"
)

func SendEmail(templateAddress string, data interface{}, to []string) error {

	var body bytes.Buffer

	t, _ := template.ParseFiles(templateAddress)
	fmt.Println("[SendEmail] template : ", t)

	body.Write([]byte(fmt.Sprintf("Subject: This is a test subject \n%s\n\n", mimeHeaders)))

	t.Execute(&body, data)

	err := smtp.SendMail(smtpHost+":"+smtpPort, Auth, from, to, body.Bytes())

	if err != nil {
		fmt.Println("[SendEmail] error : ", err)
		return err
	}

	return nil
}
