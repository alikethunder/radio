package mailer

import (
	// "fmt"
	"crypto/tls"
	"log"
	"net/smtp"
)

const (
	from        = "aleksandr.popugaiev@gmail.com"
	smtpPort    = "587"
	smtpHost    = "smtp.gmail.com"
	password    = "nfhs tfdi wbqn ichg" // google app password
	mimeHeaders = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
	login       = "aleksandr.popugaiev@gmail.com"

	smtpHostPort = smtpHost + ":" + smtpPort
)

func Initialize() {
	auth := smtp.PlainAuth("", login, password, smtpHost)

	tlsconfig := &tls.Config{
		InsecureSkipVerify: true,
		ServerName:         smtpHost,
	}

	c, err := smtp.Dial(smtpHostPort)
	if err != nil {
		log.Panic(err)
	}

	c.StartTLS(tlsconfig)

	if err = c.Auth(auth); err != nil {
		log.Panic(err)
	}
}
