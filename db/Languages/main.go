package Languages

import (
	"log"
	"web_project/db"
)

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS languages (
		en text PRIMARY KEY,
		sp text,
		fr text,
		ru text,
		pt text,
		de text
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create languages TABLE err : ", err)
	}

	//fmt.Println("languages TABLE CREATED")
}
