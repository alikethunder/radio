package History

import (
	"log"
	"web_project/db"
)

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS history (
		id uuid,
		user_id uuid,
		station_id uuid,
		date text,
		PRIMARY KEY (user_id, id)
	)`).Exec(); err != nil {

		log.Fatal("create history TABLE err : ", err)
	}

	//fmt.Println("users TABLE CREATED")
}
