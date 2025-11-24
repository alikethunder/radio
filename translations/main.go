package translations

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

var Dictionary map[string]map[string]string
var Languages []string

func Init() {
	Dictionary = make(map[string]map[string]string)
	// Read all JSON files from dictionary folder
	entries, err := os.ReadDir(os.Getenv("TEMPL_PATH") + "/served/static/dictionary")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("dictionary entries : ", entries)
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		fmt.Println("dictionary entry : ", entry, entry.Name())

		if strings.HasSuffix(entry.Name(), ".json") {
			lang := strings.TrimSpace(strings.TrimSuffix(entry.Name(), ".json"))

			// Read the JSON file
			filePath := filepath.Join(os.Getenv("TEMPL_PATH")+"/served/static/dictionary", entry.Name())
			data, err := os.ReadFile(filePath)
			if err != nil {
				log.Printf("Error reading file %s: %v", filePath, err)
				continue
			}

			// Unmarshal into map
			var translations map[string]string
			err = json.Unmarshal(data, &translations)
			if err != nil {
				log.Printf("Error unmarshaling file %s: %v", filePath, err)
				continue
			}

			// Add to Dictionary
			Dictionary[lang] = translations
			Languages = append(Languages, lang)
		}
	}
	fmt.Println("len(Dictionary) : ", len(Dictionary))

}
