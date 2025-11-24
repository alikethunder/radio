package Users

import (
	"log"
	"web_project/db"
)

/*
	id uuid, id stores date created
	name text,
	email text,
	password text, hashed password
	verification_code text, 8-digit code
	last_seen text, date last seen
	subscription_plan text,
	subscription_plan_ends text, date seller plan ends
	favorite_stations set<text>, stations ids
*/

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS users (
		id uuid,
		name text,
		email text,
		password text,
		verification_code text,
		last_seen text,
		subscription_plan text,
		subscription_plan_ends text,
		photo blob,
		admin boolean,
		favorite_stations set<text>,
		PRIMARY KEY (id, email)
	)`).Exec(); err != nil {

		log.Fatal("create users TABLE err : ", err)
	}
	/*
		if err := db.Session.Query(`CREATE INDEX ON users(password)`).Exec(); err != nil {

			log.Fatal("create INDEX on users err : ", err)
		} */

	//fmt.Println("users TABLE CREATED")
}
