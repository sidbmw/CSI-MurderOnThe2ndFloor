import { runPlotly } from './plotly.js'
import { runPlotly3D } from './plotly3D.js'

(function() {
  const uploadWrap = document.getElementById('upload-wrap')
  const form = document.getElementById('form')
  const room = document.getElementById('room')
  const landingView = document.getElementById('landing_page')
  const analyzeView = document.getElementById('level1')
  let currentView = landingView

  analyzeView.style.display = 'none'

  document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', uploadData)
  })

  const changeView = (view, roomNumber) => {
    currentView.style.display = 'none'
    currentView = view
    currentView.style.display = 'block'
    runPlotly();
    runPlotly3D(roomNumber);
  }

  let dataset, roomNumber

  const uploadData = e => {
    roomNumber = room.value.trim()
    room.value = ''

    // ajax call
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('CSI: upload successful')
          changeView(analyzeView, roomNumber)
        } else if (xhr.status === 500) {
          console.error(error)
        }
      }
    }
    xhr.open('POST', `/upload/dataset`)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    xhr.send(JSON.stringify({data: dataset}))

    e.preventDefault()
    e.stopPropagation()
  }


  // file handle
  let fileName

  const updateFileName = (name) => {

    const ss = document.querySelector('.file-custom')
    console.log(ss)

    // const fileReadyName = document.querySelector('.file-ready-name')
    // fileReadyName.textContent = name
  }

  const onChange = event => {
    const reader = new FileReader()
    reader.onload = onReaderLoad
    fileName = event.target.files[0].name
    reader.readAsText(event.target.files[0])
  }

  const onReaderLoad = event => {
    dataset = event.target.result
    updateFileName(fileName)
    console.log('CSI: upload ready')
  }

  document.getElementById('file').addEventListener('change', onChange)
})()
