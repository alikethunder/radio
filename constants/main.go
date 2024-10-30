package constants

import "web_project/translations"

func Public_Station_Props() []string {

	fields := [...]string{
		"background",
		"external",
		"external_enable",
		"id",
		"name",
		"render_order",
		"tags",
		"admins",
		"broadcasting",
	}

	i := 0

	languages := translations.Languages()

	result := make([]string, len(fields)+2*len(languages))

	for _, language := range languages {
		result[i] = "description_" + language
		i++
		result[i] = "text_description_" + language
		i++
	}

	for _, field := range fields {
		result[i] = field
		i++
	}

	return result
}
