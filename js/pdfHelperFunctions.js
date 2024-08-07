// Height workaround
let heightDiff = 0

// Font Sizes
const defaultFontSize = 10
const titleFontSize = 20
const subTitleFontSize = 16
const sectionHeaderFontSize = 12

// Font Styles
const fontNormal = ['times', 'normal']
const fontBold = ['times', 'bold']
const fontItalizedBold = ['times', 'bolditalic']

// Gives x-coordinate to align text center
const alignCenter = (text) => {
  const textWidth = doc.getTextDimensions(text).w
  return (doc.internal.pageSize.width - textWidth) / 2
}

// Gives x-coordinate to align text right
const alignRight = (text) => {
  const textWidth = doc.getTextDimensions(text).w
  return rightX = doc.internal.pageSize.width - rightMargin - textWidth
}

// Height spacing for rectangles
const rectH = (textHeight) => {
  return textHeight + 2
}

// Width spacing for rectangles
const rectW = (textWidth) => {
  return textWidth + 4
}

// Add Text
const addText = (text, x) => {
  doc.text(text, x, y)
  y += doc.getTextDimensions(text).h
}

// Add Header rectangle
const addHeaderRectangle = (sizing, text) => {
  const rectWidth = rectW(doc.getTextDimensions(sizing).w)
  const rectHeight = rectH(doc.getTextDimensions(sizing).h)

  doc.rect(doc.internal.pageSize.width - rightMargin - rectWidth, y, rectWidth, rectHeight)
  doc.text(text, alignRight(sizing + ' '), y + rectHeight / 2, { align: 'left', baseline: 'middle' })
  y += 6
}

const addPhotoLog = (data, index, width, leftBound, centerBound) => {
  const boundToUse = index % 2 === 0 ? leftBound : centerBound

  const initialY = y
  y += 6
  const imageHeight = 70
  const imageWidth = 70
  const textLeftBoundary = boundToUse + 2;
  const textRightBoundary = boundToUse + width - 4

  doc.setFontSize(sectionHeaderFontSize)

  // Counter
  addText(`Image #${index + 1}`, textLeftBoundary)
  y += 1

  // Comments
  doc.setFont(...fontBold)
  y = wrapText(data.comments[index], textLeftBoundary, textRightBoundary, true)
  doc.setFont(...fontNormal)

  const imageLeftPlacement = textLeftBoundary + (textRightBoundary - textLeftBoundary - imageWidth) / 2 

  // Image
  const image = new Image()
  image.src = data.imageSrc[index]
  doc.addImage(image, 'JPEG', imageLeftPlacement, y + 1, imageWidth, imageHeight)

  y += imageHeight - initialY + 2

  if (index % 2 === 0) {
    const currentHeight = y
    let heightToUse = y
    if (data.imageSrc[index + 1]) {
      y = initialY + 6 + doc.getTextDimensions('nom').h + 1
      y = wrapText(data.comments[index + 1], textLeftBoundary, textRightBoundary, false)
      y += imageHeight - initialY + 2

      heightToUse = currentHeight > y ? currentHeight : y
      heightDiff = heightToUse - y
      doc.rect(centerBound, initialY, width, heightToUse)
    }
    doc.rect(leftBound, initialY, width, heightToUse)
    return initialY
  }

  const returnMe = y + initialY + heightDiff
  heightDiff = 0
  return returnMe
}

// Create Header
const addHeader = (headerTexts) => {
  // Header
  doc.setFont(...fontBold)
  doc.setFontSize(titleFontSize)
  addText(headerTexts.headerText, alignCenter(headerTexts.headerText))

  // Sub Header
  doc.setFontSize(subTitleFontSize)
  addText(headerTexts.subHeaderText, alignCenter(headerTexts.subHeaderText))

  // Top Right Boxes
  doc.setFont(...fontNormal)
  doc.setFontSize(sectionHeaderFontSize)

  let longestWidth = 0
  headerTexts.boxes.forEach((box, i) => {
    if (rectW(doc.getTextDimensions(box).w) > rectW(doc.getTextDimensions(longestWidth).w)) {
      longestWidth = headerTexts.boxes[i]
    }
  })

  headerTexts.boxes.forEach(box => {
    addHeaderRectangle(longestWidth, box)
  })

  y += 1
}

// Create Section Headers
const addSectionHeader = (text) => {
  const textHeight = doc.getTextDimensions(text).h
  const rectWidth = doc.internal.pageSize.width - leftMargin - rightMargin
  const rectHeight = rectH(textHeight)

  doc.rect(leftMargin, y, rectWidth, rectHeight)

  const splitX = leftMargin + 0.31 * rectWidth
  doc.line(splitX, y, splitX, y + rectHeight)

  doc.setFontSize(sectionHeaderFontSize)
  doc.setFont(...fontItalizedBold)
  doc.text(text, leftMargin + 2, y + rectHeight / 2, { align: 'left', baseline: 'middle' })
  doc.setFontSize(defaultFontSize)
  doc.setFont(...fontNormal)
  y += 10
}

// Add Row
const addRow = (divider, texts, fonts) => {
  const dividers = Object.keys(divider)
  if (dividers.length !== texts.length || dividers.length !== fonts.length) {
    console.error('Something went wrong...')
    return
  }

  for(let i = 0; i < dividers.length; i++) {
    doc.setFont(...fonts[i])
    doc.text(texts[i], divider[dividers[i]], y)
  }
  doc.setFont(...fontNormal)
  y += 4
}

// Wrap Text
const wrapText = (text, x1, x2, shouldPrint, headerTexts, sectionHeader) => {
  const lineHeight = doc.getTextDimensions(text).h

  const paragraphs = text.split('\n')

  for (const paragraph of paragraphs) {
    const words = paragraph.split(' ');
    let line = '';
    let yPosition = y;

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const width = doc.getTextDimensions(line + word).w

      if (width < x2 - x1) {
        line += (line === '' ? '' : ' ') + word;
      } else {
        shouldPrint && doc.text(line, x1, yPosition);
        line = word;
        yPosition += lineHeight;
        if (yPosition > doc.internal.pageSize.height - 30) {
          doc.addPage()
          y = topMargin
          addHeader(headerTexts)
          addSectionHeader(sectionHeader)
          yPosition = y
        }
      }
    }
    shouldPrint && doc.text(line, x1, yPosition)
    y = yPosition + lineHeight
  }

  return y + 4
}

// Create Checkbox
const addCheckbox = (xPlacement, isChecked, text) => {
  doc.setFontSize(defaultFontSize)
  const textHeight = doc.getTextDimensions('nom').h
  doc.rect(xPlacement, y - textHeight, textHeight, textHeight)
  if (isChecked) {
    const split = xPlacement + .3 * textHeight
    const padding = .5
    doc.line(xPlacement + padding, y - .5 * textHeight, split, y - padding)
    doc.line(split, y - padding , xPlacement + textHeight - padding, y - textHeight + padding)
  }
  doc.text(text, xPlacement + 1.5 * textHeight, y - 1)
}

// Check if need new page, if yes add page and reset y
const needNewPage = (cutOff, headerTexts, sectionHeader) => {
  if (y < cutOff ) {
    return false
  }

  // Add new page and re-add header
  doc.addPage()
  y = topMargin
  addHeader(headerTexts)
  sectionHeader && addSectionHeader(sectionHeader)
  return true
}

// New Page Photos
const needNewPagePhotos = (headerTexts, data) => {
  needNewPage(0, headerTexts)
  photoDates(data)
}

// Add dates to top of Photo Log
const photoDates = (data) => {
  const d = new Date()
  const dateTimeLocalValue = (new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString()).slice(0, -1).split(':')
  const finalDate = dateTimeLocalValue[0] + ':' + dateTimeLocalValue[1]

  doc.setFontSize(defaultFontSize)
  addRow(datesX, ['Incident Occured On:', data.datetimeOccured === '' ? '' : cleanDate(data.datetimeOccured)], [fontNormal, fontBold])
  addRow(datesX, ['Report Created On:', cleanDate(finalDate)], [fontNormal, fontBold])
}
