package functions

import (
	"math/rand"
	"strconv"
	"strings"
)

func Vc() string {
	//generate 8 digit code as string
	var vc strings.Builder
	for k := 1; k <= 8; k++ {
		vc.WriteString(strconv.Itoa(rand.Intn(9) + 1))
	}
	return vc.String()
}
