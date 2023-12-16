package functions

import (
	"fmt"
	"runtime/debug"
)

func Recovery(where string) {
	if r := recover(); r != nil {
		//fmt.Println(where, " recover : ", r)
		fmt.Println("stacktrace from panic: \n" + string(debug.Stack()))
		fmt.Println(where, " error : ", r)
	}
}
