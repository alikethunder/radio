package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"crypto/tls"
	"web_project/db"
	DBPlans "web_project/db/Plans"
	"web_project/db/StationCounters"
	"web_project/db/StationTags"
	"web_project/db/Stations"
	Users "web_project/db/Users"

	"web_project/controllers"
	AuthEndpoints "web_project/controllers/auth"
	FilesEndpoints "web_project/controllers/files"
	ProfileEndpoints "web_project/controllers/profile"
	RadioEndpoints "web_project/controllers/radio"
	StationTagsEndpoints "web_project/controllers/tags"
	TranslationEndpoints "web_project/controllers/translations"

	"web_project/functions"
	"web_project/mailer"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/etag"
	"github.com/gofiber/template/html/v2"
	"golang.org/x/crypto/acme/autocert"

	"github.com/getsentry/sentry-go"
	sentryfiber "github.com/getsentry/sentry-go/fiber"
	"github.com/goccy/go-json"
	_ "github.com/joho/godotenv/autoload"
)

func init() {
	//initializers.LoadEnvVars()
	Users.Initialize()
	DBPlans.Initialize()
	mailer.Initialize()
	Stations.Initialize()
	StationCounters.Initialize()
	StationTags.Initialize()

	if os.Getenv("ENV") == "prod" {
		// To initialize Sentry's handler, you need to initialize Sentry itself beforehand
		if err := sentry.Init(sentry.ClientOptions{
			Dsn: "https://4ba1a1068260d3de6faaa8a63420a5e5@o4508217277808640.ingest.de.sentry.io/4508218385760336",
			// Set TracesSampleRate to 1.0 to capture 100%
			// of transactions for tracing.
			// We recommend adjusting this value in production,
			TracesSampleRate: 1.0,
		}); err != nil {
			fmt.Printf("Sentry initialization failed: %v\n", err)
		}
	}
}

func main() {

	defer functions.Recovery()

	fmt.Println("start server")
	defer db.Session.Close()
	defer mailer.C.Quit()

	// Load templates
	engine := html.New(os.Getenv("TEMPL_PATH")+"/served", ".html")

	app := fiber.New(fiber.Config{
		Views:       engine,
		JSONEncoder: json.Marshal,
		JSONDecoder: json.Unmarshal,
	})

	api := app.Group("/api")
	v1 := api.Group("/v1")

	auth := v1.Group("/auth")

	auth.Post("/signup", AuthEndpoints.Signup)
	auth.Post("/verification", AuthEndpoints.Verification)
	auth.Post("/signin", AuthEndpoints.Signin)
	auth.Post("/logout", AuthEndpoints.Logout)
	auth.Post("/reset-password", AuthEndpoints.ResetPassword)
	auth.Post("/google-callback", AuthEndpoints.GoogleCallback)

	//subscriptionPlans := v1.Group("/purchase-plan")

	//subscriptionPlans.Get("/get-plans", PlansEndpoints.GetPlans)

	profile_endpoints := v1.Group("/profile")

	//get user profile by user id
	//profile_endpoints.Get("/:id")

	profile_endpoints.Get("/admin/:id", ProfileEndpoints.Admin)

	profile_endpoints.Post("/update-json", ProfileEndpoints.UpdateJson)

	profile_endpoints.Post("/update", ProfileEndpoints.Update)

	profile_endpoints.Post("/update-json", ProfileEndpoints.UpdateJson)

	profile_endpoints.Post("/request-update-email", ProfileEndpoints.RequestUpdateEmail)

	profile_endpoints.Get("/update-email/:hash", ProfileEndpoints.UpdateEmail)

	translation_endpoints := v1.Group("/translation", etag.New())

	translation_endpoints.Get("/", TranslationEndpoints.Languages)

	translation_endpoints.Get("/:language", TranslationEndpoints.TranslateBunch)

	translation_endpoints.Get("/:language/:field", TranslationEndpoints.Translate)

	files_endpoints := v1.Group("/files", etag.New())

	files_endpoints.Get("/:table/:row_id/:field", FilesEndpoints.GetFile)

	files_endpoints.Post("/:table/:row_id/:field", FilesEndpoints.Upload)

	radio_endpoints := v1.Group("/radio")

	/* fname := flag.String("filename", "audio.mp3", "path of the audio file")

	flag.Parse()

	file, err := os.Open(*fname)
	if err != nil {

		log.Fatal(err)

	}

	ctn, err := io.ReadAll(file)
	if err != nil {

		log.Fatal(err)

	}

	go radio.Stream(radio.ConnPool, ctn) */

	//radio_endpoints.Get("/broadcast/:id", RadioEndpoints.Broadcast)

	radio_endpoints.Post("/update-likes/:id", RadioEndpoints.UpdateLikes)

	radio_endpoints.Post("/update/:id", RadioEndpoints.Update)

	radio_endpoints.Get("/list", RadioEndpoints.ListStations)

	radio_endpoints.Post("/stations-by-id", RadioEndpoints.ListStationsById)

	radio_endpoints.Get("/:id", RadioEndpoints.GetStation)

	tags_endpoints := v1.Group("/tags")

	tags_endpoints.Get("/", StationTagsEndpoints.ListTags)

	tags_endpoints.Post("/", StationTagsEndpoints.SaveTags)

	if os.Getenv("ENV") == "dev" {
		app.Use("/reloadws", func(c *fiber.Ctx) error {
			// IsWebSocketUpgrade returns true if the client
			// requested upgrade to the WebSocket protocol.
			//log.Println("connection", c)
			if websocket.IsWebSocketUpgrade(c) {
				//log.Println("upgrade")
				c.Locals("allowed", true)
				return c.Next()
			}
			return fiber.ErrUpgradeRequired
		})

		app.Get("/reloadws", websocket.New(func(c *websocket.Conn) {
			// c.Locals is added to the *websocket.Conn
			//log.Println(c.Locals("allowed"))  // true
			//log.Println(c.Params("id"))       // 123
			//log.Println(c.Query("v"))         // 1.0
			//log.Println(c.Cookies("session")) // ""

			// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index
			var (
				mt  int
				msg []byte
				err error
			)
			for {
				if mt, msg, err = c.ReadMessage(); err != nil {
					log.Println("[reloadws] read err :", err)
					break
				}
				log.Printf("recv: %s", msg)

				if err = c.WriteMessage(mt, msg); err != nil {
					log.Println("[reloadws] write err :", err)
					break
				}
			}

		}))
	}

	app.Use(compress.New())

	app.Get("/", controllers.Index)

	// Configure app
	app.Static("/", os.Getenv("TEMPL_PATH")+"/served/public")
	app.Static("/", os.Getenv("TEMPL_PATH")+"/served/app_icon")

	app.Get("*", controllers.Index)

	if os.Getenv("ENV") == "prod" {
		// Later in the code
		sentryHandler := sentryfiber.New(sentryfiber.Options{
			Repanic:         true,
			WaitForDelivery: true,
		})

		app.Use(sentryHandler)
	}

	if os.Getenv("ENV") == "prod" {

		go func() {
			http.ListenAndServe(":"+os.Getenv("PORT"), http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				sentry.CaptureMessage(fmt.Sprintf("[main] r.URL, r.Host, RequestURI : %s, %s", r.URL.String(), r.Host))
				u := r.URL
				u.Scheme = "https"
				sentry.CaptureMessage(fmt.Sprintf("[main] r.URL, u.String : %s, %s", r.URL.String(), u.String()))
				http.Redirect(w, r, u.String(), http.StatusMovedPermanently)
			}))
		}()

		// Certificate manager
		m := &autocert.Manager{
			Prompt: autocert.AcceptTOS,
			// Replace with your domain
			HostPolicy: autocert.HostWhitelist("radio.best", "www.radio.best"),
			// Folder to store the certificates
			Cache: autocert.DirCache("./certs"),
		}

		// TLS Config
		cfg := &tls.Config{
			// Get Certificate from Let's Encrypt
			GetCertificate: m.GetCertificate,
			// By default NextProtos contains the "h2"
			// This has to be removed since Fasthttp does not support HTTP/2
			// Or it will cause a flood of PRI method logs
			// http://webconcepts.info/concepts/http-method/PRI
			NextProtos: []string{
				"http/1.1", "acme-tls/1",
			},
		}
		ln, err := tls.Listen("tcp", ":443", cfg)
		if err != nil {
			fmt.Println("main error : ", err)
		}
		app.Listener(ln)

	} else {
		// Start app
		err := app.Listen(":" + os.Getenv("PORT"))
		if err != nil {
			fmt.Println("main error : ", err)
		}
	}
}
