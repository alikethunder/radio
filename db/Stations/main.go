package Stations

import (
	"log"
	"web_project/db"
)

/*
	id uuid, 										station id
	name text,  								station name
	description_en text, 				station en description
	description_ru text, 				station ru description
	avatar blob, 								station icon image
	background blob, 						station background image
	broadcasting boolean, 			on/off
	tags set<text>,							station tags
	admins set<uuid>, 					who can alter station
	render_order smallint,			order of stations to render
	likes set<text>,						uuid of users that added to favorites
	external text,							external link
	external_enable boolean,		play from external source
*/

func Initialize() {
	if err := db.Session.Query(`CREATE TABLE IF NOT EXISTS stations (
		id uuid PRIMARY KEY,
		name text,
		description_en text,
		description_de text,
		description_sp text,
		description_fr text,
		description_pt text,
		description_ru text,
		description_ar text, description_az text, description_bg text, description_bn text, description_cs text, description_da text,  description_el text,  description_fa text, description_fi text,  description_gu text, description_hi text, description_hr text, description_hu text, description_it text, description_ja text, description_jv text, description_ko text, description_mr text, description_nl text, description_pa text, description_pl text,  description_ro text,  description_sk text,  description_sq text, description_sr text, description_su text, description_sv text, description_ta text, description_te text, description_th text, description_tr text, description_uk text, description_ur text, description_uz text, description_vi text, description_zh text,
		country text,
		languages set<text>,
		genres set<text>,
		avatar blob,
		background blob,
		broadcasting boolean,
		tags set<text>,
		admins set<text>,
		render_order smallint,
		likes set<text>,
		external text,
		external_enable boolean,
	) WITH caching = {'enabled': 'true'};`).Exec(); err != nil {

		log.Fatal("create stations TABLE err : ", err)
	}

	//fmt.Println("stations TABLE CREATED")
}
