package Stations

import (
	"fmt"
	"log"
	"web_project/db"
)

/*
	id uuid, 								station id
	name text,  						station name
	description text, 			station description
	playlist uuid, 					station playlist table
	avatar blob, 						station icon image
	background blob, 				station background image
	broadcasting boolean, 	on/off
	tags set<text>,					station tags
	admins set<uuid>, 			who can alter station
	order int,							order of stations to render
*/

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS stations (
		id uuid,
		name text,
		description text,
		playlist uuid,
		avatar blob,
		background blob,
		broadcasting boolean,
		tags set<text>,
		admins set<uuid>,
		order int,
		PRIMARY KEY (id)
	)`).Exec(); err != nil {

		log.Fatal("create stations TABLE err : ", err)
	}
	/*
		if err := db.Session.Query(`CREATE INDEX ON users(password)`).Exec(); err != nil {

			log.Fatal("create INDEX on users err : ", err)
		} */

	fmt.Println("stations TABLE CREATED")
}
