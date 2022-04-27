import fetch from "node-fetch";
import fs from "fs";

const ishtar = "https://www.ishtar-collective.net"

const finalList = []

// REUSABLE FUNCTIONS

async function fetchURL(url) {
  const response = await fetch(url)
  const htmlTxt = await response.text()
  // waits until the request completes...
  return htmlTxt
}

// use for removing extra dom elements from entry text
// start at <div class="description highlightable"> ends with </div>
const getTxtFromEntry = (inArr) => {
  //is paragraph, text is always after a certain div with <p> tags
  var isP = false
  const outArr = []
  for(var i=0; i<inArr.length;i++){
    if(isP){
      inArr[i].includes('</div') ? (isP = false) : (outArr.push(inArr[i]))
    }
    else{
      if(inArr[i].includes('<div class="description highlightable">'))
        isP = true
    }
  }
  var entryTxt = outArr[0]
  //format text / inefficient af but who cares
  entryTxt = entryTxt.replace(/<\/p><p>/g, ' ')
  entryTxt = entryTxt.replace(/&#39;/g, '\'')
  entryTxt = entryTxt.replace(/&quot;/g, '"')
  entryTxt = entryTxt.replace(/<p>/g, '')
  entryTxt = entryTxt.replace(/<\/p>/g, '')
  entryTxt = entryTxt.replace(/"/g, ' ')
  entryTxt = entryTxt.replace(/\./g, ' ')
  entryTxt = entryTxt.replace(/\?/g, ' ')
  entryTxt = entryTxt.replace(/,/g, ' ')
  entryTxt = entryTxt.replace(/:/g, ' ')
  entryTxt = entryTxt.replace(/\*/g, ' ')
  entryTxt = entryTxt.replace(/'s/g, ' ')
  entryTxt = entryTxt.replace(/\'/g, '')
  entryTxt = entryTxt.replace(/!/g, ' ')
  entryTxt = entryTxt.replace(/û/g, 'u')
  entryTxt = entryTxt.replace(/-/g, ' ')
  entryTxt = entryTxt.replace(/ç/g, 'c')
  entryTxt = entryTxt.replace(/—/g, ' ')
  entryTxt = entryTxt.replace(/…/g, ' ')
  return entryTxt.toLowerCase()
}

//get all 5 letter words from str
const getFiveLetterWordArr = (entry) => {
  const wordArr = entry.split(" ")
  const fiveLetterArr = wordArr.reduce((outArr, txt) => {
    if(txt.length == 5 && !outArr.includes(txt)){
      outArr.push(txt)
    }
    return outArr
  }, [])
  return fiveLetterArr
}


// -------------------------------------------------MAIN---------------------------------
//                     GET BOOOKS
//scrape ishtar page to get all book links
const ishtarTxt = await fetchURL(ishtar+"/books")
const ishtarArr = ishtarTxt.split("\n")

//use a reducer to get rid of junk dom elements
const ishtarReduced = ishtarArr.reduce((outArr, txt) => {
  if(txt.includes("read-more")){
    outArr.push(txt)
  }
  return outArr
}, [])

//format to just book url endings
const books = ishtarReduced.map(txt => {
  const newTxt = txt.substring(44, txt.length)
  const outTxt = newTxt.substring(0,newTxt.length-19)
  return outTxt
})

//                      GET PAGES
//time to interate through books to get pages
for(var x=0; x<books.length; x++){
  console.log("fetching book: " + books[x])
  const currentBook = await fetchURL(ishtar + books[0])
  const bookArr = currentBook.split("\n")

  //use a reducer to get rid of junk dom elements
  const bookReduced = bookArr.reduce((outArr, txt) => {
    if(txt.includes('<a href="/entries/')){
      outArr.push(txt)
    }
    return outArr
  }, [])

  //format to just page url endings
  const pages = bookReduced.map(txt => {
    const newTxt = txt.substring(23, txt.length)
    const outTxt = newTxt.substring(0,newTxt.length-2)
    return outTxt
  })

  //         AT PAGE ENTRIES
  for(var i=0; i<pages.length; i++){
    console.log("fetching page: " + pages[i])
    const currentEntry = await fetchURL(ishtar + pages[i])
    const entryArr = currentEntry.split("\n")

    // add new words to main list
    getFiveLetterWordArr(getTxtFromEntry(entryArr)).reduce((outArr, word) => {
      if(!outArr.includes(word))
        outArr.push(word)
      return outArr
    }, finalList)
  }
}

// ------------ write output to file -----------------------------------------
var file = fs.createWriteStream('D2FiveLetterWords.txt');
file.on('error', function(err) { /* error handling */ });
finalList.forEach((word) => { file.write(word + ', '); });
file.end();
//console.log(finalList)
