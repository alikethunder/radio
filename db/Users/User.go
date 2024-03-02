package Users

import (
	//"time"

	"github.com/gocql/gocql"
)

type User struct {
	Id               gocql.UUID `json:"id,omitempty"`
	Name             string     `json:"name,omitempty"`
	Email            string     `json:"email,omitempty"`
	Password         string     `json:"password,omitempty"`
	Rememberme       bool       `json:"rememberme,omitempty"`
	VerificationCode string     ` json:"verification_code,omitempty"`
}
