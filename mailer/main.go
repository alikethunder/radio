package mailer

import (
	"crypto/tls"
	"fmt"
	"net/smtp"
)

const (
	from        = "test@example.com"
	smtpPort    = "587"
	smtpHost    = "smtp.gmail.com"
	password    = "bmyx gbwy chub subo" // google app password
	mimeHeaders = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	login       = "aleksandr.popugaiev@gmail.com"

	smtpHostPort = smtpHost + ":" + smtpPort
)

var Auth smtp.Auth
var Tlsconfig *tls.Config
var C *smtp.Client

func Initialize() {
	var err error

	Auth = smtp.PlainAuth("", login, password, smtpHost)

	Tlsconfig = &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         smtpHost,
	}

	C, err = smtp.Dial(smtpHostPort)
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
