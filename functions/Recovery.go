package functions

import (
	"fmt"
	"runtime/debug"
)

func Recovery() {
	if r := recover(); r != nil {
		fmt.Println("panic error : ", r)
		fmt.Println("stacktrace from panic: \n" + string(debug.Stack()))
	}
}
