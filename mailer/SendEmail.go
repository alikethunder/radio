package mailer

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/mail"
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
			log.Panic(err)
		}

		if err := C.Rcpt(address.Address); err != nil {
			fmt.Println("[SendEmail] rcpt error : ", err)
			log.Panic(err)
		}

		// Data
		w, err := C.Data()
		if err != nil {
			fmt.Println("[SendEmail] data error : ", err)
			log.Panic(err)
		}

		_, err = w.Write(body.Bytes())
		if err != nil {
			fmt.Println("[SendEmail] write error : ", err)
			log.Panic(err)
		}

		err = w.Close()
		if err != nil {
			fmt.Println("[SendEmail] write close error : ", err)
			log.Panic(err)
		}

		//c.Quit()

		if err != nil {
			fmt.Println("[SendEmail] error : ", err)
			return err
		}

	}

	return nil
}
