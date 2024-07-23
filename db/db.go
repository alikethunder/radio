package db
 
import (
	"fmt"

	"github.com/gocql/gocql"
)

var Session *gocql.Session

func init() {
	var err error
	//
	/* run the following command from cqlsh
	from terminal:
	$ docker exec -it scylla_vercontrack cqlsh
	
	CREATE KEYSPACE IF NOT EXISTS app WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor': 1};
	*/
	cluster := gocql.NewCluster("localhost")
 
	cluster.Keyspace = "app"

	Session, err = cluster.CreateSession()
	if err != nil {
		panic(err)
	}

	Session.Query("CREATE KEYSPACE IF NOT EXISTS app WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor': 1}").Exec()

	fmt.Println("db initialized sucessfully")

}
