package Genres

import (
	"log"
	"web_project/db"
)

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS genres (
		en text PRIMARY KEY,
		sp text,
		fr text,
		ru text,
		pt text,
		de text,
		icon text,
		color text
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create genres TABLE err : ", err)
	}

	//fmt.Println("genres TABLE CREATED")
}
