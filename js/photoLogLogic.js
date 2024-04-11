const resetPhoto = () => {
  document.getElementById('photoSuccessfullyAdded').checked = false
  if (document.getElementById('hiddenFile').value) {
    document.getElementById('hiddenFile').value = ''
  }
}

const photoUpload = () => {
  const hiddenInput = document.getElementById('hiddenFile')
  hiddenInput.click()
}

const updateRadio = () => {
  const file = document.getElementById('hiddenFile').files[0]
  const acceptableFileTypes = [
    "image/png",
    "image/jpeg"
  ]
  if (!acceptableFileTypes.includes(file.type)) {
    console.error(`Invalid File Type: ${file.type} is not an acceptable file type`)
    document.getElementById('photoSuccessfullyAdded').checked = false
    file.value = ''
    return
  }
  document.getElementById('photoSuccessfullyAdded').checked = true
}

const addPhoto = () => {
  if(!document.getElementById('photoSuccessfullyAdded').checked) {
    window.alert('Please upload a photo before pressing "Add"')
    return
  }

  // Grab File and create id
  const id = self.crypto.randomUUID()
  const file = document.getElementById('hiddenFile').files[0]

  // Grab comment and reset it
  const photoComments = document.getElementById('photoComments').value
  document.getElementById('photoComments').value = ''
  document.getElementById('photoSuccessfullyAdded').checked = false

  // Create preview
  const container = createElement('div', { className: 'row' })
  const checkbox = createElement('input', {
    class: 'form-check-input',
    type: 'checkbox',
    id
  })
  const label = createElement('label', {
    class: 'form-check-label col-md-12',
    for: id
  })
  const image = createElement('img', {
    class: 'form-check-label',
    src: URL.createObjectURL(file),
    'width': "50px",
    'height': "50px"
  })

  const hiddenText = createElement('textarea', {
    class: 'hideMe'
  }, photoComments)

  container.appendChild(checkbox)
  label.appendChild(image)
  container.appendChild(label)
  container.appendChild(hiddenText)
  document.getElementById('show-photos').appendChild(container)

  updateTotalPhotos()
}

const deletePhoto = () => {
  const container = document.getElementById('show-photos')
  for(let i = 0; i < container.children.length; i++) {
    for(let j = 0; j < container.children[i].children.length; j++) {
      if(container.children[i].children[j].checked) {
        container.children[i].remove()
        i--
        break
      }
    }
  }
  updateTotalPhotos()
}

const downloadPhotoLog = async () => {
  // Grab all data
  const data = {
    imageSrc: [],
    comments: [],
    officerReporting: document.getElementById("officerReporting").value,
    ihsCase: document.getElementById("ihsCase").value,
    omnigoNumber: document.getElementById("omnigoNumber").value,
    drNumber: document.getElementById("drNumber").value,
    datetimeOccured: document.getElementById("datetimeOccured").value
  }

  const allImages = document.getElementById('show-photos')
  for (let i = 0; i < allImages.children.length; i++) {
    const child = allImages.children[i]
    for (let j = 0; j < child.children.length; j++) {
      const info = child.children[j]
      if (info.tagName === 'LABEL') {
        data.imageSrc.push(info.children[0].src)
      }
      if (data.tagName === 'TEXTAREA') {
        info.comments.push(info.value)
      }
    }
  }
  
  if (data.imageSrc.length === 0) {
    return
  }

  const pdf = await createPhotoLog(data)
  pdf.save(`photo-log-${data.ihsCase}.pdf`)
}
