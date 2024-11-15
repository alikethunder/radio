package db

import (
	"fmt"

	"github.com/getsentry/sentry-go"
	"github.com/gocql/gocql"
)

var Session *gocql.Session

func init() {
	var err error

	cluster := gocql.NewCluster("localhost")

	cluster.Keyspace = "app"

	Session, err = cluster.CreateSession()
	if err != nil {
		sentry.CaptureException(err)
	}

	Session.Query("CREATE KEYSPACE IF NOT EXISTS app WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor': 1}").Exec()

	fmt.Println("db initialized sucessfully")

}
