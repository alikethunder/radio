package Countries

import (
	"fmt"
	"log"
	"web_project/db"
)

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS countries (
		en text PRIMARY KEY,
		sp text,
		fr text,
		ru text,
		pt text,
		de text,
		flag text
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create countries TABLE err : ", err)
	}

	fmt.Println("countries TABLE CREATED")
}
