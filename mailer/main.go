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
	"password":    "Revelation:2221", // google app password
	"mimeHeaders": "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n",
	"login":       "noreply@radio.best",
}

var Auth smtp.Auth
var Tlsconfig *tls.Config
var C *smtp.Client
var Configuration map[string]string

func Initialize() {
	var err error

	if os.Getenv("ENV") == "prod" {
		Configuration = prod_Configuration
	} else {
		Configuration = gmail_Configuration
	}

	Auth = smtp.PlainAuth("", Configuration["login"], Configuration["password"], Configuration["smtpHost"])

	Tlsconfig = &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         Configuration["smtpHost"],
	}

	C, err = smtp.Dial(Configuration["smtpHost"] + ":" + Configuration["smtpPort"])
	if err != nil {
		fmt.Println("[mailer initialize] Dial error : ", err)
		//log.Panic(err)
	}

	C.StartTLS(Tlsconfig)

	if err = C.Auth(Auth); err != nil {
		fmt.Println("[mailer initialize] Auth error : ", err)
		//log.Panic(err)
	}

}
