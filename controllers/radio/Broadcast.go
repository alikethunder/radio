package RadioEndpoints

import (
	//"bytes"

	//"io"

	"bufio"
	"log"
	"web_project/radio"

	"github.com/gofiber/fiber/v2"
)

func Broadcast(ctx *fiber.Ctx) error {
	ctx.Set(fiber.HeaderContentType, "audio/mpeg")

	ctx.Set(fiber.HeaderConnection, fiber.HeaderKeepAlive)

	connection := &radio.Connection{BufferChannel: make(chan []byte), Buffer: make([]byte, radio.BUFFERSIZE)}

	radio.ConnPool.AddConnection(connection)

	host := ctx.Request().Host()

	log.Printf("%s has connected to the audio stream\n", host)

	ctx.Context().SetBodyStreamWriter(func(w *bufio.Writer) {
		for {

			buf := <-connection.BufferChannel

			if _, err := w.Write(buf); err != nil {

				radio.ConnPool.DeleteConnection(connection)

				log.Printf("%s's connection to the audio stream has been closed\n", host)

				return

			}
			w.Flush()

			clear(connection.Buffer)

		}
	})

	//radio.ConnPool.DeleteConnection(connection)

	return nil

}
