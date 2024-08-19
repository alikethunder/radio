package Users

import (
	Types "web_project/types"

	"errors"
	//"time"
)

func Insert(u Types.Map) (Types.Map, error) {

	/* if err := db.Session.Query(`INSERT INTO users (id, name, email) VALUES (?, ?, ?)`, u["id"], user["name"], user["email"]).Exec(); err != nil {
		return nil, err
	} */

	return nil, errors.New("email exists")
}
