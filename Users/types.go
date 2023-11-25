package Users

import "github.com/gocql/gocql"

type User struct {
	Id                        gocql.UUID `json:"id"`
	Name                      string     `json:"name"`
	Password                  string
	Created                   string `json:"created"`
	Updated                   string `json:"updated"`
	Rememberme                bool   `json:"rememberme"`
	Verification_code         string `json:"verification_code"`
	Verification_code_created string `json:"verification_code_created"`
}
