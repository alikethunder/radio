package mailer

import (
	"bytes"
	"fmt"
	"html/template"
	"net/mail"

	"github.com/getsentry/sentry-go"
	//"net/smtp"
)

func SendEmail(templateAddress string, data interface{}, to []string, subject string) error {

	var body bytes.Buffer

	t, _ := template.ParseFiles(templateAddress)

	body.Write([]byte(fmt.Sprintf("%s: %s\r\n", "From", Configuration["from"].(mail.Address).Address)))

	for _, addr := range to {

		address := mail.Address{"", addr}

		body.Write([]byte(fmt.Sprintf("%s: %s\r\n", "To", address.Address)))

		body.Write([]byte(fmt.Sprintf("%s: %s\r\n", "Subject", subject)))

		body.Write([]byte(fmt.Sprintf("%s: %s\r\n", "MIME-Version", "1.0")))

		body.Write([]byte(fmt.Sprintf("%s: %s\r\n", "Content-Type", "text/html; charset=UTF-8")))

		body.Write([]byte("\r\n"))

		//body.Write([]byte(Configuration["mimeHeaders"].(string)))

		t.Execute(&body, data)
		fmt.Println("[email body ] : ", body.String())
		if err := C.Mail(Configuration["from"].(mail.Address).Address); err != nil {
			fmt.Println("[SendEmail] Mail error : ", err)
			sentry.CaptureException(err)
		}

		if err := C.Rcpt(address.Address); err != nil {
			fmt.Println("[SendEmail] rcpt error : ", err)
			sentry.CaptureException(err)
		}

		// Data
		w, err := C.Data()
		if err != nil {
			fmt.Println("[SendEmail] data error : ", err)
			sentry.CaptureException(err)
		}

		_, err = w.Write(body.Bytes())
		if err != nil {
			fmt.Println("[SendEmail] write error : ", err)
			sentry.CaptureException(err)
		}

		err = w.Close()
		if err != nil {
			fmt.Println("[SendEmail] write close error : ", err)
			sentry.CaptureException(err)
		}

		//c.Quit()

		if err != nil {
			fmt.Println("[SendEmail] error : ", err)
			return err
		}

	}

	return nil
}
