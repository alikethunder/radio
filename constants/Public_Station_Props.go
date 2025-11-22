package constants

import "web_project/translations"

func Public_Station_Props() []string {

	i := 0

	languages := translations.Languages

	result := make([]string, len(Public_Station_List_Props)+len(languages))

	for _, language := range languages {
		result[i] = "description_" + language
		i++
	}

	for _, field := range Public_Station_List_Props {
		result[i] = field
		i++
	}

	return result
}
