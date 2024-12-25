package mailer

import (
	"crypto/tls"
	"fmt"
	"net/mail"
	"net/smtp"
	"os"
	"web_project/constants"
)

var gmail_Configuration = map[string]interface{}{
	"from":     "test@example.com",
	"smtpPort": "587",
	"smtpHost": "smtp.gmail.com",
	"password": "bmyx gbwy chub subo", // google app password
	"login":    "aleksandr.popugaiev@gmail.com",
}

var prod_Configuration = map[string]interface{}{
	"from":        mail.Address{"", "noreply@" + constants.BaseURL},
	"smtpPort":    "465",
	"smtpHost":    "smtp.titan.email",
	"password":    "Revelation:2221", // Titan password
	"mimeHeaders": "Content-Transfer-Encoding: base64",
	"login":       "noreply@" + constants.BaseURL,
}

var C *smtp.Client
var Configuration map[string]interface{}

func Initialize() {
	var err error

	prod := true || os.Getenv("ENV") == "prod"

	if prod {
		Configuration = prod_Configuration
	} else {
		Configuration = gmail_Configuration
	}

	auth := smtp.PlainAuth("", Configuration["login"].(string), Configuration["password"].(string), Configuration["smtpHost"].(string))

	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         Configuration["smtpHost"].(string),
	}

	if prod {
		conn, err := tls.Dial("tcp", Configuration["smtpHost"].(string)+":"+Configuration["smtpPort"].(string), tlsconfig)
		if err != nil {
			fmt.Println("[mailer initialize] tls Dial error : ", err)
		}

		C, err = smtp.NewClient(conn, Configuration["smtpHost"].(string))
		if err != nil {
			fmt.Println("[mailer initialize] smtp.NewClient error : ", err)
		}

		fmt.Println("[mailer initialize] business email initialized")

	} else {
		C, err = smtp.Dial(Configuration["smtpHost"].(string) + ":" + Configuration["smtpPort"].(string))
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
