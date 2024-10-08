package translations

//!!first in list is the fallback language

var Dictionary = map[string]map[string]string{
	"en": {
		"login":                "Login",
		"language":             "language",
		"logout":               "logout",
		"profile":              "profile",
		"choose_image":         "choose image",
		"name":                 "name",
		"name_cannot_be_empty": "Name cannot be empty",
		"only_you_can_see":     "only you can see it",
		"error_email_not_real": "Please, enter your real email",
		"error_email_required": "Please, enter your email",
		"error_email_with_@":   "Enter an email that contains \"@\" Example: info@roshni.nl",
		"volume":               "volume",
		"play":                 "play",
		"pause":                "pause",
		"mute":                 "mute",
		"unmute":               "unmute",
	},
	"ru": {
		"login":                "Войти",
		"language":             "язык",
		"logout":               "выйти",
		"profile":              "профиль",
		"choose_image":         "выберите изображение",
		"name":                 "имя",
		"name_cannot_be_empty": "Имя не может быть пустым",
		"only_you_can_see":     "видно только вам",
		"error_email_not_real": "Пожалуйста, введите свой настоящий email",
		"error_email_required": "Пожалуйста, введите свой email",
		"error_email_with_@":   "Введите email содержащий \"@\" Пример: info@roshni.nl",
		"volume":               "звук",
		"play":                 "Играть",
		"pause":                "пауза",
		"mute":                 "выкл звук",
		"unmute":               "вкл звук",
	},
}
