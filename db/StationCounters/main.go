package StationCounters

import (
	"fmt"
	"log"
	"web_project/db"
)

/*
	id uuid, 										station id
	likes counter,							count how much people added to favorites
	listeners counter,					count how much people are listening
*/

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS station_counters (
		id uuid PRIMARY KEY,
		likes counter,
		listeners counter,
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create stations TABLE err : ", err)
	}

	fmt.Println("station_counters TABLE CREATED")
}
