package db

import (
	"fmt"

	"github.com/gocql/gocql"
)

var Session *gocql.Session

func init() {
	var err error

	cluster := gocql.NewCluster("localhost")

	cluster.Keyspace = "app"

	Session, err = cluster.CreateSession()
	if err != nil {
		panic(err)
	}

	fmt.Println("db initialized sucessfully")

}
