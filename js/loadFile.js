// Load file
const loadFile = () => {
  const file = document.getElementById('hiddenFile').files[0]
  const reader = new FileReader()

  reader.readAsText(file)

  reader.onload = () => {
    console.log(reader.result)
  }

  reader.onerror = () => {
    console.log(reader.error)
  }
}

// Button click to load file
const buttonUpload = () => {
  const hiddenInput = document.getElementById('hiddenFile')
  hiddenInput.click()
}