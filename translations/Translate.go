package translations

func Translate(field, language string) string {

	if field != "" && language != "" {

		var translation string

		translation, ok := Dictionary[language][field]

		if !ok {
			translation = Dictionary["en"][field]
		}

		return translation
	}

	return ""
}
