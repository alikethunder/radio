package functions

import (
	"fmt"
	"runtime/debug"

	"github.com/getsentry/sentry-go"
)

func Recovery() {
	if r := recover(); r != nil {
		sentry.CaptureException(fmt.Errorf("[Recovery] panic error :  %v", r))
		sentry.CaptureMessage("stacktrace from panic: \n" + string(debug.Stack()))
	}
}
