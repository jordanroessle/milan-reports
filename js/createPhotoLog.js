// Globals
let doc = new jsPDF()
let y

// Margins
const leftMargin = 10
const rightMargin = 10
const topMargin = 20

// Width of writable area
const widthPage = doc.internal.pageSize.width - leftMargin - rightMargin

const datesX = {
  descX: leftMargin,
  dateX: leftMargin + .17 * widthPage
}

// Height addPage cutoff
const newPageCutOff = 250

const createPhotoLog = async (data) => {
  y = topMargin

  // Set Header Texts
  const headerTexts = {
    headerText: 'Idaho Humane Society - Animal Control',
    subHeaderText: 'General Photo Log',
    boxes: [
      `Officer Reporting: ${data.officerReporting}`,
      `IHS Case #: ${data.ihsCase}`,
      `Omnigo #: ${data.omnigoNumber}`,
      `DR #: ${data.drNumber}`
     ]
    }
  
  addHeader(headerTexts)
  y += 2

  photoDates(data)

  data.imageSrc.forEach((image, index) => {
    if (index !== 0 && index % 4 == 0) {
      needNewPagePhotos(headerTexts, data)
    }

    let leftBound;
    switch (index % 4) {
      case 0:
        leftBound = leftMargin
        break;
      case 1:
        leftBound = leftMargin + widthPage / 2
        break;
      case 2:
        leftBound = leftMargin
        break;
      case 3:
        leftBound = leftMargin + widthPage / 2
        break;
    }
    y = addPhotoLog({
      count: `${index + 1}`,
      comment: data.comments[index],
      image,
      leftBound,
      width: widthPage / 2,
    })
    
  })

  return doc
}
