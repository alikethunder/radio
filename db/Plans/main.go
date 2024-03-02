package DBPlans

import (
	"fmt"
	"log"
	"web_project/db"
)

/*
	name text, name of plan
		priority int, priority to render
		options list<map<text, text>>, options (name, value, priority)
		price list<map<text, text>> prices for month, year, etc. (name, value, priority)
*/

func Initialize() {

	if err := db.Session.Query(`CREATE TYPE IF NOT EXISTS pricing_plan_option (
		name text,
		value int,
		priority int,
	)`).Exec(); err != nil {
		log.Fatal("create type pricing_plan_option error : ", err)
	}

	if err := db.Session.Query(`CREATE TYPE IF NOT EXISTS pricing_plan_price (
		name text,
		value float,
		priority int,
	)`).Exec(); err != nil {
		log.Fatal("create type pricing_plan_price error : ", err)
	}

	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS pricing_plans (
		name text,
		priority int,
		options list<frozen<pricing_plan_option>>,
		prices list<frozen<pricing_plan_price>>,
		PRIMARY KEY (name)
	)`).Exec(); err != nil {

		log.Fatal("create pricing_plans TABLE err : ", err)
	}

	fmt.Println("pricing_plans TABLE CREATED")

	if err := db.Session.Query(`UPDATE pricing_plans 
	SET priority = 0,
	 		options = [{
				name: 'projects',
				value: 1,
				priority: 0
			},{
				name: 'components',
				value: 20,
				priority: 1
			},{
				name: 'users',
				value: 2,
				priority: 2
			}],
			prices = [{
				name: 'month',
				value: 0,
				priority: 0
			},{
				name: 'year',
				value: 0,
				priority: 1
			}]
	WHERE name='free'`).Exec(); err != nil {

		log.Fatal("update pricing plan small err : ", err)

	}

	if err := db.Session.Query(`UPDATE pricing_plans 
	SET priority = 1,
	 		options = [{
				name: 'projects',
				value: 3,
				priority: 0
			},{
				name: 'components',
				value: 50,
				priority: 1
			},{
				name: 'users',
				value: 10,
				priority: 2
			}],
			prices = [{
				name: 'month',
				value: 30,
				priority: 0
			},{
				name: 'year',
				value: 300,
				priority: 1
			}]
	WHERE name='small'`).Exec(); err != nil {

		log.Fatal("update pricing plan small err : ", err)

	}

	if err := db.Session.Query(`UPDATE pricing_plans 
	SET priority = 2,
	 		options = [{
				name: 'projects',
				value: 10,
				priority: 0
			},{
				name: 'components',
				value: 100,
				priority: 1
			},{
				name: 'users',
				value: 35,
				priority: 2
			}],
			prices = [{
				name: 'month',
				value: 100,
				priority: 0
			},{
				name: 'year',
				value: 1000,
				priority: 1
			}]
	WHERE name='medium'`).Exec(); err != nil {

		log.Fatal("update pricing plan medium err : ", err)

	}

	if err := db.Session.Query(`UPDATE pricing_plans 
	SET priority = 3,
	 		options = [{
				name: 'projects',
				value: 100,
				priority: 0
			},{
				name: 'components',
				value: 10000,
				priority: 1
			},{
				name: 'users',
				value: 10000,
				priority: 2
			}],
			prices = [{
				name: 'month',
				value: 300,
				priority: 0
			},{
				name: 'year',
				value: 3000,
				priority: 1
			}]
	WHERE name='enterprise'`).Exec(); err != nil {

		log.Fatal("update pricing plan enterprise err : ", err)

	}
}
