package translations

func Languages() []string {

	languages := make([]string, len(Dictionary))
	i := 0

	for language := range Dictionary {
		languages[i] = language
		i++
	}

	return languages
}
