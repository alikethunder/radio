package mailer

import (
	//"fmt"
	"net/smtp"
)

const (
	from        = "ers@erx.example.com"
	smtpPort    = "25"
	smtpHost    = "localhost"
	password    = "revelation2221"
	mimeHeaders = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
)

var Auth smtp.Auth

func Initialize() {

	Auth = smtp.PlainAuth("", "alikethunder@ers.example.com", password, smtpHost)

}
