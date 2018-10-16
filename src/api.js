const BASE = '/api'

const fetchBeverages = ()=>{
  return new Promise( (resolve, reject)=> {
    fetchJson(`${BASE}/beverages/availabilities`)
    .then( handleResponse(resolve,reject) )
  })
}

const setBeverage = (id)=>{
  return new Promise( (resolve, reject)=> {
    fetchJson(`${BASE}/pour/beverages/${id}/select`, { method: 'POST' })
    .then( handleResponse(resolve,reject) )
  })
}

const startPour = ()=>{
  return new Promise( (resolve, reject)=> {
    fetchJson(`${BASE}/pour/start`, { method: 'POST' })
    .then( handleResponse(resolve,reject) )
  })
}

const stopPour = ()=>{
  return new Promise( (resolve, reject)=> {
    fetchJson(`${BASE}/pour/stop`, { method: 'POST' })
    .then( handleResponse(resolve,reject) )
  })
}

export default {
  fetchBeverages,
  setBeverage,
  startPour,
  stopPour
}

const HOST = window.location.host

export { HOST }

// -------------------------------------- utility functions
function fetchJson(url, options = {}) {
  url = `//${HOST}${url}`
  options.headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json'
  }
  options.credentials = 'include'
  return fetch(url, options)
  .then( (response)=> {
    try {
      return response.json()
    }
    catch (e) {
      console.error('Unable to parse JSON response', e)
      throw new Error(response.text())
    }
  })
}

function handleResponse(resolve, reject) {
  return (json)=> {
    if (json.code === 0 && json.message === 'success') {
      resolve(json.data)
    }
    else {
      reject(json.message, json.code)
    }
  }
}
