package cookies

const (
	//a week
	MaxAge         = 7 * 86400
	AuthCookieName = "auth"
	UserCookieName = "user"
)

var HmacSampleSecret = []byte("xJiG3VInQMRESfLKvAWNhvoYumbOyZ3tkc7k2NdqyKpSu-gvTz_6ZSkTAuM5")

/* auth cookie

fiber.Map{"email": req_json["email"], "rememberme": req_json["rememberme"], "id": user["id"]}
*/
