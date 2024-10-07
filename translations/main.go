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
	},
	"ru": {
		"login":                "Войти",
		"language":             "язык",
		"logout":               "выйти",
		"profile":              "профиль",
		"choose_image":         "выберите изображение",
		"name":                 "имя",
		"name_cannot_be_empty": "Имя не может быть пустым",
	},
}
