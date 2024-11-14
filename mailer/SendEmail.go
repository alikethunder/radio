package mailer

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	//"net/smtp"
)

func SendEmail(templateAddress string, data interface{}, to []string, subject string) error {

	var body bytes.Buffer

	t, _ := template.ParseFiles(templateAddress)
	//fmt.Println("[SendEmail] template : ", t)

	body.Write([]byte(fmt.Sprintf("%s: %s\r\n", "From", Configuration["from"])))

	body.Write([]byte(fmt.Sprintf("%s: %s\r\n", "Subject", subject)))

	//body.Write([]byte("\r\n"))

	body.Write([]byte(Configuration["mimeHeaders"]))

	t.Execute(&body, data)

	for _, addr := range to {

		if err := C.Mail(Configuration["from"]); err != nil {
			fmt.Println("[SendEmail] Mail error : ", err)
			log.Panic(err)
		}

		if err := C.Rcpt(addr); err != nil {
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
