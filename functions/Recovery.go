package functions

import "fmt"

func Recovery() {
	if r := recover(); r != nil {
		fmt.Println("[GoogleCallback] error : ", r)
	}
}
