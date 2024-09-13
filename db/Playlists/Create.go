package Playlists

import (
	"fmt"
	"log"
	"web_project/db"
)

/*
	id uuid, 							track id
	name text,						track name
	description text,			track description
	data blob,						track blob
	image blob,						track image
	track_order int,						order in which track is played
*	links ,								links to distribution platforms
	price double,					track price
	tags set<text>,				tags
	downloads set<uuid>,	ids of users that downloaded
	downloadable boolean, if track can be downloaded
*/

func Create(playlist string) (string, error) {
	id := "playlist_" + playlist
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS ` + id + ` (
		id uuid,
		name text,
		description text,
		data blob,
		image blob,
		order smallint,
		price double,
		tags set<text>,
		downloads set<uuid>,
		downloadable boolean,
		PRIMARY KEY (id)
	)`).Exec(); err != nil {

		log.Fatal("create stations TABLE err : ", err)
		return "", err
	}

	fmt.Printf("playlist %s TABLE CREATED /n", id)

	return id, nil

}
