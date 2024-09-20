package Stations

import (
	"fmt"
	"log"
	"web_project/db"
)

/*
	id uuid, 										station id
	name text,  								station name
	description text, 					station description
	playlist uuid, 							station playlist table 'playlist_${uuid}'
	avatar blob, 								station icon image
	background blob, 						station background image
	broadcasting boolean, 			on/off
	tags set<text>,							station tags
	admins set<uuid>, 					who can alter station
	render_order smallint,			order of stations to render
	likes int,									how many times was added to favorites
	external text,							external link
	external_enable boolean,		play from external source
*/

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS stations (
		id uuid PRIMARY KEY,
		name text,
		description text,
		avatar blob,
		background blob,
		broadcasting boolean,
		tags set<text>,
		admins set<uuid>,
		render_order smallint,
		likes int,
		external text,
		external_enable boolean,
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create stations TABLE err : ", err)
	}
	/*
		if err := db.Session.Query(`CREATE INDEX ON users(password)`).Exec(); err != nil {

			log.Fatal("create INDEX on users err : ", err)
		} */

	fmt.Println("stations TABLE CREATED")
}
