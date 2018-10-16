import { HOST } from './api'

const wsUrl = `ws://${HOST}/events/cui`
let attempts = 1


export function setupWebsocket(callbacks) {
  let websocket = new WebSocket(wsUrl)
  websocket.onopen = () => {
    console.log('Websocket connected')
    attempts = 1
  };

  websocket.onmessage = evt => {
    console.log('Socket data',evt.data)
    handleSocketMessage(JSON.parse(evt.data), callbacks)
  };

  websocket.onclose = () => {
    let time = Math.min(30, (attempts * 2)) * 1000
    console.log('Websocket disconnected, attempting reconnect in ',time,'ms (try #'+attempts+')');
    setTimeout(() => {
      attempts += 1
      setupWebsocket(callbacks)
    }, time)
  }
}

function handleSocketMessage(data, callbacks) {
    const { id, type, msgType } = data

    console.log('trouble:',id, msgType, type)
    switch(msgType) {
      case 'beverageChange': {
        callbacks.onBeverageChanged && callbacks.onBeverageChanged()
        break
      }
      case 'door': {
        if (data.anyDoorOpen) {
          window.location.href = `/app/ncui/index.html`
        }
        break;
      }
      default:
        console.log('No way to handle socket message of type', msgType, 'id',id)
    }
}
