package functions

import (
	"strings"
)

func UuidUnderscoresToHyphens(uuid string) string {

	return strings.ReplaceAll(uuid, "_", "-")
}
