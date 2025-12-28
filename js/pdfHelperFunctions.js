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
  const position = index % 4
  const boundToUse = (position === 0 || position === 2) ? leftBound : centerBound

  const initialY = y
  y += 6
  const imageHeight = 70
  const imageWidth = 70
  const textLeftBoundary = boundToUse + 2;
  const textRightBoundary = boundToUse + width - 4

  doc.setFontSize(sectionHeaderFontSize)

  // Only show counter and image if imageSrc is not null
  if (data.imageSrc[index] !== null) {
    // Calculate actual image number (counting only non-null entries)
    let imageNumber = 1
    for (let i = 0; i < index; i++) {
      if (data.imageSrc[i] !== null) {
        imageNumber++
      }
    }

    // Counter
    addText(`Image #${imageNumber}`, textLeftBoundary)
    y += 1

    const imageLeftPlacement = textLeftBoundary + (textRightBoundary - textLeftBoundary - imageWidth) / 2

    // Image
    const image = new Image()
    image.src = data.imageSrc[index]
    doc.addImage(image, 'JPEG', imageLeftPlacement, y + 1, imageWidth, imageHeight)

    y += imageHeight + 6
  } else {
    // Find the previous non-null image index for the "cont..." label
    let prevImageIndex = index - 1
    while (prevImageIndex >= 0 && data.imageSrc[prevImageIndex] === null) {
      prevImageIndex--
    }

    // Calculate the actual image number (count non-null entries before prevImageIndex, then add 1)
    let imageNumber = 0
    for (let i = 0; i <= prevImageIndex; i++) {
      if (data.imageSrc[i] !== null) {
        imageNumber++
      }
    }

    addText(`Image #${imageNumber} continued`, textLeftBoundary)
    y += doc.getTextDimensions('nom').h + 1
  }

  // Comments
  const lineHeight = doc.getTextDimensions('test').h;
  const maxRows = data.imageSrc[index] ? 3 : 18;
  const maxRowHeight = lineHeight * maxRows + 1;
  const startY = y;

  const words = data.comments[index].split(' ');
  let wordCount = 0;

  // Find max words that fit within maxRows
  for (let i = 1; i <= words.length; i++) {
    y = startY; // Reset y before each test
    const testText = words.slice(0, i).join(' ');
    const resultY = wrapText(testText, textLeftBoundary, textRightBoundary, false);

    if (resultY - startY  <= maxRowHeight) {
      wordCount = i;
    } else {
      break;
    }
  }

  y = startY; // Reset y before actual print

  const splicedWords = words.slice(0, wordCount);
  const secondSplice = words.slice(wordCount);

  doc.setFont(...fontBold)
  y = wrapText(splicedWords.join(' '), textLeftBoundary, textRightBoundary, true)

  // If there are overflow words, add a new entry with null imageSrc
  if (secondSplice.length > 0) {
    data.imageSrc.splice(index + 1, 0, null)
    data.comments.splice(index + 1, 0, secondSplice.join(' '))
  }

  doc.setFont(...fontNormal)

  const finalY = y

  if (position === 0 || position === 2) {
    // Left box - store height and only draw if there's no right box
    heightDiff = finalY - initialY

    if (data.imageSrc[index + 1] === undefined) {
      const leftHeight = finalY - initialY
      const maxBoxHeight = doc.internal.pageSize.height - initialY - 20
      const heightToUse = Math.min(leftHeight, maxBoxHeight)

      doc.rect(leftBound, initialY, width, heightToUse)
    }
    return initialY
  } else {
    // Right box - draw both boxes with maximum height to cover all text
    const rightHeight = finalY - initialY
    const leftHeight = heightDiff

    // Use maximum of the two heights to ensure all text is covered
    const maxHeight = Math.max(leftHeight, rightHeight)
    const maxBoxHeight = doc.internal.pageSize.height - initialY - 20
    const heightToUse = Math.min(maxHeight, maxBoxHeight)

    // Draw both boxes
    doc.rect(leftBound, initialY, width, heightToUse)
    doc.rect(centerBound, initialY, width, heightToUse)

    heightDiff = 0

    // If this is position 1 (top right), move y down to start the bottom row
    if (position === 1) {
      return initialY + heightToUse + 6
    }

    return initialY
  }
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
        if (yPosition > doc.internal.pageSize.height - 30 && headerTexts) {
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
