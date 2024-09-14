package functions

import (
	"strings"
)

func UuidHyphensToUnderscores(uuid string) string {

	return strings.ReplaceAll(uuid, "-", "_")
}
