package StationTags

import (
	"log"
	"web_project/db"
)

/*
	name text,  								tag name
	color text, 								tag color
*/

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS station_tags (
		name text PRIMARY KEY,
		color text
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create tags TABLE err : ", err)
	}

	//fmt.Println("tags TABLE CREATED")
}
