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
		updated timestamp,
		PRIMARY KEY (id, email)
	)`).Exec(); err != nil {

		log.Fatal("create users TABLE err : ", err)
	}
	/*
		if err := db.Session.Query(`CREATE INDEX ON users(password)`).Exec(); err != nil {

			log.Fatal("create INDEX on users err : ", err)
		} */

	fmt.Println("users TABLE CREATED")
}
