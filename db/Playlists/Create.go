package Playlists

import (
	"fmt"
	"log"
	"web_project/db"
)

/*
	id text, 								playlist_${station_id}
	track text,							track name
	artist text,						artist name
	description text,				track description
	data blob,							track blob
	image blob,							track image
	track_order int,				order in which track is played
*	links ,									links to distribution platforms
	price double,						track price
	tags set<text>,					tags
	downloads set<uuid>,		ids of users that downloaded
	downloadable boolean, 	if track can be downloaded
	video boolean,					if track is video
	duration smallint, 			track duration in secs
*/

func Create(id string) error {
	fmt.Printf("[Playlists.Create] id %s \n", id)
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS ` + id + ` (
		id text PRIMARY KEY,
		track text,
		artist text,
		description text,
		data blob,
		image blob,
		play_order smallint,
		price double,
		tags set<text>,
		downloads set<uuid>,
		downloadable boolean,
		video boolean,
		duration smallint,
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create playlist_ TABLE err : ", err)
		return err
	}

	return nil

}
