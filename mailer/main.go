package mailer

import (
	//"fmt"
	"net/smtp"
)

const (
	from        = "ers@erx.example.com"
	smtpPort    = "25"
	smtpHost    = "127.0.0.1"
	password    = "revelation2221"
	mimeHeaders = "MIME-version: 1.0;\nContent-Type: text/html; charset=\"UTF-8\";\n\n"
)

var Auth smtp.Auth

func Initialize() {

	Auth = smtp.PlainAuth("", "alikethunder@ers.example.com", password, smtpHost)

}
