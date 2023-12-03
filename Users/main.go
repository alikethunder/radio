package Users

import (
	"fmt"
	"go_react_starter/db"
	"log"
)

func init() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS users (
		id uuid,
		name text,
		email text,
		password text,
		verification_code text,
		verification_code_created timestamp,
		updated timestamp,
		PRIMARY KEY (id, name, email, password)
	)`).Exec(); err != nil {

		log.Fatal("create users TABLE err : ", err)
	}

	fmt.Println("users TABLE CREATED")
}
