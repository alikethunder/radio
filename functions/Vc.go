package functions

import (
	"math/rand"
	"strconv"
)

func Vc() string {
	//generate 8 digit code as string
	vc := ""
	for k := 1; k <= 8; k++ {
		vc = vc + strconv.Itoa(rand.Intn(9)+1)
	}
	return vc
}
