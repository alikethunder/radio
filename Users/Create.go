package Users

import (
	"errors"
	"fmt"
	"go_react_starter/db"
	"time"

	"github.com/gocql/gocql"
)

func Create(user User) (User, error) {

	tm := time.Now()
	fmt.Println("Create user : ", user)
	var u User
	var existing_email string

	db.Session.Query("SELECT Email FROM users WHERE Email = ? LIMIT 1 ALLOW FILTERING", user.Email).Scan(&existing_email)

	if existing_email != user.Email {
		//new user

		fmt.Println("create user check existing_email : ", existing_email)

		if err := db.Session.Query("INSERT INTO users (Id, Name, Email, Updated) VALUES (?, ?, ?, ?)", gocql.TimeUUID(), user.Name, user.Email, tm).Exec(); err != nil {
			return User{}, err
		}

		//return GetByParameter

	} else {
		return User{}, errors.New("email exists")
	}

	//fmt.Println("inserted user : ", u)

	return u, nil
}
