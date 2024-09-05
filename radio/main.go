package radio

import (
	"bytes"
	"io"
	"sync"
	"time"
)

const (
	BUFFERSIZE = 8192

	//formula for delay = track_duration * buffer_size / aac_file_size
	DELAY = 205
)

type Connection struct {
	BufferChannel chan []byte
	Buffer        []byte
}

type ConnectionPool struct {
	ConnectionMap map[*Connection]struct{}
	mu            sync.Mutex
}

func (cp *ConnectionPool) AddConnection(connection *Connection) {

	defer cp.mu.Unlock()
	cp.mu.Lock()

	cp.ConnectionMap[connection] = struct{}{}

}

func (cp *ConnectionPool) DeleteConnection(connection *Connection) {

	defer cp.mu.Unlock()
	cp.mu.Lock()

	delete(cp.ConnectionMap, connection)

}

func (cp *ConnectionPool) Broadcast(buffer []byte) {

	defer cp.mu.Unlock()
	cp.mu.Lock()

	for connection := range cp.ConnectionMap {

		copy(connection.Buffer, buffer)

		select {

		case connection.BufferChannel <- connection.Buffer:

		default:

		}

	}

}

func NewConnectionPool() *ConnectionPool {

	connectionMap := make(map[*Connection]struct{})
	return &ConnectionPool{ConnectionMap: connectionMap}

}

func Stream(connectionPool *ConnectionPool, content []byte) {

	buffer := make([]byte, BUFFERSIZE)

	for {

		clear(buffer)

		tempfile := bytes.NewReader(content)

		ticker := time.NewTicker(time.Millisecond * DELAY)

		for range ticker.C {

			_, err := tempfile.Read(buffer)

			if err == io.EOF {

				ticker.Stop()
				break

			}

			connectionPool.Broadcast(buffer)

		}

	}

}

var ConnPool = NewConnectionPool()
