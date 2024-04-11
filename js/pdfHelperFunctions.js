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

// Create Header
const addHeader = (headerTexts) => {
    // Header
    doc.setFont(...fontBold)
    doc.setFontSize(titleFontSize)
    addText(headerTexts.headerText, alignCenter(headerTexts.headerText))
  
    // Sub Header
    doc.setFontSize(subTitleFontSize)
    addText(headerTexts.subHeaderText, alignCenter(headerTexts.subHeaderText))
  
    doc.setFont(...fontNormal)
    doc.setFontSize(sectionHeaderFontSize)
  
    // Officer Reporting
    addHeaderRectangle(headerTexts.officerReportingText, headerTexts.officerReportingText)
  
    // IHS Case Number
    addHeaderRectangle(headerTexts.officerReportingText, headerTexts.ihsCaseText)

    // Omnigo #
    addHeaderRectangle(headerTexts.officerReportingText, headerTexts.omnigoNumber)

    // DR #
    addHeaderRectangle(headerTexts.officerReportingText, headerTexts.drNumber)
    y += 1
}

// Create Section Headers
const addSectionHeader = (text) => {
  const textHeight = doc.getTextDimensions(text).h
  const rectWidth = doc.internal.pageSize.width - leftMargin - rightMargin
  const rectHeight = rectH(textHeight)

  doc.rect(leftMargin, y, rectWidth, rectHeight)

  const splitX = leftMargin + 0.3 * rectWidth
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
const wrapText = (text) => {
  const lineHeight = doc.getTextDimensions(text).h
  const words = text.split(' ');
  let line = '';
  let yPosition = y;

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const width = doc.getTextDimensions(line + word).w

    if (width < widthPage) {
      line += (line === '' ? '' : ' ') + word;
    } else {
      doc.text(line, leftMargin, yPosition);
      yPosition += lineHeight;
      line = word;
    }
  }
  doc.text(line, leftMargin, yPosition)
  y = yPosition + 4
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
    return
  }

  // Add new page and re-add header
  doc.addPage()
  y = topMargin
  addHeader(headerTexts)
  sectionHeader ? addSectionHeader(sectionHeader) : ''
}