!(function() {
    function getBibtags(document) {
        return document
               .getElementById("divbib")
               .getElementsByTagName("ul")[0]
    }

    function bibtagContents(bibTag) {
        try {
            return bibTag
                   .getElementsByTagName("a")[0]
                   .textContent
                   .trim()
        } catch (e) {
            return ""
        }
    }

    function getAuthorParts(bibtags) {
        return bibtagContents(bibtags.getElementsByClassName("bibTag")[2])
               .split(", ")
               .slice(0, -1)
    }

    function getTitle(bibtags) {
        return bibtagContents(bibtags.getElementsByClassName("bibTag")[0])
               .split(" /")[0]
    }

    function getCallNum(bibtags) {
        return bibtagContents(bibtags
                              .getElementsByClassName("oddHoldingsRow")[0]
                              .getElementsByClassName("bibTag")[1])
    }

    function getLibrary(document) {
        return document
               .getElementById("tempLocation")
               .innerHTML
               .trim()
    }

    function classifyLibrary(lib) {
        lib = lib.toLowerCase()
        const translations = {
            "koerner": "k",
            "i.k. barber": "ikb",
            "online": "online",
            "okanagan": "okanagan",
            "woodward": "wood"
        }
        for (var pattern of Object.keys(translations)) {
            if (lib.startsWith(pattern))
                return translations[pattern]
        }
        return lib
    }

    function makeBookReminder(document) {
        try {
            const bibtags = getBibtags(document)

            const authorSurname = getAuthorParts(bibtags)[0]
            const title = getTitle(bibtags)
            const callNum = getCallNum(bibtags)
            const library = getLibrary(document)
        } catch (e) {
            console.log("problem!")
            return ""
        }
        return `${classifyLibrary(library)} ${callNum} ${authorSurname}: ${title}`
    }


    // This would be nicer if we had (if-let)
    const reminder = makeBookReminder(document)
    if (reminder) {
        chrome.runtime.sendMessage({ name: reminder })
    }
})()
