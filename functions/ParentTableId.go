package functions

import "strings"

// extracts parent_table_id from table_id that looks like "{table}_{parent_table_id}"
func ParentTableId(table, table_id string) string {
	return strings.ReplaceAll(
		strings.ReplaceAll(table_id, table+"_", ""),
		"_",
		"-",
	)
}
