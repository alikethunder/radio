package db

import "github.com/gocql/gocql"

var Cluster = gocql.NewCluster("localhost")
