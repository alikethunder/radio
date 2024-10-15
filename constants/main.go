package constants

import "web_project/translations"

func Public_Station_Props() []string {

	fields := [...]string{
		"background",
		"external",
		"external_enable",
		"id",
		"likes",
		"name",
		"render_order",
		"tags",
		"admins",
		"broadcasting",
	}

	i := 0

	languages := translations.Languages()

	result := make([]string, len(fields)+len(languages))

	for _, language := range languages {
		result[i] = "description_" + language
		i++
	}

	for _, field := range fields {
		result[i] = field
		i++
	}

	return result
}
