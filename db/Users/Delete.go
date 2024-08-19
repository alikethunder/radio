package Users

import (
	"web_project/db"
	Types "web_project/types"
	//"time"
	/*
		"fmt"

		"github.com/gocql/gocql" */)

func Delete(user Types.Map) error {
	if err := db.Session.Query(`DELETE FROM users WHERE id=? AND email=?`, user["id"], user["email"]).Exec(); err != nil {
		return err
	}
	return nil
}
