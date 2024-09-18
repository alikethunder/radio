package functions

import "strings"

// creates table_id as "{table}_{parent_table_id}"
func TableId(table, parent_table_id string) string {
	return table + "_" + strings.ReplaceAll(parent_table_id, "-", "_")
}
