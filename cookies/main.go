package cookies

const (
	//a week
	MaxAge         = 7 * 86400
	AuthCookieName = "auth"
	UserCookieName = "user"
)

var HmacSampleSecret = []byte("xJiG3VInQMRESfLKvAWNhvoYumbOyZ3tkc7k2NdqyKpSu-gvTz_6ZSkTAuM5")
