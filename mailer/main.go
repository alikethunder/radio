package mailer

import (
	"crypto/tls"
	"fmt"
	"net/smtp"
	"os"
)

var gmail_Configuration = map[string]string{
	"from":        "test@example.com",
	"smtpPort":    "587",
	"smtpHost":    "smtp.gmail.com",
	"password":    "bmyx gbwy chub subo", // google app password
	"mimeHeaders": "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n",
	"login":       "aleksandr.popugaiev@gmail.com",
}

var prod_Configuration = map[string]string{
	"from":        "noreply@radio.best",
	"smtpPort":    "465",
	"smtpHost":    "smtp.titan.email",
	"password":    "Revelation:2221", // Titan password
	"mimeHeaders": "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n",
	"login":       "noreply@radio.best",
}

var C *smtp.Client
var Configuration map[string]string

func Initialize() {
	var err error

	prod := true || os.Getenv("ENV") == "prod"

	if prod {
		Configuration = prod_Configuration
	} else {
		Configuration = gmail_Configuration
	}

	auth := smtp.PlainAuth("", Configuration["login"], Configuration["password"], Configuration["smtpHost"])

	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         Configuration["smtpHost"],
	}

	if prod {
		conn, err := tls.Dial("tcp", Configuration["smtpHost"]+":"+Configuration["smtpPort"], tlsconfig)
		if err != nil {
			fmt.Println("[mailer initialize] tls Dial error : ", err)
		}

		C, err = smtp.NewClient(conn, Configuration["smtpHost"])
		if err != nil {
			fmt.Println("[mailer initialize] smtp.NewClient error : ", err)
		}

		fmt.Println("[mailer initialize] business email initialized")

	} else {
		C, err = smtp.Dial(Configuration["smtpHost"] + ":" + Configuration["smtpPort"])
		if err != nil {
			fmt.Println("[mailer initialize] smtp Dial error : ", err)
			//log.Panic(err)
		}

		C.StartTLS(tlsconfig)
	}

	if err = C.Auth(auth); err != nil {
		fmt.Println("[mailer initialize] Auth error : ", err)
		//log.Panic(err)
	}

}
