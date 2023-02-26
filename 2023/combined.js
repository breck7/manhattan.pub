class Timer {
    constructor() {
      this._tickTime = Date.now() - (Utils.isNodeJs() ? 1000 * process.uptime() : 0)
      this._firstTickTime = this._tickTime
    }
    tick(msg) {
      const elapsed = Date.now() - this._tickTime
      if (msg) console.log(`${elapsed}ms ${msg}`)
      this._tickTime = Date.now()
      return elapsed
    }
    getTotalElapsedTime() {
      return Date.now() - this._firstTickTime
    }
  }
  class Utils {
    static getFileExtension(filepath = "") {
      const match = filepath.match(/\.([^\.]+)$/)
      return (match && match[1]) || ""
    }
    static runCommand(instance, command = "", param = undefined) {
      const run = name => {
        console.log(`Running ${name}:`)
        instance[name](param)
      }
      if (instance[command + "Command"]) return run(command + "Command")
      const allCommands = Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter(word => word.endsWith("Command"))
      allCommands.sort()
      const commandAsNumber = parseInt(command) - 1
      if (command.match(/^\d+$/) && allCommands[commandAsNumber]) return run(allCommands[commandAsNumber])
      console.log(`\n❌ No command provided. Available commands:\n\n` + allCommands.map((name, index) => `${index + 1}. ${name.replace("Command", "")}`).join("\n") + "\n")
    }
    static removeReturnChars(str = "") {
      return str.replace(/\r/g, "")
    }
    static removeEmptyLines(str = "") {
      return str.replace(/\n\n+/g, "\n")
    }
    static shiftRight(str = "", numSpaces = 1) {
      let spaces = " ".repeat(numSpaces)
      return str.replace(/\n/g, `\n${spaces}`)
    }
    static getLinks(str = "") {
      const _re = new RegExp("(^|[ \t\r\n])((ftp|http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))", "g")
      return str.match(_re) || []
    }
    // Only allow text content and inline styling. Don't allow HTML tags or any nested scroll tags or escape characters.
    static escapeScrollAndHtml(content = "") {
      return content
        .replace(/</g, "&lt;")
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/\\/g, "")
    }
    static ensureDelimiterNotFound(strings, delimiter) {
      const hit = strings.find(word => word.includes(delimiter))
      if (hit) throw `Delimiter "${delimiter}" found in hit`
    }
    // https://github.com/rigoneri/indefinite-article.js/blob/master/indefinite-article.js
    static getIndefiniteArticle(phrase) {
      // Getting the first word
      const match = /\w+/.exec(phrase)
      let word
      if (match) word = match[0]
      else return "an"
      var l_word = word.toLowerCase()
      // Specific start of words that should be preceded by 'an'
      var alt_cases = ["honest", "hour", "hono"]
      for (var i in alt_cases) {
        if (l_word.indexOf(alt_cases[i]) == 0) return "an"
      }
      // Single letter word which should be preceded by 'an'
      if (l_word.length == 1) {
        if ("aedhilmnorsx".indexOf(l_word) >= 0) return "an"
        else return "a"
      }
      // Capital words which should likely be preceded by 'an'
      if (word.match(/(?!FJO|[HLMNS]Y.|RY[EO]|SQU|(F[LR]?|[HL]|MN?|N|RH?|S[CHKLMNPTVW]?|X(YL)?)[AEIOU])[FHLMNRSX][A-Z]/)) {
        return "an"
      }
      // Special cases where a word that begins with a vowel should be preceded by 'a'
      const regexes = [/^e[uw]/, /^onc?e\b/, /^uni([^nmd]|mo)/, /^u[bcfhjkqrst][aeiou]/]
      for (var i in regexes) {
        if (l_word.match(regexes[i])) return "a"
      }
      // Special capital words (UK, UN)
      if (word.match(/^U[NK][AIEO]/)) {
        return "a"
      } else if (word == word.toUpperCase()) {
        if ("aedhilmnorsx".indexOf(l_word[0]) >= 0) return "an"
        else return "a"
      }
      // Basic method of words that begin with a vowel being preceded by 'an'
      if ("aeiou".indexOf(l_word[0]) >= 0) return "an"
      // Instances where y follwed by specific letters is preceded by 'an'
      if (l_word.match(/^y(b[lor]|cl[ea]|fere|gg|p[ios]|rou|tt)/)) return "an"
      return "a"
    }
    static htmlEscaped(content = "") {
      return content.replace(/</g, "&lt;")
    }
    static isValidEmail(email = "") {
      return email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    }
    static capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    // generate a random alpha numeric hash:
    static getRandomCharacters(len) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
      let result = ""
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
      }
      return result
    }
    static isNodeJs() {
      return typeof exports !== "undefined"
    }
    static findProjectRoot(startingDirName, projectName) {
      const fs = require("fs")
      const getProjectName = dirName => {
        if (!dirName) throw new Error(`dirName undefined when attempting to findProjectRoot for project "${projectName}" starting in "${startingDirName}"`)
        const parts = dirName.split("/")
        const filename = parts.join("/") + "/" + "package.json"
        if (fs.existsSync(filename) && JSON.parse(fs.readFileSync(filename, "utf8")).name === projectName) return parts.join("/") + "/"
        parts.pop()
        return parts
      }
      let result = getProjectName(startingDirName)
      while (typeof result !== "string" && result.length > 0) {
        result = getProjectName(result.join("/"))
      }
      if (result.length === 0) throw new Error(`Project root "${projectName}" in folder ${startingDirName} not found.`)
      return result
    }
    static titleToPermalink(str) {
      return str
        .replace(/[\/\_\:\\\[\]]/g, "-")
        .replace(/π/g, "pi")
        .replace(/`/g, "tick")
        .replace(/\$/g, "dollar-sign")
        .replace(/\*$/g, "-star")
        .replace(/^\*/g, "star-")
        .replace(/\*/g, "-star-")
        .replace(/\'+$/g, "q")
        .replace(/^@/g, "at-")
        .replace(/@$/g, "-at")
        .replace(/@/g, "-at-")
        .replace(/[\'\"\,\ū]/g, "")
        .replace(/^\#/g, "sharp-")
        .replace(/\#$/g, "-sharp")
        .replace(/\#/g, "-sharp-")
        .replace(/[\(\)]/g, "")
        .replace(/\+\+$/g, "pp")
        .replace(/\+$/g, "p")
        .replace(/^\!/g, "bang-")
        .replace(/\!$/g, "-bang")
        .replace(/\!/g, "-bang-")
        .replace(/\&/g, "-n-")
        .replace(/[\+ ]/g, "-")
        .replace(/[^a-zA-Z0-9\-\.]/g, "")
        .toLowerCase()
    }
    static escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    }
    static sum(arr) {
      return arr.reduce((curr, next) => curr + next, 0)
    }
    static makeVector(length, fill = 0) {
      return new Array(length).fill(fill)
    }
    static makeMatrix(cols, rows, fill = 0) {
      const matrix = []
      while (rows) {
        matrix.push(Utils.makeVector(cols, fill))
        rows--
      }
      return matrix
    }
    static removeNonAscii(str) {
      // https://stackoverflow.com/questions/20856197/remove-non-ascii-character-in-string
      return str.replace(/[^\x00-\x7F]/g, "")
    }
    static getMethodFromDotPath(context, str) {
      const methodParts = str.split(".")
      while (methodParts.length > 1) {
        const methodName = methodParts.shift()
        if (!context[methodName]) throw new Error(`${methodName} is not a method on ${context}`)
        context = context[methodName]()
      }
      const final = methodParts.shift()
      return [context, final]
    }
    static requireAbsOrRelative(filePath, contextFilePath) {
      if (!filePath.startsWith(".")) return require(filePath)
      const path = require("path")
      const folder = this.getPathWithoutFileName(contextFilePath)
      const file = path.resolve(folder + "/" + filePath)
      return require(file)
    }
    // Removes last ".*" from this string
    static removeFileExtension(filename) {
      return filename ? filename.replace(/\.[^\.]+$/, "") : ""
    }
    static getFileName(path) {
      const parts = path.split("/") // todo: change for windows?
      return parts.pop()
    }
    static getPathWithoutFileName(path) {
      const parts = path.split("/") // todo: change for windows?
      parts.pop()
      return parts.join("/")
    }
    static shuffleInPlace(arr, seed = Date.now()) {
      // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
      const randFn = Utils._getPseudoRandom0to1FloatGenerator(seed)
      for (let index = arr.length - 1; index > 0; index--) {
        const tempIndex = Math.floor(randFn() * (index + 1))
        ;[arr[index], arr[tempIndex]] = [arr[tempIndex], arr[index]]
      }
      return arr
    }
    // Only allows a-zA-Z0-9-_  (And optionally .)
    static _permalink(str, reg) {
      return str.length
        ? str
            .toLowerCase()
            .replace(reg, "")
            .replace(/ /g, "-")
        : ""
    }
    static isValueEmpty(value) {
      return value === undefined || value === "" || (typeof value === "number" && isNaN(value)) || (value instanceof Date && isNaN(value))
    }
    static stringToPermalink(str) {
      return this._permalink(str, /[^a-z0-9- _\.]/gi)
    }
    static getAvailablePermalink(permalink, doesFileExistSyncFn) {
      const extension = this.getFileExtension(permalink)
      permalink = this.removeFileExtension(permalink)
      const originalPermalink = permalink
      let num = 2
      let suffix = ""
      let filename = `${originalPermalink}${suffix}.${extension}`
      while (doesFileExistSyncFn(filename)) {
        filename = `${originalPermalink}${suffix}.${extension}`
        suffix = "-" + num
        num++
      }
      return filename
    }
    static getNextOrPrevious(arr, item) {
      const length = arr.length
      const index = arr.indexOf(item)
      if (length === 1) return undefined
      if (index === length - 1) return arr[index - 1]
      return arr[index + 1]
    }
    static toggle(currentValue, values) {
      const index = values.indexOf(currentValue)
      return index === -1 || index + 1 === values.length ? values[0] : values[index + 1]
    }
    static getClassNameFromFilePath(filepath) {
      return this.removeFileExtension(this.getFileName(filepath))
    }
    static joinArraysOn(joinOn, arrays, columns) {
      const rows = {}
      let index = 0
      if (!columns) columns = arrays.map(arr => Object.keys(arr[0]))
      arrays.forEach((arr, index) => {
        const cols = columns[index]
        arr.forEach(row => {
          const key = joinOn ? row[joinOn] : index++
          if (!rows[key]) rows[key] = {}
          const obj = rows[key]
          cols.forEach(col => (obj[col] = row[col]))
        })
      })
      return Object.values(rows)
    }
    static getParentFolder(path) {
      if (path.endsWith("/")) path = this._removeLastSlash(path)
      return path.replace(/\/[^\/]*$/, "") + "/"
    }
    static _removeLastSlash(path) {
      return path.replace(/\/$/, "")
    }
    static _listToEnglishText(list, limit = 5) {
      const len = list.length
      if (!len) return ""
      if (len === 1) return `'${list[0]}'`
      const clone = list.slice(0, limit).map(item => `'${item}'`)
      const last = clone.pop()
      if (len <= limit) return clone.join(", ") + ` and ${last}`
      return clone.join(", ") + ` and ${len - limit} more`
    }
    // todo: refactor so instead of str input takes an array of cells(strings) and scans each indepndently.
    static _chooseDelimiter(str) {
      const del = " ,|\t;^%$!#@~*&+-=_:?.{}[]()<>/".split("").find(idea => !str.includes(idea))
      if (!del) throw new Error("Could not find a delimiter")
      return del
    }
    static flatten(arr) {
      if (arr.flat) return arr.flat()
      return arr.reduce((acc, val) => acc.concat(val), [])
    }
    static escapeBackTicks(str) {
      return str.replace(/\`/g, "\\`").replace(/\$\{/g, "\\${")
    }
    static ucfirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    // Adapted from: https://github.com/dcporter/didyoumean.js/blob/master/didYouMean-1.2.1.js
    static didYouMean(str = "", options = [], caseSensitive = false, threshold = 0.4, thresholdAbsolute = 20) {
      if (!caseSensitive) str = str.toLowerCase()
      // Calculate the initial value (the threshold) if present.
      const thresholdRelative = threshold * str.length
      let maximumEditDistanceToBeBestMatch
      if (thresholdRelative !== null && thresholdAbsolute !== null) maximumEditDistanceToBeBestMatch = Math.min(thresholdRelative, thresholdAbsolute)
      else if (thresholdRelative !== null) maximumEditDistanceToBeBestMatch = thresholdRelative
      else if (thresholdAbsolute !== null) maximumEditDistanceToBeBestMatch = thresholdAbsolute
      // Get the edit distance to each option. If the closest one is less than 40% (by default) of str's length, then return it.
      let closestMatch
      const len = options.length
      for (let optionIndex = 0; optionIndex < len; optionIndex++) {
        const candidate = options[optionIndex]
        if (!candidate) continue
        const editDistance = Utils._getEditDistance(str, caseSensitive ? candidate : candidate.toLowerCase(), maximumEditDistanceToBeBestMatch)
        if (editDistance < maximumEditDistanceToBeBestMatch) {
          maximumEditDistanceToBeBestMatch = editDistance
          closestMatch = candidate
        }
      }
      return closestMatch
    }
    // Adapted from: https://github.com/dcporter/didyoumean.js/blob/master/didYouMean-1.2.1.js
    static _getEditDistance(stringA, stringB, maxInt) {
      // Handle null or undefined max.
      maxInt = maxInt || maxInt === 0 ? maxInt : Utils.MAX_INT
      const aLength = stringA.length
      const bLength = stringB.length
      // Fast path - no A or B.
      if (aLength === 0) return Math.min(maxInt + 1, bLength)
      if (bLength === 0) return Math.min(maxInt + 1, aLength)
      // Fast path - length diff larger than max.
      if (Math.abs(aLength - bLength) > maxInt) return maxInt + 1
      // Slow path.
      const matrix = []
      // Set up the first row ([0, 1, 2, 3, etc]).
      for (let bIndex = 0; bIndex <= bLength; bIndex++) {
        matrix[bIndex] = [bIndex]
      }
      // Set up the first column (same).
      for (let aIndex = 0; aIndex <= aLength; aIndex++) {
        matrix[0][aIndex] = aIndex
      }
      let colMin
      let minJ
      let maxJ
      // Loop over the rest of the columns.
      for (let bIndex = 1; bIndex <= bLength; bIndex++) {
        colMin = Utils.MAX_INT
        minJ = 1
        if (bIndex > maxInt) minJ = bIndex - maxInt
        maxJ = bLength + 1
        if (maxJ > maxInt + bIndex) maxJ = maxInt + bIndex
        // Loop over the rest of the rows.
        for (let aIndex = 1; aIndex <= aLength; aIndex++) {
          // If j is out of bounds, just put a large value in the slot.
          if (aIndex < minJ || aIndex > maxJ) matrix[bIndex][aIndex] = maxInt + 1
          // Otherwise do the normal Levenshtein thing.
          else {
            // If the characters are the same, there's no change in edit distance.
            if (stringB.charAt(bIndex - 1) === stringA.charAt(aIndex - 1)) matrix[bIndex][aIndex] = matrix[bIndex - 1][aIndex - 1]
            // Otherwise, see if we're substituting, inserting or deleting.
            else
              matrix[bIndex][aIndex] = Math.min(
                matrix[bIndex - 1][aIndex - 1] + 1, // Substitute
                Math.min(
                  matrix[bIndex][aIndex - 1] + 1, // Insert
                  matrix[bIndex - 1][aIndex] + 1
                )
              ) // Delete
          }
          // Either way, update colMin.
          if (matrix[bIndex][aIndex] < colMin) colMin = matrix[bIndex][aIndex]
        }
        // If this column's minimum is greater than the allowed maximum, there's no point
        // in going on with life.
        if (colMin > maxInt) return maxInt + 1
      }
      // If we made it this far without running into the max, then return the final matrix value.
      return matrix[bLength][aLength]
    }
    static getLineIndexAtCharacterPosition(str, index) {
      const lines = str.split("\n")
      const len = lines.length
      let position = 0
      for (let lineNumber = 0; lineNumber < len; lineNumber++) {
        position += lines[lineNumber].length
        if (position >= index) return lineNumber
      }
    }
    static resolvePath(filePath, programFilepath) {
      // For use in Node.js only
      if (!filePath.startsWith(".")) return filePath
      const path = require("path")
      const folder = this.getPathWithoutFileName(programFilepath)
      return path.resolve(folder + "/" + filePath)
    }
    static resolveProperty(obj, path, separator = ".") {
      const properties = Array.isArray(path) ? path : path.split(separator)
      return properties.reduce((prev, curr) => prev && prev[curr], obj)
    }
    static appendCodeAndReturnValueOnWindow(code, name) {
      const script = document.createElement("script")
      script.innerHTML = code
      document.head.appendChild(script)
      return window[name]
    }
    static formatStr(str, catchAllCellDelimiter = " ", parameterMap) {
      return str.replace(/{([^\}]+)}/g, (match, path) => {
        const val = parameterMap[path]
        if (!val) return ""
        return Array.isArray(val) ? val.join(catchAllCellDelimiter) : val
      })
    }
    static stripHtml(text) {
      return text && text.replace ? text.replace(/<(?:.|\n)*?>/gm, "") : text
    }
    static getUniqueWordsArray(allWords) {
      const words = allWords.replace(/\n/g, " ").split(" ")
      const index = {}
      words.forEach(word => {
        if (!index[word]) index[word] = 0
        index[word]++
      })
      return Object.keys(index).map(key => {
        return {
          word: key,
          count: index[key]
        }
      })
    }
    static getRandomString(length = 30, letters = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), seed = Date.now()) {
      let str = ""
      const randFn = Utils._getPseudoRandom0to1FloatGenerator(seed)
      while (length) {
        str += letters[Math.round(Math.min(randFn() * letters.length, letters.length - 1))]
        length--
      }
      return str
    }
    // todo: add seed!
    static makeRandomTree(lines = 1000, seed = Date.now()) {
      let str = ""
      let letters = " 123abc".split("")
      const randFn = Utils._getPseudoRandom0to1FloatGenerator(seed)
      while (lines) {
        let indent = " ".repeat(Math.round(randFn() * 6))
        let bit = indent
        let rand = Math.floor(randFn() * 30)
        while (rand) {
          bit += letters[Math.round(Math.min(randFn() * letters.length, letters.length - 1))]
          rand--
        }
        bit += "\n"
        str += bit
        lines--
      }
      return str
    }
    // adapted from https://gist.github.com/blixt/f17b47c62508be59987b
    // 1993 Park-Miller LCG
    static _getPseudoRandom0to1FloatGenerator(seed) {
      return function() {
        seed = Math.imul(48271, seed) | 0 % 2147483647
        return (seed & 2147483647) / 2147483648
      }
    }
    static sampleWithoutReplacement(population = [], quantity, seed) {
      const prng = this._getPseudoRandom0to1FloatGenerator(seed)
      const sampled = {}
      const populationSize = population.length
      if (quantity >= populationSize) return population.slice(0)
      const picked = []
      while (picked.length < quantity) {
        const index = Math.floor(prng() * populationSize)
        if (sampled[index]) continue
        sampled[index] = true
        picked.push(population[index])
      }
      return picked
    }
    static arrayToMap(arr) {
      const map = {}
      arr.forEach(val => (map[val] = true))
      return map
    }
    static _replaceNonAlphaNumericCharactersWithCharCodes(str) {
      return str
        .replace(/[^a-zA-Z0-9]/g, sub => {
          return "_" + sub.charCodeAt(0).toString()
        })
        .replace(/^([0-9])/, "number$1")
    }
    static mapValues(object, fn) {
      const result = {}
      Object.keys(object).forEach(key => {
        result[key] = fn(key)
      })
      return result
    }
    static javascriptTableWithHeaderRowToObjects(dataTable) {
      dataTable = dataTable.slice()
      const header = dataTable.shift()
      return dataTable.map(row => {
        const obj = {}
        header.forEach((colName, index) => (obj[colName] = row[index]))
        return obj
      })
    }
    static interweave(arrayOfArrays) {
      const lineCount = Math.max(...arrayOfArrays.map(arr => arr.length))
      const totalArrays = arrayOfArrays.length
      const result = []
      arrayOfArrays.forEach((lineArray, arrayIndex) => {
        for (let lineIndex = 0; lineIndex < lineCount; lineIndex++) {
          result[lineIndex * totalArrays + arrayIndex] = lineArray[lineIndex]
        }
      })
      return result
    }
    static makeSortByFn(accessorOrAccessors) {
      const arrayOfFns = Array.isArray(accessorOrAccessors) ? accessorOrAccessors : [accessorOrAccessors]
      return (objectA, objectB) => {
        const nodeAFirst = -1
        const nodeBFirst = 1
        const accessor = arrayOfFns[0] // todo: handle accessors
        const av = accessor(objectA)
        const bv = accessor(objectB)
        let result = av < bv ? nodeAFirst : av > bv ? nodeBFirst : 0
        if (av === undefined && bv !== undefined) result = nodeAFirst
        else if (bv === undefined && av !== undefined) result = nodeBFirst
        return result
      }
    }
    static _makeGraphSortFunctionFromGraph(idAccessor, graph) {
      return (nodeA, nodeB) => {
        const nodeAFirst = -1
        const nodeBFirst = 1
        const nodeAUniqueId = idAccessor(nodeA)
        const nodeBUniqueId = idAccessor(nodeB)
        const nodeAExtendsNodeB = graph[nodeAUniqueId].has(nodeBUniqueId)
        const nodeBExtendsNodeA = graph[nodeBUniqueId].has(nodeAUniqueId)
        if (nodeAExtendsNodeB) return nodeBFirst
        else if (nodeBExtendsNodeA) return nodeAFirst
        const nodeAExtendsSomething = graph[nodeAUniqueId].size > 1
        const nodeBExtendsSomething = graph[nodeBUniqueId].size > 1
        if (!nodeAExtendsSomething && nodeBExtendsSomething) return nodeAFirst
        else if (!nodeBExtendsSomething && nodeAExtendsSomething) return nodeBFirst
        if (nodeAUniqueId > nodeBUniqueId) return nodeBFirst
        else if (nodeAUniqueId < nodeBUniqueId) return nodeAFirst
        return 0
      }
    }
    static removeAll(str, needle) {
      return str.split(needle).join("")
    }
    static _makeGraphSortFunction(idAccessor, extendsIdAccessor) {
      return (nodeA, nodeB) => {
        // -1 === a before b
        const nodeAUniqueId = idAccessor(nodeA)
        const nodeAExtends = extendsIdAccessor(nodeA)
        const nodeBUniqueId = idAccessor(nodeB)
        const nodeBExtends = extendsIdAccessor(nodeB)
        const nodeAExtendsNodeB = nodeAExtends === nodeBUniqueId
        const nodeBExtendsNodeA = nodeBExtends === nodeAUniqueId
        const nodeAFirst = -1
        const nodeBFirst = 1
        if (!nodeAExtends && !nodeBExtends) {
          // If neither extends, sort by firstWord
          if (nodeAUniqueId > nodeBUniqueId) return nodeBFirst
          else if (nodeAUniqueId < nodeBUniqueId) return nodeAFirst
          return 0
        }
        // If only one extends, the other comes first
        else if (!nodeAExtends) return nodeAFirst
        else if (!nodeBExtends) return nodeBFirst
        // If A extends B, B should come first
        if (nodeAExtendsNodeB) return nodeBFirst
        else if (nodeBExtendsNodeA) return nodeAFirst
        // Sort by what they extend
        if (nodeAExtends > nodeBExtends) return nodeBFirst
        else if (nodeAExtends < nodeBExtends) return nodeAFirst
        // Finally sort by firstWord
        if (nodeAUniqueId > nodeBUniqueId) return nodeBFirst
        else if (nodeAUniqueId < nodeBUniqueId) return nodeAFirst
        // Should never hit this, unless we have a duplicate line.
        return 0
      }
    }
  }
  Utils.Timer = Timer
  //http://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links#21925491
  Utils.linkify = (text, target = "_blank") => {
    let replacedText
    let replacePattern1
    let replacePattern2
    let replacePattern3
    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z\(\)0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+\(\)&@#\/%=~_|])/gim
    replacedText = text.replace(replacePattern1, `<a href="$1" target="${target}">$1</a>`)
    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim
    replacedText = replacedText.replace(replacePattern2, `$1<a href="http://$2" target="${target}">$2</a>`)
    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>')
    return replacedText
  }
  // todo: switch algo to: http://indiegamr.com/generate-repeatable-random-numbers-in-js/?
  Utils.makeSemiRandomFn = (seed = Date.now()) => {
    return () => {
      const semiRand = Math.sin(seed++) * 10000
      return semiRand - Math.floor(semiRand)
    }
  }
  Utils.randomUniformInt = (min, max, seed = Date.now()) => {
    return Math.floor(Utils.randomUniformFloat(min, max, seed))
  }
  Utils.randomUniformFloat = (min, max, seed = Date.now()) => {
    const randFn = Utils.makeSemiRandomFn(seed)
    return min + (max - min) * randFn()
  }
  Utils.getRange = (startIndex, endIndexExclusive, increment = 1) => {
    const range = []
    for (let index = startIndex; index < endIndexExclusive; index = index + increment) {
      range.push(index)
    }
    return range
  }
  Utils.MAX_INT = Math.pow(2, 32) - 1
  window.Utils = Utils
  ;
  
  let _jtreeLatestTime = 0
  let _jtreeMinTimeIncrement = 0.000000000001
  class AbstractNode {
    _getProcessTimeInMilliseconds() {
      // We add this loop to restore monotonically increasing .now():
      // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now
      let time = performance.now()
      while (time <= _jtreeLatestTime) {
        if (time === time + _jtreeMinTimeIncrement)
          // Some browsers have different return values for perf.now()
          _jtreeMinTimeIncrement = 10 * _jtreeMinTimeIncrement
        time += _jtreeMinTimeIncrement
      }
      _jtreeLatestTime = time
      return time
    }
  }
  var FileFormat
  ;(function(FileFormat) {
    FileFormat["csv"] = "csv"
    FileFormat["tsv"] = "tsv"
    FileFormat["tree"] = "tree"
  })(FileFormat || (FileFormat = {}))
  class AbstractTreeEvent {
    constructor(targetNode) {
      this.targetNode = targetNode
    }
  }
  class ChildAddedTreeEvent extends AbstractTreeEvent {}
  class ChildRemovedTreeEvent extends AbstractTreeEvent {}
  class DescendantChangedTreeEvent extends AbstractTreeEvent {}
  class LineChangedTreeEvent extends AbstractTreeEvent {}
  class TreeWord {
    constructor(node, cellIndex) {
      this._node = node
      this._cellIndex = cellIndex
    }
    replace(newWord) {
      this._node.setWord(this._cellIndex, newWord)
    }
    get word() {
      return this._node.getWord(this._cellIndex)
    }
  }
  const TreeEvents = { ChildAddedTreeEvent, ChildRemovedTreeEvent, DescendantChangedTreeEvent, LineChangedTreeEvent }
  var WhereOperators
  ;(function(WhereOperators) {
    WhereOperators["equal"] = "="
    WhereOperators["notEqual"] = "!="
    WhereOperators["lessThan"] = "<"
    WhereOperators["lessThanOrEqual"] = "<="
    WhereOperators["greaterThan"] = ">"
    WhereOperators["greaterThanOrEqual"] = ">="
    WhereOperators["includes"] = "includes"
    WhereOperators["doesNotInclude"] = "doesNotInclude"
    WhereOperators["in"] = "in"
    WhereOperators["notIn"] = "notIn"
    WhereOperators["empty"] = "empty"
    WhereOperators["notEmpty"] = "notEmpty"
  })(WhereOperators || (WhereOperators = {}))
  var TreeNotationConstants
  ;(function(TreeNotationConstants) {
    TreeNotationConstants["extends"] = "extends"
  })(TreeNotationConstants || (TreeNotationConstants = {}))
  class Parser {
    constructor(catchAllNodeConstructor, firstWordMap = {}, regexTests = undefined) {
      this._catchAllNodeConstructor = catchAllNodeConstructor
      this._firstWordMap = new Map(Object.entries(firstWordMap))
      this._regexTests = regexTests
    }
    getFirstWordOptions() {
      return Array.from(this._getFirstWordMap().keys())
    }
    // todo: remove
    _getFirstWordMap() {
      return this._firstWordMap
    }
    // todo: remove
    _getFirstWordMapAsObject() {
      let obj = {}
      const map = this._getFirstWordMap()
      for (let [key, val] of map.entries()) {
        obj[key] = val
      }
      return obj
    }
    _getNodeConstructor(line, contextNode, wordBreakSymbol = " ") {
      return this._getFirstWordMap().get(this._getFirstWord(line, wordBreakSymbol)) || this._getConstructorFromRegexTests(line) || this._getCatchAllNodeConstructor(contextNode)
    }
    _getCatchAllNodeConstructor(contextNode) {
      if (this._catchAllNodeConstructor) return this._catchAllNodeConstructor
      const parent = contextNode.parent
      if (parent) return parent._getParser()._getCatchAllNodeConstructor(parent)
      return contextNode.constructor
    }
    _getConstructorFromRegexTests(line) {
      if (!this._regexTests) return undefined
      const hit = this._regexTests.find(test => test.regex.test(line))
      if (hit) return hit.nodeConstructor
      return undefined
    }
    _getFirstWord(line, wordBreakSymbol) {
      const firstBreak = line.indexOf(wordBreakSymbol)
      return line.substr(0, firstBreak > -1 ? firstBreak : undefined)
    }
  }
  class TreeNode extends AbstractNode {
    constructor(children, line, parent) {
      super()
      // BEGIN MUTABLE METHODS BELOw
      this._nodeCreationTime = this._getProcessTimeInMilliseconds()
      this._parent = parent
      this._setLine(line)
      this._setChildren(children)
    }
    execute() {}
    async loadRequirements(context) {
      // todo: remove
      await Promise.all(this.map(node => node.loadRequirements(context)))
    }
    getErrors() {
      return []
    }
    getLineCellTypes() {
      // todo: make this any a constant
      return "undefinedCellType ".repeat(this.words.length).trim()
    }
    isNodeJs() {
      return typeof exports !== "undefined"
    }
    isBrowser() {
      return !this.isNodeJs()
    }
    getOlderSiblings() {
      if (this.isRoot()) return []
      return this.parent.slice(0, this.getIndex())
    }
    _getClosestOlderSibling() {
      const olderSiblings = this.getOlderSiblings()
      return olderSiblings[olderSiblings.length - 1]
    }
    getYoungerSiblings() {
      if (this.isRoot()) return []
      return this.parent.slice(this.getIndex() + 1)
    }
    getSiblings() {
      if (this.isRoot()) return []
      return this.parent.filter(node => node !== this)
    }
    _getUid() {
      if (!this._uid) this._uid = TreeNode._makeUniqueId()
      return this._uid
    }
    // todo: rename getMother? grandMother et cetera?
    get parent() {
      return this._parent
    }
    getIndentLevel(relativeTo) {
      return this._getIndentLevel(relativeTo)
    }
    getIndentation(relativeTo) {
      const indentLevel = this._getIndentLevel(relativeTo) - 1
      if (indentLevel < 0) return ""
      return this.getEdgeSymbol().repeat(indentLevel)
    }
    _getTopDownArray(arr) {
      this.forEach(child => {
        arr.push(child)
        child._getTopDownArray(arr)
      })
    }
    getTopDownArray() {
      const arr = []
      this._getTopDownArray(arr)
      return arr
    }
    *getTopDownArrayIterator() {
      for (let child of this.getChildren()) {
        yield child
        yield* child.getTopDownArrayIterator()
      }
    }
    nodeAtLine(lineNumber) {
      let index = 0
      for (let node of this.getTopDownArrayIterator()) {
        if (lineNumber === index) return node
        index++
      }
    }
    getNumberOfLines() {
      let lineCount = 0
      for (let node of this.getTopDownArrayIterator()) {
        lineCount++
      }
      return lineCount
    }
    _getMaxUnitsOnALine() {
      let max = 0
      for (let node of this.getTopDownArrayIterator()) {
        const count = node.words.length + node.getIndentLevel()
        if (count > max) max = count
      }
      return max
    }
    getNumberOfWords() {
      let wordCount = 0
      for (let node of this.getTopDownArrayIterator()) {
        wordCount += node.words.length
      }
      return wordCount
    }
    getLineNumber() {
      return this._getLineNumberRelativeTo()
    }
    _getLineNumber(target = this) {
      if (this._cachedLineNumber) return this._cachedLineNumber
      let lineNumber = 1
      for (let node of this.root.getTopDownArrayIterator()) {
        if (node === target) return lineNumber
        lineNumber++
      }
      return lineNumber
    }
    isBlankLine() {
      return !this.length && !this.getLine()
    }
    hasDuplicateFirstWords() {
      return this.length ? new Set(this.getFirstWords()).size !== this.length : false
    }
    isEmpty() {
      return !this.length && !this.content
    }
    _getLineNumberRelativeTo(relativeTo) {
      if (this.isRoot(relativeTo)) return 0
      const start = relativeTo || this.root
      return start._getLineNumber(this)
    }
    isRoot(relativeTo) {
      return relativeTo === this || !this.parent
    }
    get root() {
      return this._getRootNode()
    }
    _getRootNode(relativeTo) {
      if (this.isRoot(relativeTo)) return this
      return this.parent._getRootNode(relativeTo)
    }
    toString(indentCount = 0, language = this) {
      if (this.isRoot()) return this._childrenToString(indentCount, language)
      return language.getEdgeSymbol().repeat(indentCount) + this.getLine(language) + (this.length ? language.getNodeBreakSymbol() + this._childrenToString(indentCount + 1, language) : "")
    }
    printLinesFrom(start, quantity) {
      return this._printLinesFrom(start, quantity, false)
    }
    printLinesWithLineNumbersFrom(start, quantity) {
      return this._printLinesFrom(start, quantity, true)
    }
    _printLinesFrom(start, quantity, printLineNumbers) {
      // todo: use iterator for better perf?
      const end = start + quantity
      this.toString()
        .split("\n")
        .slice(start, end)
        .forEach((line, index) => {
          if (printLineNumbers) console.log(`${start + index} ${line}`)
          else console.log(line)
        })
      return this
    }
    getWord(index) {
      const words = this._getWords(0)
      if (index < 0) index = words.length + index
      return words[index]
    }
    get list() {
      return this.getWordsFrom(1)
    }
    _toHtml(indentCount) {
      const path = this.getPathVector().join(" ")
      const classes = {
        nodeLine: "nodeLine",
        edgeSymbol: "edgeSymbol",
        nodeBreakSymbol: "nodeBreakSymbol",
        nodeChildren: "nodeChildren"
      }
      const edge = this.getEdgeSymbol().repeat(indentCount)
      // Set up the firstWord part of the node
      const edgeHtml = `<span class="${classes.nodeLine}" data-pathVector="${path}"><span class="${classes.edgeSymbol}">${edge}</span>`
      const lineHtml = this._getLineHtml()
      const childrenHtml = this.length ? `<span class="${classes.nodeBreakSymbol}">${this.getNodeBreakSymbol()}</span>` + `<span class="${classes.nodeChildren}">${this._childrenToHtml(indentCount + 1)}</span>` : ""
      return `${edgeHtml}${lineHtml}${childrenHtml}</span>`
    }
    _getWords(startFrom) {
      if (!this._words) this._words = this._getLine().split(this.getWordBreakSymbol())
      return startFrom ? this._words.slice(startFrom) : this._words
    }
    get words() {
      return this._getWords(0)
    }
    doesExtend(nodeTypeId) {
      return false
    }
    require(moduleName, filePath) {
      if (!this.isNodeJs()) return window[moduleName]
      return require(filePath || moduleName)
    }
    getWordsFrom(startFrom) {
      return this._getWords(startFrom)
    }
    getFirstAncestor() {
      const parent = this.parent
      return parent.isRoot() ? this : parent.getFirstAncestor()
    }
    isLoaded() {
      return true
    }
    getRunTimePhaseErrors() {
      if (!this._runTimePhaseErrors) this._runTimePhaseErrors = {}
      return this._runTimePhaseErrors
    }
    setRunTimePhaseError(phase, errorObject) {
      if (errorObject === undefined) delete this.getRunTimePhaseErrors()[phase]
      else this.getRunTimePhaseErrors()[phase] = errorObject
      return this
    }
    _getJavascriptPrototypeChainUpTo(stopAtClassName = "TreeNode") {
      // todo: cross browser test this
      let constructor = this.constructor
      const chain = []
      while (constructor.name !== stopAtClassName) {
        chain.unshift(constructor.name)
        constructor = constructor.__proto__
      }
      chain.unshift(stopAtClassName)
      return chain
    }
    _getProjectRootDir() {
      return this.isRoot() ? "" : this.root._getProjectRootDir()
    }
    // Concat 2 trees amd return a new true, but replace any nodes
    // in this tree that start with the same node from the first tree with
    // that patched version. Does not recurse.
    patch(two) {
      const copy = this.clone()
      two.forEach(node => {
        const hit = copy.getNode(node.getWord(0))
        if (hit) hit.destroy()
      })
      copy.concat(two)
      return copy
    }
    getSparsity() {
      const nodes = this.getChildren()
      const fields = this._getUnionNames()
      let count = 0
      this.getChildren().forEach(node => {
        fields.forEach(field => {
          if (node.has(field)) count++
        })
      })
      return 1 - count / (nodes.length * fields.length)
    }
    // todo: rename. what is the proper term from set/cat theory?
    getBiDirectionalMaps(propertyNameOrFn, propertyNameOrFn2 = node => node.getWord(0)) {
      const oneToTwo = {}
      const twoToOne = {}
      const is1Str = typeof propertyNameOrFn === "string"
      const is2Str = typeof propertyNameOrFn2 === "string"
      const children = this.getChildren()
      this.forEach((node, index) => {
        const value1 = is1Str ? node.get(propertyNameOrFn) : propertyNameOrFn(node, index, children)
        const value2 = is2Str ? node.get(propertyNameOrFn2) : propertyNameOrFn2(node, index, children)
        if (value1 !== undefined) {
          if (!oneToTwo[value1]) oneToTwo[value1] = []
          oneToTwo[value1].push(value2)
        }
        if (value2 !== undefined) {
          if (!twoToOne[value2]) twoToOne[value2] = []
          twoToOne[value2].push(value1)
        }
      })
      return [oneToTwo, twoToOne]
    }
    _getWordIndexCharacterStartPosition(wordIndex) {
      const xiLength = this.getEdgeSymbol().length
      const numIndents = this._getIndentLevel(undefined) - 1
      const indentPosition = xiLength * numIndents
      if (wordIndex < 1) return xiLength * (numIndents + wordIndex)
      return indentPosition + this.words.slice(0, wordIndex).join(this.getWordBreakSymbol()).length + this.getWordBreakSymbol().length
    }
    getNodeInScopeAtCharIndex(charIndex) {
      if (this.isRoot()) return this
      let wordIndex = this.getWordIndexAtCharacterIndex(charIndex)
      if (wordIndex > 0) return this
      let node = this
      while (wordIndex < 1) {
        node = node.parent
        wordIndex++
      }
      return node
    }
    getWordProperties(wordIndex) {
      const start = this._getWordIndexCharacterStartPosition(wordIndex)
      const word = wordIndex < 0 ? "" : this.getWord(wordIndex)
      return {
        startCharIndex: start,
        endCharIndex: start + word.length,
        word: word
      }
    }
    fill(fill = "") {
      this.getTopDownArray().forEach(line => {
        line.words.forEach((word, index) => {
          line.setWord(index, fill)
        })
      })
      return this
    }
    getAllWordBoundaryCoordinates() {
      const coordinates = []
      let lineIndex = 0
      for (let node of this.getTopDownArrayIterator()) {
        node.getWordBoundaryCharIndices().forEach((charIndex, wordIndex) => {
          coordinates.push({
            lineIndex: lineIndex,
            charIndex: charIndex,
            wordIndex: wordIndex
          })
        })
        lineIndex++
      }
      return coordinates
    }
    getWordBoundaryCharIndices() {
      let indentLevel = this._getIndentLevel()
      const wordBreakSymbolLength = this.getWordBreakSymbol().length
      let elapsed = indentLevel
      return this.words.map((word, wordIndex) => {
        const boundary = elapsed
        elapsed += word.length + wordBreakSymbolLength
        return boundary
      })
    }
    getWordIndexAtCharacterIndex(charIndex) {
      // todo: is this correct thinking for handling root?
      if (this.isRoot()) return 0
      const numberOfIndents = this._getIndentLevel(undefined) - 1
      // todo: probably want to rewrite this in a performant way.
      const spots = []
      while (spots.length < numberOfIndents) {
        spots.push(-(numberOfIndents - spots.length))
      }
      this.words.forEach((word, wordIndex) => {
        word.split("").forEach(letter => {
          spots.push(wordIndex)
        })
        spots.push(wordIndex)
      })
      return spots[charIndex]
    }
    // Note: This currently does not return any errors resulting from "required" or "single"
    getAllErrors(lineStartsAt = 1) {
      const errors = []
      for (let node of this.getTopDownArray()) {
        node._cachedLineNumber = lineStartsAt // todo: cleanup
        const errs = node.getErrors()
        errs.forEach(err => errors.push(err))
        // delete node._cachedLineNumber
        lineStartsAt++
      }
      return errors
    }
    *getAllErrorsIterator() {
      let line = 1
      for (let node of this.getTopDownArrayIterator()) {
        node._cachedLineNumber = line
        const errs = node.getErrors()
        // delete node._cachedLineNumber
        if (errs.length) yield errs
        line++
      }
    }
    get firstWord() {
      return this.words[0]
    }
    get content() {
      const words = this.getWordsFrom(1)
      return words.length ? words.join(this.getWordBreakSymbol()) : undefined
    }
    getContentWithChildren() {
      // todo: deprecate
      const content = this.content
      return (content ? content : "") + (this.length ? this.getNodeBreakSymbol() + this._childrenToString() : "")
    }
    getFirstNode() {
      return this.nodeAt(0)
    }
    getStack() {
      return this._getStack()
    }
    _getStack(relativeTo) {
      if (this.isRoot(relativeTo)) return []
      const parent = this.parent
      if (parent.isRoot(relativeTo)) return [this]
      else return parent._getStack(relativeTo).concat([this])
    }
    getStackString() {
      return this._getStack()
        .map((node, index) => this.getEdgeSymbol().repeat(index) + node.getLine())
        .join(this.getNodeBreakSymbol())
    }
    getLine(language) {
      if (!this._words && !language) return this._getLine() // todo: how does this interact with "language" param?
      return this.words.join((language || this).getWordBreakSymbol())
    }
    getColumnNames() {
      return this._getUnionNames()
    }
    getOneHot(column) {
      const clone = this.clone()
      const cols = Array.from(new Set(clone.getColumn(column)))
      clone.forEach(node => {
        const val = node.get(column)
        node.delete(column)
        cols.forEach(col => {
          node.set(column + "_" + col, val === col ? "1" : "0")
        })
      })
      return clone
    }
    // todo: return array? getPathArray?
    _getFirstWordPath(relativeTo) {
      if (this.isRoot(relativeTo)) return ""
      else if (this.parent.isRoot(relativeTo)) return this.firstWord
      return this.parent._getFirstWordPath(relativeTo) + this.getEdgeSymbol() + this.firstWord
    }
    getFirstWordPathRelativeTo(relativeTo) {
      return this._getFirstWordPath(relativeTo)
    }
    getFirstWordPath() {
      return this._getFirstWordPath()
    }
    getPathVector() {
      return this._getPathVector()
    }
    getPathVectorRelativeTo(relativeTo) {
      return this._getPathVector(relativeTo)
    }
    _getPathVector(relativeTo) {
      if (this.isRoot(relativeTo)) return []
      const path = this.parent._getPathVector(relativeTo)
      path.push(this.getIndex())
      return path
    }
    getIndex() {
      return this.parent._indexOfNode(this)
    }
    isTerminal() {
      return !this.length
    }
    _getLineHtml() {
      return this.words.map((word, index) => `<span class="word${index}">${Utils.stripHtml(word)}</span>`).join(`<span class="zIncrement">${this.getWordBreakSymbol()}</span>`)
    }
    _getXmlContent(indentCount) {
      if (this.content !== undefined) return this.getContentWithChildren()
      return this.length ? `${indentCount === -1 ? "" : "\n"}${this._childrenToXml(indentCount > -1 ? indentCount + 2 : -1)}${" ".repeat(indentCount)}` : ""
    }
    _toXml(indentCount) {
      const indent = " ".repeat(indentCount)
      const tag = this.firstWord
      return `${indent}<${tag}>${this._getXmlContent(indentCount)}</${tag}>${indentCount === -1 ? "" : "\n"}`
    }
    _toObjectTuple() {
      const content = this.content
      const length = this.length
      const hasChildrenNoContent = content === undefined && length
      const hasContentAndHasChildren = content !== undefined && length
      // If the node has a content and a subtree return it as a string, as
      // Javascript object values can't be both a leaf and a tree.
      const tupleValue = hasChildrenNoContent ? this.toObject() : hasContentAndHasChildren ? this.getContentWithChildren() : content
      return [this.firstWord, tupleValue]
    }
    _indexOfNode(needleNode) {
      let result = -1
      this.find((node, index) => {
        if (node === needleNode) {
          result = index
          return true
        }
      })
      return result
    }
    getMaxLineWidth() {
      let maxWidth = 0
      for (let node of this.getTopDownArrayIterator()) {
        const lineWidth = node.getLine().length
        if (lineWidth > maxWidth) maxWidth = lineWidth
      }
      return maxWidth
    }
    toTreeNode() {
      return new TreeNode(this.toString())
    }
    _rightPad(newWidth, padCharacter) {
      const line = this.getLine()
      this.setLine(line + padCharacter.repeat(newWidth - line.length))
      return this
    }
    rightPad(padCharacter = " ") {
      const newWidth = this.getMaxLineWidth()
      this.getTopDownArray().forEach(node => node._rightPad(newWidth, padCharacter))
      return this
    }
    lengthen(numberOfLines) {
      let linesToAdd = numberOfLines - this.getNumberOfLines()
      while (linesToAdd > 0) {
        this.appendLine("")
        linesToAdd--
      }
      return this
    }
    toSideBySide(treesOrStrings, delimiter = " ") {
      treesOrStrings = treesOrStrings.map(tree => (tree instanceof TreeNode ? tree : new TreeNode(tree)))
      const clone = this.toTreeNode()
      const nodeBreakSymbol = "\n"
      let next
      while ((next = treesOrStrings.shift())) {
        clone.lengthen(next.getNumberOfLines())
        clone.rightPad()
        next
          .toString()
          .split(nodeBreakSymbol)
          .forEach((line, index) => {
            const node = clone.nodeAtLine(index)
            node.setLine(node.getLine() + delimiter + line)
          })
      }
      return clone
    }
    toComparison(treeNode) {
      const nodeBreakSymbol = "\n"
      const lines = treeNode.toString().split(nodeBreakSymbol)
      return new TreeNode(
        this.toString()
          .split(nodeBreakSymbol)
          .map((line, index) => (lines[index] === line ? "" : "x"))
          .join(nodeBreakSymbol)
      )
    }
    toBraid(treesOrStrings) {
      treesOrStrings.unshift(this)
      const nodeDelimiter = this.getNodeBreakSymbol()
      return new TreeNode(
        Utils.interweave(treesOrStrings.map(tree => tree.toString().split(nodeDelimiter)))
          .map(line => (line === undefined ? "" : line))
          .join(nodeDelimiter)
      )
    }
    getSlice(startIndexInclusive, stopIndexExclusive) {
      return new TreeNode(
        this.slice(startIndexInclusive, stopIndexExclusive)
          .map(child => child.toString())
          .join("\n")
      )
    }
    _hasColumns(columns) {
      const words = this.words
      return columns.every((searchTerm, index) => searchTerm === words[index])
    }
    hasWord(index, word) {
      return this.getWord(index) === word
    }
    getNodeByColumns(...columns) {
      return this.getTopDownArray().find(node => node._hasColumns(columns))
    }
    getNodeByColumn(index, name) {
      return this.find(node => node.getWord(index) === name)
    }
    _getNodesByColumn(index, name) {
      return this.filter(node => node.getWord(index) === name)
    }
    // todo: preserve subclasses!
    select(columnNames) {
      columnNames = Array.isArray(columnNames) ? columnNames : [columnNames]
      const result = new TreeNode()
      this.forEach(node => {
        const tree = result.appendLine(node.getLine())
        columnNames.forEach(name => {
          const valueNode = node.getNode(name)
          if (valueNode) tree.appendNode(valueNode)
        })
      })
      return result
    }
    selectionToString() {
      return this.getSelectedNodes()
        .map(node => node.toString())
        .join("\n")
    }
    getSelectedNodes() {
      return this.getTopDownArray().filter(node => node.isSelected())
    }
    clearSelection() {
      this.getSelectedNodes().forEach(node => node.unselectNode())
    }
    // Note: this is for debugging select chains
    print(message = "") {
      if (message) console.log(message)
      console.log(this.toString())
      return this
    }
    // todo: preserve subclasses!
    // todo: preserve links back to parent so you could edit as normal?
    where(columnName, operator, fixedValue) {
      const isArray = Array.isArray(fixedValue)
      const valueType = isArray ? typeof fixedValue[0] : typeof fixedValue
      let parser
      if (valueType === "number") parser = parseFloat
      const fn = node => {
        const cell = node.get(columnName)
        const typedCell = parser ? parser(cell) : cell
        if (operator === WhereOperators.equal) return fixedValue === typedCell
        else if (operator === WhereOperators.notEqual) return fixedValue !== typedCell
        else if (operator === WhereOperators.includes) return typedCell !== undefined && typedCell.includes(fixedValue)
        else if (operator === WhereOperators.doesNotInclude) return typedCell === undefined || !typedCell.includes(fixedValue)
        else if (operator === WhereOperators.greaterThan) return typedCell > fixedValue
        else if (operator === WhereOperators.lessThan) return typedCell < fixedValue
        else if (operator === WhereOperators.greaterThanOrEqual) return typedCell >= fixedValue
        else if (operator === WhereOperators.lessThanOrEqual) return typedCell <= fixedValue
        else if (operator === WhereOperators.empty) return !node.has(columnName)
        else if (operator === WhereOperators.notEmpty) return node.has(columnName) || (cell !== "" && cell !== undefined)
        else if (operator === WhereOperators.in && isArray) return fixedValue.includes(typedCell)
        else if (operator === WhereOperators.notIn && isArray) return !fixedValue.includes(typedCell)
      }
      const result = new TreeNode()
      this.filter(fn).forEach(node => {
        result.appendNode(node)
      })
      return result
    }
    with(firstWord) {
      return this.filter(node => node.has(firstWord))
    }
    without(firstWord) {
      return this.filter(node => !node.has(firstWord))
    }
    first(quantity = 1) {
      return this.limit(quantity, 0)
    }
    last(quantity = 1) {
      return this.limit(quantity, this.length - quantity)
    }
    // todo: preserve subclasses!
    limit(quantity, offset = 0) {
      const result = new TreeNode()
      this.getChildren()
        .slice(offset, quantity + offset)
        .forEach(node => {
          result.appendNode(node)
        })
      return result
    }
    getChildrenFirstArray() {
      const arr = []
      this._getChildrenFirstArray(arr)
      return arr
    }
    _getChildrenFirstArray(arr) {
      this.forEach(child => {
        child._getChildrenFirstArray(arr)
        arr.push(child)
      })
    }
    _getIndentLevel(relativeTo) {
      return this._getStack(relativeTo).length
    }
    getParentFirstArray() {
      const levels = this._getLevels()
      const arr = []
      Object.values(levels).forEach(level => {
        level.forEach(item => arr.push(item))
      })
      return arr
    }
    _getLevels() {
      const levels = {}
      this.getTopDownArray().forEach(node => {
        const level = node._getIndentLevel()
        if (!levels[level]) levels[level] = []
        levels[level].push(node)
      })
      return levels
    }
    _getChildrenArray() {
      if (!this._children) this._children = []
      return this._children
    }
    getLines() {
      return this.map(node => node.getLine())
    }
    getChildren() {
      return this._getChildrenArray().slice(0)
    }
    get length() {
      return this._getChildrenArray().length
    }
    _nodeAt(index) {
      if (index < 0) index = this.length + index
      return this._getChildrenArray()[index]
    }
    nodeAt(indexOrIndexArray) {
      if (typeof indexOrIndexArray === "number") return this._nodeAt(indexOrIndexArray)
      if (indexOrIndexArray.length === 1) return this._nodeAt(indexOrIndexArray[0])
      const first = indexOrIndexArray[0]
      const node = this._nodeAt(first)
      if (!node) return undefined
      return node.nodeAt(indexOrIndexArray.slice(1))
    }
    _toObject() {
      const obj = {}
      this.forEach(node => {
        const tuple = node._toObjectTuple()
        obj[tuple[0]] = tuple[1]
      })
      return obj
    }
    toHtml() {
      return this._childrenToHtml(0)
    }
    _toHtmlCubeLine(indents = 0, lineIndex = 0, planeIndex = 0) {
      const getLine = (cellIndex, word = "") =>
        `<span class="htmlCubeSpan" style="top: calc(var(--topIncrement) * ${planeIndex} + var(--rowHeight) * ${lineIndex}); left:calc(var(--leftIncrement) * ${planeIndex} + var(--cellWidth) * ${cellIndex});">${word}</span>`
      let cells = []
      this.words.forEach((word, index) => (word ? cells.push(getLine(index + indents, word)) : ""))
      return cells.join("")
    }
    toHtmlCube() {
      return this.map((plane, planeIndex) =>
        plane
          .getTopDownArray()
          .map((line, lineIndex) => line._toHtmlCubeLine(line.getIndentLevel() - 2, lineIndex, planeIndex))
          .join("")
      ).join("")
    }
    _getHtmlJoinByCharacter() {
      return `<span class="nodeBreakSymbol">${this.getNodeBreakSymbol()}</span>`
    }
    _childrenToHtml(indentCount) {
      const joinBy = this._getHtmlJoinByCharacter()
      return this.map(node => node._toHtml(indentCount)).join(joinBy)
    }
    _childrenToString(indentCount, language = this) {
      return this.map(node => node.toString(indentCount, language)).join(language.getNodeBreakSymbol())
    }
    childrenToString(indentCount = 0) {
      return this._childrenToString(indentCount)
    }
    // todo: implement
    _getChildJoinCharacter() {
      return "\n"
    }
    format() {
      this.forEach(child => child.format())
      return this
    }
    compile() {
      return this.map(child => child.compile()).join(this._getChildJoinCharacter())
    }
    toXml() {
      return this._childrenToXml(0)
    }
    toDisk(path) {
      if (!this.isNodeJs()) throw new Error("This method only works in Node.js")
      const format = TreeNode._getFileFormat(path)
      const formats = {
        tree: tree => tree.toString(),
        csv: tree => tree.toCsv(),
        tsv: tree => tree.toTsv()
      }
      this.require("fs").writeFileSync(path, formats[format](this), "utf8")
      return this
    }
    _lineToYaml(indentLevel, listTag = "") {
      let prefix = " ".repeat(indentLevel)
      if (listTag && indentLevel > 1) prefix = " ".repeat(indentLevel - 2) + listTag + " "
      return prefix + `${this.firstWord}:` + (this.content ? " " + this.content : "")
    }
    _isYamlList() {
      return this.hasDuplicateFirstWords()
    }
    toYaml() {
      return `%YAML 1.2
  ---\n${this._childrenToYaml(0).join("\n")}`
    }
    _childrenToYaml(indentLevel) {
      if (this._isYamlList()) return this._childrenToYamlList(indentLevel)
      else return this._childrenToYamlAssociativeArray(indentLevel)
    }
    // if your code-to-be-yaml has a list of associative arrays of type N and you don't
    // want the type N to print
    _collapseYamlLine() {
      return false
    }
    _toYamlListElement(indentLevel) {
      const children = this._childrenToYaml(indentLevel + 1)
      if (this._collapseYamlLine()) {
        if (indentLevel > 1) return children.join("\n").replace(" ".repeat(indentLevel), " ".repeat(indentLevel - 2) + "- ")
        return children.join("\n")
      } else {
        children.unshift(this._lineToYaml(indentLevel, "-"))
        return children.join("\n")
      }
    }
    _childrenToYamlList(indentLevel) {
      return this.map(node => node._toYamlListElement(indentLevel + 2))
    }
    _toYamlAssociativeArrayElement(indentLevel) {
      const children = this._childrenToYaml(indentLevel + 1)
      children.unshift(this._lineToYaml(indentLevel))
      return children.join("\n")
    }
    _childrenToYamlAssociativeArray(indentLevel) {
      return this.map(node => node._toYamlAssociativeArrayElement(indentLevel))
    }
    toJsonSubset() {
      return JSON.stringify(this.toObject(), null, " ")
    }
    _toObjectForSerialization() {
      return this.length
        ? {
            cells: this.words,
            children: this.map(child => child._toObjectForSerialization())
          }
        : {
            cells: this.words
          }
    }
    toJson() {
      return JSON.stringify({ children: this.map(child => child._toObjectForSerialization()) }, null, " ")
    }
    toGrid() {
      const WordBreakSymbol = this.getWordBreakSymbol()
      return this.toString()
        .split(this.getNodeBreakSymbol())
        .map(line => line.split(WordBreakSymbol))
    }
    toGridJson() {
      return JSON.stringify(this.toGrid(), null, 2)
    }
    findNodes(firstWordPath) {
      // todo: can easily speed this up
      const map = {}
      if (!Array.isArray(firstWordPath)) firstWordPath = [firstWordPath]
      firstWordPath.forEach(path => (map[path] = true))
      return this.getTopDownArray().filter(node => {
        if (map[node._getFirstWordPath(this)]) return true
        return false
      })
    }
    evalTemplateString(str) {
      const that = this
      return str.replace(/{([^\}]+)}/g, (match, path) => that.get(path) || "")
    }
    emitLogMessage(message) {
      console.log(message)
    }
    getColumn(path) {
      return this.map(node => node.get(path))
    }
    getFiltered(fn) {
      const clone = this.clone()
      clone
        .filter((node, index) => !fn(node, index))
        .forEach(node => {
          node.destroy()
        })
      return clone
    }
    getNode(firstWordPath) {
      return this._getNodeByPath(firstWordPath)
    }
    getFrom(prefix) {
      const hit = this.filter(node => node.getLine().startsWith(prefix))[0]
      if (hit) return hit.getLine().substr((prefix + this.getWordBreakSymbol()).length)
    }
    get(firstWordPath) {
      const node = this._getNodeByPath(firstWordPath)
      return node === undefined ? undefined : node.content
    }
    getOneOf(keys) {
      for (let i = 0; i < keys.length; i++) {
        const value = this.get(keys[i])
        if (value) return value
      }
      return ""
    }
    // move to treenode
    pick(fields) {
      const newTree = new TreeNode(this.toString()) // todo: why not clone?
      const map = Utils.arrayToMap(fields)
      newTree.nodeAt(0).forEach(node => {
        if (!map[node.getWord(0)]) node.destroy()
      })
      return newTree
    }
    getNodesByGlobPath(query) {
      return this._getNodesByGlobPath(query)
    }
    _getNodesByGlobPath(globPath) {
      const edgeSymbol = this.getEdgeSymbol()
      if (!globPath.includes(edgeSymbol)) {
        if (globPath === "*") return this.getChildren()
        return this.filter(node => node.firstWord === globPath)
      }
      const parts = globPath.split(edgeSymbol)
      const current = parts.shift()
      const rest = parts.join(edgeSymbol)
      const matchingNodes = current === "*" ? this.getChildren() : this.filter(child => child.firstWord === current)
      return [].concat.apply(
        [],
        matchingNodes.map(node => node._getNodesByGlobPath(rest))
      )
    }
    _getNodeByPath(firstWordPath) {
      const edgeSymbol = this.getEdgeSymbol()
      if (!firstWordPath.includes(edgeSymbol)) {
        const index = this.indexOfLast(firstWordPath)
        return index === -1 ? undefined : this._nodeAt(index)
      }
      const parts = firstWordPath.split(edgeSymbol)
      const current = parts.shift()
      const currentNode = this._getChildrenArray()[this._getIndex()[current]]
      return currentNode ? currentNode._getNodeByPath(parts.join(edgeSymbol)) : undefined
    }
    getNext() {
      if (this.isRoot()) return this
      const index = this.getIndex()
      const parent = this.parent
      const length = parent.length
      const next = index + 1
      return next === length ? parent._getChildrenArray()[0] : parent._getChildrenArray()[next]
    }
    getPrevious() {
      if (this.isRoot()) return this
      const index = this.getIndex()
      const parent = this.parent
      const length = parent.length
      const prev = index - 1
      return prev === -1 ? parent._getChildrenArray()[length - 1] : parent._getChildrenArray()[prev]
    }
    _getUnionNames() {
      if (!this.length) return []
      const obj = {}
      this.forEach(node => {
        if (!node.length) return undefined
        node.forEach(node => {
          obj[node.firstWord] = 1
        })
      })
      return Object.keys(obj)
    }
    getAncestorNodesByInheritanceViaExtendsKeyword(key) {
      const ancestorNodes = this._getAncestorNodes(
        (node, id) => node._getNodesByColumn(0, id),
        node => node.get(key),
        this
      )
      ancestorNodes.push(this)
      return ancestorNodes
    }
    // Note: as you can probably tell by the name of this method, I don't recommend using this as it will likely be replaced by something better.
    getAncestorNodesByInheritanceViaColumnIndices(thisColumnNumber, extendsColumnNumber) {
      const ancestorNodes = this._getAncestorNodes(
        (node, id) => node._getNodesByColumn(thisColumnNumber, id),
        node => node.getWord(extendsColumnNumber),
        this
      )
      ancestorNodes.push(this)
      return ancestorNodes
    }
    _getAncestorNodes(getPotentialParentNodesByIdFn, getParentIdFn, cannotContainNode) {
      const parentId = getParentIdFn(this)
      if (!parentId) return []
      const potentialParentNodes = getPotentialParentNodesByIdFn(this.parent, parentId)
      if (!potentialParentNodes.length) throw new Error(`"${this.getLine()} tried to extend "${parentId}" but "${parentId}" not found.`)
      if (potentialParentNodes.length > 1) throw new Error(`Invalid inheritance family tree. Multiple unique ids found for "${parentId}"`)
      const parentNode = potentialParentNodes[0]
      // todo: detect loops
      if (parentNode === cannotContainNode) throw new Error(`Loop detected between '${this.getLine()}' and '${parentNode.getLine()}'`)
      const ancestorNodes = parentNode._getAncestorNodes(getPotentialParentNodesByIdFn, getParentIdFn, cannotContainNode)
      ancestorNodes.push(parentNode)
      return ancestorNodes
    }
    pathVectorToFirstWordPath(pathVector) {
      const path = pathVector.slice() // copy array
      const names = []
      let node = this
      while (path.length) {
        if (!node) return names
        names.push(node.nodeAt(path[0]).firstWord)
        node = node.nodeAt(path.shift())
      }
      return names
    }
    toStringWithLineNumbers() {
      return this.toString()
        .split("\n")
        .map((line, index) => `${index + 1} ${line}`)
        .join("\n")
    }
    toCsv() {
      return this.toDelimited(",")
    }
    _getTypes(header) {
      const matrix = this._getMatrix(header)
      const types = header.map(i => "int")
      matrix.forEach(row => {
        row.forEach((value, index) => {
          const type = types[index]
          if (type === "string") return 1
          if (value === undefined || value === "") return 1
          if (type === "float") {
            if (value.match(/^\-?[0-9]*\.?[0-9]*$/)) return 1
            types[index] = "string"
          }
          if (value.match(/^\-?[0-9]+$/)) return 1
          types[index] = "string"
        })
      })
      return types
    }
    toDataTable(header = this._getUnionNames()) {
      const types = this._getTypes(header)
      const parsers = {
        string: str => str,
        float: parseFloat,
        int: parseInt
      }
      const cellFn = (cellValue, rowIndex, columnIndex) => (rowIndex ? parsers[types[columnIndex]](cellValue) : cellValue)
      const arrays = this._toArrays(header, cellFn)
      arrays.rows.unshift(arrays.header)
      return arrays.rows
    }
    toDelimited(delimiter, header = this._getUnionNames(), escapeSpecialChars = true) {
      const regex = new RegExp(`(\\n|\\"|\\${delimiter})`)
      const cellFn = (str, row, column) => (!str.toString().match(regex) ? str : `"` + str.replace(/\"/g, `""`) + `"`)
      return this._toDelimited(delimiter, header, escapeSpecialChars ? cellFn : str => str)
    }
    _getMatrix(columns) {
      const matrix = []
      this.forEach(child => {
        const row = []
        columns.forEach(col => {
          row.push(child.get(col))
        })
        matrix.push(row)
      })
      return matrix
    }
    _toArrays(columnNames, cellFn) {
      const skipHeaderRow = 1
      const header = columnNames.map((columnName, index) => cellFn(columnName, 0, index))
      const rows = this.map((node, rowNumber) =>
        columnNames.map((columnName, columnIndex) => {
          const childNode = node.getNode(columnName)
          const content = childNode ? childNode.getContentWithChildren() : ""
          return cellFn(content, rowNumber + skipHeaderRow, columnIndex)
        })
      )
      return {
        rows,
        header
      }
    }
    _toDelimited(delimiter, header, cellFn) {
      const data = this._toArrays(header, cellFn)
      return data.header.join(delimiter) + "\n" + data.rows.map(row => row.join(delimiter)).join("\n")
    }
    toTable() {
      // Output a table for printing
      return this._toTable(100, false)
    }
    toFormattedTable(maxCharactersPerColumn, alignRight = false) {
      return this._toTable(maxCharactersPerColumn, alignRight)
    }
    _toTable(maxCharactersPerColumn, alignRight = false) {
      const header = this._getUnionNames()
      // Set initial column widths
      const widths = header.map(col => (col.length > maxCharactersPerColumn ? maxCharactersPerColumn : col.length))
      // Expand column widths if needed
      this.forEach(node => {
        if (!node.length) return true
        header.forEach((col, index) => {
          const cellValue = node.get(col)
          if (!cellValue) return true
          const length = cellValue.toString().length
          if (length > widths[index]) widths[index] = length > maxCharactersPerColumn ? maxCharactersPerColumn : length
        })
      })
      const cellFn = (cellText, row, col) => {
        const width = widths[col]
        // Strip newlines in fixedWidth output
        const cellValue = cellText.toString().replace(/\n/g, "\\n")
        const cellLength = cellValue.length
        if (cellLength > width) return cellValue.substr(0, width) + "..."
        const padding = " ".repeat(width - cellLength)
        return alignRight ? padding + cellValue : cellValue + padding
      }
      return this._toDelimited(" ", header, cellFn)
    }
    toSsv() {
      return this.toDelimited(" ")
    }
    toOutline() {
      return this._toOutline(node => node.getLine())
    }
    toMappedOutline(nodeFn) {
      return this._toOutline(nodeFn)
    }
    // Adapted from: https://github.com/notatestuser/treeify.js
    _toOutline(nodeFn) {
      const growBranch = (outlineTreeNode, last, lastStates, nodeFn, callback) => {
        let lastStatesCopy = lastStates.slice(0)
        const node = outlineTreeNode.node
        if (lastStatesCopy.push([outlineTreeNode, last]) && lastStates.length > 0) {
          let line = ""
          // firstWordd on the "was last element" states of whatever we're nested within,
          // we need to append either blankness or a branch to our line
          lastStates.forEach((lastState, idx) => {
            if (idx > 0) line += lastState[1] ? " " : "│"
          })
          // the prefix varies firstWordd on whether the key contains something to show and
          // whether we're dealing with the last element in this collection
          // the extra "-" just makes things stand out more.
          line += (last ? "└" : "├") + nodeFn(node)
          callback(line)
        }
        if (!node) return
        const length = node.length
        let index = 0
        node.forEach(node => {
          let lastKey = ++index === length
          growBranch({ node: node }, lastKey, lastStatesCopy, nodeFn, callback)
        })
      }
      let output = ""
      growBranch({ node: this }, false, [], nodeFn, line => (output += line + "\n"))
      return output
    }
    copyTo(node, index) {
      return node._insertLineAndChildren(this.getLine(), this.childrenToString(), index)
    }
    // Note: Splits using a positive lookahead
    // this.split("foo").join("\n") === this.toString()
    split(firstWord) {
      const constructor = this.constructor
      const NodeBreakSymbol = this.getNodeBreakSymbol()
      const WordBreakSymbol = this.getWordBreakSymbol()
      // todo: cleanup. the escaping is wierd.
      return this.toString()
        .split(new RegExp(`\\${NodeBreakSymbol}(?=${firstWord}(?:${WordBreakSymbol}|\\${NodeBreakSymbol}))`, "g"))
        .map(str => new constructor(str))
    }
    toMarkdownTable() {
      return this.toMarkdownTableAdvanced(this._getUnionNames(), val => val)
    }
    toMarkdownTableAdvanced(columns, formatFn) {
      const matrix = this._getMatrix(columns)
      const empty = columns.map(col => "-")
      matrix.unshift(empty)
      matrix.unshift(columns)
      const lines = matrix.map((row, rowIndex) => {
        const formattedValues = row.map((val, colIndex) => formatFn(val, rowIndex, colIndex))
        return `|${formattedValues.join("|")}|`
      })
      return lines.join("\n")
    }
    toTsv() {
      return this.toDelimited("\t")
    }
    getNodeBreakSymbol() {
      return "\n"
    }
    getWordBreakSymbol() {
      return " "
    }
    getNodeBreakSymbolRegex() {
      return new RegExp(this.getNodeBreakSymbol(), "g")
    }
    getEdgeSymbol() {
      return " "
    }
    _textToContentAndChildrenTuple(text) {
      const lines = text.split(this.getNodeBreakSymbolRegex())
      const firstLine = lines.shift()
      const children = !lines.length
        ? undefined
        : lines
            .map(line => (line.substr(0, 1) === this.getEdgeSymbol() ? line : this.getEdgeSymbol() + line))
            .map(line => line.substr(1))
            .join(this.getNodeBreakSymbol())
      return [firstLine, children]
    }
    _getLine() {
      return this._line
    }
    _setLine(line = "") {
      this._line = line
      if (this._words) delete this._words
      return this
    }
    _clearChildren() {
      this._deleteByIndexes(Utils.getRange(0, this.length))
      delete this._children
      return this
    }
    _setChildren(content, circularCheckArray) {
      this._clearChildren()
      if (!content) return this
      // set from string
      if (typeof content === "string") {
        this._appendChildrenFromString(content)
        return this
      }
      // set from tree object
      if (content instanceof TreeNode) {
        content.forEach(node => this._insertLineAndChildren(node.getLine(), node.childrenToString()))
        return this
      }
      // If we set from object, create an array of inserted objects to avoid circular loops
      if (!circularCheckArray) circularCheckArray = [content]
      return this._setFromObject(content, circularCheckArray)
    }
    _setFromObject(content, circularCheckArray) {
      for (let firstWord in content) {
        if (!content.hasOwnProperty(firstWord)) continue
        // Branch the circularCheckArray, as we only have same branch circular arrays
        this._appendFromJavascriptObjectTuple(firstWord, content[firstWord], circularCheckArray.slice(0))
      }
      return this
    }
    // todo: refactor the below.
    _appendFromJavascriptObjectTuple(firstWord, content, circularCheckArray) {
      const type = typeof content
      let line
      let children
      if (content === null) line = firstWord + " " + null
      else if (content === undefined) line = firstWord
      else if (type === "string") {
        const tuple = this._textToContentAndChildrenTuple(content)
        line = firstWord + " " + tuple[0]
        children = tuple[1]
      } else if (type === "function") line = firstWord + " " + content.toString()
      else if (type !== "object") line = firstWord + " " + content
      else if (content instanceof Date) line = firstWord + " " + content.getTime().toString()
      else if (content instanceof TreeNode) {
        line = firstWord
        children = new TreeNode(content.childrenToString(), content.getLine())
      } else if (circularCheckArray.indexOf(content) === -1) {
        circularCheckArray.push(content)
        line = firstWord
        const length = content instanceof Array ? content.length : Object.keys(content).length
        if (length) children = new TreeNode()._setChildren(content, circularCheckArray)
      } else {
        // iirc this is return early from circular
        return
      }
      this._insertLineAndChildren(line, children)
    }
    _insertLineAndChildren(line, children, index = this.length) {
      const nodeConstructor = this._getParser()._getNodeConstructor(line, this)
      const newNode = new nodeConstructor(children, line, this)
      const adjustedIndex = index < 0 ? this.length + index : index
      this._getChildrenArray().splice(adjustedIndex, 0, newNode)
      if (this._index) this._makeIndex(adjustedIndex)
      this.clearQuickCache()
      return newNode
    }
    _appendChildrenFromString(str) {
      const lines = str.split(this.getNodeBreakSymbolRegex())
      const parentStack = []
      let currentIndentCount = -1
      let lastNode = this
      lines.forEach(line => {
        const indentCount = this._getIndentCount(line)
        if (indentCount > currentIndentCount) {
          currentIndentCount++
          parentStack.push(lastNode)
        } else if (indentCount < currentIndentCount) {
          // pop things off stack
          while (indentCount < currentIndentCount) {
            parentStack.pop()
            currentIndentCount--
          }
        }
        const lineContent = line.substr(currentIndentCount)
        const parent = parentStack[parentStack.length - 1]
        const nodeConstructor = parent._getParser()._getNodeConstructor(lineContent, parent)
        lastNode = new nodeConstructor(undefined, lineContent, parent)
        parent._getChildrenArray().push(lastNode)
      })
    }
    _getIndex() {
      // StringMap<int> {firstWord: index}
      // When there are multiple tails with the same firstWord, _index stores the last content.
      // todo: change the above behavior: when a collision occurs, create an array.
      return this._index || this._makeIndex()
    }
    getContentsArray() {
      return this.map(node => node.content)
    }
    // todo: rename to getChildrenByConstructor(?)
    getChildrenByNodeConstructor(constructor) {
      return this.filter(child => child instanceof constructor)
    }
    getAncestorByNodeConstructor(constructor) {
      if (this instanceof constructor) return this
      if (this.isRoot()) return undefined
      const parent = this.parent
      return parent instanceof constructor ? parent : parent.getAncestorByNodeConstructor(constructor)
    }
    // todo: rename to getNodeByConstructor(?)
    getNodeByType(constructor) {
      return this.find(child => child instanceof constructor)
    }
    indexOfLast(firstWord) {
      const result = this._getIndex()[firstWord]
      return result === undefined ? -1 : result
    }
    // todo: renmae to indexOfFirst?
    indexOf(firstWord) {
      if (!this.has(firstWord)) return -1
      const length = this.length
      const nodes = this._getChildrenArray()
      for (let index = 0; index < length; index++) {
        if (nodes[index].firstWord === firstWord) return index
      }
    }
    // todo: rename this. it is a particular type of object.
    toObject() {
      return this._toObject()
    }
    getFirstWords() {
      return this.map(node => node.firstWord)
    }
    _makeIndex(startAt = 0) {
      if (!this._index || !startAt) this._index = {}
      const nodes = this._getChildrenArray()
      const newIndex = this._index
      const length = nodes.length
      for (let index = startAt; index < length; index++) {
        newIndex[nodes[index].firstWord] = index
      }
      return newIndex
    }
    _childrenToXml(indentCount) {
      return this.map(node => node._toXml(indentCount)).join("")
    }
    _getIndentCount(str) {
      let level = 0
      const edgeChar = this.getEdgeSymbol()
      while (str[level] === edgeChar) {
        level++
      }
      return level
    }
    clone(children = this.childrenToString(), line = this.getLine()) {
      return new this.constructor(children, line)
    }
    hasFirstWord(firstWord) {
      return this._hasFirstWord(firstWord)
    }
    has(firstWordPath) {
      const edgeSymbol = this.getEdgeSymbol()
      if (!firstWordPath.includes(edgeSymbol)) return this.hasFirstWord(firstWordPath)
      const parts = firstWordPath.split(edgeSymbol)
      const next = this.getNode(parts.shift())
      if (!next) return false
      return next.has(parts.join(edgeSymbol))
    }
    hasNode(node) {
      const needle = node.toString()
      return this.getChildren().some(node => node.toString() === needle)
    }
    _hasFirstWord(firstWord) {
      return this._getIndex()[firstWord] !== undefined
    }
    map(fn) {
      return this.getChildren().map(fn)
    }
    filter(fn = item => item) {
      return this.getChildren().filter(fn)
    }
    find(fn) {
      return this.getChildren().find(fn)
    }
    findLast(fn) {
      return this.getChildren()
        .reverse()
        .find(fn)
    }
    every(fn) {
      let index = 0
      for (let node of this.getTopDownArrayIterator()) {
        if (!fn(node, index)) return false
        index++
      }
      return true
    }
    forEach(fn) {
      this.getChildren().forEach(fn)
      return this
    }
    // Recurse if predicate passes
    deepVisit(predicate) {
      this.forEach(node => {
        if (predicate(node) !== false) node.deepVisit(predicate)
      })
    }
    get quickCache() {
      if (!this._quickCache) this._quickCache = {}
      return this._quickCache
    }
    clearQuickCache() {
      delete this._quickCache
    }
    // todo: protected?
    _clearIndex() {
      delete this._index
      this.clearQuickCache()
    }
    slice(start, end) {
      return this.getChildren().slice(start, end)
    }
    // todo: make 0 and 1 a param
    getInheritanceTree() {
      const paths = {}
      const result = new TreeNode()
      this.forEach(node => {
        const key = node.getWord(0)
        const parentKey = node.getWord(1)
        const parentPath = paths[parentKey]
        paths[key] = parentPath ? [parentPath, key].join(" ") : key
        result.touchNode(paths[key])
      })
      return result
    }
    _getGrandParent() {
      return this.isRoot() || this.parent.isRoot() ? undefined : this.parent.parent
    }
    _getParser() {
      if (!TreeNode._parsers.has(this.constructor)) TreeNode._parsers.set(this.constructor, this.createParser())
      return TreeNode._parsers.get(this.constructor)
    }
    createParser() {
      return new Parser(this.constructor)
    }
    static _makeUniqueId() {
      if (this._uniqueId === undefined) this._uniqueId = 0
      this._uniqueId++
      return this._uniqueId
    }
    static _getFileFormat(path) {
      const format = path.split(".").pop()
      return FileFormat[format] ? format : FileFormat.tree
    }
    getLineModifiedTime() {
      return this._lineModifiedTime || this._nodeCreationTime
    }
    getChildArrayModifiedTime() {
      return this._childArrayModifiedTime || this._nodeCreationTime
    }
    _setChildArrayMofifiedTime(value) {
      this._childArrayModifiedTime = value
      return this
    }
    getLineOrChildrenModifiedTime() {
      return Math.max(
        this.getLineModifiedTime(),
        this.getChildArrayModifiedTime(),
        Math.max.apply(
          null,
          this.map(child => child.getLineOrChildrenModifiedTime())
        )
      )
    }
    _setVirtualParentTree(tree) {
      this._virtualParentTree = tree
      return this
    }
    _getVirtualParentTreeNode() {
      return this._virtualParentTree
    }
    _setVirtualAncestorNodesByInheritanceViaColumnIndicesAndThenExpand(nodes, thisIdColumnNumber, extendsIdColumnNumber) {
      const map = {}
      for (let node of nodes) {
        const nodeId = node.getWord(thisIdColumnNumber)
        if (map[nodeId]) throw new Error(`Tried to define a node with id "${nodeId}" but one is already defined.`)
        map[nodeId] = {
          nodeId: nodeId,
          node: node,
          parentId: node.getWord(extendsIdColumnNumber)
        }
      }
      // Add parent Nodes
      Object.values(map).forEach(nodeInfo => {
        const parentId = nodeInfo.parentId
        const parentNode = map[parentId]
        if (parentId && !parentNode) throw new Error(`Node "${nodeInfo.nodeId}" tried to extend "${parentId}" but "${parentId}" not found.`)
        if (parentId) nodeInfo.node._setVirtualParentTree(parentNode.node)
      })
      nodes.forEach(node => node._expandFromVirtualParentTree())
      return this
    }
    _expandFromVirtualParentTree() {
      if (this._isVirtualExpanded) return this
      this._isExpanding = true
      let parentNode = this._getVirtualParentTreeNode()
      if (parentNode) {
        if (parentNode._isExpanding) throw new Error(`Loop detected: '${this.getLine()}' is the ancestor of one of its ancestors.`)
        parentNode._expandFromVirtualParentTree()
        const clone = this.clone()
        this._setChildren(parentNode.childrenToString())
        this.extend(clone)
      }
      this._isExpanding = false
      this._isVirtualExpanded = true
    }
    // todo: solve issue related to whether extend should overwrite or append.
    _expandChildren(thisIdColumnNumber, extendsIdColumnNumber, childrenThatNeedExpanding = this.getChildren()) {
      return this._setVirtualAncestorNodesByInheritanceViaColumnIndicesAndThenExpand(childrenThatNeedExpanding, thisIdColumnNumber, extendsIdColumnNumber)
    }
    // todo: add more testing.
    // todo: solve issue with where extend should overwrite or append
    // todo: should take a grammar? to decide whether to overwrite or append.
    // todo: this is slow.
    extend(nodeOrStr) {
      const node = nodeOrStr instanceof TreeNode ? nodeOrStr : new TreeNode(nodeOrStr)
      const usedFirstWords = new Set()
      node.forEach(sourceNode => {
        const firstWord = sourceNode.firstWord
        let targetNode
        const isAnArrayNotMap = usedFirstWords.has(firstWord)
        if (!this.has(firstWord)) {
          usedFirstWords.add(firstWord)
          this.appendLineAndChildren(sourceNode.getLine(), sourceNode.childrenToString())
          return true
        }
        if (isAnArrayNotMap) targetNode = this.appendLine(sourceNode.getLine())
        else {
          targetNode = this.touchNode(firstWord).setContent(sourceNode.content)
          usedFirstWords.add(firstWord)
        }
        if (sourceNode.length) targetNode.extend(sourceNode)
      })
      return this
    }
    lastNode() {
      return this.getChildren()[this.length - 1]
    }
    expandLastFromTopMatter() {
      const clone = this.clone()
      const map = new Map()
      const lastNode = clone.lastNode()
      lastNode.getOlderSiblings().forEach(node => map.set(node.getWord(0), node))
      lastNode.getTopDownArray().forEach(node => {
        const replacement = map.get(node.getWord(0))
        if (!replacement) return
        node.replaceNode(str => replacement.toString())
      })
      return lastNode
    }
    macroExpand(macroDefinitionWord, macroUsageWord) {
      const clone = this.clone()
      const defs = clone.findNodes(macroDefinitionWord)
      const allUses = clone.findNodes(macroUsageWord)
      const wordBreakSymbol = clone.getWordBreakSymbol()
      defs.forEach(def => {
        const macroName = def.getWord(1)
        const uses = allUses.filter(node => node.hasWord(1, macroName))
        const params = def.getWordsFrom(2)
        const replaceFn = str => {
          const paramValues = str.split(wordBreakSymbol).slice(2)
          let newTree = def.childrenToString()
          params.forEach((param, index) => {
            newTree = newTree.replace(new RegExp(param, "g"), paramValues[index])
          })
          return newTree
        }
        uses.forEach(node => {
          node.replaceNode(replaceFn)
        })
        def.destroy()
      })
      return clone
    }
    setChildren(children) {
      return this._setChildren(children)
    }
    _updateLineModifiedTimeAndTriggerEvent() {
      this._lineModifiedTime = this._getProcessTimeInMilliseconds()
    }
    insertWord(index, word) {
      const wi = this.getWordBreakSymbol()
      const words = this._getLine().split(wi)
      words.splice(index, 0, word)
      this.setLine(words.join(wi))
      return this
    }
    deleteDuplicates() {
      const set = new Set()
      this.getTopDownArray().forEach(node => {
        const str = node.toString()
        if (set.has(str)) node.destroy()
        else set.add(str)
      })
      return this
    }
    setWord(index, word) {
      const wi = this.getWordBreakSymbol()
      const words = this._getLine().split(wi)
      words[index] = word
      this.setLine(words.join(wi))
      return this
    }
    deleteChildren() {
      return this._clearChildren()
    }
    setContent(content) {
      if (content === this.content) return this
      const newArray = [this.firstWord]
      if (content !== undefined) {
        content = content.toString()
        if (content.match(this.getNodeBreakSymbol())) return this.setContentWithChildren(content)
        newArray.push(content)
      }
      this._setLine(newArray.join(this.getWordBreakSymbol()))
      this._updateLineModifiedTimeAndTriggerEvent()
      return this
    }
    prependSibling(line, children) {
      return this.parent.insertLineAndChildren(line, children, this.getIndex())
    }
    appendSibling(line, children) {
      return this.parent.insertLineAndChildren(line, children, this.getIndex() + 1)
    }
    setContentWithChildren(text) {
      // todo: deprecate
      if (!text.includes(this.getNodeBreakSymbol())) {
        this._clearChildren()
        return this.setContent(text)
      }
      const lines = text.split(this.getNodeBreakSymbolRegex())
      const firstLine = lines.shift()
      this.setContent(firstLine)
      // tood: cleanup.
      const remainingString = lines.join(this.getNodeBreakSymbol())
      const children = new TreeNode(remainingString)
      if (!remainingString) children.appendLine("")
      this.setChildren(children)
      return this
    }
    setFirstWord(firstWord) {
      return this.setWord(0, firstWord)
    }
    setLine(line) {
      if (line === this.getLine()) return this
      // todo: clear parent TMTimes
      this.parent._clearIndex()
      this._setLine(line)
      this._updateLineModifiedTimeAndTriggerEvent()
      return this
    }
    duplicate() {
      return this.parent._insertLineAndChildren(this.getLine(), this.childrenToString(), this.getIndex() + 1)
    }
    trim() {
      // todo: could do this so only the trimmed rows are deleted.
      this.setChildren(this.childrenToString().trim())
      return this
    }
    destroy() {
      this.parent._deleteNode(this)
    }
    set(firstWordPath, text) {
      return this.touchNode(firstWordPath).setContentWithChildren(text)
    }
    setFromText(text) {
      if (this.toString() === text) return this
      const tuple = this._textToContentAndChildrenTuple(text)
      this.setLine(tuple[0])
      return this._setChildren(tuple[1])
    }
    setPropertyIfMissing(prop, value) {
      if (this.has(prop)) return true
      return this.touchNode(prop).setContent(value)
    }
    setProperties(propMap) {
      const props = Object.keys(propMap)
      const values = Object.values(propMap)
      // todo: is there a built in tree method to do this?
      props.forEach((prop, index) => {
        const value = values[index]
        if (!value) return true
        if (this.get(prop) === value) return true
        this.touchNode(prop).setContent(value)
      })
      return this
    }
    // todo: throw error if line contains a \n
    appendLine(line) {
      return this._insertLineAndChildren(line)
    }
    appendLineAndChildren(line, children) {
      return this._insertLineAndChildren(line, children)
    }
    getNodesByRegex(regex) {
      const matches = []
      regex = regex instanceof RegExp ? [regex] : regex
      this._getNodesByLineRegex(matches, regex)
      return matches
    }
    // todo: remove?
    getNodesByLinePrefixes(columns) {
      const matches = []
      this._getNodesByLineRegex(
        matches,
        columns.map(str => new RegExp("^" + str))
      )
      return matches
    }
    nodesThatStartWith(prefix) {
      return this.filter(node => node.getLine().startsWith(prefix))
    }
    _getNodesByLineRegex(matches, regs) {
      const rgs = regs.slice(0)
      const reg = rgs.shift()
      const candidates = this.filter(child => child.getLine().match(reg))
      if (!rgs.length) return candidates.forEach(cand => matches.push(cand))
      candidates.forEach(cand => cand._getNodesByLineRegex(matches, rgs))
    }
    concat(node) {
      if (typeof node === "string") node = new TreeNode(node)
      return node.map(node => this._insertLineAndChildren(node.getLine(), node.childrenToString()))
    }
    _deleteByIndexes(indexesToDelete) {
      if (!indexesToDelete.length) return this
      this._clearIndex()
      // note: assumes indexesToDelete is in ascending order
      const deletedNodes = indexesToDelete.reverse().map(index => this._getChildrenArray().splice(index, 1)[0])
      this._setChildArrayMofifiedTime(this._getProcessTimeInMilliseconds())
      return this
    }
    _deleteNode(node) {
      const index = this._indexOfNode(node)
      return index > -1 ? this._deleteByIndexes([index]) : 0
    }
    reverse() {
      this._clearIndex()
      this._getChildrenArray().reverse()
      return this
    }
    shift() {
      if (!this.length) return null
      const node = this._getChildrenArray().shift()
      return node.copyTo(new this.constructor(), 0)
    }
    sort(fn) {
      this._getChildrenArray().sort(fn)
      this._clearIndex()
      return this
    }
    invert() {
      this.forEach(node => node.words.reverse())
      return this
    }
    _rename(oldFirstWord, newFirstWord) {
      const index = this.indexOf(oldFirstWord)
      if (index === -1) return this
      const node = this._getChildrenArray()[index]
      node.setFirstWord(newFirstWord)
      this._clearIndex()
      return this
    }
    // Does not recurse.
    remap(map) {
      this.forEach(node => {
        const firstWord = node.firstWord
        if (map[firstWord] !== undefined) node.setFirstWord(map[firstWord])
      })
      return this
    }
    rename(oldFirstWord, newFirstWord) {
      this._rename(oldFirstWord, newFirstWord)
      return this
    }
    renameAll(oldName, newName) {
      this.findNodes(oldName).forEach(node => node.setFirstWord(newName))
      return this
    }
    _deleteAllChildNodesWithFirstWord(firstWord) {
      if (!this.has(firstWord)) return this
      const allNodes = this._getChildrenArray()
      const indexesToDelete = []
      allNodes.forEach((node, index) => {
        if (node.firstWord === firstWord) indexesToDelete.push(index)
      })
      return this._deleteByIndexes(indexesToDelete)
    }
    delete(path = "") {
      const edgeSymbol = this.getEdgeSymbol()
      if (!path.includes(edgeSymbol)) return this._deleteAllChildNodesWithFirstWord(path)
      const parts = path.split(edgeSymbol)
      const nextFirstWord = parts.pop()
      const targetNode = this.getNode(parts.join(edgeSymbol))
      return targetNode ? targetNode._deleteAllChildNodesWithFirstWord(nextFirstWord) : 0
    }
    deleteColumn(firstWord = "") {
      this.forEach(node => node.delete(firstWord))
      return this
    }
    _getNonMaps() {
      const results = this.getTopDownArray().filter(node => node.hasDuplicateFirstWords())
      if (this.hasDuplicateFirstWords()) results.unshift(this)
      return results
    }
    replaceNode(fn) {
      const parent = this.parent
      const index = this.getIndex()
      const newNodes = new TreeNode(fn(this.toString()))
      const returnedNodes = []
      newNodes.forEach((child, childIndex) => {
        const newNode = parent.insertLineAndChildren(child.getLine(), child.childrenToString(), index + childIndex)
        returnedNodes.push(newNode)
      })
      this.destroy()
      return returnedNodes
    }
    insertLineAndChildren(line, children, index) {
      return this._insertLineAndChildren(line, children, index)
    }
    insertLine(line, index) {
      return this._insertLineAndChildren(line, undefined, index)
    }
    prependLine(line) {
      return this.insertLine(line, 0)
    }
    pushContentAndChildren(content, children) {
      let index = this.length
      while (this.has(index.toString())) {
        index++
      }
      const line = index.toString() + (content === undefined ? "" : this.getWordBreakSymbol() + content)
      return this.appendLineAndChildren(line, children)
    }
    deleteBlanks() {
      this.getChildren()
        .filter(node => node.isBlankLine())
        .forEach(node => node.destroy())
      return this
    }
    // todo: add "globalReplace" method? Which runs a global regex or string replace on the Tree doc as a string?
    firstWordSort(firstWordOrder) {
      return this._firstWordSort(firstWordOrder)
    }
    deleteWordAt(wordIndex) {
      const words = this.words
      words.splice(wordIndex, 1)
      return this.setWords(words)
    }
    trigger(event) {
      if (this._listeners && this._listeners.has(event.constructor)) {
        const listeners = this._listeners.get(event.constructor)
        const listenersToRemove = []
        for (let index = 0; index < listeners.length; index++) {
          const listener = listeners[index]
          if (listener(event) === true) listenersToRemove.push(index)
        }
        listenersToRemove.reverse().forEach(index => listenersToRemove.splice(index, 1))
      }
    }
    triggerAncestors(event) {
      if (this.isRoot()) return
      const parent = this.parent
      parent.trigger(event)
      parent.triggerAncestors(event)
    }
    onLineChanged(eventHandler) {
      return this._addEventListener(LineChangedTreeEvent, eventHandler)
    }
    onDescendantChanged(eventHandler) {
      return this._addEventListener(DescendantChangedTreeEvent, eventHandler)
    }
    onChildAdded(eventHandler) {
      return this._addEventListener(ChildAddedTreeEvent, eventHandler)
    }
    onChildRemoved(eventHandler) {
      return this._addEventListener(ChildRemovedTreeEvent, eventHandler)
    }
    _addEventListener(eventClass, eventHandler) {
      if (!this._listeners) this._listeners = new Map()
      if (!this._listeners.has(eventClass)) this._listeners.set(eventClass, [])
      this._listeners.get(eventClass).push(eventHandler)
      return this
    }
    setWords(words) {
      return this.setLine(words.join(this.getWordBreakSymbol()))
    }
    setWordsFrom(index, words) {
      this.setWords(this.words.slice(0, index).concat(words))
      return this
    }
    appendWord(word) {
      const words = this.words
      words.push(word)
      return this.setWords(words)
    }
    _firstWordSort(firstWordOrder, secondarySortFn) {
      const nodeAFirst = -1
      const nodeBFirst = 1
      const map = {}
      firstWordOrder.forEach((word, index) => {
        map[word] = index
      })
      this.sort((nodeA, nodeB) => {
        const valA = map[nodeA.firstWord]
        const valB = map[nodeB.firstWord]
        if (valA > valB) return nodeBFirst
        if (valA < valB) return nodeAFirst
        return secondarySortFn ? secondarySortFn(nodeA, nodeB) : 0
      })
      return this
    }
    _touchNode(firstWordPathArray) {
      let contextNode = this
      firstWordPathArray.forEach(firstWord => {
        contextNode = contextNode.getNode(firstWord) || contextNode.appendLine(firstWord)
      })
      return contextNode
    }
    _touchNodeByString(str) {
      str = str.replace(this.getNodeBreakSymbolRegex(), "") // todo: do we want to do this sanitization?
      return this._touchNode(str.split(this.getWordBreakSymbol()))
    }
    touchNode(str) {
      return this._touchNodeByString(str)
    }
    appendNode(node) {
      return this.appendLineAndChildren(node.getLine(), node.childrenToString())
    }
    hasLine(line) {
      return this.getChildren().some(node => node.getLine() === line)
    }
    getNodesByLine(line) {
      return this.filter(node => node.getLine() === line)
    }
    toggleLine(line) {
      const lines = this.getNodesByLine(line)
      if (lines.length) {
        lines.map(line => line.destroy())
        return this
      }
      return this.appendLine(line)
    }
    // todo: remove?
    sortByColumns(indexOrIndices) {
      const indices = indexOrIndices instanceof Array ? indexOrIndices : [indexOrIndices]
      const length = indices.length
      this.sort((nodeA, nodeB) => {
        const wordsA = nodeA.words
        const wordsB = nodeB.words
        for (let index = 0; index < length; index++) {
          const col = indices[index]
          const av = wordsA[col]
          const bv = wordsB[col]
          if (av === undefined) return -1
          if (bv === undefined) return 1
          if (av > bv) return 1
          else if (av < bv) return -1
        }
        return 0
      })
      return this
    }
    getWordsAsSet() {
      return new Set(this.getWordsFrom(1))
    }
    appendWordIfMissing(word) {
      if (this.getWordsAsSet().has(word)) return this
      return this.appendWord(word)
    }
    // todo: check to ensure identical objects
    addObjectsAsDelimited(arrayOfObjects, delimiter = Utils._chooseDelimiter(new TreeNode(arrayOfObjects).toString())) {
      const header = Object.keys(arrayOfObjects[0])
        .join(delimiter)
        .replace(/[\n\r]/g, "")
      const rows = arrayOfObjects.map(item =>
        Object.values(item)
          .join(delimiter)
          .replace(/[\n\r]/g, "")
      )
      return this.addUniqueRowsToNestedDelimited(header, rows)
    }
    setChildrenAsDelimited(tree, delimiter = Utils._chooseDelimiter(tree.toString())) {
      tree = tree instanceof TreeNode ? tree : new TreeNode(tree)
      return this.setChildren(tree.toDelimited(delimiter))
    }
    convertChildrenToDelimited(delimiter = Utils._chooseDelimiter(this.childrenToString())) {
      // todo: handle newlines!!!
      return this.setChildren(this.toDelimited(delimiter))
    }
    addUniqueRowsToNestedDelimited(header, rowsAsStrings) {
      if (!this.length) this.appendLine(header)
      // todo: this looks brittle
      rowsAsStrings.forEach(row => {
        if (!this.toString().includes(row)) this.appendLine(row)
      })
      return this
    }
    shiftLeft() {
      const grandParent = this._getGrandParent()
      if (!grandParent) return this
      const parentIndex = this.parent.getIndex()
      const newNode = grandParent.insertLineAndChildren(this.getLine(), this.length ? this.childrenToString() : undefined, parentIndex + 1)
      this.destroy()
      return newNode
    }
    pasteText(text) {
      const parent = this.parent
      const index = this.getIndex()
      const newNodes = new TreeNode(text)
      const firstNode = newNodes.nodeAt(0)
      if (firstNode) {
        this.setLine(firstNode.getLine())
        if (firstNode.length) this.setChildren(firstNode.childrenToString())
      } else {
        this.setLine("")
      }
      newNodes.forEach((child, childIndex) => {
        if (!childIndex)
          // skip first
          return true
        parent.insertLineAndChildren(child.getLine(), child.childrenToString(), index + childIndex)
      })
      return this
    }
    templateToString(obj) {
      // todo: compile/cache for perf?
      const tree = this.clone()
      tree.getTopDownArray().forEach(node => {
        const line = node.getLine().replace(/{([^\}]+)}/g, (match, path) => {
          const replacement = obj[path]
          if (replacement === undefined) throw new Error(`In string template no match found on line "${node.getLine()}"`)
          return replacement
        })
        node.pasteText(line)
      })
      return tree.toString()
    }
    shiftRight() {
      const olderSibling = this._getClosestOlderSibling()
      if (!olderSibling) return this
      const newNode = olderSibling.appendLineAndChildren(this.getLine(), this.length ? this.childrenToString() : undefined)
      this.destroy()
      return newNode
    }
    shiftYoungerSibsRight() {
      const nodes = this.getYoungerSiblings()
      nodes.forEach(node => node.shiftRight())
      return this
    }
    sortBy(nameOrNames) {
      const names = nameOrNames instanceof Array ? nameOrNames : [nameOrNames]
      const length = names.length
      this.sort((nodeA, nodeB) => {
        if (!nodeB.length && !nodeA.length) return 0
        else if (!nodeA.length) return -1
        else if (!nodeB.length) return 1
        for (let index = 0; index < length; index++) {
          const firstWord = names[index]
          const av = nodeA.get(firstWord)
          const bv = nodeB.get(firstWord)
          if (av > bv) return 1
          else if (av < bv) return -1
        }
        return 0
      })
      return this
    }
    selectNode() {
      this._selected = true
    }
    unselectNode() {
      delete this._selected
    }
    isSelected() {
      return !!this._selected
    }
    async saveVersion() {
      const newVersion = this.toString()
      const topUndoVersion = this._getTopUndoVersion()
      if (newVersion === topUndoVersion) return undefined
      this._recordChange(newVersion)
      this._setSavedVersion(this.toString())
      return this
    }
    hasUnsavedChanges() {
      return this.toString() !== this._getSavedVersion()
    }
    async redo() {
      const undoStack = this._getUndoStack()
      const redoStack = this._getRedoStack()
      if (!redoStack.length) return undefined
      undoStack.push(redoStack.pop())
      return this._reloadFromUndoTop()
    }
    async undo() {
      const undoStack = this._getUndoStack()
      const redoStack = this._getRedoStack()
      if (undoStack.length === 1) return undefined
      redoStack.push(undoStack.pop())
      return this._reloadFromUndoTop()
    }
    _getSavedVersion() {
      return this._savedVersion
    }
    _setSavedVersion(str) {
      this._savedVersion = str
      return this
    }
    _clearRedoStack() {
      const redoStack = this._getRedoStack()
      redoStack.splice(0, redoStack.length)
    }
    getChangeHistory() {
      return this._getUndoStack().slice(0)
    }
    _getUndoStack() {
      if (!this._undoStack) this._undoStack = []
      return this._undoStack
    }
    _getRedoStack() {
      if (!this._redoStack) this._redoStack = []
      return this._redoStack
    }
    _getTopUndoVersion() {
      const undoStack = this._getUndoStack()
      return undoStack[undoStack.length - 1]
    }
    async _reloadFromUndoTop() {
      this.setChildren(this._getTopUndoVersion())
    }
    _recordChange(newVersion) {
      this._clearRedoStack()
      this._getUndoStack().push(newVersion) // todo: use diffs?
    }
    static fromCsv(str) {
      return this.fromDelimited(str, ",", '"')
    }
    // todo: jeez i think we can come up with a better name than "JsonSubset"
    static fromJsonSubset(str) {
      return new TreeNode(JSON.parse(str))
    }
    static serializedTreeNodeToTree(treeNode) {
      const language = new TreeNode()
      const cellDelimiter = language.getWordBreakSymbol()
      const nodeDelimiter = language.getNodeBreakSymbol()
      const line = treeNode.cells ? treeNode.cells.join(cellDelimiter) : undefined
      const tree = new TreeNode(undefined, line)
      if (treeNode.children)
        treeNode.children.forEach(child => {
          tree.appendNode(this.serializedTreeNodeToTree(child))
        })
      return tree
    }
    static fromJson(str) {
      return this.serializedTreeNodeToTree(JSON.parse(str))
    }
    static fromGridJson(str) {
      const lines = JSON.parse(str)
      const language = new TreeNode()
      const cellDelimiter = language.getWordBreakSymbol()
      const nodeDelimiter = language.getNodeBreakSymbol()
      return new TreeNode(lines.map(line => line.join(cellDelimiter)).join(nodeDelimiter))
    }
    static fromSsv(str) {
      return this.fromDelimited(str, " ", '"')
    }
    static fromTsv(str) {
      return this.fromDelimited(str, "\t", '"')
    }
    static fromDelimited(str, delimiter, quoteChar = '"') {
      str = str.replace(/\r/g, "") // remove windows newlines if present
      const rows = this._getEscapedRows(str, delimiter, quoteChar)
      return this._rowsToTreeNode(rows, delimiter, true)
    }
    static _getEscapedRows(str, delimiter, quoteChar) {
      return str.includes(quoteChar) ? this._strToRows(str, delimiter, quoteChar) : str.split("\n").map(line => line.split(delimiter))
    }
    static fromDelimitedNoHeaders(str, delimiter, quoteChar) {
      str = str.replace(/\r/g, "") // remove windows newlines if present
      const rows = this._getEscapedRows(str, delimiter, quoteChar)
      return this._rowsToTreeNode(rows, delimiter, false)
    }
    static _strToRows(str, delimiter, quoteChar, newLineChar = "\n") {
      const rows = [[]]
      const newLine = "\n"
      const length = str.length
      let currentCell = ""
      let inQuote = str.substr(0, 1) === quoteChar
      let currentPosition = inQuote ? 1 : 0
      let nextChar
      let isLastChar
      let currentRow = 0
      let char
      let isNextCharAQuote
      while (currentPosition < length) {
        char = str[currentPosition]
        isLastChar = currentPosition + 1 === length
        nextChar = str[currentPosition + 1]
        isNextCharAQuote = nextChar === quoteChar
        if (inQuote) {
          if (char !== quoteChar) currentCell += char
          else if (isNextCharAQuote) {
            // Both the current and next char are ", so the " is escaped
            currentCell += nextChar
            currentPosition++ // Jump 2
          } else {
            // If the current char is a " and the next char is not, it's the end of the quotes
            inQuote = false
            if (isLastChar) rows[currentRow].push(currentCell)
          }
        } else {
          if (char === delimiter) {
            rows[currentRow].push(currentCell)
            currentCell = ""
            if (isNextCharAQuote) {
              inQuote = true
              currentPosition++ // Jump 2
            }
          } else if (char === newLine) {
            rows[currentRow].push(currentCell)
            currentCell = ""
            currentRow++
            if (nextChar) rows[currentRow] = []
            if (isNextCharAQuote) {
              inQuote = true
              currentPosition++ // Jump 2
            }
          } else if (isLastChar) rows[currentRow].push(currentCell + char)
          else currentCell += char
        }
        currentPosition++
      }
      return rows
    }
    static multiply(nodeA, nodeB) {
      const productNode = nodeA.clone()
      productNode.forEach((node, index) => {
        node.setChildren(node.length ? this.multiply(node, nodeB) : nodeB.clone())
      })
      return productNode
    }
    // Given an array return a tree
    static _rowsToTreeNode(rows, delimiter, hasHeaders) {
      const numberOfColumns = rows[0].length
      const treeNode = new TreeNode()
      const names = this._getHeader(rows, hasHeaders)
      const rowCount = rows.length
      for (let rowIndex = hasHeaders ? 1 : 0; rowIndex < rowCount; rowIndex++) {
        let row = rows[rowIndex]
        // If the row contains too many columns, shift the extra columns onto the last one.
        // This allows you to not have to escape delimiter characters in the final column.
        if (row.length > numberOfColumns) {
          row[numberOfColumns - 1] = row.slice(numberOfColumns - 1).join(delimiter)
          row = row.slice(0, numberOfColumns)
        } else if (row.length < numberOfColumns) {
          // If the row is missing columns add empty columns until it is full.
          // This allows you to make including delimiters for empty ending columns in each row optional.
          while (row.length < numberOfColumns) {
            row.push("")
          }
        }
        const obj = {}
        row.forEach((cellValue, index) => {
          obj[names[index]] = cellValue
        })
        treeNode.pushContentAndChildren(undefined, obj)
      }
      return treeNode
    }
    static _initializeXmlParser() {
      if (this._xmlParser) return
      const windowObj = window
      if (typeof windowObj.DOMParser !== "undefined") this._xmlParser = xmlStr => new windowObj.DOMParser().parseFromString(xmlStr, "text/xml")
      else if (typeof windowObj.ActiveXObject !== "undefined" && new windowObj.ActiveXObject("Microsoft.XMLDOM")) {
        this._xmlParser = xmlStr => {
          const xmlDoc = new windowObj.ActiveXObject("Microsoft.XMLDOM")
          xmlDoc.async = "false"
          xmlDoc.loadXML(xmlStr)
          return xmlDoc
        }
      } else throw new Error("No XML parser found")
    }
    static fromXml(str) {
      this._initializeXmlParser()
      const xml = this._xmlParser(str)
      try {
        return this._treeNodeFromXml(xml).getNode("children")
      } catch (err) {
        return this._treeNodeFromXml(this._parseXml2(str)).getNode("children")
      }
    }
    static _zipObject(keys, values) {
      const obj = {}
      keys.forEach((key, index) => (obj[key] = values[index]))
      return obj
    }
    static fromShape(shapeArr, rootNode = new TreeNode()) {
      const part = shapeArr.shift()
      if (part !== undefined) {
        for (let index = 0; index < part; index++) {
          rootNode.appendLine(index.toString())
        }
      }
      if (shapeArr.length) rootNode.forEach(node => TreeNode.fromShape(shapeArr.slice(0), node))
      return rootNode
    }
    static fromDataTable(table) {
      const header = table.shift()
      return new TreeNode(table.map(row => this._zipObject(header, row)))
    }
    static _parseXml2(str) {
      const el = document.createElement("div")
      el.innerHTML = str
      return el
    }
    // todo: cleanup typings
    static _treeNodeFromXml(xml) {
      const result = new TreeNode()
      const children = new TreeNode()
      // Set attributes
      if (xml.attributes) {
        for (let index = 0; index < xml.attributes.length; index++) {
          result.set(xml.attributes[index].name, xml.attributes[index].value)
        }
      }
      if (xml.data) children.pushContentAndChildren(xml.data)
      // Set content
      if (xml.childNodes && xml.childNodes.length > 0) {
        for (let index = 0; index < xml.childNodes.length; index++) {
          const child = xml.childNodes[index]
          if (child.tagName && child.tagName.match(/parsererror/i)) throw new Error("Parse Error")
          if (child.childNodes.length > 0 && child.tagName) children.appendLineAndChildren(child.tagName, this._treeNodeFromXml(child))
          else if (child.tagName) children.appendLine(child.tagName)
          else if (child.data) {
            const data = child.data.trim()
            if (data) children.pushContentAndChildren(data)
          }
        }
      }
      if (children.length > 0) result.touchNode("children").setChildren(children)
      return result
    }
    static _getHeader(rows, hasHeaders) {
      const numberOfColumns = rows[0].length
      const headerRow = hasHeaders ? rows[0] : []
      const WordBreakSymbol = " "
      const ziRegex = new RegExp(WordBreakSymbol, "g")
      if (hasHeaders) {
        // Strip any WordBreakSymbols from column names in the header row.
        // This makes the mapping not quite 1 to 1 if there are any WordBreakSymbols in names.
        for (let index = 0; index < numberOfColumns; index++) {
          headerRow[index] = headerRow[index].replace(ziRegex, "")
        }
      } else {
        // If str has no headers, create them as 0,1,2,3
        for (let index = 0; index < numberOfColumns; index++) {
          headerRow.push(index.toString())
        }
      }
      return headerRow
    }
    static nest(str, xValue) {
      const NodeBreakSymbol = "\n"
      const WordBreakSymbol = " "
      const indent = NodeBreakSymbol + WordBreakSymbol.repeat(xValue)
      return str ? indent + str.replace(/\n/g, indent) : ""
    }
    static fromDisk(path) {
      const format = this._getFileFormat(path)
      const content = require("fs").readFileSync(path, "utf8")
      const methods = {
        tree: content => new TreeNode(content),
        csv: content => this.fromCsv(content),
        tsv: content => this.fromTsv(content)
      }
      return methods[format](content)
    }
    static fromFolder(folderPath, filepathPredicate = filepath => filepath !== ".DS_Store") {
      const path = require("path")
      const fs = require("fs")
      const tree = new TreeNode()
      const files = fs
        .readdirSync(folderPath)
        .map(filename => path.join(folderPath, filename))
        .filter(filepath => !fs.statSync(filepath).isDirectory() && filepathPredicate(filepath))
        .forEach(filePath => tree.appendLineAndChildren(filePath, fs.readFileSync(filePath, "utf8")))
      return tree
    }
  }
  TreeNode._parsers = new Map()
  TreeNode.Parser = Parser
  TreeNode.iris = `sepal_length,sepal_width,petal_length,petal_width,species
  6.1,3,4.9,1.8,virginica
  5.6,2.7,4.2,1.3,versicolor
  5.6,2.8,4.9,2,virginica
  6.2,2.8,4.8,1.8,virginica
  7.7,3.8,6.7,2.2,virginica
  5.3,3.7,1.5,0.2,setosa
  6.2,3.4,5.4,2.3,virginica
  4.9,2.5,4.5,1.7,virginica
  5.1,3.5,1.4,0.2,setosa
  5,3.4,1.5,0.2,setosa`
  TreeNode.getVersion = () => "68.0.0"
  class AbstractExtendibleTreeNode extends TreeNode {
    _getFromExtended(firstWordPath) {
      const hit = this._getNodeFromExtended(firstWordPath)
      return hit ? hit.get(firstWordPath) : undefined
    }
    _getFamilyTree() {
      const tree = new TreeNode()
      this.forEach(node => {
        const path = node._getAncestorsArray().map(node => node._getId())
        path.reverse()
        tree.touchNode(path.join(" "))
      })
      return tree
    }
    // todo: be more specific with the param
    _getChildrenByNodeConstructorInExtended(constructor) {
      return Utils.flatten(this._getAncestorsArray().map(node => node.getChildrenByNodeConstructor(constructor)))
    }
    _getExtendedParent() {
      return this._getAncestorsArray()[1]
    }
    _hasFromExtended(firstWordPath) {
      return !!this._getNodeFromExtended(firstWordPath)
    }
    _getNodeFromExtended(firstWordPath) {
      return this._getAncestorsArray().find(node => node.has(firstWordPath))
    }
    _getConcatBlockStringFromExtended(firstWordPath) {
      return this._getAncestorsArray()
        .filter(node => node.has(firstWordPath))
        .map(node => node.getNode(firstWordPath).childrenToString())
        .reverse()
        .join("\n")
    }
    _doesExtend(nodeTypeId) {
      return this._getAncestorSet().has(nodeTypeId)
    }
    _getAncestorSet() {
      if (!this._cache_ancestorSet) this._cache_ancestorSet = new Set(this._getAncestorsArray().map(def => def._getId()))
      return this._cache_ancestorSet
    }
    // Note: the order is: [this, parent, grandParent, ...]
    _getAncestorsArray(cannotContainNodes) {
      this._initAncestorsArrayCache(cannotContainNodes)
      return this._cache_ancestorsArray
    }
    _getIdThatThisExtends() {
      return this.get(TreeNotationConstants.extends)
    }
    _initAncestorsArrayCache(cannotContainNodes) {
      if (this._cache_ancestorsArray) return undefined
      if (cannotContainNodes && cannotContainNodes.includes(this)) throw new Error(`Loop detected: '${this.getLine()}' is the ancestor of one of its ancestors.`)
      cannotContainNodes = cannotContainNodes || [this]
      let ancestors = [this]
      const extendedId = this._getIdThatThisExtends()
      if (extendedId) {
        const parentNode = this._getIdToNodeMap()[extendedId]
        if (!parentNode) throw new Error(`${extendedId} not found`)
        ancestors = ancestors.concat(parentNode._getAncestorsArray(cannotContainNodes))
      }
      this._cache_ancestorsArray = ancestors
    }
  }
  class ExtendibleTreeNode extends AbstractExtendibleTreeNode {
    _getIdToNodeMap() {
      if (!this.isRoot()) return this.root._getIdToNodeMap()
      if (!this._nodeMapCache) {
        this._nodeMapCache = {}
        this.forEach(child => {
          this._nodeMapCache[child._getId()] = child
        })
      }
      return this._nodeMapCache
    }
    _getId() {
      return this.getWord(0)
    }
  }
  window.TreeNode = TreeNode
  window.ExtendibleTreeNode = ExtendibleTreeNode
  window.AbstractExtendibleTreeNode = AbstractExtendibleTreeNode
  window.TreeEvents = TreeEvents
  window.TreeWord = TreeWord
  ;
  
  // Compiled language parsers will include these files:
  const GlobalNamespaceAdditions = {
    Utils: "Utils.js",
    TreeNode: "TreeNode.js",
    HandGrammarProgram: "GrammarLanguage.js",
    GrammarBackedNode: "GrammarLanguage.js"
  }
  var GrammarConstantsCompiler
  ;(function(GrammarConstantsCompiler) {
    GrammarConstantsCompiler["stringTemplate"] = "stringTemplate"
    GrammarConstantsCompiler["indentCharacter"] = "indentCharacter"
    GrammarConstantsCompiler["catchAllCellDelimiter"] = "catchAllCellDelimiter"
    GrammarConstantsCompiler["openChildren"] = "openChildren"
    GrammarConstantsCompiler["joinChildrenWith"] = "joinChildrenWith"
    GrammarConstantsCompiler["closeChildren"] = "closeChildren"
  })(GrammarConstantsCompiler || (GrammarConstantsCompiler = {}))
  var SQLiteTypes
  ;(function(SQLiteTypes) {
    SQLiteTypes["integer"] = "INTEGER"
    SQLiteTypes["float"] = "FLOAT"
    SQLiteTypes["text"] = "TEXT"
  })(SQLiteTypes || (SQLiteTypes = {}))
  var GrammarConstantsMisc
  ;(function(GrammarConstantsMisc) {
    GrammarConstantsMisc["doNotSynthesize"] = "doNotSynthesize"
    GrammarConstantsMisc["tableName"] = "tableName"
  })(GrammarConstantsMisc || (GrammarConstantsMisc = {}))
  var PreludeCellTypeIds
  ;(function(PreludeCellTypeIds) {
    PreludeCellTypeIds["anyCell"] = "anyCell"
    PreludeCellTypeIds["keywordCell"] = "keywordCell"
    PreludeCellTypeIds["extraWordCell"] = "extraWordCell"
    PreludeCellTypeIds["floatCell"] = "floatCell"
    PreludeCellTypeIds["numberCell"] = "numberCell"
    PreludeCellTypeIds["bitCell"] = "bitCell"
    PreludeCellTypeIds["boolCell"] = "boolCell"
    PreludeCellTypeIds["intCell"] = "intCell"
  })(PreludeCellTypeIds || (PreludeCellTypeIds = {}))
  var GrammarConstantsConstantTypes
  ;(function(GrammarConstantsConstantTypes) {
    GrammarConstantsConstantTypes["boolean"] = "boolean"
    GrammarConstantsConstantTypes["string"] = "string"
    GrammarConstantsConstantTypes["int"] = "int"
    GrammarConstantsConstantTypes["float"] = "float"
  })(GrammarConstantsConstantTypes || (GrammarConstantsConstantTypes = {}))
  var GrammarBundleFiles
  ;(function(GrammarBundleFiles) {
    GrammarBundleFiles["package"] = "package.json"
    GrammarBundleFiles["readme"] = "readme.md"
    GrammarBundleFiles["indexHtml"] = "index.html"
    GrammarBundleFiles["indexJs"] = "index.js"
    GrammarBundleFiles["testJs"] = "test.js"
  })(GrammarBundleFiles || (GrammarBundleFiles = {}))
  var GrammarCellParser
  ;(function(GrammarCellParser) {
    GrammarCellParser["prefix"] = "prefix"
    GrammarCellParser["postfix"] = "postfix"
    GrammarCellParser["omnifix"] = "omnifix"
  })(GrammarCellParser || (GrammarCellParser = {}))
  var GrammarConstants
  ;(function(GrammarConstants) {
    // node types
    GrammarConstants["extensions"] = "extensions"
    GrammarConstants["toolingDirective"] = "tooling"
    GrammarConstants["todoComment"] = "todo"
    GrammarConstants["version"] = "version"
    GrammarConstants["nodeType"] = "nodeType"
    GrammarConstants["cellType"] = "cellType"
    GrammarConstants["grammarFileExtension"] = "grammar"
    GrammarConstants["abstractNodeTypePrefix"] = "abstract"
    GrammarConstants["nodeTypeSuffix"] = "Node"
    GrammarConstants["cellTypeSuffix"] = "Cell"
    // error check time
    GrammarConstants["regex"] = "regex"
    GrammarConstants["reservedWords"] = "reservedWords"
    GrammarConstants["enumFromCellTypes"] = "enumFromCellTypes"
    GrammarConstants["enum"] = "enum"
    GrammarConstants["examples"] = "examples"
    GrammarConstants["min"] = "min"
    GrammarConstants["max"] = "max"
    // baseNodeTypes
    GrammarConstants["baseNodeType"] = "baseNodeType"
    GrammarConstants["blobNode"] = "blobNode"
    GrammarConstants["errorNode"] = "errorNode"
    // parse time
    GrammarConstants["extends"] = "extends"
    GrammarConstants["root"] = "root"
    GrammarConstants["crux"] = "crux"
    GrammarConstants["cruxFromId"] = "cruxFromId"
    GrammarConstants["pattern"] = "pattern"
    GrammarConstants["inScope"] = "inScope"
    GrammarConstants["cells"] = "cells"
    GrammarConstants["listDelimiter"] = "listDelimiter"
    GrammarConstants["contentKey"] = "contentKey"
    GrammarConstants["childrenKey"] = "childrenKey"
    GrammarConstants["uniqueFirstWord"] = "uniqueFirstWord"
    GrammarConstants["catchAllCellType"] = "catchAllCellType"
    GrammarConstants["cellParser"] = "cellParser"
    GrammarConstants["catchAllNodeType"] = "catchAllNodeType"
    GrammarConstants["constants"] = "constants"
    GrammarConstants["required"] = "required"
    GrammarConstants["single"] = "single"
    GrammarConstants["uniqueLine"] = "uniqueLine"
    GrammarConstants["tags"] = "tags"
    GrammarConstants["_extendsJsClass"] = "_extendsJsClass"
    GrammarConstants["_rootNodeJsHeader"] = "_rootNodeJsHeader"
    // default catchAll nodeType
    GrammarConstants["BlobNode"] = "BlobNode"
    GrammarConstants["defaultRootNode"] = "defaultRootNode"
    // code
    GrammarConstants["javascript"] = "javascript"
    // compile time
    GrammarConstants["compilerNodeType"] = "compiler"
    GrammarConstants["compilesTo"] = "compilesTo"
    // develop time
    GrammarConstants["description"] = "description"
    GrammarConstants["example"] = "example"
    GrammarConstants["sortTemplate"] = "sortTemplate"
    GrammarConstants["frequency"] = "frequency"
    GrammarConstants["highlightScope"] = "highlightScope"
  })(GrammarConstants || (GrammarConstants = {}))
  class TypedWord extends TreeWord {
    constructor(node, cellIndex, type) {
      super(node, cellIndex)
      this._type = type
    }
    get type() {
      return this._type
    }
    toString() {
      return this.word + ":" + this.type
    }
  }
  // todo: can we merge these methods into base TreeNode and ditch this class?
  class GrammarBackedNode extends TreeNode {
    getDefinition() {
      if (this._definition) return this._definition
      const handGrammarProgram = this.getHandGrammarProgram()
      this._definition = this.isRoot() ? handGrammarProgram : handGrammarProgram.getNodeTypeDefinitionByNodeTypeId(this.constructor.name)
      return this._definition
    }
    get rootGrammarTree() {
      return this.getDefinition().root
    }
    toSQLiteInsertStatement(id) {
      const def = this.getDefinition()
      const tableName = this.tableName || def.getTableNameIfAny() || def._getId()
      const columns = def.getSQLiteTableColumns()
      const hits = columns.filter(colDef => this.has(colDef.columnName))
      const values = hits.map(colDef => {
        const node = this.getNode(colDef.columnName)
        let content = node.content
        const hasChildren = node.length
        const isText = colDef.type === SQLiteTypes.text
        if (content && hasChildren) content = node.getContentWithChildren().replace(/\n/g, "\\n")
        else if (hasChildren) content = node.childrenToString().replace(/\n/g, "\\n")
        return isText || hasChildren ? `"${content}"` : content
      })
      hits.unshift({ columnName: "id", type: SQLiteTypes.text })
      values.unshift(`"${id}"`)
      return `INSERT INTO ${tableName} (${hits.map(col => col.columnName).join(",")}) VALUES (${values.join(",")});`
    }
    getAutocompleteResults(partialWord, cellIndex) {
      return cellIndex === 0 ? this._getAutocompleteResultsForFirstWord(partialWord) : this._getAutocompleteResultsForCell(partialWord, cellIndex)
    }
    get nodeIndex() {
      // StringMap<int> {firstWord: index}
      // When there are multiple tails with the same firstWord, _index stores the last content.
      // todo: change the above behavior: when a collision occurs, create an array.
      return this._nodeIndex || this._makeNodeIndex()
    }
    _clearIndex() {
      delete this._nodeIndex
      return super._clearIndex()
    }
    _makeIndex(startAt = 0) {
      if (this._nodeIndex) this._makeNodeIndex(startAt)
      return super._makeIndex(startAt)
    }
    _makeNodeIndex(startAt = 0) {
      if (!this._nodeIndex || !startAt) this._nodeIndex = {}
      const nodes = this._getChildrenArray()
      const newIndex = this._nodeIndex
      const length = nodes.length
      for (let index = startAt; index < length; index++) {
        const node = nodes[index]
        const ancestors = Array.from(node.getDefinition()._getAncestorSet()).forEach(id => {
          if (!newIndex[id]) newIndex[id] = []
          newIndex[id].push(node)
        })
      }
      return newIndex
    }
    getChildInstancesOfNodeTypeId(nodeTypeId) {
      return this.nodeIndex[nodeTypeId] || []
    }
    doesExtend(nodeTypeId) {
      return this.getDefinition()._doesExtend(nodeTypeId)
    }
    _getErrorNodeErrors() {
      return [this.firstWord ? new UnknownNodeTypeError(this) : new BlankLineError(this)]
    }
    _getBlobNodeCatchAllNodeType() {
      return BlobNode
    }
    _getAutocompleteResultsForFirstWord(partialWord) {
      const keywordMap = this.getDefinition().getFirstWordMapWithDefinitions()
      let keywords = Object.keys(keywordMap)
      if (partialWord) keywords = keywords.filter(keyword => keyword.includes(partialWord))
      return keywords
        .map(keyword => {
          const def = keywordMap[keyword]
          if (def.suggestInAutocomplete === false) return false
          const description = def.getDescription()
          return {
            text: keyword,
            displayText: keyword + (description ? " " + description : "")
          }
        })
        .filter(i => i)
    }
    _getAutocompleteResultsForCell(partialWord, cellIndex) {
      // todo: root should be [] correct?
      const cell = this._getParsedCells()[cellIndex]
      return cell ? cell.getAutoCompleteWords(partialWord) : []
    }
    // note: this is overwritten by the root node of a runtime grammar program.
    // some of the magic that makes this all work. but maybe there's a better way.
    getHandGrammarProgram() {
      if (this.isRoot()) throw new Error(`Root node without getHandGrammarProgram defined.`)
      return this.root.getHandGrammarProgram()
    }
    getRunTimeEnumOptions(cell) {
      return undefined
    }
    _sortNodesByInScopeOrder() {
      const nodeTypeOrder = this.getDefinition()._getMyInScopeNodeTypeIds()
      if (!nodeTypeOrder.length) return this
      const orderMap = {}
      nodeTypeOrder.forEach((word, index) => {
        orderMap[word] = index
      })
      this.sort(
        Utils.makeSortByFn(runtimeNode => {
          return orderMap[runtimeNode.getDefinition().getNodeTypeIdFromDefinition()]
        })
      )
      return this
    }
    get requiredNodeErrors() {
      const errors = []
      Object.values(this.getDefinition().getFirstWordMapWithDefinitions()).forEach(def => {
        if (def.isRequired() && !this.nodeIndex[def.id]) errors.push(new MissingRequiredNodeTypeError(this, def.id))
      })
      return errors
    }
    getProgramAsCells() {
      // todo: what is this?
      return this.getTopDownArray().map(node => {
        const cells = node._getParsedCells()
        let indents = node.getIndentLevel() - 1
        while (indents) {
          cells.unshift(undefined)
          indents--
        }
        return cells
      })
    }
    getProgramWidth() {
      return Math.max(...this.getProgramAsCells().map(line => line.length))
    }
    getAllTypedWords() {
      const words = []
      this.getTopDownArray().forEach(node => {
        node.getWordTypes().forEach((cell, index) => {
          words.push(new TypedWord(node, index, cell.getCellTypeId()))
        })
      })
      return words
    }
    findAllWordsWithCellType(cellTypeId) {
      return this.getAllTypedWords().filter(typedWord => typedWord.type === cellTypeId)
    }
    findAllNodesWithNodeType(nodeTypeId) {
      return this.getTopDownArray().filter(node => node.getDefinition().getNodeTypeIdFromDefinition() === nodeTypeId)
    }
    toCellTypeTree() {
      return this.getTopDownArray()
        .map(child => child.getIndentation() + child.getLineCellTypes())
        .join("\n")
    }
    getParseTable(maxColumnWidth = 40) {
      const tree = new TreeNode(this.toCellTypeTree())
      return new TreeNode(
        tree.getTopDownArray().map((node, lineNumber) => {
          const sourceNode = this.nodeAtLine(lineNumber)
          const errs = sourceNode.getErrors()
          const errorCount = errs.length
          const obj = {
            lineNumber: lineNumber,
            source: sourceNode.getIndentation() + sourceNode.getLine(),
            nodeType: sourceNode.constructor.name,
            cellTypes: node.content,
            errorCount: errorCount
          }
          if (errorCount) obj.errorMessages = errs.map(err => err.getMessage()).join(";")
          return obj
        })
      ).toFormattedTable(maxColumnWidth)
    }
    // Helper method for selecting potential nodeTypes needed to update grammar file.
    getInvalidNodeTypes() {
      return Array.from(
        new Set(
          this.getAllErrors()
            .filter(err => err instanceof UnknownNodeTypeError)
            .map(err => err.getNode().firstWord)
        )
      )
    }
    _getAllAutoCompleteWords() {
      return this.getAllWordBoundaryCoordinates().map(coordinate => {
        const results = this.getAutocompleteResultsAt(coordinate.lineIndex, coordinate.charIndex)
        return {
          lineIndex: coordinate.lineIndex,
          charIndex: coordinate.charIndex,
          wordIndex: coordinate.wordIndex,
          word: results.word,
          suggestions: results.matches
        }
      })
    }
    toAutoCompleteCube(fillChar = "") {
      const trees = [this.clone()]
      const filled = this.clone().fill(fillChar)
      this._getAllAutoCompleteWords().forEach(hole => {
        hole.suggestions.forEach((suggestion, index) => {
          if (!trees[index + 1]) trees[index + 1] = filled.clone()
          trees[index + 1].nodeAtLine(hole.lineIndex).setWord(hole.wordIndex, suggestion.text)
        })
      })
      return new TreeNode(trees)
    }
    toAutoCompleteTable() {
      return new TreeNode(
        this._getAllAutoCompleteWords().map(result => {
          result.suggestions = result.suggestions.map(node => node.text).join(" ")
          return result
        })
      ).toTable()
    }
    getAutocompleteResultsAt(lineIndex, charIndex) {
      const lineNode = this.nodeAtLine(lineIndex) || this
      const nodeInScope = lineNode.getNodeInScopeAtCharIndex(charIndex)
      // todo: add more tests
      // todo: second param this.childrenToString()
      // todo: change to getAutocomplete definitions
      const wordIndex = lineNode.getWordIndexAtCharacterIndex(charIndex)
      const wordProperties = lineNode.getWordProperties(wordIndex)
      return {
        startCharIndex: wordProperties.startCharIndex,
        endCharIndex: wordProperties.endCharIndex,
        word: wordProperties.word,
        matches: nodeInScope.getAutocompleteResults(wordProperties.word, wordIndex)
      }
    }
    _sortWithParentNodeTypesUpTop() {
      const familyTree = new HandGrammarProgram(this.toString()).getNodeTypeFamilyTree()
      const rank = {}
      familyTree.getTopDownArray().forEach((node, index) => {
        rank[node.getWord(0)] = index
      })
      const nodeAFirst = -1
      const nodeBFirst = 1
      this.sort((nodeA, nodeB) => {
        const nodeARank = rank[nodeA.getWord(0)]
        const nodeBRank = rank[nodeB.getWord(0)]
        return nodeARank < nodeBRank ? nodeAFirst : nodeBFirst
      })
      return this
    }
    format() {
      if (this.isRoot()) {
        this._sortNodesByInScopeOrder()
        try {
          this._sortWithParentNodeTypesUpTop()
        } catch (err) {
          console.log(`Warning: ${err}`)
        }
      }
      this.getTopDownArray().forEach(child => {
        child.format()
      })
      return this
    }
    sortFromSortTemplate() {
      if (!this.length) return this
      // Recurse
      this.forEach(node => node.sortFromSortTemplate())
      const def = this.isRoot() ? this.getDefinition().getRootNodeTypeDefinitionNode() : this.getDefinition()
      const { sortIndices, sortSections } = def.sortSpec
      // Sort and insert section breaks
      if (sortIndices.size) {
        // Sort keywords
        this.sort((nodeA, nodeB) => {
          const aIndex = sortIndices.get(nodeA.firstWord)
          const bIndex = sortIndices.get(nodeB.firstWord)
          if (aIndex === undefined) console.error(`sortTemplate is missing "${nodeA.firstWord}"`)
          const a = aIndex !== null && aIndex !== void 0 ? aIndex : 1000
          const b = bIndex !== null && bIndex !== void 0 ? bIndex : 1000
          return a > b ? 1 : a < b ? -1 : nodeA.getLine() > nodeB.getLine()
        })
        // pad sections
        let currentSection = 0
        this.forEach(node => {
          const nodeSection = sortSections.get(node.firstWord)
          const sectionHasAdvanced = nodeSection > currentSection
          if (sectionHasAdvanced) {
            currentSection = nodeSection
            node.prependSibling("") // Put a blank line before this section
          }
        })
      }
      return this
    }
    getNodeTypeUsage(filepath = "") {
      // returns a report on what nodeTypes from its language the program uses
      const usage = new TreeNode()
      const handGrammarProgram = this.getHandGrammarProgram()
      handGrammarProgram.getValidConcreteAndAbstractNodeTypeDefinitions().forEach(def => {
        const requiredCellTypeIds = def.getCellParser().getRequiredCellTypeIds()
        usage.appendLine([def.getNodeTypeIdFromDefinition(), "line-id", "nodeType", requiredCellTypeIds.join(" ")].join(" "))
      })
      this.getTopDownArray().forEach((node, lineNumber) => {
        const stats = usage.getNode(node.getNodeTypeId())
        stats.appendLine([filepath + "-" + lineNumber, node.words.join(" ")].join(" "))
      })
      return usage
    }
    toHighlightScopeTree() {
      return this.getTopDownArray()
        .map(child => child.getIndentation() + child.getLineHighlightScopes())
        .join("\n")
    }
    toDefinitionLineNumberTree() {
      return this.getTopDownArray()
        .map(child => child.getDefinition().getLineNumber() + " " + child.getIndentation() + child.getCellDefinitionLineNumbers().join(" "))
        .join("\n")
    }
    toCellTypeTreeWithNodeConstructorNames() {
      return this.getTopDownArray()
        .map(child => child.constructor.name + this.getWordBreakSymbol() + child.getIndentation() + child.getLineCellTypes())
        .join("\n")
    }
    toPreludeCellTypeTreeWithNodeConstructorNames() {
      return this.getTopDownArray()
        .map(child => child.constructor.name + this.getWordBreakSymbol() + child.getIndentation() + child.getLineCellPreludeTypes())
        .join("\n")
    }
    getTreeWithNodeTypes() {
      return this.getTopDownArray()
        .map(child => child.constructor.name + this.getWordBreakSymbol() + child.getIndentation() + child.getLine())
        .join("\n")
    }
    getCellHighlightScopeAtPosition(lineIndex, wordIndex) {
      this._initCellTypeCache()
      const typeNode = this._cache_highlightScopeTree.getTopDownArray()[lineIndex - 1]
      return typeNode ? typeNode.getWord(wordIndex - 1) : undefined
    }
    _initCellTypeCache() {
      const treeMTime = this.getLineOrChildrenModifiedTime()
      if (this._cache_programCellTypeStringMTime === treeMTime) return undefined
      this._cache_typeTree = new TreeNode(this.toCellTypeTree())
      this._cache_highlightScopeTree = new TreeNode(this.toHighlightScopeTree())
      this._cache_programCellTypeStringMTime = treeMTime
    }
    createParser() {
      return this.isRoot() ? new TreeNode.Parser(BlobNode) : new TreeNode.Parser(this.parent._getParser()._getCatchAllNodeConstructor(this.parent), {})
    }
    getNodeTypeId() {
      return this.getDefinition().getNodeTypeIdFromDefinition()
    }
    getWordTypes() {
      return this._getParsedCells().filter(cell => cell.getWord() !== undefined)
    }
    get cellErrors() {
      return this._getParsedCells()
        .map(check => check.getErrorIfAny())
        .filter(identity => identity)
    }
    get singleNodeUsedTwiceErrors() {
      const errors = []
      const parent = this.parent
      const hits = parent.getChildInstancesOfNodeTypeId(this.getDefinition().id)
      if (hits.length > 1)
        hits.forEach((node, index) => {
          if (node === this) errors.push(new NodeTypeUsedMultipleTimesError(node))
        })
      return errors
    }
    get uniqueLineAppearsTwiceErrors() {
      const errors = []
      const parent = this.parent
      const hits = parent.getChildInstancesOfNodeTypeId(this.getDefinition().id)
      if (hits.length > 1) {
        const set = new Set()
        hits.forEach((node, index) => {
          const line = node.getLine()
          if (set.has(line)) errors.push(new NodeTypeUsedMultipleTimesError(node))
          set.add(line)
        })
      }
      return errors
    }
    get scopeErrors() {
      let errors = []
      const def = this.getDefinition()
      if (def.isSingle) errors = errors.concat(this.singleNodeUsedTwiceErrors)
      if (def.isUniqueLine) errors = errors.concat(this.uniqueLineAppearsTwiceErrors)
      const { requiredNodeErrors } = this
      if (requiredNodeErrors.length) errors = errors.concat(requiredNodeErrors)
      return errors
    }
    getErrors() {
      return this.cellErrors.concat(this.scopeErrors)
    }
    _getParsedCells() {
      return this.getDefinition()
        .getCellParser()
        .getCellArray(this)
    }
    // todo: just make a fn that computes proper spacing and then is given a node to print
    getLineCellTypes() {
      return this._getParsedCells()
        .map(slot => slot.getCellTypeId())
        .join(" ")
    }
    getLineCellPreludeTypes() {
      return this._getParsedCells()
        .map(slot => {
          const def = slot._getCellTypeDefinition()
          //todo: cleanup
          return def ? def._getPreludeKindId() : PreludeCellTypeIds.anyCell
        })
        .join(" ")
    }
    getLineHighlightScopes(defaultScope = "source") {
      return this._getParsedCells()
        .map(slot => slot.getHighlightScope() || defaultScope)
        .join(" ")
    }
    getCellDefinitionLineNumbers() {
      return this._getParsedCells().map(cell => cell.getDefinitionLineNumber())
    }
    _getCompiledIndentation() {
      const indentCharacter = this.getDefinition()._getCompilerObject()[GrammarConstantsCompiler.indentCharacter]
      const indent = this.getIndentation()
      return indentCharacter !== undefined ? indentCharacter.repeat(indent.length) : indent
    }
    _getFields() {
      // fields are like cells
      const fields = {}
      this.forEach(node => {
        const def = node.getDefinition()
        if (def.isRequired() || def.isSingle) fields[node.getWord(0)] = node.content
      })
      return fields
    }
    _getCompiledLine() {
      const compiler = this.getDefinition()._getCompilerObject()
      const catchAllCellDelimiter = compiler[GrammarConstantsCompiler.catchAllCellDelimiter]
      const str = compiler[GrammarConstantsCompiler.stringTemplate]
      return str !== undefined ? Utils.formatStr(str, catchAllCellDelimiter, Object.assign(this._getFields(), this.cells)) : this.getLine()
    }
    get listDelimiter() {
      return this.getDefinition()._getFromExtended(GrammarConstants.listDelimiter)
    }
    get contentKey() {
      return this.getDefinition()._getFromExtended(GrammarConstants.contentKey)
    }
    get childrenKey() {
      return this.getDefinition()._getFromExtended(GrammarConstants.childrenKey)
    }
    get childrenAreTextBlob() {
      return this.getDefinition()._isBlobNodeType()
    }
    get isArrayElement() {
      return this.getDefinition()._hasFromExtended(GrammarConstants.uniqueFirstWord) ? false : !this.getDefinition().isSingle
    }
    get list() {
      return this.listDelimiter ? this.content.split(this.listDelimiter) : super.list
    }
    get typedContent() {
      // todo: probably a better way to do this, perhaps by defining a cellDelimiter at the node level
      // todo: this currently parse anything other than string types
      if (this.listDelimiter) return this.content.split(this.listDelimiter)
      const cells = this._getParsedCells()
      if (cells.length === 2) return cells[1].getParsed()
      return this.content
    }
    get typedTuple() {
      const key = this.firstWord
      if (this.childrenAreTextBlob) return [key, this.childrenToString()]
      const { typedContent, contentKey, childrenKey } = this
      if (contentKey || childrenKey) {
        let obj = {}
        if (childrenKey) obj[childrenKey] = this.childrenToString()
        else obj = this.typedMap
        if (contentKey) {
          obj[contentKey] = typedContent
        }
        return [key, obj]
      }
      const hasChildren = this.length > 0
      const hasChildrenNoContent = typedContent === undefined && hasChildren
      const shouldReturnValueAsObject = hasChildrenNoContent
      if (shouldReturnValueAsObject) return [key, this.typedMap]
      const hasChildrenAndContent = typedContent !== undefined && hasChildren
      const shouldReturnValueAsContentPlusChildren = hasChildrenAndContent
      // If the node has a content and a subtree return it as a string, as
      // Javascript object values can't be both a leaf and a tree.
      if (shouldReturnValueAsContentPlusChildren) return [key, this.getContentWithChildren()]
      return [key, typedContent]
    }
    get _shouldSerialize() {
      const should = this.shouldSerialize
      return should === undefined ? true : should
    }
    get typedMap() {
      const obj = {}
      this.forEach(node => {
        if (!node._shouldSerialize) return true
        const tuple = node.typedTuple
        if (!node.isArrayElement) obj[tuple[0]] = tuple[1]
        else {
          if (!obj[tuple[0]]) obj[tuple[0]] = []
          obj[tuple[0]].push(tuple[1])
        }
      })
      return obj
    }
    fromTypedMap() {}
    compile() {
      if (this.isRoot()) return super.compile()
      const def = this.getDefinition()
      const indent = this._getCompiledIndentation()
      const compiledLine = this._getCompiledLine()
      if (def.isTerminalNodeType()) return indent + compiledLine
      const compiler = def._getCompilerObject()
      const openChildrenString = compiler[GrammarConstantsCompiler.openChildren] || ""
      const closeChildrenString = compiler[GrammarConstantsCompiler.closeChildren] || ""
      const childJoinCharacter = compiler[GrammarConstantsCompiler.joinChildrenWith] || "\n"
      const compiledChildren = this.map(child => child.compile()).join(childJoinCharacter)
      return `${indent + compiledLine}${openChildrenString}
  ${compiledChildren}
  ${indent}${closeChildrenString}`
    }
    // todo: remove
    get cells() {
      const cells = {}
      this._getParsedCells().forEach(cell => {
        const cellTypeId = cell.getCellTypeId()
        if (!cell.isCatchAll()) cells[cellTypeId] = cell.getParsed()
        else {
          if (!cells[cellTypeId]) cells[cellTypeId] = []
          cells[cellTypeId].push(cell.getParsed())
        }
      })
      return cells
    }
  }
  class BlobNode extends GrammarBackedNode {
    createParser() {
      return new TreeNode.Parser(BlobNode, {})
    }
    getErrors() {
      return []
    }
  }
  // todo: can we remove this? hard to extend.
  class UnknownNodeTypeNode extends GrammarBackedNode {
    createParser() {
      return new TreeNode.Parser(UnknownNodeTypeNode, {})
    }
    getErrors() {
      return [new UnknownNodeTypeError(this)]
    }
  }
  /*
  A cell contains a word but also the type information for that word.
  */
  class AbstractGrammarBackedCell {
    constructor(node, index, typeDef, cellTypeId, isCatchAll, nodeTypeDef) {
      this._typeDef = typeDef
      this._node = node
      this._isCatchAll = isCatchAll
      this._index = index
      this._cellTypeId = cellTypeId
      this._nodeTypeDefinition = nodeTypeDef
    }
    getWord() {
      return this._node.getWord(this._index)
    }
    getDefinitionLineNumber() {
      return this._typeDef.getLineNumber()
    }
    getSQLiteType() {
      return SQLiteTypes.text
    }
    getCellTypeId() {
      return this._cellTypeId
    }
    getNode() {
      return this._node
    }
    getCellIndex() {
      return this._index
    }
    isCatchAll() {
      return this._isCatchAll
    }
    get min() {
      return this._getCellTypeDefinition().get(GrammarConstants.min) || "0"
    }
    get max() {
      return this._getCellTypeDefinition().get(GrammarConstants.max) || "100"
    }
    get placeholder() {
      return this._getCellTypeDefinition().get(GrammarConstants.examples) || ""
    }
    getHighlightScope() {
      const definition = this._getCellTypeDefinition()
      if (definition) return definition.getHighlightScope() // todo: why the undefined?
    }
    getAutoCompleteWords(partialWord = "") {
      const cellDef = this._getCellTypeDefinition()
      let words = cellDef ? cellDef._getAutocompleteWordOptions(this.getNode().root) : []
      const runTimeOptions = this.getNode().getRunTimeEnumOptions(this)
      if (runTimeOptions) words = runTimeOptions.concat(words)
      if (partialWord) words = words.filter(word => word.includes(partialWord))
      return words.map(word => {
        return {
          text: word,
          displayText: word
        }
      })
    }
    synthesizeCell(seed = Date.now()) {
      // todo: cleanup
      const cellDef = this._getCellTypeDefinition()
      const enumOptions = cellDef._getFromExtended(GrammarConstants.enum)
      if (enumOptions) return Utils.getRandomString(1, enumOptions.split(" "))
      return this._synthesizeCell(seed)
    }
    _getStumpEnumInput(crux) {
      const cellDef = this._getCellTypeDefinition()
      const enumOptions = cellDef._getFromExtended(GrammarConstants.enum)
      if (!enumOptions) return undefined
      const options = new TreeNode(
        enumOptions
          .split(" ")
          .map(option => `option ${option}`)
          .join("\n")
      )
      return `select
   name ${crux}
  ${options.toString(1)}`
    }
    _toStumpInput(crux) {
      // todo: remove
      const enumInput = this._getStumpEnumInput(crux)
      if (enumInput) return enumInput
      // todo: cleanup. We shouldn't have these dual cellType classes.
      return `input
   name ${crux}
   placeholder ${this.placeholder}`
    }
    _getCellTypeDefinition() {
      return this._typeDef
    }
    _getFullLine() {
      return this.getNode().getLine()
    }
    _getErrorContext() {
      return this._getFullLine().split(" ")[0] // todo: WordBreakSymbol
    }
    isValid() {
      const runTimeOptions = this.getNode().getRunTimeEnumOptions(this)
      const word = this.getWord()
      if (runTimeOptions) return runTimeOptions.includes(word)
      return this._getCellTypeDefinition().isValid(word, this.getNode().root) && this._isValid()
    }
    getErrorIfAny() {
      const word = this.getWord()
      if (word !== undefined && this.isValid()) return undefined
      // todo: refactor invalidwordError. We want better error messages.
      return word === undefined || word === "" ? new MissingWordError(this) : new InvalidWordError(this)
    }
  }
  AbstractGrammarBackedCell.parserFunctionName = ""
  class GrammarBitCell extends AbstractGrammarBackedCell {
    _isValid() {
      const word = this.getWord()
      return word === "0" || word === "1"
    }
    _synthesizeCell() {
      return Utils.getRandomString(1, "01".split(""))
    }
    getRegexString() {
      return "[01]"
    }
    getParsed() {
      const word = this.getWord()
      return !!parseInt(word)
    }
  }
  GrammarBitCell.defaultHighlightScope = "constant.numeric"
  class GrammarNumericCell extends AbstractGrammarBackedCell {
    _toStumpInput(crux) {
      return `input
   name ${crux}
   type number
   placeholder ${this.placeholder}
   min ${this.min}
   max ${this.max}`
    }
  }
  class GrammarIntCell extends GrammarNumericCell {
    _isValid() {
      const word = this.getWord()
      const num = parseInt(word)
      if (isNaN(num)) return false
      return num.toString() === word
    }
    _synthesizeCell(seed) {
      return Utils.randomUniformInt(parseInt(this.min), parseInt(this.max), seed).toString()
    }
    getRegexString() {
      return "-?[0-9]+"
    }
    getSQLiteType() {
      return SQLiteTypes.integer
    }
    getParsed() {
      const word = this.getWord()
      return parseInt(word)
    }
  }
  GrammarIntCell.defaultHighlightScope = "constant.numeric.integer"
  GrammarIntCell.parserFunctionName = "parseInt"
  class GrammarFloatCell extends GrammarNumericCell {
    _isValid() {
      const word = this.getWord()
      const num = parseFloat(word)
      return !isNaN(num) && /^-?\d*(\.\d+)?$/.test(word)
    }
    getSQLiteType() {
      return SQLiteTypes.float
    }
    _synthesizeCell(seed) {
      return Utils.randomUniformFloat(parseFloat(this.min), parseFloat(this.max), seed).toString()
    }
    getRegexString() {
      return "-?d*(.d+)?"
    }
    getParsed() {
      const word = this.getWord()
      return parseFloat(word)
    }
  }
  GrammarFloatCell.defaultHighlightScope = "constant.numeric.float"
  GrammarFloatCell.parserFunctionName = "parseFloat"
  // ErrorCellType => grammar asks for a '' cell type here but the grammar does not specify a '' cell type. (todo: bring in didyoumean?)
  class GrammarBoolCell extends AbstractGrammarBackedCell {
    constructor() {
      super(...arguments)
      this._trues = new Set(["1", "true", "t", "yes"])
      this._falses = new Set(["0", "false", "f", "no"])
    }
    _isValid() {
      const word = this.getWord()
      const str = word.toLowerCase()
      return this._trues.has(str) || this._falses.has(str)
    }
    getSQLiteType() {
      return SQLiteTypes.integer
    }
    _synthesizeCell() {
      return Utils.getRandomString(1, ["1", "true", "t", "yes", "0", "false", "f", "no"])
    }
    _getOptions() {
      return Array.from(this._trues).concat(Array.from(this._falses))
    }
    getRegexString() {
      return "(?:" + this._getOptions().join("|") + ")"
    }
    getParsed() {
      const word = this.getWord()
      return this._trues.has(word.toLowerCase())
    }
  }
  GrammarBoolCell.defaultHighlightScope = "constant.numeric"
  class GrammarAnyCell extends AbstractGrammarBackedCell {
    _isValid() {
      return true
    }
    _synthesizeCell() {
      const examples = this._getCellTypeDefinition()._getFromExtended(GrammarConstants.examples)
      if (examples) return Utils.getRandomString(1, examples.split(" "))
      return this._nodeTypeDefinition.getNodeTypeIdFromDefinition() + "-" + this.constructor.name
    }
    getRegexString() {
      return "[^ ]+"
    }
    getParsed() {
      return this.getWord()
    }
  }
  class GrammarKeywordCell extends GrammarAnyCell {
    _synthesizeCell() {
      return this._nodeTypeDefinition._getCruxIfAny()
    }
  }
  GrammarKeywordCell.defaultHighlightScope = "keyword"
  class GrammarExtraWordCellTypeCell extends AbstractGrammarBackedCell {
    _isValid() {
      return false
    }
    synthesizeCell() {
      throw new Error(`Trying to synthesize a GrammarExtraWordCellTypeCell`)
      return this._synthesizeCell()
    }
    _synthesizeCell() {
      return "extraWord" // should never occur?
    }
    getParsed() {
      return this.getWord()
    }
    getErrorIfAny() {
      return new ExtraWordError(this)
    }
  }
  class GrammarUnknownCellTypeCell extends AbstractGrammarBackedCell {
    _isValid() {
      return false
    }
    synthesizeCell() {
      throw new Error(`Trying to synthesize an GrammarUnknownCellTypeCell`)
      return this._synthesizeCell()
    }
    _synthesizeCell() {
      return "extraWord" // should never occur?
    }
    getParsed() {
      return this.getWord()
    }
    getErrorIfAny() {
      return new UnknownCellTypeError(this)
    }
  }
  class AbstractTreeError {
    constructor(node) {
      this._node = node
    }
    getLineIndex() {
      return this.getLineNumber() - 1
    }
    getLineNumber() {
      return this.getNode()._getLineNumber() // todo: handle sourcemaps
    }
    isCursorOnWord(lineIndex, characterIndex) {
      return lineIndex === this.getLineIndex() && this._doesCharacterIndexFallOnWord(characterIndex)
    }
    _doesCharacterIndexFallOnWord(characterIndex) {
      return this.getCellIndex() === this.getNode().getWordIndexAtCharacterIndex(characterIndex)
    }
    // convenience method. may be removed.
    isBlankLineError() {
      return false
    }
    // convenience method. may be removed.
    isMissingWordError() {
      return false
    }
    getIndent() {
      return this.getNode().getIndentation()
    }
    getCodeMirrorLineWidgetElement(onApplySuggestionCallBack = () => {}) {
      const suggestion = this.getSuggestionMessage()
      if (this.isMissingWordError()) return this._getCodeMirrorLineWidgetElementCellTypeHints()
      if (suggestion) return this._getCodeMirrorLineWidgetElementWithSuggestion(onApplySuggestionCallBack, suggestion)
      return this._getCodeMirrorLineWidgetElementWithoutSuggestion()
    }
    getNodeTypeId() {
      return this.getNode()
        .getDefinition()
        .getNodeTypeIdFromDefinition()
    }
    _getCodeMirrorLineWidgetElementCellTypeHints() {
      const el = document.createElement("div")
      el.appendChild(
        document.createTextNode(
          this.getIndent() +
            this.getNode()
              .getDefinition()
              .getLineHints()
        )
      )
      el.className = "LintCellTypeHints"
      return el
    }
    _getCodeMirrorLineWidgetElementWithoutSuggestion() {
      const el = document.createElement("div")
      el.appendChild(document.createTextNode(this.getIndent() + this.getMessage()))
      el.className = "LintError"
      return el
    }
    _getCodeMirrorLineWidgetElementWithSuggestion(onApplySuggestionCallBack, suggestion) {
      const el = document.createElement("div")
      el.appendChild(document.createTextNode(this.getIndent() + `${this.getErrorTypeName()}. Suggestion: ${suggestion}`))
      el.className = "LintErrorWithSuggestion"
      el.onclick = () => {
        this.applySuggestion()
        onApplySuggestionCallBack()
      }
      return el
    }
    getLine() {
      return this.getNode().getLine()
    }
    getExtension() {
      return this.getNode()
        .getHandGrammarProgram()
        .getExtensionName()
    }
    getNode() {
      return this._node
    }
    getErrorTypeName() {
      return this.constructor.name.replace("Error", "")
    }
    getCellIndex() {
      return 0
    }
    toObject() {
      return {
        type: this.getErrorTypeName(),
        line: this.getLineNumber(),
        cell: this.getCellIndex(),
        suggestion: this.getSuggestionMessage(),
        path: this.getNode().getFirstWordPath(),
        message: this.getMessage()
      }
    }
    hasSuggestion() {
      return this.getSuggestionMessage() !== ""
    }
    getSuggestionMessage() {
      return ""
    }
    toString() {
      return this.getMessage()
    }
    applySuggestion() {}
    getMessage() {
      return `${this.getErrorTypeName()} at line ${this.getLineNumber()} cell ${this.getCellIndex()}.`
    }
  }
  class AbstractCellError extends AbstractTreeError {
    constructor(cell) {
      super(cell.getNode())
      this._cell = cell
    }
    getCell() {
      return this._cell
    }
    getCellIndex() {
      return this._cell.getCellIndex()
    }
    _getWordSuggestion() {
      return Utils.didYouMean(
        this.getCell().getWord(),
        this.getCell()
          .getAutoCompleteWords()
          .map(option => option.text)
      )
    }
  }
  class UnknownNodeTypeError extends AbstractTreeError {
    getMessage() {
      const node = this.getNode()
      const parentNode = node.parent
      const options = parentNode._getParser().getFirstWordOptions()
      return super.getMessage() + ` Invalid nodeType "${node.firstWord}". Valid nodeTypes are: ${Utils._listToEnglishText(options, 7)}.`
    }
    _getWordSuggestion() {
      const node = this.getNode()
      const parentNode = node.parent
      return Utils.didYouMean(
        node.firstWord,
        parentNode.getAutocompleteResults("", 0).map(option => option.text)
      )
    }
    getSuggestionMessage() {
      const suggestion = this._getWordSuggestion()
      const node = this.getNode()
      if (suggestion) return `Change "${node.firstWord}" to "${suggestion}"`
      return ""
    }
    applySuggestion() {
      const suggestion = this._getWordSuggestion()
      if (suggestion) this.getNode().setWord(this.getCellIndex(), suggestion)
      return this
    }
  }
  class BlankLineError extends UnknownNodeTypeError {
    getMessage() {
      return super.getMessage() + ` Line: "${this.getNode().getLine()}". Blank lines are errors.`
    }
    // convenience method
    isBlankLineError() {
      return true
    }
    getSuggestionMessage() {
      return `Delete line ${this.getLineNumber()}`
    }
    applySuggestion() {
      this.getNode().destroy()
      return this
    }
  }
  class MissingRequiredNodeTypeError extends AbstractTreeError {
    constructor(node, missingNodeTypeId) {
      super(node)
      this._missingNodeTypeId = missingNodeTypeId
    }
    getMessage() {
      return super.getMessage() + ` A "${this._missingNodeTypeId}" is required.`
    }
  }
  class NodeTypeUsedMultipleTimesError extends AbstractTreeError {
    getMessage() {
      return super.getMessage() + ` Multiple "${this.getNode().firstWord}" found.`
    }
    getSuggestionMessage() {
      return `Delete line ${this.getLineNumber()}`
    }
    applySuggestion() {
      return this.getNode().destroy()
    }
  }
  class LineAppearsMultipleTimesError extends AbstractTreeError {
    getMessage() {
      return super.getMessage() + ` "${this.getNode().getLine()}" appears multiple times.`
    }
    getSuggestionMessage() {
      return `Delete line ${this.getLineNumber()}`
    }
    applySuggestion() {
      return this.getNode().destroy()
    }
  }
  class UnknownCellTypeError extends AbstractCellError {
    getMessage() {
      return super.getMessage() + ` No cellType "${this.getCell().getCellTypeId()}" found. Language grammar for "${this.getExtension()}" may need to be fixed.`
    }
  }
  class InvalidWordError extends AbstractCellError {
    getMessage() {
      return super.getMessage() + ` "${this.getCell().getWord()}" does not fit in cellType "${this.getCell().getCellTypeId()}".`
    }
    getSuggestionMessage() {
      const suggestion = this._getWordSuggestion()
      if (suggestion) return `Change "${this.getCell().getWord()}" to "${suggestion}"`
      return ""
    }
    applySuggestion() {
      const suggestion = this._getWordSuggestion()
      if (suggestion) this.getNode().setWord(this.getCellIndex(), suggestion)
      return this
    }
  }
  class ExtraWordError extends AbstractCellError {
    getMessage() {
      return super.getMessage() + ` Extra word "${this.getCell().getWord()}" in ${this.getNodeTypeId()}.`
    }
    getSuggestionMessage() {
      return `Delete word "${this.getCell().getWord()}" at cell ${this.getCellIndex()}`
    }
    applySuggestion() {
      return this.getNode().deleteWordAt(this.getCellIndex())
    }
  }
  class MissingWordError extends AbstractCellError {
    // todo: autocomplete suggestion
    getMessage() {
      return super.getMessage() + ` Missing word for cell "${this.getCell().getCellTypeId()}".`
    }
    isMissingWordError() {
      return true
    }
  }
  // todo: add standard types, enum types, from disk types
  class AbstractGrammarWordTestNode extends TreeNode {}
  class GrammarRegexTestNode extends AbstractGrammarWordTestNode {
    isValid(str) {
      if (!this._regex) this._regex = new RegExp("^" + this.content + "$")
      return !!str.match(this._regex)
    }
  }
  class GrammarReservedWordsTestNode extends AbstractGrammarWordTestNode {
    isValid(str) {
      if (!this._set) this._set = new Set(this.content.split(" "))
      return !this._set.has(str)
    }
  }
  // todo: remove in favor of custom word type constructors
  class EnumFromCellTypesTestNode extends AbstractGrammarWordTestNode {
    _getEnumFromCellTypes(programRootNode) {
      const cellTypeIds = this.getWordsFrom(1)
      const enumGroup = cellTypeIds.join(" ")
      // note: hack where we store it on the program. otherwise has global effects.
      if (!programRootNode._enumMaps) programRootNode._enumMaps = {}
      if (programRootNode._enumMaps[enumGroup]) return programRootNode._enumMaps[enumGroup]
      const wordIndex = 1
      const map = {}
      const cellTypeMap = {}
      cellTypeIds.forEach(typeId => (cellTypeMap[typeId] = true))
      programRootNode
        .getAllTypedWords()
        .filter(typedWord => cellTypeMap[typedWord.type])
        .forEach(typedWord => {
          map[typedWord.word] = true
        })
      programRootNode._enumMaps[enumGroup] = map
      return map
    }
    // todo: remove
    isValid(str, programRootNode) {
      return this._getEnumFromCellTypes(programRootNode)[str] === true
    }
  }
  class GrammarEnumTestNode extends AbstractGrammarWordTestNode {
    isValid(str) {
      // enum c c++ java
      return !!this.getOptions()[str]
    }
    getOptions() {
      if (!this._map) this._map = Utils.arrayToMap(this.getWordsFrom(1))
      return this._map
    }
  }
  class cellTypeDefinitionNode extends AbstractExtendibleTreeNode {
    createParser() {
      const types = {}
      types[GrammarConstants.regex] = GrammarRegexTestNode
      types[GrammarConstants.reservedWords] = GrammarReservedWordsTestNode
      types[GrammarConstants.enumFromCellTypes] = EnumFromCellTypesTestNode
      types[GrammarConstants.enum] = GrammarEnumTestNode
      types[GrammarConstants.highlightScope] = TreeNode
      types[GrammarConstants.todoComment] = TreeNode
      types[GrammarConstants.examples] = TreeNode
      types[GrammarConstants.min] = TreeNode
      types[GrammarConstants.max] = TreeNode
      types[GrammarConstants.description] = TreeNode
      types[GrammarConstants.extends] = TreeNode
      return new TreeNode.Parser(undefined, types)
    }
    _getId() {
      return this.getWord(0)
    }
    _getIdToNodeMap() {
      return this.parent.getCellTypeDefinitions()
    }
    getGetter(wordIndex) {
      const wordToNativeJavascriptTypeParser = this.getCellConstructor().parserFunctionName
      return `get ${this.getCellTypeId()}() {
        return ${wordToNativeJavascriptTypeParser ? wordToNativeJavascriptTypeParser + `(this.getWord(${wordIndex}))` : `this.getWord(${wordIndex})`}
      }`
    }
    getCatchAllGetter(wordIndex) {
      const wordToNativeJavascriptTypeParser = this.getCellConstructor().parserFunctionName
      return `get ${this.getCellTypeId()}() {
        return ${wordToNativeJavascriptTypeParser ? `this.getWordsFrom(${wordIndex}).map(val => ${wordToNativeJavascriptTypeParser}(val))` : `this.getWordsFrom(${wordIndex})`}
      }`
    }
    // `this.getWordsFrom(${requireds.length + 1})`
    // todo: cleanup typings. todo: remove this hidden logic. have a "baseType" property?
    getCellConstructor() {
      return this._getPreludeKind() || GrammarAnyCell
    }
    _getPreludeKind() {
      return PreludeKinds[this.getWord(0)] || PreludeKinds[this._getExtendedCellTypeId()]
    }
    _getPreludeKindId() {
      if (PreludeKinds[this.getWord(0)]) return this.getWord(0)
      else if (PreludeKinds[this._getExtendedCellTypeId()]) return this._getExtendedCellTypeId()
      return PreludeCellTypeIds.anyCell
    }
    _getExtendedCellTypeId() {
      const arr = this._getAncestorsArray()
      return arr[arr.length - 1]._getId()
    }
    getHighlightScope() {
      const hs = this._getFromExtended(GrammarConstants.highlightScope)
      if (hs) return hs
      const preludeKind = this._getPreludeKind()
      if (preludeKind) return preludeKind.defaultHighlightScope
    }
    _getEnumOptions() {
      const enumNode = this._getNodeFromExtended(GrammarConstants.enum)
      if (!enumNode) return undefined
      // we sort by longest first to capture longest match first. todo: add test
      const options = Object.keys(enumNode.getNode(GrammarConstants.enum).getOptions())
      options.sort((a, b) => b.length - a.length)
      return options
    }
    _getEnumFromCellTypeOptions(program) {
      const node = this._getNodeFromExtended(GrammarConstants.enumFromCellTypes)
      return node ? Object.keys(node.getNode(GrammarConstants.enumFromCellTypes)._getEnumFromCellTypes(program)) : undefined
    }
    _getAutocompleteWordOptions(program) {
      return this._getEnumOptions() || this._getEnumFromCellTypeOptions(program) || []
    }
    getRegexString() {
      // todo: enum
      const enumOptions = this._getEnumOptions()
      return this._getFromExtended(GrammarConstants.regex) || (enumOptions ? "(?:" + enumOptions.join("|") + ")" : "[^ ]*")
    }
    _getAllTests() {
      return this._getChildrenByNodeConstructorInExtended(AbstractGrammarWordTestNode)
    }
    isValid(str, programRootNode) {
      return this._getAllTests().every(node => node.isValid(str, programRootNode))
    }
    getCellTypeId() {
      return this.getWord(0)
    }
  }
  class AbstractCellParser {
    constructor(definition) {
      this._definition = definition
    }
    getCatchAllCellTypeId() {
      return this._definition._getFromExtended(GrammarConstants.catchAllCellType)
    }
    // todo: improve layout (use bold?)
    getLineHints() {
      const catchAllCellTypeId = this.getCatchAllCellTypeId()
      const nodeTypeId = this._definition._getCruxIfAny() || this._definition._getId() // todo: cleanup
      return `${nodeTypeId}: ${this.getRequiredCellTypeIds().join(" ")}${catchAllCellTypeId ? ` ${catchAllCellTypeId}...` : ""}`
    }
    getRequiredCellTypeIds() {
      if (!this._requiredCellTypeIds) {
        const parameters = this._definition._getFromExtended(GrammarConstants.cells)
        this._requiredCellTypeIds = parameters ? parameters.split(" ") : []
      }
      return this._requiredCellTypeIds
    }
    _getCellTypeId(cellIndex, requiredCellTypeIds, totalWordCount) {
      return requiredCellTypeIds[cellIndex]
    }
    _isCatchAllCell(cellIndex, numberOfRequiredCells, totalWordCount) {
      return cellIndex >= numberOfRequiredCells
    }
    getCellArray(node = undefined) {
      const wordCount = node ? node.words.length : 0
      const def = this._definition
      const grammarProgram = def.getLanguageDefinitionProgram()
      const requiredCellTypeIds = this.getRequiredCellTypeIds()
      const numberOfRequiredCells = requiredCellTypeIds.length
      const actualWordCountOrRequiredCellCount = Math.max(wordCount, numberOfRequiredCells)
      const cells = []
      // A for loop instead of map because "numberOfCellsToFill" can be longer than words.length
      for (let cellIndex = 0; cellIndex < actualWordCountOrRequiredCellCount; cellIndex++) {
        const isCatchAll = this._isCatchAllCell(cellIndex, numberOfRequiredCells, wordCount)
        let cellTypeId = isCatchAll ? this.getCatchAllCellTypeId() : this._getCellTypeId(cellIndex, requiredCellTypeIds, wordCount)
        let cellTypeDefinition = grammarProgram.getCellTypeDefinitionById(cellTypeId)
        let cellConstructor
        if (cellTypeDefinition) cellConstructor = cellTypeDefinition.getCellConstructor()
        else if (cellTypeId) cellConstructor = GrammarUnknownCellTypeCell
        else {
          cellConstructor = GrammarExtraWordCellTypeCell
          cellTypeId = PreludeCellTypeIds.extraWordCell
          cellTypeDefinition = grammarProgram.getCellTypeDefinitionById(cellTypeId)
        }
        const anyCellConstructor = cellConstructor
        cells[cellIndex] = new anyCellConstructor(node, cellIndex, cellTypeDefinition, cellTypeId, isCatchAll, def)
      }
      return cells
    }
  }
  class PrefixCellParser extends AbstractCellParser {}
  class PostfixCellParser extends AbstractCellParser {
    _isCatchAllCell(cellIndex, numberOfRequiredCells, totalWordCount) {
      return cellIndex < totalWordCount - numberOfRequiredCells
    }
    _getCellTypeId(cellIndex, requiredCellTypeIds, totalWordCount) {
      const catchAllWordCount = Math.max(totalWordCount - requiredCellTypeIds.length, 0)
      return requiredCellTypeIds[cellIndex - catchAllWordCount]
    }
  }
  class OmnifixCellParser extends AbstractCellParser {
    getCellArray(node = undefined) {
      const cells = []
      const def = this._definition
      const program = node ? node.root : undefined
      const grammarProgram = def.getLanguageDefinitionProgram()
      const words = node ? node.words : []
      const requiredCellTypeDefs = this.getRequiredCellTypeIds().map(cellTypeId => grammarProgram.getCellTypeDefinitionById(cellTypeId))
      const catchAllCellTypeId = this.getCatchAllCellTypeId()
      const catchAllCellTypeDef = catchAllCellTypeId && grammarProgram.getCellTypeDefinitionById(catchAllCellTypeId)
      words.forEach((word, wordIndex) => {
        let cellConstructor
        for (let index = 0; index < requiredCellTypeDefs.length; index++) {
          const cellTypeDefinition = requiredCellTypeDefs[index]
          if (cellTypeDefinition.isValid(word, program)) {
            // todo: cleanup cellIndex/wordIndex stuff
            cellConstructor = cellTypeDefinition.getCellConstructor()
            cells.push(new cellConstructor(node, wordIndex, cellTypeDefinition, cellTypeDefinition._getId(), false, def))
            requiredCellTypeDefs.splice(index, 1)
            return true
          }
        }
        if (catchAllCellTypeDef && catchAllCellTypeDef.isValid(word, program)) {
          cellConstructor = catchAllCellTypeDef.getCellConstructor()
          cells.push(new cellConstructor(node, wordIndex, catchAllCellTypeDef, catchAllCellTypeId, true, def))
          return true
        }
        cells.push(new GrammarUnknownCellTypeCell(node, wordIndex, undefined, undefined, false, def))
      })
      const wordCount = words.length
      requiredCellTypeDefs.forEach((cellTypeDef, index) => {
        let cellConstructor = cellTypeDef.getCellConstructor()
        cells.push(new cellConstructor(node, wordCount + index, cellTypeDef, cellTypeDef._getId(), false, def))
      })
      return cells
    }
  }
  class GrammarExampleNode extends TreeNode {}
  class GrammarCompilerNode extends TreeNode {
    createParser() {
      const types = [
        GrammarConstantsCompiler.stringTemplate,
        GrammarConstantsCompiler.indentCharacter,
        GrammarConstantsCompiler.catchAllCellDelimiter,
        GrammarConstantsCompiler.joinChildrenWith,
        GrammarConstantsCompiler.openChildren,
        GrammarConstantsCompiler.closeChildren
      ]
      const map = {}
      types.forEach(type => {
        map[type] = TreeNode
      })
      return new TreeNode.Parser(undefined, map)
    }
  }
  class GrammarNodeTypeConstant extends TreeNode {
    constructor(children, line, parent) {
      super(children, line, parent)
      parent[this.getIdentifier()] = this.getConstantValue()
    }
    getGetter() {
      return `get ${this.getIdentifier()}() { return ${this.getConstantValueAsJsText()} }`
    }
    getIdentifier() {
      return this.getWord(1)
    }
    getConstantValueAsJsText() {
      const words = this.getWordsFrom(2)
      return words.length > 1 ? `[${words.join(",")}]` : words[0]
    }
    getConstantValue() {
      return JSON.parse(this.getConstantValueAsJsText())
    }
  }
  class GrammarNodeTypeConstantInt extends GrammarNodeTypeConstant {}
  class GrammarNodeTypeConstantString extends GrammarNodeTypeConstant {
    getConstantValueAsJsText() {
      return "`" + Utils.escapeBackTicks(this.getConstantValue()) + "`"
    }
    getConstantValue() {
      return this.length ? this.childrenToString() : this.getWordsFrom(2).join(" ")
    }
  }
  class GrammarNodeTypeConstantFloat extends GrammarNodeTypeConstant {}
  class GrammarNodeTypeConstantBoolean extends GrammarNodeTypeConstant {}
  class AbstractGrammarDefinitionNode extends AbstractExtendibleTreeNode {
    createParser() {
      // todo: some of these should just be on nonRootNodes
      const types = [
        GrammarConstants.frequency,
        GrammarConstants.inScope,
        GrammarConstants.cells,
        GrammarConstants.extends,
        GrammarConstants.description,
        GrammarConstants.catchAllNodeType,
        GrammarConstants.catchAllCellType,
        GrammarConstants.cellParser,
        GrammarConstants.extensions,
        GrammarConstants.version,
        GrammarConstants.sortTemplate,
        GrammarConstants.tags,
        GrammarConstants.crux,
        GrammarConstants.cruxFromId,
        GrammarConstants.listDelimiter,
        GrammarConstants.contentKey,
        GrammarConstants.childrenKey,
        GrammarConstants.uniqueFirstWord,
        GrammarConstants.uniqueLine,
        GrammarConstants.pattern,
        GrammarConstants.baseNodeType,
        GrammarConstants.required,
        GrammarConstants.root,
        GrammarConstants._extendsJsClass,
        GrammarConstants._rootNodeJsHeader,
        GrammarConstants.javascript,
        GrammarConstants.compilesTo,
        GrammarConstants.javascript,
        GrammarConstants.single,
        GrammarConstants.todoComment
      ]
      const map = {}
      types.forEach(type => {
        map[type] = TreeNode
      })
      map[GrammarConstantsConstantTypes.boolean] = GrammarNodeTypeConstantBoolean
      map[GrammarConstantsConstantTypes.int] = GrammarNodeTypeConstantInt
      map[GrammarConstantsConstantTypes.string] = GrammarNodeTypeConstantString
      map[GrammarConstantsConstantTypes.float] = GrammarNodeTypeConstantFloat
      map[GrammarConstants.compilerNodeType] = GrammarCompilerNode
      map[GrammarConstants.example] = GrammarExampleNode
      return new TreeNode.Parser(undefined, map)
    }
    get sortSpec() {
      const sortSections = new Map()
      const sortIndices = new Map()
      const sortTemplate = this.get(GrammarConstants.sortTemplate)
      if (!sortTemplate) return { sortSections, sortIndices }
      sortTemplate.split("  ").forEach((section, sectionIndex) => section.split(" ").forEach(word => sortSections.set(word, sectionIndex)))
      sortTemplate.split(" ").forEach((word, index) => sortIndices.set(word, index))
      return { sortSections, sortIndices }
    }
    toTypeScriptInterface(used = new Set()) {
      let childrenInterfaces = []
      let properties = []
      const inScope = this.getFirstWordMapWithDefinitions()
      const thisId = this._getId()
      used.add(thisId)
      Object.keys(inScope).forEach(key => {
        const def = inScope[key]
        const map = def.getFirstWordMapWithDefinitions()
        const id = def._getId()
        const optionalTag = def.isRequired() ? "" : "?"
        const escapedKey = key.match(/\?/) ? `"${key}"` : key
        const description = def.getDescription()
        if (Object.keys(map).length && !used.has(id)) {
          childrenInterfaces.push(def.toTypeScriptInterface(used))
          properties.push(` ${escapedKey}${optionalTag}: ${id}`)
        } else properties.push(` ${escapedKey}${optionalTag}: any${description ? " // " + description : ""}`)
      })
      properties.sort()
      const description = this.getDescription()
      const myInterface = ""
      return `${childrenInterfaces.join("\n")}
  ${description ? "// " + description : ""}
  interface ${thisId} {
  ${properties.join("\n")}
  }`.trim()
    }
    getTableNameIfAny() {
      return this.getFrom(`${GrammarConstantsConstantTypes.string} ${GrammarConstantsMisc.tableName}`)
    }
    getSQLiteTableColumns() {
      return this._getConcreteNonErrorInScopeNodeDefinitions(this._getInScopeNodeTypeIds()).map(def => {
        const firstNonKeywordCellType = def.getCellParser().getCellArray()[1]
        let type = firstNonKeywordCellType ? firstNonKeywordCellType.getSQLiteType() : SQLiteTypes.text
        // For now if it can have children serialize it as text in SQLite
        if (!def.isTerminalNodeType()) type = SQLiteTypes.text
        return {
          columnName: def._getIdWithoutSuffix(),
          type
        }
      })
    }
    toSQLiteTableSchema() {
      const columns = this.getSQLiteTableColumns().map(columnDef => `${columnDef.columnName} ${columnDef.type}`)
      return `create table ${this.getTableNameIfAny() || this._getId()} (
   id TEXT NOT NULL PRIMARY KEY,
   ${columns.join(",\n ")}
  );`
    }
    _getId() {
      return this.getWord(0)
    }
    get id() {
      return this._getId()
    }
    _getIdWithoutSuffix() {
      return this._getId().replace(HandGrammarProgram.nodeTypeSuffixRegex, "")
    }
    getConstantsObject() {
      const obj = this._getUniqueConstantNodes()
      Object.keys(obj).forEach(key => (obj[key] = obj[key].getConstantValue()))
      return obj
    }
    _getUniqueConstantNodes(extended = true) {
      const obj = {}
      const items = extended ? this._getChildrenByNodeConstructorInExtended(GrammarNodeTypeConstant) : this.getChildrenByNodeConstructor(GrammarNodeTypeConstant)
      items.reverse() // Last definition wins.
      items.forEach(node => {
        obj[node.getIdentifier()] = node
      })
      return obj
    }
    getExamples() {
      return this._getChildrenByNodeConstructorInExtended(GrammarExampleNode)
    }
    getNodeTypeIdFromDefinition() {
      return this.getWord(0)
    }
    // todo: remove? just reused nodeTypeId
    _getGeneratedClassName() {
      return this.getNodeTypeIdFromDefinition()
    }
    _hasValidNodeTypeId() {
      return !!this._getGeneratedClassName()
    }
    _isAbstract() {
      return this.id.startsWith(GrammarConstants.abstractNodeTypePrefix)
    }
    _getConcreteDescendantDefinitions() {
      const defs = this._getProgramNodeTypeDefinitionCache()
      const id = this._getId()
      return Object.values(defs).filter(def => {
        return def._doesExtend(id) && !def._isAbstract()
      })
    }
    _getCruxIfAny() {
      return this.get(GrammarConstants.crux) || (this._hasFromExtended(GrammarConstants.cruxFromId) ? this._getIdWithoutSuffix() : undefined)
    }
    _getRegexMatch() {
      return this.get(GrammarConstants.pattern)
    }
    _getFirstCellEnumOptions() {
      const firstCellDef = this._getMyCellTypeDefs()[0]
      return firstCellDef ? firstCellDef._getEnumOptions() : undefined
    }
    getLanguageDefinitionProgram() {
      return this.parent
    }
    _getCustomJavascriptMethods() {
      const hasJsCode = this.has(GrammarConstants.javascript)
      return hasJsCode ? this.getNode(GrammarConstants.javascript).childrenToString() : ""
    }
    getFirstWordMapWithDefinitions() {
      if (!this._cache_firstWordToNodeDefMap) this._cache_firstWordToNodeDefMap = this._createParserInfo(this._getInScopeNodeTypeIds()).firstWordMap
      return this._cache_firstWordToNodeDefMap
    }
    // todo: remove
    getRunTimeFirstWordsInScope() {
      return this._getParser().getFirstWordOptions()
    }
    _getMyCellTypeDefs() {
      const requiredCells = this.get(GrammarConstants.cells)
      if (!requiredCells) return []
      const grammarProgram = this.getLanguageDefinitionProgram()
      return requiredCells.split(" ").map(cellTypeId => {
        const cellTypeDef = grammarProgram.getCellTypeDefinitionById(cellTypeId)
        if (!cellTypeDef) throw new Error(`No cellType "${cellTypeId}" found`)
        return cellTypeDef
      })
    }
    // todo: what happens when you have a cell getter and constant with same name?
    _getCellGettersAndNodeTypeConstants() {
      // todo: add cellType parsings
      const grammarProgram = this.getLanguageDefinitionProgram()
      const getters = this._getMyCellTypeDefs().map((cellTypeDef, index) => cellTypeDef.getGetter(index))
      const catchAllCellTypeId = this.get(GrammarConstants.catchAllCellType)
      if (catchAllCellTypeId) getters.push(grammarProgram.getCellTypeDefinitionById(catchAllCellTypeId).getCatchAllGetter(getters.length))
      // Constants
      Object.values(this._getUniqueConstantNodes(false)).forEach(node => {
        getters.push(node.getGetter())
      })
      return getters.join("\n")
    }
    _createParserInfo(nodeTypeIdsInScope) {
      const result = {
        firstWordMap: {},
        regexTests: []
      }
      if (!nodeTypeIdsInScope.length) return result
      const allProgramNodeTypeDefinitionsMap = this._getProgramNodeTypeDefinitionCache()
      Object.keys(allProgramNodeTypeDefinitionsMap)
        .filter(nodeTypeId => allProgramNodeTypeDefinitionsMap[nodeTypeId].isOrExtendsANodeTypeInScope(nodeTypeIdsInScope))
        .filter(nodeTypeId => !allProgramNodeTypeDefinitionsMap[nodeTypeId]._isAbstract())
        .forEach(nodeTypeId => {
          const def = allProgramNodeTypeDefinitionsMap[nodeTypeId]
          const regex = def._getRegexMatch()
          const crux = def._getCruxIfAny()
          const enumOptions = def._getFirstCellEnumOptions()
          if (regex) result.regexTests.push({ regex: regex, nodeConstructor: def.getNodeTypeIdFromDefinition() })
          else if (crux) result.firstWordMap[crux] = def
          else if (enumOptions) {
            enumOptions.forEach(option => {
              result.firstWordMap[option] = def
            })
          }
        })
      return result
    }
    getTopNodeTypeDefinitions() {
      const arr = Object.values(this.getFirstWordMapWithDefinitions())
      arr.sort(Utils.makeSortByFn(definition => definition.getFrequency()))
      arr.reverse()
      return arr
    }
    _getMyInScopeNodeTypeIds() {
      const nodeTypesNode = this.getNode(GrammarConstants.inScope)
      return nodeTypesNode ? nodeTypesNode.getWordsFrom(1) : []
    }
    _getInScopeNodeTypeIds() {
      // todo: allow multiple of these if we allow mixins?
      const ids = this._getMyInScopeNodeTypeIds()
      const parentDef = this._getExtendedParent()
      return parentDef ? ids.concat(parentDef._getInScopeNodeTypeIds()) : ids
    }
    get isSingle() {
      const hit = this._getNodeFromExtended(GrammarConstants.single)
      return hit && hit.get(GrammarConstants.single) !== "false"
    }
    get isUniqueLine() {
      const hit = this._getNodeFromExtended(GrammarConstants.uniqueLine)
      return hit && hit.get(GrammarConstants.uniqueLine) !== "false"
    }
    isRequired() {
      return this._hasFromExtended(GrammarConstants.required)
    }
    getNodeTypeDefinitionByNodeTypeId(nodeTypeId) {
      // todo: return catch all?
      const def = this._getProgramNodeTypeDefinitionCache()[nodeTypeId]
      if (def) return def
      // todo: cleanup
      this.getLanguageDefinitionProgram()._addDefaultCatchAllBlobNode()
      return this._getProgramNodeTypeDefinitionCache()[nodeTypeId]
    }
    isDefined(nodeTypeId) {
      return !!this._getProgramNodeTypeDefinitionCache()[nodeTypeId]
    }
    _getIdToNodeMap() {
      return this._getProgramNodeTypeDefinitionCache()
    }
    _amIRoot() {
      if (this._cache_isRoot === undefined) this._cache_isRoot = this._getLanguageRootNode() === this
      return this._cache_isRoot
    }
    _getLanguageRootNode() {
      return this.parent.getRootNodeTypeDefinitionNode()
    }
    _isErrorNodeType() {
      return this.get(GrammarConstants.baseNodeType) === GrammarConstants.errorNode
    }
    _isBlobNodeType() {
      // Do not check extended classes. Only do once.
      return this._getFromExtended(GrammarConstants.baseNodeType) === GrammarConstants.blobNode
    }
    _getErrorMethodToJavascript() {
      if (this._isBlobNodeType()) return "getErrors() { return [] }" // Skips parsing child nodes for perf gains.
      if (this._isErrorNodeType()) return "getErrors() { return this._getErrorNodeErrors() }"
      return ""
    }
    _getParserToJavascript() {
      if (this._isBlobNodeType())
        // todo: do we need this?
        return "createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}"
      const parserInfo = this._createParserInfo(this._getMyInScopeNodeTypeIds())
      const myFirstWordMap = parserInfo.firstWordMap
      const regexRules = parserInfo.regexTests
      // todo: use constants in first word maps?
      // todo: cache the super extending?
      const firstWords = Object.keys(myFirstWordMap)
      const hasFirstWords = firstWords.length
      const catchAllConstructor = this._getCatchAllNodeConstructorToJavascript()
      if (!hasFirstWords && !catchAllConstructor && !regexRules.length) return ""
      const firstWordsStr = hasFirstWords
        ? `Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {` + firstWords.map(firstWord => `"${firstWord}" : ${myFirstWordMap[firstWord].getNodeTypeIdFromDefinition()}`).join(",\n") + "})"
        : "undefined"
      const regexStr = regexRules.length
        ? `[${regexRules
            .map(rule => {
              return `{regex: /${rule.regex}/, nodeConstructor: ${rule.nodeConstructor}}`
            })
            .join(",")}]`
        : "undefined"
      const catchAllStr = catchAllConstructor ? catchAllConstructor : this._amIRoot() ? `this._getBlobNodeCatchAllNodeType()` : "undefined"
      return `createParser() {
    return new TreeNode.Parser(${catchAllStr}, ${firstWordsStr}, ${regexStr})
    }`
    }
    _getCatchAllNodeConstructorToJavascript() {
      if (this._isBlobNodeType()) return "this._getBlobNodeCatchAllNodeType()"
      const nodeTypeId = this.get(GrammarConstants.catchAllNodeType)
      if (!nodeTypeId) return ""
      const nodeDef = this.getNodeTypeDefinitionByNodeTypeId(nodeTypeId)
      if (!nodeDef) throw new Error(`No definition found for nodeType id "${nodeTypeId}"`)
      return nodeDef._getGeneratedClassName()
    }
    _nodeDefToJavascriptClass() {
      const components = [this._getParserToJavascript(), this._getErrorMethodToJavascript(), this._getCellGettersAndNodeTypeConstants(), this._getCustomJavascriptMethods()].filter(identity => identity)
      if (this._amIRoot()) {
        components.push(`static cachedHandGrammarProgramRoot = new HandGrammarProgram(\`${Utils.escapeBackTicks(this.parent.toString().replace(/\\/g, "\\\\"))}\`)
          getHandGrammarProgram() {
            return this.constructor.cachedHandGrammarProgramRoot
        }`)
        const nodeTypeMap = this.getLanguageDefinitionProgram()
          .getValidConcreteAndAbstractNodeTypeDefinitions()
          .map(def => {
            const id = def.getNodeTypeIdFromDefinition()
            return `"${id}": ${id}`
          })
          .join(",\n")
        components.push(`static getNodeTypeMap() { return {${nodeTypeMap} }}`)
      }
      return `class ${this._getGeneratedClassName()} extends ${this._getExtendsClassName()} {
        ${components.join("\n")}
      }`
    }
    _getExtendsClassName() {
      // todo: this is hopefully a temporary line in place for now for the case where you want your base class to extend something other than another treeclass
      const hardCodedExtend = this.get(GrammarConstants._extendsJsClass)
      if (hardCodedExtend) return hardCodedExtend
      const extendedDef = this._getExtendedParent()
      return extendedDef ? extendedDef._getGeneratedClassName() : "GrammarBackedNode"
    }
    _getCompilerObject() {
      let obj = {}
      const items = this._getChildrenByNodeConstructorInExtended(GrammarCompilerNode)
      items.reverse() // Last definition wins.
      items.forEach(node => {
        obj = Object.assign(obj, node.toObject()) // todo: what about multiline strings?
      })
      return obj
    }
    // todo: improve layout (use bold?)
    getLineHints() {
      return this.getCellParser().getLineHints()
    }
    isOrExtendsANodeTypeInScope(firstWordsInScope) {
      const chain = this._getNodeTypeInheritanceSet()
      return firstWordsInScope.some(firstWord => chain.has(firstWord))
    }
    isTerminalNodeType() {
      return !this._getFromExtended(GrammarConstants.inScope) && !this._getFromExtended(GrammarConstants.catchAllNodeType)
    }
    _getSublimeMatchLine() {
      const regexMatch = this._getRegexMatch()
      if (regexMatch) return `'${regexMatch}'`
      const cruxMatch = this._getCruxIfAny()
      if (cruxMatch) return `'^ *${Utils.escapeRegExp(cruxMatch)}(?: |$)'`
      const enumOptions = this._getFirstCellEnumOptions()
      if (enumOptions) return `'^ *(${Utils.escapeRegExp(enumOptions.join("|"))})(?: |$)'`
    }
    // todo: refactor. move some parts to cellParser?
    _toSublimeMatchBlock() {
      const defaultHighlightScope = "source"
      const program = this.getLanguageDefinitionProgram()
      const cellParser = this.getCellParser()
      const requiredCellTypeIds = cellParser.getRequiredCellTypeIds()
      const catchAllCellTypeId = cellParser.getCatchAllCellTypeId()
      const firstCellTypeDef = program.getCellTypeDefinitionById(requiredCellTypeIds[0])
      const firstWordHighlightScope = (firstCellTypeDef ? firstCellTypeDef.getHighlightScope() : defaultHighlightScope) + "." + this.getNodeTypeIdFromDefinition()
      const topHalf = ` '${this.getNodeTypeIdFromDefinition()}':
    - match: ${this._getSublimeMatchLine()}
      scope: ${firstWordHighlightScope}`
      if (catchAllCellTypeId) requiredCellTypeIds.push(catchAllCellTypeId)
      if (!requiredCellTypeIds.length) return topHalf
      const captures = requiredCellTypeIds
        .map((cellTypeId, index) => {
          const cellTypeDefinition = program.getCellTypeDefinitionById(cellTypeId) // todo: cleanup
          if (!cellTypeDefinition) throw new Error(`No ${GrammarConstants.cellType} ${cellTypeId} found`) // todo: standardize error/capture error at grammar time
          return `        ${index + 1}: ${(cellTypeDefinition.getHighlightScope() || defaultHighlightScope) + "." + cellTypeDefinition.getCellTypeId()}`
        })
        .join("\n")
      const cellTypesToRegex = cellTypeIds => cellTypeIds.map(cellTypeId => `({{${cellTypeId}}})?`).join(" ?")
      return `${topHalf}
      push:
       - match: ${cellTypesToRegex(requiredCellTypeIds)}
         captures:
  ${captures}
       - match: $
         pop: true`
    }
    _getNodeTypeInheritanceSet() {
      if (!this._cache_nodeTypeInheritanceSet) this._cache_nodeTypeInheritanceSet = new Set(this.getAncestorNodeTypeIdsArray())
      return this._cache_nodeTypeInheritanceSet
    }
    getAncestorNodeTypeIdsArray() {
      if (!this._cache_ancestorNodeTypeIdsArray) {
        this._cache_ancestorNodeTypeIdsArray = this._getAncestorsArray().map(def => def.getNodeTypeIdFromDefinition())
        this._cache_ancestorNodeTypeIdsArray.reverse()
      }
      return this._cache_ancestorNodeTypeIdsArray
    }
    _getProgramNodeTypeDefinitionCache() {
      return this.getLanguageDefinitionProgram()._getProgramNodeTypeDefinitionCache()
    }
    getDescription() {
      return this._getFromExtended(GrammarConstants.description) || ""
    }
    getFrequency() {
      const val = this._getFromExtended(GrammarConstants.frequency)
      return val ? parseFloat(val) : 0
    }
    _getExtendedNodeTypeId() {
      const ancestorIds = this.getAncestorNodeTypeIdsArray()
      if (ancestorIds.length > 1) return ancestorIds[ancestorIds.length - 2]
    }
    _toStumpString() {
      const crux = this._getCruxIfAny()
      const cellArray = this.getCellParser()
        .getCellArray()
        .filter((item, index) => index) // for now this only works for keyword langs
      if (!cellArray.length)
        // todo: remove this! just doing it for now until we refactor getCellArray to handle catchAlls better.
        return ""
      const cells = new TreeNode(cellArray.map((cell, index) => cell._toStumpInput(crux)).join("\n"))
      return `div
   label ${crux}
  ${cells.toString(1)}`
    }
    toStumpString() {
      const nodeBreakSymbol = "\n"
      return this._getConcreteNonErrorInScopeNodeDefinitions(this._getInScopeNodeTypeIds())
        .map(def => def._toStumpString())
        .filter(identity => identity)
        .join(nodeBreakSymbol)
    }
    _generateSimulatedLine(seed) {
      // todo: generate simulated data from catch all
      const crux = this._getCruxIfAny()
      return this.getCellParser()
        .getCellArray()
        .map((cell, index) => (!index && crux ? crux : cell.synthesizeCell(seed)))
        .join(" ")
    }
    _shouldSynthesize(def, nodeTypeChain) {
      if (def._isErrorNodeType() || def._isAbstract()) return false
      if (nodeTypeChain.includes(def._getId())) return false
      const tags = def.get(GrammarConstants.tags)
      if (tags && tags.includes(GrammarConstantsMisc.doNotSynthesize)) return false
      return true
    }
    _getConcreteNonErrorInScopeNodeDefinitions(nodeTypeIds) {
      const results = []
      nodeTypeIds.forEach(nodeTypeId => {
        const def = this.getNodeTypeDefinitionByNodeTypeId(nodeTypeId)
        if (def._isErrorNodeType()) return true
        else if (def._isAbstract()) {
          def._getConcreteDescendantDefinitions().forEach(def => results.push(def))
        } else {
          results.push(def)
        }
      })
      return results
    }
    // todo: refactor
    synthesizeNode(nodeCount = 1, indentCount = -1, nodeTypesAlreadySynthesized = [], seed = Date.now()) {
      let inScopeNodeTypeIds = this._getInScopeNodeTypeIds()
      const catchAllNodeTypeId = this._getFromExtended(GrammarConstants.catchAllNodeType)
      if (catchAllNodeTypeId) inScopeNodeTypeIds.push(catchAllNodeTypeId)
      const thisId = this._getId()
      if (!nodeTypesAlreadySynthesized.includes(thisId)) nodeTypesAlreadySynthesized.push(thisId)
      const lines = []
      while (nodeCount) {
        const line = this._generateSimulatedLine(seed)
        if (line) lines.push(" ".repeat(indentCount >= 0 ? indentCount : 0) + line)
        this._getConcreteNonErrorInScopeNodeDefinitions(inScopeNodeTypeIds.filter(nodeTypeId => !nodeTypesAlreadySynthesized.includes(nodeTypeId)))
          .filter(def => this._shouldSynthesize(def, nodeTypesAlreadySynthesized))
          .forEach(def => {
            const chain = nodeTypesAlreadySynthesized // .slice(0)
            chain.push(def._getId())
            def.synthesizeNode(1, indentCount + 1, chain, seed).forEach(line => {
              lines.push(line)
            })
          })
        nodeCount--
      }
      return lines
    }
    getCellParser() {
      if (!this._cellParser) {
        const cellParsingStrategy = this._getFromExtended(GrammarConstants.cellParser)
        if (cellParsingStrategy === GrammarCellParser.postfix) this._cellParser = new PostfixCellParser(this)
        else if (cellParsingStrategy === GrammarCellParser.omnifix) this._cellParser = new OmnifixCellParser(this)
        else this._cellParser = new PrefixCellParser(this)
      }
      return this._cellParser
    }
  }
  // todo: remove?
  class nodeTypeDefinitionNode extends AbstractGrammarDefinitionNode {}
  // HandGrammarProgram is a constructor that takes a grammar file, and builds a new
  // constructor for new language that takes files in that language to execute, compile, etc.
  class HandGrammarProgram extends AbstractGrammarDefinitionNode {
    createParser() {
      const map = {}
      map[GrammarConstants.toolingDirective] = TreeNode
      map[GrammarConstants.todoComment] = TreeNode
      return new TreeNode.Parser(UnknownNodeTypeNode, map, [
        { regex: HandGrammarProgram.nodeTypeFullRegex, nodeConstructor: nodeTypeDefinitionNode },
        { regex: HandGrammarProgram.cellTypeFullRegex, nodeConstructor: cellTypeDefinitionNode }
      ])
    }
    // Note: this is some so far unavoidable tricky code. We need to eval the transpiled JS, in a NodeJS or browser environment.
    _compileAndEvalGrammar() {
      if (!this.isNodeJs()) this._cache_compiledLoadedNodeTypes = Utils.appendCodeAndReturnValueOnWindow(this.toBrowserJavascript(), this.getRootNodeTypeId()).getNodeTypeMap()
      else {
        const path = require("path")
        const code = this.toNodeJsJavascript(__dirname)
        try {
          const rootNode = this._requireInVmNodeJsRootNodeTypeConstructor(code)
          this._cache_compiledLoadedNodeTypes = rootNode.getNodeTypeMap()
          if (!this._cache_compiledLoadedNodeTypes) throw new Error(`Failed to getNodeTypeMap`)
        } catch (err) {
          // todo: figure out best error pattern here for debugging
          console.log(err)
          // console.log(`Error in code: `)
          // console.log(new TreeNode(code).toStringWithLineNumbers())
        }
      }
    }
    trainModel(programs, programConstructor = this.compileAndReturnRootConstructor()) {
      const nodeDefs = this.getValidConcreteAndAbstractNodeTypeDefinitions()
      const nodeDefCountIncludingRoot = nodeDefs.length + 1
      const matrix = Utils.makeMatrix(nodeDefCountIncludingRoot, nodeDefCountIncludingRoot, 0)
      const idToIndex = {}
      const indexToId = {}
      nodeDefs.forEach((def, index) => {
        const id = def._getId()
        idToIndex[id] = index + 1
        indexToId[index + 1] = id
      })
      programs.forEach(code => {
        const exampleProgram = new programConstructor(code)
        exampleProgram.getTopDownArray().forEach(node => {
          const nodeIndex = idToIndex[node.getDefinition()._getId()]
          const parentNode = node.parent
          if (!nodeIndex) return undefined
          if (parentNode.isRoot()) matrix[0][nodeIndex]++
          else {
            const parentIndex = idToIndex[parentNode.getDefinition()._getId()]
            if (!parentIndex) return undefined
            matrix[parentIndex][nodeIndex]++
          }
        })
      })
      return {
        idToIndex,
        indexToId,
        matrix
      }
    }
    _mapPredictions(predictionsVector, model) {
      const total = Utils.sum(predictionsVector)
      const predictions = predictionsVector.slice(1).map((count, index) => {
        const id = model.indexToId[index + 1]
        return {
          id: id,
          def: this.getNodeTypeDefinitionByNodeTypeId(id),
          count,
          prob: count / total
        }
      })
      predictions.sort(Utils.makeSortByFn(prediction => prediction.count)).reverse()
      return predictions
    }
    predictChildren(model, node) {
      return this._mapPredictions(this._predictChildren(model, node), model)
    }
    predictParents(model, node) {
      return this._mapPredictions(this._predictParents(model, node), model)
    }
    _predictChildren(model, node) {
      return model.matrix[node.isRoot() ? 0 : model.idToIndex[node.getDefinition()._getId()]]
    }
    _predictParents(model, node) {
      if (node.isRoot()) return []
      const nodeIndex = model.idToIndex[node.getDefinition()._getId()]
      return model.matrix.map(row => row[nodeIndex])
    }
    _compileAndReturnNodeTypeMap() {
      if (!this._cache_compiledLoadedNodeTypes) this._compileAndEvalGrammar()
      return this._cache_compiledLoadedNodeTypes
    }
    _setDirName(name) {
      this._dirName = name
      return this
    }
    _requireInVmNodeJsRootNodeTypeConstructor(code) {
      const vm = require("vm")
      const path = require("path")
      // todo: cleanup up
      try {
        Object.keys(GlobalNamespaceAdditions).forEach(key => {
          global[key] = require("./" + GlobalNamespaceAdditions[key])
        })
        global.require = require
        global.__dirname = this._dirName
        global.module = {}
        return vm.runInThisContext(code)
      } catch (err) {
        // todo: figure out best error pattern here for debugging
        console.log(`Error in compiled grammar code for language "${this.getGrammarName()}"`)
        // console.log(new TreeNode(code).toStringWithLineNumbers())
        console.log(err)
        throw err
      }
    }
    examplesToTestBlocks(programConstructor = this.compileAndReturnRootConstructor(), expectedErrorMessage = "") {
      const testBlocks = {}
      this.getValidConcreteAndAbstractNodeTypeDefinitions().forEach(def =>
        def.getExamples().forEach(example => {
          const id = def._getId() + example.content
          testBlocks[id] = equal => {
            const exampleProgram = new programConstructor(example.childrenToString())
            const errors = exampleProgram.getAllErrors(example._getLineNumber() + 1)
            equal(errors.join("\n"), expectedErrorMessage, `Expected no errors in ${id}`)
          }
        })
      )
      return testBlocks
    }
    toReadMe() {
      const languageName = this.getExtensionName()
      const rootNodeDef = this.getRootNodeTypeDefinitionNode()
      const cellTypes = this.getCellTypeDefinitions()
      const nodeTypeFamilyTree = this.getNodeTypeFamilyTree()
      const exampleNode = rootNodeDef.getExamples()[0]
      return `title ${languageName} Readme
  
  paragraph ${rootNodeDef.getDescription()}
  
  subtitle Quick Example
  
  code
  ${exampleNode ? exampleNode.childrenToString(1) : ""}
  
  subtitle Quick facts about ${languageName}
  
  list
   - ${languageName} has ${nodeTypeFamilyTree.getTopDownArray().length} node types.
   - ${languageName} has ${Object.keys(cellTypes).length} cell types
   - The source code for ${languageName} is ${this.getTopDownArray().length} lines long.
  
  subtitle Installing
  
  code
   npm install .
  
  subtitle Testing
  
  code
   node test.js
  
  subtitle Node Types
  
  code
  ${nodeTypeFamilyTree.toString(1)}
  
  subtitle Cell Types
  
  code
  ${new TreeNode(Object.keys(cellTypes).join("\n")).toString(1)}
  
  subtitle Road Map
  
  paragraph Here are the "todos" present in the source code for ${languageName}:
  
  list
  ${this.getTopDownArray()
    .filter(node => node.getWord(0) === "todo")
    .map(node => ` - ${node.getLine()}`)
    .join("\n")}
  
  paragraph This readme was auto-generated using the
   link https://github.com/treenotation/jtree JTree library.`
    }
    toBundle() {
      const files = {}
      const rootNodeDef = this.getRootNodeTypeDefinitionNode()
      const languageName = this.getExtensionName()
      const example = rootNodeDef.getExamples()[0]
      const sampleCode = example ? example.childrenToString() : ""
      files[GrammarBundleFiles.package] = JSON.stringify(
        {
          name: languageName,
          private: true,
          dependencies: {
            jtree: TreeNode.getVersion()
          }
        },
        null,
        2
      )
      files[GrammarBundleFiles.readme] = this.toReadMe()
      const testCode = `const program = new ${languageName}(sampleCode)
  const errors = program.getAllErrors()
  console.log("Sample program compiled with " + errors.length + " errors.")
  if (errors.length)
   console.log(errors.map(error => error.getMessage()))`
      const nodePath = `${languageName}.node.js`
      files[nodePath] = this.toNodeJsJavascript()
      files[GrammarBundleFiles.indexJs] = `module.exports = require("./${nodePath}")`
      const browserPath = `${languageName}.browser.js`
      files[browserPath] = this.toBrowserJavascript()
      files[GrammarBundleFiles.indexHtml] = `<script src="node_modules/jtree/products/Utils.browser.js"></script>
  <script src="node_modules/jtree/products/TreeNode.browser.js"></script>
  <script src="node_modules/jtree/products/GrammarLanguage.browser.js"></script>
  <script src="${browserPath}"></script>
  <script>
  const sampleCode = \`${sampleCode.toString()}\`
  ${testCode}
  </script>`
      const samplePath = "sample." + this.getExtensionName()
      files[samplePath] = sampleCode.toString()
      files[GrammarBundleFiles.testJs] = `const ${languageName} = require("./index.js")
  /*keep-line*/ const sampleCode = require("fs").readFileSync("${samplePath}", "utf8")
  ${testCode}`
      return files
    }
    getTargetExtension() {
      return this.getRootNodeTypeDefinitionNode().get(GrammarConstants.compilesTo)
    }
    getCellTypeDefinitions() {
      if (!this._cache_cellTypes) this._cache_cellTypes = this._getCellTypeDefinitions()
      return this._cache_cellTypes
    }
    getCellTypeDefinitionById(cellTypeId) {
      // todo: return unknownCellTypeDefinition? or is that handled somewhere else?
      return this.getCellTypeDefinitions()[cellTypeId]
    }
    getNodeTypeFamilyTree() {
      const tree = new TreeNode()
      Object.values(this.getValidConcreteAndAbstractNodeTypeDefinitions()).forEach(node => {
        const path = node.getAncestorNodeTypeIdsArray().join(" ")
        tree.touchNode(path)
      })
      return tree
    }
    _getCellTypeDefinitions() {
      const types = {}
      // todo: add built in word types?
      this.getChildrenByNodeConstructor(cellTypeDefinitionNode).forEach(type => (types[type.getCellTypeId()] = type))
      return types
    }
    getLanguageDefinitionProgram() {
      return this
    }
    getValidConcreteAndAbstractNodeTypeDefinitions() {
      return this.getChildrenByNodeConstructor(nodeTypeDefinitionNode).filter(node => node._hasValidNodeTypeId())
    }
    _getLastRootNodeTypeDefinitionNode() {
      return this.findLast(def => def instanceof AbstractGrammarDefinitionNode && def.has(GrammarConstants.root) && def._hasValidNodeTypeId())
    }
    _initRootNodeTypeDefinitionNode() {
      if (this._cache_rootNodeTypeNode) return
      if (!this._cache_rootNodeTypeNode) this._cache_rootNodeTypeNode = this._getLastRootNodeTypeDefinitionNode()
      // By default, have a very permissive basic root node.
      // todo: whats the best design pattern to use for this sort of thing?
      if (!this._cache_rootNodeTypeNode) {
        this._cache_rootNodeTypeNode = this.concat(`${GrammarConstants.defaultRootNode}
   ${GrammarConstants.root}
   ${GrammarConstants.catchAllNodeType} ${GrammarConstants.BlobNode}`)[0]
        this._addDefaultCatchAllBlobNode()
      }
    }
    getRootNodeTypeDefinitionNode() {
      this._initRootNodeTypeDefinitionNode()
      return this._cache_rootNodeTypeNode
    }
    // todo: whats the best design pattern to use for this sort of thing?
    _addDefaultCatchAllBlobNode() {
      delete this._cache_nodeTypeDefinitions
      this.concat(`${GrammarConstants.BlobNode}
   ${GrammarConstants.baseNodeType} ${GrammarConstants.blobNode}`)
    }
    getExtensionName() {
      return this.getGrammarName()
    }
    _getId() {
      return this.getRootNodeTypeId()
    }
    getRootNodeTypeId() {
      return this.getRootNodeTypeDefinitionNode().getNodeTypeIdFromDefinition()
    }
    getGrammarName() {
      return this.getRootNodeTypeId().replace(HandGrammarProgram.nodeTypeSuffixRegex, "")
    }
    _getMyInScopeNodeTypeIds() {
      const nodeTypesNode = this.getRootNodeTypeDefinitionNode().getNode(GrammarConstants.inScope)
      return nodeTypesNode ? nodeTypesNode.getWordsFrom(1) : []
    }
    _getInScopeNodeTypeIds() {
      const nodeTypesNode = this.getRootNodeTypeDefinitionNode().getNode(GrammarConstants.inScope)
      return nodeTypesNode ? nodeTypesNode.getWordsFrom(1) : []
    }
    _initProgramNodeTypeDefinitionCache() {
      if (this._cache_nodeTypeDefinitions) return undefined
      this._cache_nodeTypeDefinitions = {}
      this.getChildrenByNodeConstructor(nodeTypeDefinitionNode).forEach(nodeTypeDefinitionNode => {
        this._cache_nodeTypeDefinitions[nodeTypeDefinitionNode.getNodeTypeIdFromDefinition()] = nodeTypeDefinitionNode
      })
    }
    _getProgramNodeTypeDefinitionCache() {
      this._initProgramNodeTypeDefinitionCache()
      return this._cache_nodeTypeDefinitions
    }
    compileAndReturnRootConstructor() {
      if (!this._cache_rootConstructorClass) {
        const def = this.getRootNodeTypeDefinitionNode()
        const rootNodeTypeId = def.getNodeTypeIdFromDefinition()
        this._cache_rootConstructorClass = def.getLanguageDefinitionProgram()._compileAndReturnNodeTypeMap()[rootNodeTypeId]
      }
      return this._cache_rootConstructorClass
    }
    _getFileExtensions() {
      return this.getRootNodeTypeDefinitionNode().get(GrammarConstants.extensions)
        ? this.getRootNodeTypeDefinitionNode()
            .get(GrammarConstants.extensions)
            .split(" ")
            .join(",")
        : this.getExtensionName()
    }
    toNodeJsJavascript(jtreeProductsPath = "jtree/products") {
      return this._rootNodeDefToJavascriptClass(jtreeProductsPath, true).trim()
    }
    toBrowserJavascript() {
      return this._rootNodeDefToJavascriptClass("", false).trim()
    }
    _getProperName() {
      return Utils.ucfirst(this.getExtensionName())
    }
    _rootNodeDefToJavascriptClass(jtreeProductsPath, forNodeJs = true) {
      const defs = this.getValidConcreteAndAbstractNodeTypeDefinitions()
      // todo: throw if there is no root node defined
      const nodeTypeClasses = defs.map(def => def._nodeDefToJavascriptClass()).join("\n\n")
      const rootDef = this.getRootNodeTypeDefinitionNode()
      const rootNodeJsHeader = forNodeJs && rootDef._getConcatBlockStringFromExtended(GrammarConstants._rootNodeJsHeader)
      const rootName = rootDef._getGeneratedClassName()
      if (!rootName) throw new Error(`Root Node Type Has No Name`)
      let exportScript = ""
      if (forNodeJs) {
        exportScript = `module.exports = ${rootName};
  ${rootName}`
      } else {
        exportScript = `window.${rootName} = ${rootName}`
      }
      let nodeJsImports = ``
      if (forNodeJs)
        nodeJsImports = Object.keys(GlobalNamespaceAdditions)
          .map(key => `const { ${key} } = require("${jtreeProductsPath}/${GlobalNamespaceAdditions[key]}")`)
          .join("\n")
      // todo: we can expose the previous "constants" export, if needed, via the grammar, which we preserve.
      return `{
  ${nodeJsImports}
  ${rootNodeJsHeader ? rootNodeJsHeader : ""}
  ${nodeTypeClasses}
  
  ${exportScript}
  }
  `
    }
    toSublimeSyntaxFile() {
      const cellTypeDefs = this.getCellTypeDefinitions()
      const variables = Object.keys(cellTypeDefs)
        .map(name => ` ${name}: '${cellTypeDefs[name].getRegexString()}'`)
        .join("\n")
      const defs = this.getValidConcreteAndAbstractNodeTypeDefinitions().filter(kw => !kw._isAbstract())
      const nodeTypeContexts = defs.map(def => def._toSublimeMatchBlock()).join("\n\n")
      const includes = defs.map(nodeTypeDef => `  - include: '${nodeTypeDef.getNodeTypeIdFromDefinition()}'`).join("\n")
      return `%YAML 1.2
  ---
  name: ${this.getExtensionName()}
  file_extensions: [${this._getFileExtensions()}]
  scope: source.${this.getExtensionName()}
  
  variables:
  ${variables}
  
  contexts:
   main:
  ${includes}
  
  ${nodeTypeContexts}`
    }
  }
  HandGrammarProgram.makeNodeTypeId = str => Utils._replaceNonAlphaNumericCharactersWithCharCodes(str).replace(HandGrammarProgram.nodeTypeSuffixRegex, "") + GrammarConstants.nodeTypeSuffix
  HandGrammarProgram.makeCellTypeId = str => Utils._replaceNonAlphaNumericCharactersWithCharCodes(str).replace(HandGrammarProgram.cellTypeSuffixRegex, "") + GrammarConstants.cellTypeSuffix
  HandGrammarProgram.nodeTypeSuffixRegex = new RegExp(GrammarConstants.nodeTypeSuffix + "$")
  HandGrammarProgram.nodeTypeFullRegex = new RegExp("^[a-zA-Z0-9_]+" + GrammarConstants.nodeTypeSuffix + "$")
  HandGrammarProgram.cellTypeSuffixRegex = new RegExp(GrammarConstants.cellTypeSuffix + "$")
  HandGrammarProgram.cellTypeFullRegex = new RegExp("^[a-zA-Z0-9_]+" + GrammarConstants.cellTypeSuffix + "$")
  HandGrammarProgram._languages = {}
  HandGrammarProgram._nodeTypes = {}
  const PreludeKinds = {}
  PreludeKinds[PreludeCellTypeIds.anyCell] = GrammarAnyCell
  PreludeKinds[PreludeCellTypeIds.keywordCell] = GrammarKeywordCell
  PreludeKinds[PreludeCellTypeIds.floatCell] = GrammarFloatCell
  PreludeKinds[PreludeCellTypeIds.numberCell] = GrammarFloatCell
  PreludeKinds[PreludeCellTypeIds.bitCell] = GrammarBitCell
  PreludeKinds[PreludeCellTypeIds.boolCell] = GrammarBoolCell
  PreludeKinds[PreludeCellTypeIds.intCell] = GrammarIntCell
  class UnknownGrammarProgram extends TreeNode {
    _inferRootNodeForAPrefixLanguage(grammarName) {
      grammarName = HandGrammarProgram.makeNodeTypeId(grammarName)
      const rootNode = new TreeNode(`${grammarName}
   ${GrammarConstants.root}`)
      // note: right now we assume 1 global cellTypeMap and nodeTypeMap per grammar. But we may have scopes in the future?
      const rootNodeNames = this.getFirstWords()
        .filter(identity => identity)
        .map(word => HandGrammarProgram.makeNodeTypeId(word))
      rootNode
        .nodeAt(0)
        .touchNode(GrammarConstants.inScope)
        .setWordsFrom(1, Array.from(new Set(rootNodeNames)))
      return rootNode
    }
    _renameIntegerKeywords(clone) {
      // todo: why are we doing this?
      for (let node of clone.getTopDownArrayIterator()) {
        const firstWordIsAnInteger = !!node.firstWord.match(/^\d+$/)
        const parentFirstWord = node.parent.firstWord
        if (firstWordIsAnInteger && parentFirstWord) node.setFirstWord(HandGrammarProgram.makeNodeTypeId(parentFirstWord + UnknownGrammarProgram._childSuffix))
      }
    }
    _getKeywordMaps(clone) {
      const keywordsToChildKeywords = {}
      const keywordsToNodeInstances = {}
      for (let node of clone.getTopDownArrayIterator()) {
        const firstWord = node.firstWord
        if (!keywordsToChildKeywords[firstWord]) keywordsToChildKeywords[firstWord] = {}
        if (!keywordsToNodeInstances[firstWord]) keywordsToNodeInstances[firstWord] = []
        keywordsToNodeInstances[firstWord].push(node)
        node.forEach(child => {
          keywordsToChildKeywords[firstWord][child.firstWord] = true
        })
      }
      return { keywordsToChildKeywords: keywordsToChildKeywords, keywordsToNodeInstances: keywordsToNodeInstances }
    }
    _inferNodeTypeDef(firstWord, globalCellTypeMap, childFirstWords, instances) {
      const edgeSymbol = this.getEdgeSymbol()
      const nodeTypeId = HandGrammarProgram.makeNodeTypeId(firstWord)
      const nodeDefNode = new TreeNode(nodeTypeId).nodeAt(0)
      const childNodeTypeIds = childFirstWords.map(word => HandGrammarProgram.makeNodeTypeId(word))
      if (childNodeTypeIds.length) nodeDefNode.touchNode(GrammarConstants.inScope).setWordsFrom(1, childNodeTypeIds)
      const cellsForAllInstances = instances
        .map(line => line.content)
        .filter(identity => identity)
        .map(line => line.split(edgeSymbol))
      const instanceCellCounts = new Set(cellsForAllInstances.map(cells => cells.length))
      const maxCellsOnLine = Math.max(...Array.from(instanceCellCounts))
      const minCellsOnLine = Math.min(...Array.from(instanceCellCounts))
      let catchAllCellType
      let cellTypeIds = []
      for (let cellIndex = 0; cellIndex < maxCellsOnLine; cellIndex++) {
        const cellType = this._getBestCellType(
          firstWord,
          instances.length,
          maxCellsOnLine,
          cellsForAllInstances.map(cells => cells[cellIndex])
        )
        if (!globalCellTypeMap.has(cellType.cellTypeId)) globalCellTypeMap.set(cellType.cellTypeId, cellType.cellTypeDefinition)
        cellTypeIds.push(cellType.cellTypeId)
      }
      if (maxCellsOnLine > minCellsOnLine) {
        //columns = columns.slice(0, min)
        catchAllCellType = cellTypeIds.pop()
        while (cellTypeIds[cellTypeIds.length - 1] === catchAllCellType) {
          cellTypeIds.pop()
        }
      }
      const needsCruxProperty = !firstWord.endsWith(UnknownGrammarProgram._childSuffix + "Node") // todo: cleanup
      if (needsCruxProperty) nodeDefNode.set(GrammarConstants.crux, firstWord)
      if (catchAllCellType) nodeDefNode.set(GrammarConstants.catchAllCellType, catchAllCellType)
      const cellLine = cellTypeIds.slice()
      cellLine.unshift(PreludeCellTypeIds.keywordCell)
      if (cellLine.length > 0) nodeDefNode.set(GrammarConstants.cells, cellLine.join(edgeSymbol))
      //if (!catchAllCellType && cellTypeIds.length === 1) nodeDefNode.set(GrammarConstants.cells, cellTypeIds[0])
      // Todo: add conditional frequencies
      return nodeDefNode.parent.toString()
    }
    //  inferGrammarFileForAnSSVLanguage(grammarName: string): string {
    //     grammarName = HandGrammarProgram.makeNodeTypeId(grammarName)
    //    const rootNode = new TreeNode(`${grammarName}
    // ${GrammarConstants.root}`)
    //    // note: right now we assume 1 global cellTypeMap and nodeTypeMap per grammar. But we may have scopes in the future?
    //    const rootNodeNames = this.getFirstWords().map(word => HandGrammarProgram.makeNodeTypeId(word))
    //    rootNode
    //      .nodeAt(0)
    //      .touchNode(GrammarConstants.inScope)
    //      .setWordsFrom(1, Array.from(new Set(rootNodeNames)))
    //    return rootNode
    //  }
    inferGrammarFileForAKeywordLanguage(grammarName) {
      const clone = this.clone()
      this._renameIntegerKeywords(clone)
      const { keywordsToChildKeywords, keywordsToNodeInstances } = this._getKeywordMaps(clone)
      const globalCellTypeMap = new Map()
      globalCellTypeMap.set(PreludeCellTypeIds.keywordCell, undefined)
      const nodeTypeDefs = Object.keys(keywordsToChildKeywords)
        .filter(identity => identity)
        .map(firstWord => this._inferNodeTypeDef(firstWord, globalCellTypeMap, Object.keys(keywordsToChildKeywords[firstWord]), keywordsToNodeInstances[firstWord]))
      const cellTypeDefs = []
      globalCellTypeMap.forEach((def, id) => cellTypeDefs.push(def ? def : id))
      const nodeBreakSymbol = this.getNodeBreakSymbol()
      return this._formatCode([this._inferRootNodeForAPrefixLanguage(grammarName).toString(), cellTypeDefs.join(nodeBreakSymbol), nodeTypeDefs.join(nodeBreakSymbol)].filter(identity => identity).join("\n"))
    }
    _formatCode(code) {
      // todo: make this run in browser too
      if (!this.isNodeJs()) return code
      const grammarProgram = new HandGrammarProgram(TreeNode.fromDisk(__dirname + "/../langs/grammar/grammar.grammar"))
      const programConstructor = grammarProgram.compileAndReturnRootConstructor()
      const program = new programConstructor(code)
      return program.format().toString()
    }
    _getBestCellType(firstWord, instanceCount, maxCellsOnLine, allValues) {
      const asSet = new Set(allValues)
      const edgeSymbol = this.getEdgeSymbol()
      const values = Array.from(asSet).filter(identity => identity)
      const every = fn => {
        for (let index = 0; index < values.length; index++) {
          if (!fn(values[index])) return false
        }
        return true
      }
      if (every(str => str === "0" || str === "1")) return { cellTypeId: PreludeCellTypeIds.bitCell }
      if (
        every(str => {
          const num = parseInt(str)
          if (isNaN(num)) return false
          return num.toString() === str
        })
      ) {
        return { cellTypeId: PreludeCellTypeIds.intCell }
      }
      if (every(str => str.match(/^-?\d*.?\d+$/))) return { cellTypeId: PreludeCellTypeIds.floatCell }
      const bools = new Set(["1", "0", "true", "false", "t", "f", "yes", "no"])
      if (every(str => bools.has(str.toLowerCase()))) return { cellTypeId: PreludeCellTypeIds.boolCell }
      // todo: cleanup
      const enumLimit = 30
      if (instanceCount > 1 && maxCellsOnLine === 1 && allValues.length > asSet.size && asSet.size < enumLimit)
        return {
          cellTypeId: HandGrammarProgram.makeCellTypeId(firstWord),
          cellTypeDefinition: `${HandGrammarProgram.makeCellTypeId(firstWord)}
   enum ${values.join(edgeSymbol)}`
        }
      return { cellTypeId: PreludeCellTypeIds.anyCell }
    }
  }
  UnknownGrammarProgram._childSuffix = "Child"
  window.GrammarConstants = GrammarConstants
  window.PreludeCellTypeIds = PreludeCellTypeIds
  window.HandGrammarProgram = HandGrammarProgram
  window.GrammarBackedNode = GrammarBackedNode
  window.UnknownNodeTypeError = UnknownNodeTypeError
  window.UnknownGrammarProgram = UnknownGrammarProgram
  ;
  
  "use strict"
  // Adapted from https://github.com/NeekSandhu/codemirror-textmate/blob/master/src/tmToCm.ts
  var CmToken
  ;(function(CmToken) {
    CmToken["Atom"] = "atom"
    CmToken["Attribute"] = "attribute"
    CmToken["Bracket"] = "bracket"
    CmToken["Builtin"] = "builtin"
    CmToken["Comment"] = "comment"
    CmToken["Def"] = "def"
    CmToken["Error"] = "error"
    CmToken["Header"] = "header"
    CmToken["HR"] = "hr"
    CmToken["Keyword"] = "keyword"
    CmToken["Link"] = "link"
    CmToken["Meta"] = "meta"
    CmToken["Number"] = "number"
    CmToken["Operator"] = "operator"
    CmToken["Property"] = "property"
    CmToken["Qualifier"] = "qualifier"
    CmToken["Quote"] = "quote"
    CmToken["String"] = "string"
    CmToken["String2"] = "string-2"
    CmToken["Tag"] = "tag"
    CmToken["Type"] = "type"
    CmToken["Variable"] = "variable"
    CmToken["Variable2"] = "variable-2"
    CmToken["Variable3"] = "variable-3"
  })(CmToken || (CmToken = {}))
  const tmToCm = {
    comment: {
      $: CmToken.Comment
    },
    constant: {
      // TODO: Revision
      $: CmToken.Def,
      character: {
        escape: {
          $: CmToken.String2
        }
      },
      language: {
        $: CmToken.Atom
      },
      numeric: {
        $: CmToken.Number
      },
      other: {
        email: {
          link: {
            $: CmToken.Link
          }
        },
        symbol: {
          // TODO: Revision
          $: CmToken.Def
        }
      }
    },
    entity: {
      name: {
        class: {
          $: CmToken.Def
        },
        function: {
          $: CmToken.Def
        },
        tag: {
          $: CmToken.Tag
        },
        type: {
          $: CmToken.Type,
          class: {
            $: CmToken.Variable
          }
        }
      },
      other: {
        "attribute-name": {
          $: CmToken.Attribute
        },
        "inherited-class": {
          // TODO: Revision
          $: CmToken.Def
        }
      },
      support: {
        function: {
          // TODO: Revision
          $: CmToken.Def
        }
      }
    },
    invalid: {
      $: CmToken.Error,
      illegal: { $: CmToken.Error },
      deprecated: {
        $: CmToken.Error
      }
    },
    keyword: {
      $: CmToken.Keyword,
      operator: {
        $: CmToken.Operator
      },
      other: {
        "special-method": CmToken.Def
      }
    },
    punctuation: {
      $: CmToken.Operator,
      definition: {
        comment: {
          $: CmToken.Comment
        },
        tag: {
          $: CmToken.Bracket
        }
        // 'template-expression': {
        //     $: CodeMirrorToken.Operator,
        // },
      }
      // terminator: {
      //     $: CodeMirrorToken.Operator,
      // },
    },
    storage: {
      $: CmToken.Keyword
    },
    string: {
      $: CmToken.String,
      regexp: {
        $: CmToken.String2
      }
    },
    support: {
      class: {
        $: CmToken.Def
      },
      constant: {
        $: CmToken.Variable2
      },
      function: {
        $: CmToken.Def
      },
      type: {
        $: CmToken.Type
      },
      variable: {
        $: CmToken.Variable2,
        property: {
          $: CmToken.Property
        }
      }
    },
    variable: {
      $: CmToken.Def,
      language: {
        // TODO: Revision
        $: CmToken.Variable3
      },
      other: {
        object: {
          $: CmToken.Variable,
          property: {
            $: CmToken.Property
          }
        },
        property: {
          $: CmToken.Property
        }
      },
      parameter: {
        $: CmToken.Def
      }
    }
  }
  const textMateScopeToCodeMirrorStyle = (scopeSegments, styleTree = tmToCm) => {
    const matchingBranch = styleTree[scopeSegments.shift()]
    return matchingBranch ? textMateScopeToCodeMirrorStyle(scopeSegments, matchingBranch) || matchingBranch.$ || null : null
  }
  class GrammarCodeMirrorMode {
    constructor(name, getProgramConstructorFn, getProgramCodeFn, codeMirrorLib = undefined) {
      this._name = name
      this._getProgramConstructorFn = getProgramConstructorFn
      this._getProgramCodeFn = getProgramCodeFn || (instance => (instance ? instance.getValue() : this._originalValue))
      this._codeMirrorLib = codeMirrorLib
    }
    _getParsedProgram() {
      const source = this._getProgramCodeFn(this._cmInstance) || ""
      if (!this._cachedProgram || this._cachedSource !== source) {
        this._cachedSource = source
        this._cachedProgram = new (this._getProgramConstructorFn())(source)
      }
      return this._cachedProgram
    }
    _getExcludedIntelliSenseTriggerKeys() {
      return {
        "8": "backspace",
        "9": "tab",
        "13": "enter",
        "16": "shift",
        "17": "ctrl",
        "18": "alt",
        "19": "pause",
        "20": "capslock",
        "27": "escape",
        "33": "pageup",
        "34": "pagedown",
        "35": "end",
        "36": "home",
        "37": "left",
        "38": "up",
        "39": "right",
        "40": "down",
        "45": "insert",
        "46": "delete",
        "91": "left window key",
        "92": "right window key",
        "93": "select",
        "112": "f1",
        "113": "f2",
        "114": "f3",
        "115": "f4",
        "116": "f5",
        "117": "f6",
        "118": "f7",
        "119": "f8",
        "120": "f9",
        "121": "f10",
        "122": "f11",
        "123": "f12",
        "144": "numlock",
        "145": "scrolllock"
      }
    }
    token(stream, state) {
      return this._advanceStreamAndReturnTokenType(stream, state)
    }
    fromTextAreaWithAutocomplete(area, options) {
      this._originalValue = area.value
      const defaultOptions = {
        lineNumbers: true,
        mode: this._name,
        tabSize: 1,
        indentUnit: 1,
        hintOptions: {
          hint: (cmInstance, options) => this.codeMirrorAutocomplete(cmInstance, options)
        }
      }
      Object.assign(defaultOptions, options)
      this._cmInstance = this._getCodeMirrorLib().fromTextArea(area, defaultOptions)
      this._enableAutoComplete(this._cmInstance)
      return this._cmInstance
    }
    _enableAutoComplete(cmInstance) {
      const excludedKeys = this._getExcludedIntelliSenseTriggerKeys()
      const codeMirrorLib = this._getCodeMirrorLib()
      cmInstance.on("keyup", (cm, event) => {
        // https://stackoverflow.com/questions/13744176/codemirror-autocomplete-after-any-keyup
        if (!cm.state.completionActive && !excludedKeys[event.keyCode.toString()])
          // Todo: get typings for CM autocomplete
          codeMirrorLib.commands.autocomplete(cm, null, { completeSingle: false })
      })
    }
    _getCodeMirrorLib() {
      return this._codeMirrorLib
    }
    async codeMirrorAutocomplete(cmInstance, options) {
      const cursor = cmInstance.getDoc().getCursor()
      const codeMirrorLib = this._getCodeMirrorLib()
      const result = await this._getParsedProgram().getAutocompleteResultsAt(cursor.line, cursor.ch)
      // It seems to be better UX if there's only 1 result, and its the word the user entered, to close autocomplete
      if (result.matches.length === 1 && result.matches[0].text === result.word) return null
      return result.matches.length
        ? {
            list: result.matches,
            from: codeMirrorLib.Pos(cursor.line, result.startCharIndex),
            to: codeMirrorLib.Pos(cursor.line, result.endCharIndex)
          }
        : null
    }
    register() {
      const codeMirrorLib = this._getCodeMirrorLib()
      codeMirrorLib.defineMode(this._name, () => this)
      codeMirrorLib.defineMIME("text/" + this._name, this._name)
      return this
    }
    _advanceStreamAndReturnTokenType(stream, state) {
      let nextCharacter = stream.next()
      const lineNumber = stream.lineOracle.line + 1 // state.lineIndex
      const WordBreakSymbol = " "
      const NodeBreakSymbol = "\n"
      while (typeof nextCharacter === "string") {
        const peek = stream.peek()
        if (nextCharacter === WordBreakSymbol) {
          if (peek === undefined || peek === NodeBreakSymbol) {
            stream.skipToEnd() // advance string to end
            this._incrementLine(state)
          }
          if (peek === WordBreakSymbol && state.cellIndex) {
            // If we are missing a cell.
            // TODO: this is broken for a blank 1st cell. We need to track WordBreakSymbol level.
            state.cellIndex++
          }
          return "bracket"
        }
        if (peek === WordBreakSymbol) {
          state.cellIndex++
          return this._getCellStyle(lineNumber, state.cellIndex)
        }
        nextCharacter = stream.next()
      }
      state.cellIndex++
      const style = this._getCellStyle(lineNumber, state.cellIndex)
      this._incrementLine(state)
      return style
    }
    _getCellStyle(lineIndex, cellIndex) {
      const program = this._getParsedProgram()
      // todo: if the current word is an error, don't show red?
      if (!program.getCellHighlightScopeAtPosition) console.log(program)
      const highlightScope = program.getCellHighlightScopeAtPosition(lineIndex, cellIndex)
      const style = highlightScope ? textMateScopeToCodeMirrorStyle(highlightScope.split(".")) : undefined
      return style || "noHighlightScopeDefinedInGrammar"
    }
    // todo: remove.
    startState() {
      return {
        cellIndex: 0
      }
    }
    _incrementLine(state) {
      state.cellIndex = 0
    }
  }
  window.GrammarCodeMirrorMode = GrammarCodeMirrorMode
  ;
  
  // CodeMirror, copyright (c) by Marijn Haverbeke and others
  // Distributed under an MIT license: https://codemirror.net/LICENSE
  
  // This is CodeMirror (https://codemirror.net), a code editor
  // implemented in JavaScript on top of the browser's DOM.
  //
  // You can find some technical background for some of the code below
  // at http://marijnhaverbeke.nl/blog/#cm-internals .
  
  (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.CodeMirror = factory());
  }(this, (function () { 'use strict';
  
    // Kludges for bugs and behavior differences that can't be feature
    // detected are enabled based on userAgent etc sniffing.
    var userAgent = navigator.userAgent;
    var platform = navigator.platform;
  
    var gecko = /gecko\/\d/i.test(userAgent);
    var ie_upto10 = /MSIE \d/.test(userAgent);
    var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
    var edge = /Edge\/(\d+)/.exec(userAgent);
    var ie = ie_upto10 || ie_11up || edge;
    var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
    var webkit = !edge && /WebKit\//.test(userAgent);
    var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
    var chrome = !edge && /Chrome\//.test(userAgent);
    var presto = /Opera\//.test(userAgent);
    var safari = /Apple Computer/.test(navigator.vendor);
    var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
    var phantom = /PhantomJS/.test(userAgent);
  
    var ios = !edge && /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
    var android = /Android/.test(userAgent);
    // This is woefully incomplete. Suggestions for alternative methods welcome.
    var mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    var mac = ios || /Mac/.test(platform);
    var chromeOS = /\bCrOS\b/.test(userAgent);
    var windows = /win/i.test(platform);
  
    var presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
    if (presto_version) { presto_version = Number(presto_version[1]); }
    if (presto_version && presto_version >= 15) { presto = false; webkit = true; }
    // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
    var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
    var captureRightClick = gecko || (ie && ie_version >= 9);
  
    function classTest(cls) { return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*") }
  
    var rmClass = function(node, cls) {
      var current = node.className;
      var match = classTest(cls).exec(current);
      if (match) {
        var after = current.slice(match.index + match[0].length);
        node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
      }
    };
  
    function removeChildren(e) {
      for (var count = e.childNodes.length; count > 0; --count)
        { e.removeChild(e.firstChild); }
      return e
    }
  
    function removeChildrenAndAdd(parent, e) {
      return removeChildren(parent).appendChild(e)
    }
  
    function elt(tag, content, className, style) {
      var e = document.createElement(tag);
      if (className) { e.className = className; }
      if (style) { e.style.cssText = style; }
      if (typeof content == "string") { e.appendChild(document.createTextNode(content)); }
      else if (content) { for (var i = 0; i < content.length; ++i) { e.appendChild(content[i]); } }
      return e
    }
    // wrapper for elt, which removes the elt from the accessibility tree
    function eltP(tag, content, className, style) {
      var e = elt(tag, content, className, style);
      e.setAttribute("role", "presentation");
      return e
    }
  
    var range;
    if (document.createRange) { range = function(node, start, end, endNode) {
      var r = document.createRange();
      r.setEnd(endNode || node, end);
      r.setStart(node, start);
      return r
    }; }
    else { range = function(node, start, end) {
      var r = document.body.createTextRange();
      try { r.moveToElementText(node.parentNode); }
      catch(e) { return r }
      r.collapse(true);
      r.moveEnd("character", end);
      r.moveStart("character", start);
      return r
    }; }
  
    function contains(parent, child) {
      if (child.nodeType == 3) // Android browser always returns false when child is a textnode
        { child = child.parentNode; }
      if (parent.contains)
        { return parent.contains(child) }
      do {
        if (child.nodeType == 11) { child = child.host; }
        if (child == parent) { return true }
      } while (child = child.parentNode)
    }
  
    function activeElt() {
      // IE and Edge may throw an "Unspecified Error" when accessing document.activeElement.
      // IE < 10 will throw when accessed while the page is loading or in an iframe.
      // IE > 9 and Edge will throw when accessed in an iframe if document.body is unavailable.
      var activeElement;
      try {
        activeElement = document.activeElement;
      } catch(e) {
        activeElement = document.body || null;
      }
      while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement)
        { activeElement = activeElement.shadowRoot.activeElement; }
      return activeElement
    }
  
    function addClass(node, cls) {
      var current = node.className;
      if (!classTest(cls).test(current)) { node.className += (current ? " " : "") + cls; }
    }
    function joinClasses(a, b) {
      var as = a.split(" ");
      for (var i = 0; i < as.length; i++)
        { if (as[i] && !classTest(as[i]).test(b)) { b += " " + as[i]; } }
      return b
    }
  
    var selectInput = function(node) { node.select(); };
    if (ios) // Mobile Safari apparently has a bug where select() is broken.
      { selectInput = function(node) { node.selectionStart = 0; node.selectionEnd = node.value.length; }; }
    else if (ie) // Suppress mysterious IE10 errors
      { selectInput = function(node) { try { node.select(); } catch(_e) {} }; }
  
    function bind(f) {
      var args = Array.prototype.slice.call(arguments, 1);
      return function(){return f.apply(null, args)}
    }
  
    function copyObj(obj, target, overwrite) {
      if (!target) { target = {}; }
      for (var prop in obj)
        { if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
          { target[prop] = obj[prop]; } }
      return target
    }
  
    // Counts the column offset in a string, taking tabs into account.
    // Used mostly to find indentation.
    function countColumn(string, end, tabSize, startIndex, startValue) {
      if (end == null) {
        end = string.search(/[^\s\u00a0]/);
        if (end == -1) { end = string.length; }
      }
      for (var i = startIndex || 0, n = startValue || 0;;) {
        var nextTab = string.indexOf("\t", i);
        if (nextTab < 0 || nextTab >= end)
          { return n + (end - i) }
        n += nextTab - i;
        n += tabSize - (n % tabSize);
        i = nextTab + 1;
      }
    }
  
    var Delayed = function() {this.id = null;};
    Delayed.prototype.set = function (ms, f) {
      clearTimeout(this.id);
      this.id = setTimeout(f, ms);
    };
  
    function indexOf(array, elt) {
      for (var i = 0; i < array.length; ++i)
        { if (array[i] == elt) { return i } }
      return -1
    }
  
    // Number of pixels added to scroller and sizer to hide scrollbar
    var scrollerGap = 30;
  
    // Returned or thrown by various protocols to signal 'I'm not
    // handling this'.
    var Pass = {toString: function(){return "CodeMirror.Pass"}};
  
    // Reused option objects for setSelection & friends
    var sel_dontScroll = {scroll: false}, sel_mouse = {origin: "*mouse"}, sel_move = {origin: "+move"};
  
    // The inverse of countColumn -- find the offset that corresponds to
    // a particular column.
    function findColumn(string, goal, tabSize) {
      for (var pos = 0, col = 0;;) {
        var nextTab = string.indexOf("\t", pos);
        if (nextTab == -1) { nextTab = string.length; }
        var skipped = nextTab - pos;
        if (nextTab == string.length || col + skipped >= goal)
          { return pos + Math.min(skipped, goal - col) }
        col += nextTab - pos;
        col += tabSize - (col % tabSize);
        pos = nextTab + 1;
        if (col >= goal) { return pos }
      }
    }
  
    var spaceStrs = [""];
    function spaceStr(n) {
      while (spaceStrs.length <= n)
        { spaceStrs.push(lst(spaceStrs) + " "); }
      return spaceStrs[n]
    }
  
    function lst(arr) { return arr[arr.length-1] }
  
    function map(array, f) {
      var out = [];
      for (var i = 0; i < array.length; i++) { out[i] = f(array[i], i); }
      return out
    }
  
    function insertSorted(array, value, score) {
      var pos = 0, priority = score(value);
      while (pos < array.length && score(array[pos]) <= priority) { pos++; }
      array.splice(pos, 0, value);
    }
  
    function nothing() {}
  
    function createObj(base, props) {
      var inst;
      if (Object.create) {
        inst = Object.create(base);
      } else {
        nothing.prototype = base;
        inst = new nothing();
      }
      if (props) { copyObj(props, inst); }
      return inst
    }
  
    var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function isWordCharBasic(ch) {
      return /\w/.test(ch) || ch > "\x80" &&
        (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch))
    }
    function isWordChar(ch, helper) {
      if (!helper) { return isWordCharBasic(ch) }
      if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) { return true }
      return helper.test(ch)
    }
  
    function isEmpty(obj) {
      for (var n in obj) { if (obj.hasOwnProperty(n) && obj[n]) { return false } }
      return true
    }
  
    // Extending unicode characters. A series of a non-extending char +
    // any number of extending chars is treated as a single unit as far
    // as editing and measuring is concerned. This is not fully correct,
    // since some scripts/fonts/browsers also treat other configurations
    // of code points as a group.
    var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    function isExtendingChar(ch) { return ch.charCodeAt(0) >= 768 && extendingChars.test(ch) }
  
    // Returns a number from the range [`0`; `str.length`] unless `pos` is outside that range.
    function skipExtendingChars(str, pos, dir) {
      while ((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos))) { pos += dir; }
      return pos
    }
  
    // Returns the value from the range [`from`; `to`] that satisfies
    // `pred` and is closest to `from`. Assumes that at least `to`
    // satisfies `pred`. Supports `from` being greater than `to`.
    function findFirst(pred, from, to) {
      // At any point we are certain `to` satisfies `pred`, don't know
      // whether `from` does.
      var dir = from > to ? -1 : 1;
      for (;;) {
        if (from == to) { return from }
        var midF = (from + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
        if (mid == from) { return pred(mid) ? from : to }
        if (pred(mid)) { to = mid; }
        else { from = mid + dir; }
      }
    }
  
    // The display handles the DOM integration, both for input reading
    // and content drawing. It holds references to DOM nodes and
    // display-related state.
  
    function Display(place, doc, input) {
      var d = this;
      this.input = input;
  
      // Covers bottom-right square when both scrollbars are present.
      d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
      d.scrollbarFiller.setAttribute("cm-not-content", "true");
      // Covers bottom of gutter when coverGutterNextToScrollbar is on
      // and h scrollbar is present.
      d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
      d.gutterFiller.setAttribute("cm-not-content", "true");
      // Will contain the actual code, positioned to cover the viewport.
      d.lineDiv = eltP("div", null, "CodeMirror-code");
      // Elements are added to these to represent selection and cursors.
      d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
      d.cursorDiv = elt("div", null, "CodeMirror-cursors");
      // A visibility: hidden element used to find the size of things.
      d.measure = elt("div", null, "CodeMirror-measure");
      // When lines outside of the viewport are measured, they are drawn in this.
      d.lineMeasure = elt("div", null, "CodeMirror-measure");
      // Wraps everything that needs to exist inside the vertically-padded coordinate system
      d.lineSpace = eltP("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
                        null, "position: relative; outline: none");
      var lines = eltP("div", [d.lineSpace], "CodeMirror-lines");
      // Moved around its parent to cover visible view.
      d.mover = elt("div", [lines], null, "position: relative");
      // Set to the height of the document, allowing scrolling.
      d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
      d.sizerWidth = null;
      // Behavior of elts with overflow: auto and padding is
      // inconsistent across browsers. This is used to ensure the
      // scrollable area is big enough.
      d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
      // Will contain the gutters, if any.
      d.gutters = elt("div", null, "CodeMirror-gutters");
      d.lineGutter = null;
      // Actual scrollable element.
      d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
      d.scroller.setAttribute("tabIndex", "-1");
      // The element in which the editor lives.
      d.wrapper = elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");
  
      // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
      if (ie && ie_version < 8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
      if (!webkit && !(gecko && mobile)) { d.scroller.draggable = true; }
  
      if (place) {
        if (place.appendChild) { place.appendChild(d.wrapper); }
        else { place(d.wrapper); }
      }
  
      // Current rendered range (may be bigger than the view window).
      d.viewFrom = d.viewTo = doc.first;
      d.reportedViewFrom = d.reportedViewTo = doc.first;
      // Information about the rendered lines.
      d.view = [];
      d.renderedView = null;
      // Holds info about a single rendered line when it was rendered
      // for measurement, while not in view.
      d.externalMeasured = null;
      // Empty space (in pixels) above the view
      d.viewOffset = 0;
      d.lastWrapHeight = d.lastWrapWidth = 0;
      d.updateLineNumbers = null;
  
      d.nativeBarWidth = d.barHeight = d.barWidth = 0;
      d.scrollbarsClipped = false;
  
      // Used to only resize the line number gutter when necessary (when
      // the amount of lines crosses a boundary that makes its width change)
      d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
      // Set to true when a non-horizontal-scrolling line widget is
      // added. As an optimization, line widget aligning is skipped when
      // this is false.
      d.alignWidgets = false;
  
      d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
  
      // Tracks the maximum line length so that the horizontal scrollbar
      // can be kept static when scrolling.
      d.maxLine = null;
      d.maxLineLength = 0;
      d.maxLineChanged = false;
  
      // Used for measuring wheel scrolling granularity
      d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
  
      // True when shift is held down.
      d.shift = false;
  
      // Used to track whether anything happened since the context menu
      // was opened.
      d.selForContextMenu = null;
  
      d.activeTouch = null;
  
      input.init(d);
    }
  
    // Find the line object corresponding to the given line number.
    function getLine(doc, n) {
      n -= doc.first;
      if (n < 0 || n >= doc.size) { throw new Error("There is no line " + (n + doc.first) + " in the document.") }
      var chunk = doc;
      while (!chunk.lines) {
        for (var i = 0;; ++i) {
          var child = chunk.children[i], sz = child.chunkSize();
          if (n < sz) { chunk = child; break }
          n -= sz;
        }
      }
      return chunk.lines[n]
    }
  
    // Get the part of a document between two positions, as an array of
    // strings.
    function getBetween(doc, start, end) {
      var out = [], n = start.line;
      doc.iter(start.line, end.line + 1, function (line) {
        var text = line.text;
        if (n == end.line) { text = text.slice(0, end.ch); }
        if (n == start.line) { text = text.slice(start.ch); }
        out.push(text);
        ++n;
      });
      return out
    }
    // Get the lines between from and to, as array of strings.
    function getLines(doc, from, to) {
      var out = [];
      doc.iter(from, to, function (line) { out.push(line.text); }); // iter aborts when callback returns truthy value
      return out
    }
  
    // Update the height of a line, propagating the height change
    // upwards to parent nodes.
    function updateLineHeight(line, height) {
      var diff = height - line.height;
      if (diff) { for (var n = line; n; n = n.parent) { n.height += diff; } }
    }
  
    // Given a line object, find its line number by walking up through
    // its parent links.
    function lineNo(line) {
      if (line.parent == null) { return null }
      var cur = line.parent, no = indexOf(cur.lines, line);
      for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
        for (var i = 0;; ++i) {
          if (chunk.children[i] == cur) { break }
          no += chunk.children[i].chunkSize();
        }
      }
      return no + cur.first
    }
  
    // Find the line at the given vertical position, using the height
    // information in the document tree.
    function lineAtHeight(chunk, h) {
      var n = chunk.first;
      outer: do {
        for (var i$1 = 0; i$1 < chunk.children.length; ++i$1) {
          var child = chunk.children[i$1], ch = child.height;
          if (h < ch) { chunk = child; continue outer }
          h -= ch;
          n += child.chunkSize();
        }
        return n
      } while (!chunk.lines)
      var i = 0;
      for (; i < chunk.lines.length; ++i) {
        var line = chunk.lines[i], lh = line.height;
        if (h < lh) { break }
        h -= lh;
      }
      return n + i
    }
  
    function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size}
  
    function lineNumberFor(options, i) {
      return String(options.lineNumberFormatter(i + options.firstLineNumber))
    }
  
    // A Pos instance represents a position within the text.
    function Pos(line, ch, sticky) {
      if ( sticky === void 0 ) sticky = null;
  
      if (!(this instanceof Pos)) { return new Pos(line, ch, sticky) }
      this.line = line;
      this.ch = ch;
      this.sticky = sticky;
    }
  
    // Compare two positions, return 0 if they are the same, a negative
    // number when a is less, and a positive number otherwise.
    function cmp(a, b) { return a.line - b.line || a.ch - b.ch }
  
    function equalCursorPos(a, b) { return a.sticky == b.sticky && cmp(a, b) == 0 }
  
    function copyPos(x) {return Pos(x.line, x.ch)}
    function maxPos(a, b) { return cmp(a, b) < 0 ? b : a }
    function minPos(a, b) { return cmp(a, b) < 0 ? a : b }
  
    // Most of the external API clips given positions to make sure they
    // actually exist within the document.
    function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1))}
    function clipPos(doc, pos) {
      if (pos.line < doc.first) { return Pos(doc.first, 0) }
      var last = doc.first + doc.size - 1;
      if (pos.line > last) { return Pos(last, getLine(doc, last).text.length) }
      return clipToLen(pos, getLine(doc, pos.line).text.length)
    }
    function clipToLen(pos, linelen) {
      var ch = pos.ch;
      if (ch == null || ch > linelen) { return Pos(pos.line, linelen) }
      else if (ch < 0) { return Pos(pos.line, 0) }
      else { return pos }
    }
    function clipPosArray(doc, array) {
      var out = [];
      for (var i = 0; i < array.length; i++) { out[i] = clipPos(doc, array[i]); }
      return out
    }
  
    // Optimize some code when these features are not used.
    var sawReadOnlySpans = false, sawCollapsedSpans = false;
  
    function seeReadOnlySpans() {
      sawReadOnlySpans = true;
    }
  
    function seeCollapsedSpans() {
      sawCollapsedSpans = true;
    }
  
    // TEXTMARKER SPANS
  
    function MarkedSpan(marker, from, to) {
      this.marker = marker;
      this.from = from; this.to = to;
    }
  
    // Search an array of spans for a span matching the given marker.
    function getMarkedSpanFor(spans, marker) {
      if (spans) { for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if (span.marker == marker) { return span }
      } }
    }
    // Remove a span from an array, returning undefined if no spans are
    // left (we don't store arrays for lines without spans).
    function removeMarkedSpan(spans, span) {
      var r;
      for (var i = 0; i < spans.length; ++i)
        { if (spans[i] != span) { (r || (r = [])).push(spans[i]); } }
      return r
    }
    // Add a span to a line.
    function addMarkedSpan(line, span) {
      line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
      span.marker.attachLine(line);
    }
  
    // Used for the algorithm that adjusts markers for a change in the
    // document. These functions cut an array of spans at a given
    // character position, returning an array of remaining chunks (or
    // undefined if nothing remains).
    function markedSpansBefore(old, startCh, isInsert) {
      var nw;
      if (old) { for (var i = 0; i < old.length; ++i) {
        var span = old[i], marker = span.marker;
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
        if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
          var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh)
          ;(nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
        }
      } }
      return nw
    }
    function markedSpansAfter(old, endCh, isInsert) {
      var nw;
      if (old) { for (var i = 0; i < old.length; ++i) {
        var span = old[i], marker = span.marker;
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
        if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
          var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh)
          ;(nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh,
                                                span.to == null ? null : span.to - endCh));
        }
      } }
      return nw
    }
  
    // Given a change object, compute the new set of marker spans that
    // cover the line in which the change took place. Removes spans
    // entirely within the change, reconnects spans belonging to the
    // same marker that appear on both sides of the change, and cuts off
    // spans partially within the change. Returns an array of span
    // arrays with one element for each line in (after) the change.
    function stretchSpansOverChange(doc, change) {
      if (change.full) { return null }
      var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
      var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
      if (!oldFirst && !oldLast) { return null }
  
      var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
      // Get the spans that 'stick out' on both sides
      var first = markedSpansBefore(oldFirst, startCh, isInsert);
      var last = markedSpansAfter(oldLast, endCh, isInsert);
  
      // Next, merge those two ends
      var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
      if (first) {
        // Fix up .to properties of first
        for (var i = 0; i < first.length; ++i) {
          var span = first[i];
          if (span.to == null) {
            var found = getMarkedSpanFor(last, span.marker);
            if (!found) { span.to = startCh; }
            else if (sameLine) { span.to = found.to == null ? null : found.to + offset; }
          }
        }
      }
      if (last) {
        // Fix up .from in last (or move them into first in case of sameLine)
        for (var i$1 = 0; i$1 < last.length; ++i$1) {
          var span$1 = last[i$1];
          if (span$1.to != null) { span$1.to += offset; }
          if (span$1.from == null) {
            var found$1 = getMarkedSpanFor(first, span$1.marker);
            if (!found$1) {
              span$1.from = offset;
              if (sameLine) { (first || (first = [])).push(span$1); }
            }
          } else {
            span$1.from += offset;
            if (sameLine) { (first || (first = [])).push(span$1); }
          }
        }
      }
      // Make sure we didn't create any zero-length spans
      if (first) { first = clearEmptySpans(first); }
      if (last && last != first) { last = clearEmptySpans(last); }
  
      var newMarkers = [first];
      if (!sameLine) {
        // Fill gap with whole-line-spans
        var gap = change.text.length - 2, gapMarkers;
        if (gap > 0 && first)
          { for (var i$2 = 0; i$2 < first.length; ++i$2)
            { if (first[i$2].to == null)
              { (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i$2].marker, null, null)); } } }
        for (var i$3 = 0; i$3 < gap; ++i$3)
          { newMarkers.push(gapMarkers); }
        newMarkers.push(last);
      }
      return newMarkers
    }
  
    // Remove spans that are empty and don't have a clearWhenEmpty
    // option of false.
    function clearEmptySpans(spans) {
      for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
          { spans.splice(i--, 1); }
      }
      if (!spans.length) { return null }
      return spans
    }
  
    // Used to 'clip' out readOnly ranges when making a change.
    function removeReadOnlyRanges(doc, from, to) {
      var markers = null;
      doc.iter(from.line, to.line + 1, function (line) {
        if (line.markedSpans) { for (var i = 0; i < line.markedSpans.length; ++i) {
          var mark = line.markedSpans[i].marker;
          if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
            { (markers || (markers = [])).push(mark); }
        } }
      });
      if (!markers) { return null }
      var parts = [{from: from, to: to}];
      for (var i = 0; i < markers.length; ++i) {
        var mk = markers[i], m = mk.find(0);
        for (var j = 0; j < parts.length; ++j) {
          var p = parts[j];
          if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) { continue }
          var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
          if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
            { newParts.push({from: p.from, to: m.from}); }
          if (dto > 0 || !mk.inclusiveRight && !dto)
            { newParts.push({from: m.to, to: p.to}); }
          parts.splice.apply(parts, newParts);
          j += newParts.length - 3;
        }
      }
      return parts
    }
  
    // Connect or disconnect spans from a line.
    function detachMarkedSpans(line) {
      var spans = line.markedSpans;
      if (!spans) { return }
      for (var i = 0; i < spans.length; ++i)
        { spans[i].marker.detachLine(line); }
      line.markedSpans = null;
    }
    function attachMarkedSpans(line, spans) {
      if (!spans) { return }
      for (var i = 0; i < spans.length; ++i)
        { spans[i].marker.attachLine(line); }
      line.markedSpans = spans;
    }
  
    // Helpers used when computing which overlapping collapsed span
    // counts as the larger one.
    function extraLeft(marker) { return marker.inclusiveLeft ? -1 : 0 }
    function extraRight(marker) { return marker.inclusiveRight ? 1 : 0 }
  
    // Returns a number indicating which of two overlapping collapsed
    // spans is larger (and thus includes the other). Falls back to
    // comparing ids when the spans cover exactly the same range.
    function compareCollapsedMarkers(a, b) {
      var lenDiff = a.lines.length - b.lines.length;
      if (lenDiff != 0) { return lenDiff }
      var aPos = a.find(), bPos = b.find();
      var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
      if (fromCmp) { return -fromCmp }
      var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
      if (toCmp) { return toCmp }
      return b.id - a.id
    }
  
    // Find out whether a line ends or starts in a collapsed span. If
    // so, return the marker for that span.
    function collapsedSpanAtSide(line, start) {
      var sps = sawCollapsedSpans && line.markedSpans, found;
      if (sps) { for (var sp = (void 0), i = 0; i < sps.length; ++i) {
        sp = sps[i];
        if (sp.marker.collapsed && (start ? sp.from : sp.to) == null &&
            (!found || compareCollapsedMarkers(found, sp.marker) < 0))
          { found = sp.marker; }
      } }
      return found
    }
    function collapsedSpanAtStart(line) { return collapsedSpanAtSide(line, true) }
    function collapsedSpanAtEnd(line) { return collapsedSpanAtSide(line, false) }
  
    function collapsedSpanAround(line, ch) {
      var sps = sawCollapsedSpans && line.markedSpans, found;
      if (sps) { for (var i = 0; i < sps.length; ++i) {
        var sp = sps[i];
        if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) &&
            (!found || compareCollapsedMarkers(found, sp.marker) < 0)) { found = sp.marker; }
      } }
      return found
    }
  
    // Test whether there exists a collapsed span that partially
    // overlaps (covers the start or end, but not both) of a new span.
    // Such overlap is not allowed.
    function conflictingCollapsedRange(doc, lineNo$$1, from, to, marker) {
      var line = getLine(doc, lineNo$$1);
      var sps = sawCollapsedSpans && line.markedSpans;
      if (sps) { for (var i = 0; i < sps.length; ++i) {
        var sp = sps[i];
        if (!sp.marker.collapsed) { continue }
        var found = sp.marker.find(0);
        var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
        var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
        if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) { continue }
        if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from) >= 0 : cmp(found.to, from) > 0) ||
            fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.from, to) <= 0 : cmp(found.from, to) < 0))
          { return true }
      } }
    }
  
    // A visual line is a line as drawn on the screen. Folding, for
    // example, can cause multiple logical lines to appear on the same
    // visual line. This finds the start of the visual line that the
    // given line is part of (usually that is the line itself).
    function visualLine(line) {
      var merged;
      while (merged = collapsedSpanAtStart(line))
        { line = merged.find(-1, true).line; }
      return line
    }
  
    function visualLineEnd(line) {
      var merged;
      while (merged = collapsedSpanAtEnd(line))
        { line = merged.find(1, true).line; }
      return line
    }
  
    // Returns an array of logical lines that continue the visual line
    // started by the argument, or undefined if there are no such lines.
    function visualLineContinued(line) {
      var merged, lines;
      while (merged = collapsedSpanAtEnd(line)) {
        line = merged.find(1, true).line
        ;(lines || (lines = [])).push(line);
      }
      return lines
    }
  
    // Get the line number of the start of the visual line that the
    // given line number is part of.
    function visualLineNo(doc, lineN) {
      var line = getLine(doc, lineN), vis = visualLine(line);
      if (line == vis) { return lineN }
      return lineNo(vis)
    }
  
    // Get the line number of the start of the next visual line after
    // the given line.
    function visualLineEndNo(doc, lineN) {
      if (lineN > doc.lastLine()) { return lineN }
      var line = getLine(doc, lineN), merged;
      if (!lineIsHidden(doc, line)) { return lineN }
      while (merged = collapsedSpanAtEnd(line))
        { line = merged.find(1, true).line; }
      return lineNo(line) + 1
    }
  
    // Compute whether a line is hidden. Lines count as hidden when they
    // are part of a visual line that starts with another line, or when
    // they are entirely covered by collapsed, non-widget span.
    function lineIsHidden(doc, line) {
      var sps = sawCollapsedSpans && line.markedSpans;
      if (sps) { for (var sp = (void 0), i = 0; i < sps.length; ++i) {
        sp = sps[i];
        if (!sp.marker.collapsed) { continue }
        if (sp.from == null) { return true }
        if (sp.marker.widgetNode) { continue }
        if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
          { return true }
      } }
    }
    function lineIsHiddenInner(doc, line, span) {
      if (span.to == null) {
        var end = span.marker.find(1, true);
        return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker))
      }
      if (span.marker.inclusiveRight && span.to == line.text.length)
        { return true }
      for (var sp = (void 0), i = 0; i < line.markedSpans.length; ++i) {
        sp = line.markedSpans[i];
        if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to &&
            (sp.to == null || sp.to != span.from) &&
            (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
            lineIsHiddenInner(doc, line, sp)) { return true }
      }
    }
  
    // Find the height above the given line.
    function heightAtLine(lineObj) {
      lineObj = visualLine(lineObj);
  
      var h = 0, chunk = lineObj.parent;
      for (var i = 0; i < chunk.lines.length; ++i) {
        var line = chunk.lines[i];
        if (line == lineObj) { break }
        else { h += line.height; }
      }
      for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
        for (var i$1 = 0; i$1 < p.children.length; ++i$1) {
          var cur = p.children[i$1];
          if (cur == chunk) { break }
          else { h += cur.height; }
        }
      }
      return h
    }
  
    // Compute the character length of a line, taking into account
    // collapsed ranges (see markText) that might hide parts, and join
    // other lines onto it.
    function lineLength(line) {
      if (line.height == 0) { return 0 }
      var len = line.text.length, merged, cur = line;
      while (merged = collapsedSpanAtStart(cur)) {
        var found = merged.find(0, true);
        cur = found.from.line;
        len += found.from.ch - found.to.ch;
      }
      cur = line;
      while (merged = collapsedSpanAtEnd(cur)) {
        var found$1 = merged.find(0, true);
        len -= cur.text.length - found$1.from.ch;
        cur = found$1.to.line;
        len += cur.text.length - found$1.to.ch;
      }
      return len
    }
  
    // Find the longest line in the document.
    function findMaxLine(cm) {
      var d = cm.display, doc = cm.doc;
      d.maxLine = getLine(doc, doc.first);
      d.maxLineLength = lineLength(d.maxLine);
      d.maxLineChanged = true;
      doc.iter(function (line) {
        var len = lineLength(line);
        if (len > d.maxLineLength) {
          d.maxLineLength = len;
          d.maxLine = line;
        }
      });
    }
  
    // BIDI HELPERS
  
    function iterateBidiSections(order, from, to, f) {
      if (!order) { return f(from, to, "ltr", 0) }
      var found = false;
      for (var i = 0; i < order.length; ++i) {
        var part = order[i];
        if (part.from < to && part.to > from || from == to && part.to == from) {
          f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr", i);
          found = true;
        }
      }
      if (!found) { f(from, to, "ltr"); }
    }
  
    var bidiOther = null;
    function getBidiPartAt(order, ch, sticky) {
      var found;
      bidiOther = null;
      for (var i = 0; i < order.length; ++i) {
        var cur = order[i];
        if (cur.from < ch && cur.to > ch) { return i }
        if (cur.to == ch) {
          if (cur.from != cur.to && sticky == "before") { found = i; }
          else { bidiOther = i; }
        }
        if (cur.from == ch) {
          if (cur.from != cur.to && sticky != "before") { found = i; }
          else { bidiOther = i; }
        }
      }
      return found != null ? found : bidiOther
    }
  
    // Bidirectional ordering algorithm
    // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
    // that this (partially) implements.
  
    // One-char codes used for character types:
    // L (L):   Left-to-Right
    // R (R):   Right-to-Left
    // r (AL):  Right-to-Left Arabic
    // 1 (EN):  European Number
    // + (ES):  European Number Separator
    // % (ET):  European Number Terminator
    // n (AN):  Arabic Number
    // , (CS):  Common Number Separator
    // m (NSM): Non-Spacing Mark
    // b (BN):  Boundary Neutral
    // s (B):   Paragraph Separator
    // t (S):   Segment Separator
    // w (WS):  Whitespace
    // N (ON):  Other Neutrals
  
    // Returns null if characters are ordered as they appear
    // (left-to-right), or an array of sections ({from, to, level}
    // objects) in the order in which they occur visually.
    var bidiOrdering = (function() {
      // Character types for codepoints 0 to 0xff
      var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
      // Character types for codepoints 0x600 to 0x6f9
      var arabicTypes = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
      function charType(code) {
        if (code <= 0xf7) { return lowTypes.charAt(code) }
        else if (0x590 <= code && code <= 0x5f4) { return "R" }
        else if (0x600 <= code && code <= 0x6f9) { return arabicTypes.charAt(code - 0x600) }
        else if (0x6ee <= code && code <= 0x8ac) { return "r" }
        else if (0x2000 <= code && code <= 0x200b) { return "w" }
        else if (code == 0x200c) { return "b" }
        else { return "L" }
      }
  
      var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
      var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
  
      function BidiSpan(level, from, to) {
        this.level = level;
        this.from = from; this.to = to;
      }
  
      return function(str, direction) {
        var outerType = direction == "ltr" ? "L" : "R";
  
        if (str.length == 0 || direction == "ltr" && !bidiRE.test(str)) { return false }
        var len = str.length, types = [];
        for (var i = 0; i < len; ++i)
          { types.push(charType(str.charCodeAt(i))); }
  
        // W1. Examine each non-spacing mark (NSM) in the level run, and
        // change the type of the NSM to the type of the previous
        // character. If the NSM is at the start of the level run, it will
        // get the type of sor.
        for (var i$1 = 0, prev = outerType; i$1 < len; ++i$1) {
          var type = types[i$1];
          if (type == "m") { types[i$1] = prev; }
          else { prev = type; }
        }
  
        // W2. Search backwards from each instance of a European number
        // until the first strong type (R, L, AL, or sor) is found. If an
        // AL is found, change the type of the European number to Arabic
        // number.
        // W3. Change all ALs to R.
        for (var i$2 = 0, cur = outerType; i$2 < len; ++i$2) {
          var type$1 = types[i$2];
          if (type$1 == "1" && cur == "r") { types[i$2] = "n"; }
          else if (isStrong.test(type$1)) { cur = type$1; if (type$1 == "r") { types[i$2] = "R"; } }
        }
  
        // W4. A single European separator between two European numbers
        // changes to a European number. A single common separator between
        // two numbers of the same type changes to that type.
        for (var i$3 = 1, prev$1 = types[0]; i$3 < len - 1; ++i$3) {
          var type$2 = types[i$3];
          if (type$2 == "+" && prev$1 == "1" && types[i$3+1] == "1") { types[i$3] = "1"; }
          else if (type$2 == "," && prev$1 == types[i$3+1] &&
                   (prev$1 == "1" || prev$1 == "n")) { types[i$3] = prev$1; }
          prev$1 = type$2;
        }
  
        // W5. A sequence of European terminators adjacent to European
        // numbers changes to all European numbers.
        // W6. Otherwise, separators and terminators change to Other
        // Neutral.
        for (var i$4 = 0; i$4 < len; ++i$4) {
          var type$3 = types[i$4];
          if (type$3 == ",") { types[i$4] = "N"; }
          else if (type$3 == "%") {
            var end = (void 0);
            for (end = i$4 + 1; end < len && types[end] == "%"; ++end) {}
            var replace = (i$4 && types[i$4-1] == "!") || (end < len && types[end] == "1") ? "1" : "N";
            for (var j = i$4; j < end; ++j) { types[j] = replace; }
            i$4 = end - 1;
          }
        }
  
        // W7. Search backwards from each instance of a European number
        // until the first strong type (R, L, or sor) is found. If an L is
        // found, then change the type of the European number to L.
        for (var i$5 = 0, cur$1 = outerType; i$5 < len; ++i$5) {
          var type$4 = types[i$5];
          if (cur$1 == "L" && type$4 == "1") { types[i$5] = "L"; }
          else if (isStrong.test(type$4)) { cur$1 = type$4; }
        }
  
        // N1. A sequence of neutrals takes the direction of the
        // surrounding strong text if the text on both sides has the same
        // direction. European and Arabic numbers act as if they were R in
        // terms of their influence on neutrals. Start-of-level-run (sor)
        // and end-of-level-run (eor) are used at level run boundaries.
        // N2. Any remaining neutrals take the embedding direction.
        for (var i$6 = 0; i$6 < len; ++i$6) {
          if (isNeutral.test(types[i$6])) {
            var end$1 = (void 0);
            for (end$1 = i$6 + 1; end$1 < len && isNeutral.test(types[end$1]); ++end$1) {}
            var before = (i$6 ? types[i$6-1] : outerType) == "L";
            var after = (end$1 < len ? types[end$1] : outerType) == "L";
            var replace$1 = before == after ? (before ? "L" : "R") : outerType;
            for (var j$1 = i$6; j$1 < end$1; ++j$1) { types[j$1] = replace$1; }
            i$6 = end$1 - 1;
          }
        }
  
        // Here we depart from the documented algorithm, in order to avoid
        // building up an actual levels array. Since there are only three
        // levels (0, 1, 2) in an implementation that doesn't take
        // explicit embedding into account, we can build up the order on
        // the fly, without following the level-based algorithm.
        var order = [], m;
        for (var i$7 = 0; i$7 < len;) {
          if (countsAsLeft.test(types[i$7])) {
            var start = i$7;
            for (++i$7; i$7 < len && countsAsLeft.test(types[i$7]); ++i$7) {}
            order.push(new BidiSpan(0, start, i$7));
          } else {
            var pos = i$7, at = order.length;
            for (++i$7; i$7 < len && types[i$7] != "L"; ++i$7) {}
            for (var j$2 = pos; j$2 < i$7;) {
              if (countsAsNum.test(types[j$2])) {
                if (pos < j$2) { order.splice(at, 0, new BidiSpan(1, pos, j$2)); }
                var nstart = j$2;
                for (++j$2; j$2 < i$7 && countsAsNum.test(types[j$2]); ++j$2) {}
                order.splice(at, 0, new BidiSpan(2, nstart, j$2));
                pos = j$2;
              } else { ++j$2; }
            }
            if (pos < i$7) { order.splice(at, 0, new BidiSpan(1, pos, i$7)); }
          }
        }
        if (direction == "ltr") {
          if (order[0].level == 1 && (m = str.match(/^\s+/))) {
            order[0].from = m[0].length;
            order.unshift(new BidiSpan(0, 0, m[0].length));
          }
          if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
            lst(order).to -= m[0].length;
            order.push(new BidiSpan(0, len - m[0].length, len));
          }
        }
  
        return direction == "rtl" ? order.reverse() : order
      }
    })();
  
    // Get the bidi ordering for the given line (and cache it). Returns
    // false for lines that are fully left-to-right, and an array of
    // BidiSpan objects otherwise.
    function getOrder(line, direction) {
      var order = line.order;
      if (order == null) { order = line.order = bidiOrdering(line.text, direction); }
      return order
    }
  
    // EVENT HANDLING
  
    // Lightweight event framework. on/off also work on DOM nodes,
    // registering native DOM handlers.
  
    var noHandlers = [];
  
    var on = function(emitter, type, f) {
      if (emitter.addEventListener) {
        emitter.addEventListener(type, f, false);
      } else if (emitter.attachEvent) {
        emitter.attachEvent("on" + type, f);
      } else {
        var map$$1 = emitter._handlers || (emitter._handlers = {});
        map$$1[type] = (map$$1[type] || noHandlers).concat(f);
      }
    };
  
    function getHandlers(emitter, type) {
      return emitter._handlers && emitter._handlers[type] || noHandlers
    }
  
    function off(emitter, type, f) {
      if (emitter.removeEventListener) {
        emitter.removeEventListener(type, f, false);
      } else if (emitter.detachEvent) {
        emitter.detachEvent("on" + type, f);
      } else {
        var map$$1 = emitter._handlers, arr = map$$1 && map$$1[type];
        if (arr) {
          var index = indexOf(arr, f);
          if (index > -1)
            { map$$1[type] = arr.slice(0, index).concat(arr.slice(index + 1)); }
        }
      }
    }
  
    function signal(emitter, type /*, values...*/) {
      var handlers = getHandlers(emitter, type);
      if (!handlers.length) { return }
      var args = Array.prototype.slice.call(arguments, 2);
      for (var i = 0; i < handlers.length; ++i) { handlers[i].apply(null, args); }
    }
  
    // The DOM events that CodeMirror handles can be overridden by
    // registering a (non-DOM) handler on the editor for the event name,
    // and preventDefault-ing the event in that handler.
    function signalDOMEvent(cm, e, override) {
      if (typeof e == "string")
        { e = {type: e, preventDefault: function() { this.defaultPrevented = true; }}; }
      signal(cm, override || e.type, cm, e);
      return e_defaultPrevented(e) || e.codemirrorIgnore
    }
  
    function signalCursorActivity(cm) {
      var arr = cm._handlers && cm._handlers.cursorActivity;
      if (!arr) { return }
      var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
      for (var i = 0; i < arr.length; ++i) { if (indexOf(set, arr[i]) == -1)
        { set.push(arr[i]); } }
    }
  
    function hasHandler(emitter, type) {
      return getHandlers(emitter, type).length > 0
    }
  
    // Add on and off methods to a constructor's prototype, to make
    // registering events on such objects more convenient.
    function eventMixin(ctor) {
      ctor.prototype.on = function(type, f) {on(this, type, f);};
      ctor.prototype.off = function(type, f) {off(this, type, f);};
    }
  
    // Due to the fact that we still support jurassic IE versions, some
    // compatibility wrappers are needed.
  
    function e_preventDefault(e) {
      if (e.preventDefault) { e.preventDefault(); }
      else { e.returnValue = false; }
    }
    function e_stopPropagation(e) {
      if (e.stopPropagation) { e.stopPropagation(); }
      else { e.cancelBubble = true; }
    }
    function e_defaultPrevented(e) {
      return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false
    }
    function e_stop(e) {e_preventDefault(e); e_stopPropagation(e);}
  
    function e_target(e) {return e.target || e.srcElement}
    function e_button(e) {
      var b = e.which;
      if (b == null) {
        if (e.button & 1) { b = 1; }
        else if (e.button & 2) { b = 3; }
        else if (e.button & 4) { b = 2; }
      }
      if (mac && e.ctrlKey && b == 1) { b = 3; }
      return b
    }
  
    // Detect drag-and-drop
    var dragAndDrop = function() {
      // There is *some* kind of drag-and-drop support in IE6-8, but I
      // couldn't get it to work yet.
      if (ie && ie_version < 9) { return false }
      var div = elt('div');
      return "draggable" in div || "dragDrop" in div
    }();
  
    var zwspSupported;
    function zeroWidthElement(measure) {
      if (zwspSupported == null) {
        var test = elt("span", "\u200b");
        removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
        if (measure.firstChild.offsetHeight != 0)
          { zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8); }
      }
      var node = zwspSupported ? elt("span", "\u200b") :
        elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
      node.setAttribute("cm-text", "");
      return node
    }
  
    // Feature-detect IE's crummy client rect reporting for bidi text
    var badBidiRects;
    function hasBadBidiRects(measure) {
      if (badBidiRects != null) { return badBidiRects }
      var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
      var r0 = range(txt, 0, 1).getBoundingClientRect();
      var r1 = range(txt, 1, 2).getBoundingClientRect();
      removeChildren(measure);
      if (!r0 || r0.left == r0.right) { return false } // Safari returns null in some cases (#2780)
      return badBidiRects = (r1.right - r0.right < 3)
    }
  
    // See if "".split is the broken IE version, if so, provide an
    // alternative way to split lines.
    var splitLinesAuto = "\n\nb".split(/\n/).length != 3 ? function (string) {
      var pos = 0, result = [], l = string.length;
      while (pos <= l) {
        var nl = string.indexOf("\n", pos);
        if (nl == -1) { nl = string.length; }
        var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
        var rt = line.indexOf("\r");
        if (rt != -1) {
          result.push(line.slice(0, rt));
          pos += rt + 1;
        } else {
          result.push(line);
          pos = nl + 1;
        }
      }
      return result
    } : function (string) { return string.split(/\r\n?|\n/); };
  
    var hasSelection = window.getSelection ? function (te) {
      try { return te.selectionStart != te.selectionEnd }
      catch(e) { return false }
    } : function (te) {
      var range$$1;
      try {range$$1 = te.ownerDocument.selection.createRange();}
      catch(e) {}
      if (!range$$1 || range$$1.parentElement() != te) { return false }
      return range$$1.compareEndPoints("StartToEnd", range$$1) != 0
    };
  
    var hasCopyEvent = (function () {
      var e = elt("div");
      if ("oncopy" in e) { return true }
      e.setAttribute("oncopy", "return;");
      return typeof e.oncopy == "function"
    })();
  
    var badZoomedRects = null;
    function hasBadZoomedRects(measure) {
      if (badZoomedRects != null) { return badZoomedRects }
      var node = removeChildrenAndAdd(measure, elt("span", "x"));
      var normal = node.getBoundingClientRect();
      var fromRange = range(node, 0, 1).getBoundingClientRect();
      return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1
    }
  
    // Known modes, by name and by MIME
    var modes = {}, mimeModes = {};
  
    // Extra arguments are stored as the mode's dependencies, which is
    // used by (legacy) mechanisms like loadmode.js to automatically
    // load a mode. (Preferred mechanism is the require/define calls.)
    function defineMode(name, mode) {
      if (arguments.length > 2)
        { mode.dependencies = Array.prototype.slice.call(arguments, 2); }
      modes[name] = mode;
    }
  
    function defineMIME(mime, spec) {
      mimeModes[mime] = spec;
    }
  
    // Given a MIME type, a {name, ...options} config object, or a name
    // string, return a mode config object.
    function resolveMode(spec) {
      if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
        spec = mimeModes[spec];
      } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
        var found = mimeModes[spec.name];
        if (typeof found == "string") { found = {name: found}; }
        spec = createObj(found, spec);
        spec.name = found.name;
      } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
        return resolveMode("application/xml")
      } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) {
        return resolveMode("application/json")
      }
      if (typeof spec == "string") { return {name: spec} }
      else { return spec || {name: "null"} }
    }
  
    // Given a mode spec (anything that resolveMode accepts), find and
    // initialize an actual mode object.
    function getMode(options, spec) {
      spec = resolveMode(spec);
      var mfactory = modes[spec.name];
      if (!mfactory) { return getMode(options, "text/plain") }
      var modeObj = mfactory(options, spec);
      if (modeExtensions.hasOwnProperty(spec.name)) {
        var exts = modeExtensions[spec.name];
        for (var prop in exts) {
          if (!exts.hasOwnProperty(prop)) { continue }
          if (modeObj.hasOwnProperty(prop)) { modeObj["_" + prop] = modeObj[prop]; }
          modeObj[prop] = exts[prop];
        }
      }
      modeObj.name = spec.name;
      if (spec.helperType) { modeObj.helperType = spec.helperType; }
      if (spec.modeProps) { for (var prop$1 in spec.modeProps)
        { modeObj[prop$1] = spec.modeProps[prop$1]; } }
  
      return modeObj
    }
  
    // This can be used to attach properties to mode objects from
    // outside the actual mode definition.
    var modeExtensions = {};
    function extendMode(mode, properties) {
      var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
      copyObj(properties, exts);
    }
  
    function copyState(mode, state) {
      if (state === true) { return state }
      if (mode.copyState) { return mode.copyState(state) }
      var nstate = {};
      for (var n in state) {
        var val = state[n];
        if (val instanceof Array) { val = val.concat([]); }
        nstate[n] = val;
      }
      return nstate
    }
  
    // Given a mode and a state (for that mode), find the inner mode and
    // state at the position that the state refers to.
    function innerMode(mode, state) {
      var info;
      while (mode.innerMode) {
        info = mode.innerMode(state);
        if (!info || info.mode == mode) { break }
        state = info.state;
        mode = info.mode;
      }
      return info || {mode: mode, state: state}
    }
  
    function startState(mode, a1, a2) {
      return mode.startState ? mode.startState(a1, a2) : true
    }
  
    // STRING STREAM
  
    // Fed to the mode parsers, provides helper functions to make
    // parsers more succinct.
  
    var StringStream = function(string, tabSize, lineOracle) {
      this.pos = this.start = 0;
      this.string = string;
      this.tabSize = tabSize || 8;
      this.lastColumnPos = this.lastColumnValue = 0;
      this.lineStart = 0;
      this.lineOracle = lineOracle;
    };
  
    StringStream.prototype.eol = function () {return this.pos >= this.string.length};
    StringStream.prototype.sol = function () {return this.pos == this.lineStart};
    StringStream.prototype.peek = function () {return this.string.charAt(this.pos) || undefined};
    StringStream.prototype.next = function () {
      if (this.pos < this.string.length)
        { return this.string.charAt(this.pos++) }
    };
    StringStream.prototype.eat = function (match) {
      var ch = this.string.charAt(this.pos);
      var ok;
      if (typeof match == "string") { ok = ch == match; }
      else { ok = ch && (match.test ? match.test(ch) : match(ch)); }
      if (ok) {++this.pos; return ch}
    };
    StringStream.prototype.eatWhile = function (match) {
      var start = this.pos;
      while (this.eat(match)){}
      return this.pos > start
    };
    StringStream.prototype.eatSpace = function () {
        var this$1 = this;
  
      var start = this.pos;
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) { ++this$1.pos; }
      return this.pos > start
    };
    StringStream.prototype.skipToEnd = function () {this.pos = this.string.length;};
    StringStream.prototype.skipTo = function (ch) {
      var found = this.string.indexOf(ch, this.pos);
      if (found > -1) {this.pos = found; return true}
    };
    StringStream.prototype.backUp = function (n) {this.pos -= n;};
    StringStream.prototype.column = function () {
      if (this.lastColumnPos < this.start) {
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;
      }
      return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0)
    };
    StringStream.prototype.indentation = function () {
      return countColumn(this.string, null, this.tabSize) -
        (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0)
    };
    StringStream.prototype.match = function (pattern, consume, caseInsensitive) {
      if (typeof pattern == "string") {
        var cased = function (str) { return caseInsensitive ? str.toLowerCase() : str; };
        var substr = this.string.substr(this.pos, pattern.length);
        if (cased(substr) == cased(pattern)) {
          if (consume !== false) { this.pos += pattern.length; }
          return true
        }
      } else {
        var match = this.string.slice(this.pos).match(pattern);
        if (match && match.index > 0) { return null }
        if (match && consume !== false) { this.pos += match[0].length; }
        return match
      }
    };
    StringStream.prototype.current = function (){return this.string.slice(this.start, this.pos)};
    StringStream.prototype.hideFirstChars = function (n, inner) {
      this.lineStart += n;
      try { return inner() }
      finally { this.lineStart -= n; }
    };
    StringStream.prototype.lookAhead = function (n) {
      var oracle = this.lineOracle;
      return oracle && oracle.lookAhead(n)
    };
    StringStream.prototype.baseToken = function () {
      var oracle = this.lineOracle;
      return oracle && oracle.baseToken(this.pos)
    };
  
    var SavedContext = function(state, lookAhead) {
      this.state = state;
      this.lookAhead = lookAhead;
    };
  
    var Context = function(doc, state, line, lookAhead) {
      this.state = state;
      this.doc = doc;
      this.line = line;
      this.maxLookAhead = lookAhead || 0;
      this.baseTokens = null;
      this.baseTokenPos = 1;
    };
  
    Context.prototype.lookAhead = function (n) {
      var line = this.doc.getLine(this.line + n);
      if (line != null && n > this.maxLookAhead) { this.maxLookAhead = n; }
      return line
    };
  
    Context.prototype.baseToken = function (n) {
        var this$1 = this;
  
      if (!this.baseTokens) { return null }
      while (this.baseTokens[this.baseTokenPos] <= n)
        { this$1.baseTokenPos += 2; }
      var type = this.baseTokens[this.baseTokenPos + 1];
      return {type: type && type.replace(/( |^)overlay .*/, ""),
              size: this.baseTokens[this.baseTokenPos] - n}
    };
  
    Context.prototype.nextLine = function () {
      this.line++;
      if (this.maxLookAhead > 0) { this.maxLookAhead--; }
    };
  
    Context.fromSaved = function (doc, saved, line) {
      if (saved instanceof SavedContext)
        { return new Context(doc, copyState(doc.mode, saved.state), line, saved.lookAhead) }
      else
        { return new Context(doc, copyState(doc.mode, saved), line) }
    };
  
    Context.prototype.save = function (copy) {
      var state = copy !== false ? copyState(this.doc.mode, this.state) : this.state;
      return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state
    };
  
  
    // Compute a style array (an array starting with a mode generation
    // -- for invalidation -- followed by pairs of end positions and
    // style strings), which is used to highlight the tokens on the
    // line.
    function highlightLine(cm, line, context, forceToEnd) {
      // A styles array always starts with a number identifying the
      // mode/overlays that it is based on (for easy invalidation).
      var st = [cm.state.modeGen], lineClasses = {};
      // Compute the base array of styles
      runMode(cm, line.text, cm.doc.mode, context, function (end, style) { return st.push(end, style); },
              lineClasses, forceToEnd);
      var state = context.state;
  
      // Run overlays, adjust style array.
      var loop = function ( o ) {
        context.baseTokens = st;
        var overlay = cm.state.overlays[o], i = 1, at = 0;
        context.state = true;
        runMode(cm, line.text, overlay.mode, context, function (end, style) {
          var start = i;
          // Ensure there's a token end at the current position, and that i points at it
          while (at < end) {
            var i_end = st[i];
            if (i_end > end)
              { st.splice(i, 1, end, st[i+1], i_end); }
            i += 2;
            at = Math.min(end, i_end);
          }
          if (!style) { return }
          if (overlay.opaque) {
            st.splice(start, i - start, end, "overlay " + style);
            i = start + 2;
          } else {
            for (; start < i; start += 2) {
              var cur = st[start+1];
              st[start+1] = (cur ? cur + " " : "") + "overlay " + style;
            }
          }
        }, lineClasses);
        context.state = state;
        context.baseTokens = null;
        context.baseTokenPos = 1;
      };
  
      for (var o = 0; o < cm.state.overlays.length; ++o) loop( o );
  
      return {styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null}
    }
  
    function getLineStyles(cm, line, updateFrontier) {
      if (!line.styles || line.styles[0] != cm.state.modeGen) {
        var context = getContextBefore(cm, lineNo(line));
        var resetState = line.text.length > cm.options.maxHighlightLength && copyState(cm.doc.mode, context.state);
        var result = highlightLine(cm, line, context);
        if (resetState) { context.state = resetState; }
        line.stateAfter = context.save(!resetState);
        line.styles = result.styles;
        if (result.classes) { line.styleClasses = result.classes; }
        else if (line.styleClasses) { line.styleClasses = null; }
        if (updateFrontier === cm.doc.highlightFrontier)
          { cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier); }
      }
      return line.styles
    }
  
    function getContextBefore(cm, n, precise) {
      var doc = cm.doc, display = cm.display;
      if (!doc.mode.startState) { return new Context(doc, true, n) }
      var start = findStartLine(cm, n, precise);
      var saved = start > doc.first && getLine(doc, start - 1).stateAfter;
      var context = saved ? Context.fromSaved(doc, saved, start) : new Context(doc, startState(doc.mode), start);
  
      doc.iter(start, n, function (line) {
        processLine(cm, line.text, context);
        var pos = context.line;
        line.stateAfter = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null;
        context.nextLine();
      });
      if (precise) { doc.modeFrontier = context.line; }
      return context
    }
  
    // Lightweight form of highlight -- proceed over this line and
    // update state, but don't save a style array. Used for lines that
    // aren't currently visible.
    function processLine(cm, text, context, startAt) {
      var mode = cm.doc.mode;
      var stream = new StringStream(text, cm.options.tabSize, context);
      stream.start = stream.pos = startAt || 0;
      if (text == "") { callBlankLine(mode, context.state); }
      while (!stream.eol()) {
        readToken(mode, stream, context.state);
        stream.start = stream.pos;
      }
    }
  
    function callBlankLine(mode, state) {
      if (mode.blankLine) { return mode.blankLine(state) }
      if (!mode.innerMode) { return }
      var inner = innerMode(mode, state);
      if (inner.mode.blankLine) { return inner.mode.blankLine(inner.state) }
    }
  
    function readToken(mode, stream, state, inner) {
      for (var i = 0; i < 10; i++) {
        if (inner) { inner[0] = innerMode(mode, state).mode; }
        var style = mode.token(stream, state);
        if (stream.pos > stream.start) { return style }
      }
      throw new Error("Mode " + mode.name + " failed to advance stream.")
    }
  
    var Token = function(stream, type, state) {
      this.start = stream.start; this.end = stream.pos;
      this.string = stream.current();
      this.type = type || null;
      this.state = state;
    };
  
    // Utility for getTokenAt and getLineTokens
    function takeToken(cm, pos, precise, asArray) {
      var doc = cm.doc, mode = doc.mode, style;
      pos = clipPos(doc, pos);
      var line = getLine(doc, pos.line), context = getContextBefore(cm, pos.line, precise);
      var stream = new StringStream(line.text, cm.options.tabSize, context), tokens;
      if (asArray) { tokens = []; }
      while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
        stream.start = stream.pos;
        style = readToken(mode, stream, context.state);
        if (asArray) { tokens.push(new Token(stream, style, copyState(doc.mode, context.state))); }
      }
      return asArray ? tokens : new Token(stream, style, context.state)
    }
  
    function extractLineClasses(type, output) {
      if (type) { for (;;) {
        var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
        if (!lineClass) { break }
        type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
        var prop = lineClass[1] ? "bgClass" : "textClass";
        if (output[prop] == null)
          { output[prop] = lineClass[2]; }
        else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(output[prop]))
          { output[prop] += " " + lineClass[2]; }
      } }
      return type
    }
  
    // Run the given mode's parser over a line, calling f for each token.
    function runMode(cm, text, mode, context, f, lineClasses, forceToEnd) {
      var flattenSpans = mode.flattenSpans;
      if (flattenSpans == null) { flattenSpans = cm.options.flattenSpans; }
      var curStart = 0, curStyle = null;
      var stream = new StringStream(text, cm.options.tabSize, context), style;
      var inner = cm.options.addModeClass && [null];
      if (text == "") { extractLineClasses(callBlankLine(mode, context.state), lineClasses); }
      while (!stream.eol()) {
        if (stream.pos > cm.options.maxHighlightLength) {
          flattenSpans = false;
          if (forceToEnd) { processLine(cm, text, context, stream.pos); }
          stream.pos = text.length;
          style = null;
        } else {
          style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses);
        }
        if (inner) {
          var mName = inner[0].name;
          if (mName) { style = "m-" + (style ? mName + " " + style : mName); }
        }
        if (!flattenSpans || curStyle != style) {
          while (curStart < stream.start) {
            curStart = Math.min(stream.start, curStart + 5000);
            f(curStart, curStyle);
          }
          curStyle = style;
        }
        stream.start = stream.pos;
      }
      while (curStart < stream.pos) {
        // Webkit seems to refuse to render text nodes longer than 57444
        // characters, and returns inaccurate measurements in nodes
        // starting around 5000 chars.
        var pos = Math.min(stream.pos, curStart + 5000);
        f(pos, curStyle);
        curStart = pos;
      }
    }
  
    // Finds the line to start with when starting a parse. Tries to
    // find a line with a stateAfter, so that it can start with a
    // valid state. If that fails, it returns the line with the
    // smallest indentation, which tends to need the least context to
    // parse correctly.
    function findStartLine(cm, n, precise) {
      var minindent, minline, doc = cm.doc;
      var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
      for (var search = n; search > lim; --search) {
        if (search <= doc.first) { return doc.first }
        var line = getLine(doc, search - 1), after = line.stateAfter;
        if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc.modeFrontier))
          { return search }
        var indented = countColumn(line.text, null, cm.options.tabSize);
        if (minline == null || minindent > indented) {
          minline = search - 1;
          minindent = indented;
        }
      }
      return minline
    }
  
    function retreatFrontier(doc, n) {
      doc.modeFrontier = Math.min(doc.modeFrontier, n);
      if (doc.highlightFrontier < n - 10) { return }
      var start = doc.first;
      for (var line = n - 1; line > start; line--) {
        var saved = getLine(doc, line).stateAfter;
        // change is on 3
        // state on line 1 looked ahead 2 -- so saw 3
        // test 1 + 2 < 3 should cover this
        if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n)) {
          start = line + 1;
          break
        }
      }
      doc.highlightFrontier = Math.min(doc.highlightFrontier, start);
    }
  
    // LINE DATA STRUCTURE
  
    // Line objects. These hold state related to a line, including
    // highlighting info (the styles array).
    var Line = function(text, markedSpans, estimateHeight) {
      this.text = text;
      attachMarkedSpans(this, markedSpans);
      this.height = estimateHeight ? estimateHeight(this) : 1;
    };
  
    Line.prototype.lineNo = function () { return lineNo(this) };
    eventMixin(Line);
  
    // Change the content (text, markers) of a line. Automatically
    // invalidates cached information and tries to re-estimate the
    // line's height.
    function updateLine(line, text, markedSpans, estimateHeight) {
      line.text = text;
      if (line.stateAfter) { line.stateAfter = null; }
      if (line.styles) { line.styles = null; }
      if (line.order != null) { line.order = null; }
      detachMarkedSpans(line);
      attachMarkedSpans(line, markedSpans);
      var estHeight = estimateHeight ? estimateHeight(line) : 1;
      if (estHeight != line.height) { updateLineHeight(line, estHeight); }
    }
  
    // Detach a line from the document tree and its markers.
    function cleanUpLine(line) {
      line.parent = null;
      detachMarkedSpans(line);
    }
  
    // Convert a style as returned by a mode (either null, or a string
    // containing one or more styles) to a CSS style. This is cached,
    // and also looks for line-wide styles.
    var styleToClassCache = {}, styleToClassCacheWithMode = {};
    function interpretTokenStyle(style, options) {
      if (!style || /^\s*$/.test(style)) { return null }
      var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
      return cache[style] ||
        (cache[style] = style.replace(/\S+/g, "cm-$&"))
    }
  
    // Render the DOM representation of the text of a line. Also builds
    // up a 'line map', which points at the DOM nodes that represent
    // specific stretches of text, and is used by the measuring code.
    // The returned object contains the DOM node, this map, and
    // information about line-wide styles that were set by the mode.
    function buildLineContent(cm, lineView) {
      // The padding-right forces the element to have a 'border', which
      // is needed on Webkit to be able to get line-level bounding
      // rectangles for it (in measureChar).
      var content = eltP("span", null, null, webkit ? "padding-right: .1px" : null);
      var builder = {pre: eltP("pre", [content], "CodeMirror-line"), content: content,
                     col: 0, pos: 0, cm: cm,
                     trailingSpace: false,
                     splitSpaces: cm.getOption("lineWrapping")};
      lineView.measure = {};
  
      // Iterate over the logical lines that make up this visual line.
      for (var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
        var line = i ? lineView.rest[i - 1] : lineView.line, order = (void 0);
        builder.pos = 0;
        builder.addToken = buildToken;
        // Optionally wire in some hacks into the token-rendering
        // algorithm, to deal with browser quirks.
        if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line, cm.doc.direction)))
          { builder.addToken = buildTokenBadBidi(builder.addToken, order); }
        builder.map = [];
        var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
        insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
        if (line.styleClasses) {
          if (line.styleClasses.bgClass)
            { builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || ""); }
          if (line.styleClasses.textClass)
            { builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || ""); }
        }
  
        // Ensure at least a single node is present, for measuring.
        if (builder.map.length == 0)
          { builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure))); }
  
        // Store the map and a cache object for the current logical line
        if (i == 0) {
          lineView.measure.map = builder.map;
          lineView.measure.cache = {};
        } else {
    (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map)
          ;(lineView.measure.caches || (lineView.measure.caches = [])).push({});
        }
      }
  
      // See issue #2901
      if (webkit) {
        var last = builder.content.lastChild;
        if (/\bcm-tab\b/.test(last.className) || (last.querySelector && last.querySelector(".cm-tab")))
          { builder.content.className = "cm-tab-wrap-hack"; }
      }
  
      signal(cm, "renderLine", cm, lineView.line, builder.pre);
      if (builder.pre.className)
        { builder.textClass = joinClasses(builder.pre.className, builder.textClass || ""); }
  
      return builder
    }
  
    function defaultSpecialCharPlaceholder(ch) {
      var token = elt("span", "\u2022", "cm-invalidchar");
      token.title = "\\u" + ch.charCodeAt(0).toString(16);
      token.setAttribute("aria-label", token.title);
      return token
    }
  
    // Build up the DOM representation for a single token, and add it to
    // the line map. Takes care to render special characters separately.
    function buildToken(builder, text, style, startStyle, endStyle, css, attributes) {
      if (!text) { return }
      var displayText = builder.splitSpaces ? splitSpaces(text, builder.trailingSpace) : text;
      var special = builder.cm.state.specialChars, mustWrap = false;
      var content;
      if (!special.test(text)) {
        builder.col += text.length;
        content = document.createTextNode(displayText);
        builder.map.push(builder.pos, builder.pos + text.length, content);
        if (ie && ie_version < 9) { mustWrap = true; }
        builder.pos += text.length;
      } else {
        content = document.createDocumentFragment();
        var pos = 0;
        while (true) {
          special.lastIndex = pos;
          var m = special.exec(text);
          var skipped = m ? m.index - pos : text.length - pos;
          if (skipped) {
            var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
            if (ie && ie_version < 9) { content.appendChild(elt("span", [txt])); }
            else { content.appendChild(txt); }
            builder.map.push(builder.pos, builder.pos + skipped, txt);
            builder.col += skipped;
            builder.pos += skipped;
          }
          if (!m) { break }
          pos += skipped + 1;
          var txt$1 = (void 0);
          if (m[0] == "\t") {
            var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
            txt$1 = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
            txt$1.setAttribute("role", "presentation");
            txt$1.setAttribute("cm-text", "\t");
            builder.col += tabWidth;
          } else if (m[0] == "\r" || m[0] == "\n") {
            txt$1 = content.appendChild(elt("span", m[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
            txt$1.setAttribute("cm-text", m[0]);
            builder.col += 1;
          } else {
            txt$1 = builder.cm.options.specialCharPlaceholder(m[0]);
            txt$1.setAttribute("cm-text", m[0]);
            if (ie && ie_version < 9) { content.appendChild(elt("span", [txt$1])); }
            else { content.appendChild(txt$1); }
            builder.col += 1;
          }
          builder.map.push(builder.pos, builder.pos + 1, txt$1);
          builder.pos++;
        }
      }
      builder.trailingSpace = displayText.charCodeAt(text.length - 1) == 32;
      if (style || startStyle || endStyle || mustWrap || css) {
        var fullStyle = style || "";
        if (startStyle) { fullStyle += startStyle; }
        if (endStyle) { fullStyle += endStyle; }
        var token = elt("span", [content], fullStyle, css);
        if (attributes) {
          for (var attr in attributes) { if (attributes.hasOwnProperty(attr) && attr != "style" && attr != "class")
            { token.setAttribute(attr, attributes[attr]); } }
        }
        return builder.content.appendChild(token)
      }
      builder.content.appendChild(content);
    }
  
    // Change some spaces to NBSP to prevent the browser from collapsing
    // trailing spaces at the end of a line when rendering text (issue #1362).
    function splitSpaces(text, trailingBefore) {
      if (text.length > 1 && !/  /.test(text)) { return text }
      var spaceBefore = trailingBefore, result = "";
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch == " " && spaceBefore && (i == text.length - 1 || text.charCodeAt(i + 1) == 32))
          { ch = "\u00a0"; }
        result += ch;
        spaceBefore = ch == " ";
      }
      return result
    }
  
    // Work around nonsense dimensions being reported for stretches of
    // right-to-left text.
    function buildTokenBadBidi(inner, order) {
      return function (builder, text, style, startStyle, endStyle, css, attributes) {
        style = style ? style + " cm-force-border" : "cm-force-border";
        var start = builder.pos, end = start + text.length;
        for (;;) {
          // Find the part that overlaps with the start of this text
          var part = (void 0);
          for (var i = 0; i < order.length; i++) {
            part = order[i];
            if (part.to > start && part.from <= start) { break }
          }
          if (part.to >= end) { return inner(builder, text, style, startStyle, endStyle, css, attributes) }
          inner(builder, text.slice(0, part.to - start), style, startStyle, null, css, attributes);
          startStyle = null;
          text = text.slice(part.to - start);
          start = part.to;
        }
      }
    }
  
    function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
      var widget = !ignoreWidget && marker.widgetNode;
      if (widget) { builder.map.push(builder.pos, builder.pos + size, widget); }
      if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
        if (!widget)
          { widget = builder.content.appendChild(document.createElement("span")); }
        widget.setAttribute("cm-marker", marker.id);
      }
      if (widget) {
        builder.cm.display.input.setUneditable(widget);
        builder.content.appendChild(widget);
      }
      builder.pos += size;
      builder.trailingSpace = false;
    }
  
    // Outputs a number of spans to make up a line, taking highlighting
    // and marked text into account.
    function insertLineContent(line, builder, styles) {
      var spans = line.markedSpans, allText = line.text, at = 0;
      if (!spans) {
        for (var i$1 = 1; i$1 < styles.length; i$1+=2)
          { builder.addToken(builder, allText.slice(at, at = styles[i$1]), interpretTokenStyle(styles[i$1+1], builder.cm.options)); }
        return
      }
  
      var len = allText.length, pos = 0, i = 1, text = "", style, css;
      var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, collapsed, attributes;
      for (;;) {
        if (nextChange == pos) { // Update current marker set
          spanStyle = spanEndStyle = spanStartStyle = css = "";
          attributes = null;
          collapsed = null; nextChange = Infinity;
          var foundBookmarks = [], endStyles = (void 0);
          for (var j = 0; j < spans.length; ++j) {
            var sp = spans[j], m = sp.marker;
            if (m.type == "bookmark" && sp.from == pos && m.widgetNode) {
              foundBookmarks.push(m);
            } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
              if (sp.to != null && sp.to != pos && nextChange > sp.to) {
                nextChange = sp.to;
                spanEndStyle = "";
              }
              if (m.className) { spanStyle += " " + m.className; }
              if (m.css) { css = (css ? css + ";" : "") + m.css; }
              if (m.startStyle && sp.from == pos) { spanStartStyle += " " + m.startStyle; }
              if (m.endStyle && sp.to == nextChange) { (endStyles || (endStyles = [])).push(m.endStyle, sp.to); }
              // support for the old title property
              // https://github.com/codemirror/CodeMirror/pull/5673
              if (m.title) { (attributes || (attributes = {})).title = m.title; }
              if (m.attributes) {
                for (var attr in m.attributes)
                  { (attributes || (attributes = {}))[attr] = m.attributes[attr]; }
              }
              if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0))
                { collapsed = sp; }
            } else if (sp.from > pos && nextChange > sp.from) {
              nextChange = sp.from;
            }
          }
          if (endStyles) { for (var j$1 = 0; j$1 < endStyles.length; j$1 += 2)
            { if (endStyles[j$1 + 1] == nextChange) { spanEndStyle += " " + endStyles[j$1]; } } }
  
          if (!collapsed || collapsed.from == pos) { for (var j$2 = 0; j$2 < foundBookmarks.length; ++j$2)
            { buildCollapsedSpan(builder, 0, foundBookmarks[j$2]); } }
          if (collapsed && (collapsed.from || 0) == pos) {
            buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos,
                               collapsed.marker, collapsed.from == null);
            if (collapsed.to == null) { return }
            if (collapsed.to == pos) { collapsed = false; }
          }
        }
        if (pos >= len) { break }
  
        var upto = Math.min(len, nextChange);
        while (true) {
          if (text) {
            var end = pos + text.length;
            if (!collapsed) {
              var tokenText = end > upto ? text.slice(0, upto - pos) : text;
              builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
                               spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", css, attributes);
            }
            if (end >= upto) {text = text.slice(upto - pos); pos = upto; break}
            pos = end;
            spanStartStyle = "";
          }
          text = allText.slice(at, at = styles[i++]);
          style = interpretTokenStyle(styles[i++], builder.cm.options);
        }
      }
    }
  
  
    // These objects are used to represent the visible (currently drawn)
    // part of the document. A LineView may correspond to multiple
    // logical lines, if those are connected by collapsed ranges.
    function LineView(doc, line, lineN) {
      // The starting line
      this.line = line;
      // Continuing lines, if any
      this.rest = visualLineContinued(line);
      // Number of logical lines in this visual line
      this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
      this.node = this.text = null;
      this.hidden = lineIsHidden(doc, line);
    }
  
    // Create a range of LineView objects for the given lines.
    function buildViewArray(cm, from, to) {
      var array = [], nextPos;
      for (var pos = from; pos < to; pos = nextPos) {
        var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
        nextPos = pos + view.size;
        array.push(view);
      }
      return array
    }
  
    var operationGroup = null;
  
    function pushOperation(op) {
      if (operationGroup) {
        operationGroup.ops.push(op);
      } else {
        op.ownsGroup = operationGroup = {
          ops: [op],
          delayedCallbacks: []
        };
      }
    }
  
    function fireCallbacksForOps(group) {
      // Calls delayed callbacks and cursorActivity handlers until no
      // new ones appear
      var callbacks = group.delayedCallbacks, i = 0;
      do {
        for (; i < callbacks.length; i++)
          { callbacks[i].call(null); }
        for (var j = 0; j < group.ops.length; j++) {
          var op = group.ops[j];
          if (op.cursorActivityHandlers)
            { while (op.cursorActivityCalled < op.cursorActivityHandlers.length)
              { op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm); } }
        }
      } while (i < callbacks.length)
    }
  
    function finishOperation(op, endCb) {
      var group = op.ownsGroup;
      if (!group) { return }
  
      try { fireCallbacksForOps(group); }
      finally {
        operationGroup = null;
        endCb(group);
      }
    }
  
    var orphanDelayedCallbacks = null;
  
    // Often, we want to signal events at a point where we are in the
    // middle of some work, but don't want the handler to start calling
    // other methods on the editor, which might be in an inconsistent
    // state or simply not expect any other events to happen.
    // signalLater looks whether there are any handlers, and schedules
    // them to be executed when the last operation ends, or, if no
    // operation is active, when a timeout fires.
    function signalLater(emitter, type /*, values...*/) {
      var arr = getHandlers(emitter, type);
      if (!arr.length) { return }
      var args = Array.prototype.slice.call(arguments, 2), list;
      if (operationGroup) {
        list = operationGroup.delayedCallbacks;
      } else if (orphanDelayedCallbacks) {
        list = orphanDelayedCallbacks;
      } else {
        list = orphanDelayedCallbacks = [];
        setTimeout(fireOrphanDelayed, 0);
      }
      var loop = function ( i ) {
        list.push(function () { return arr[i].apply(null, args); });
      };
  
      for (var i = 0; i < arr.length; ++i)
        loop( i );
    }
  
    function fireOrphanDelayed() {
      var delayed = orphanDelayedCallbacks;
      orphanDelayedCallbacks = null;
      for (var i = 0; i < delayed.length; ++i) { delayed[i](); }
    }
  
    // When an aspect of a line changes, a string is added to
    // lineView.changes. This updates the relevant part of the line's
    // DOM structure.
    function updateLineForChanges(cm, lineView, lineN, dims) {
      for (var j = 0; j < lineView.changes.length; j++) {
        var type = lineView.changes[j];
        if (type == "text") { updateLineText(cm, lineView); }
        else if (type == "gutter") { updateLineGutter(cm, lineView, lineN, dims); }
        else if (type == "class") { updateLineClasses(cm, lineView); }
        else if (type == "widget") { updateLineWidgets(cm, lineView, dims); }
      }
      lineView.changes = null;
    }
  
    // Lines with gutter elements, widgets or a background class need to
    // be wrapped, and have the extra elements added to the wrapper div
    function ensureLineWrapped(lineView) {
      if (lineView.node == lineView.text) {
        lineView.node = elt("div", null, null, "position: relative");
        if (lineView.text.parentNode)
          { lineView.text.parentNode.replaceChild(lineView.node, lineView.text); }
        lineView.node.appendChild(lineView.text);
        if (ie && ie_version < 8) { lineView.node.style.zIndex = 2; }
      }
      return lineView.node
    }
  
    function updateLineBackground(cm, lineView) {
      var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
      if (cls) { cls += " CodeMirror-linebackground"; }
      if (lineView.background) {
        if (cls) { lineView.background.className = cls; }
        else { lineView.background.parentNode.removeChild(lineView.background); lineView.background = null; }
      } else if (cls) {
        var wrap = ensureLineWrapped(lineView);
        lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
        cm.display.input.setUneditable(lineView.background);
      }
    }
  
    // Wrapper around buildLineContent which will reuse the structure
    // in display.externalMeasured when possible.
    function getLineContent(cm, lineView) {
      var ext = cm.display.externalMeasured;
      if (ext && ext.line == lineView.line) {
        cm.display.externalMeasured = null;
        lineView.measure = ext.measure;
        return ext.built
      }
      return buildLineContent(cm, lineView)
    }
  
    // Redraw the line's text. Interacts with the background and text
    // classes because the mode may output tokens that influence these
    // classes.
    function updateLineText(cm, lineView) {
      var cls = lineView.text.className;
      var built = getLineContent(cm, lineView);
      if (lineView.text == lineView.node) { lineView.node = built.pre; }
      lineView.text.parentNode.replaceChild(built.pre, lineView.text);
      lineView.text = built.pre;
      if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
        lineView.bgClass = built.bgClass;
        lineView.textClass = built.textClass;
        updateLineClasses(cm, lineView);
      } else if (cls) {
        lineView.text.className = cls;
      }
    }
  
    function updateLineClasses(cm, lineView) {
      updateLineBackground(cm, lineView);
      if (lineView.line.wrapClass)
        { ensureLineWrapped(lineView).className = lineView.line.wrapClass; }
      else if (lineView.node != lineView.text)
        { lineView.node.className = ""; }
      var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
      lineView.text.className = textClass || "";
    }
  
    function updateLineGutter(cm, lineView, lineN, dims) {
      if (lineView.gutter) {
        lineView.node.removeChild(lineView.gutter);
        lineView.gutter = null;
      }
      if (lineView.gutterBackground) {
        lineView.node.removeChild(lineView.gutterBackground);
        lineView.gutterBackground = null;
      }
      if (lineView.line.gutterClass) {
        var wrap = ensureLineWrapped(lineView);
        lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass,
                                        ("left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px; width: " + (dims.gutterTotalWidth) + "px"));
        cm.display.input.setUneditable(lineView.gutterBackground);
        wrap.insertBefore(lineView.gutterBackground, lineView.text);
      }
      var markers = lineView.line.gutterMarkers;
      if (cm.options.lineNumbers || markers) {
        var wrap$1 = ensureLineWrapped(lineView);
        var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", ("left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px"));
        cm.display.input.setUneditable(gutterWrap);
        wrap$1.insertBefore(gutterWrap, lineView.text);
        if (lineView.line.gutterClass)
          { gutterWrap.className += " " + lineView.line.gutterClass; }
        if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
          { lineView.lineNumber = gutterWrap.appendChild(
            elt("div", lineNumberFor(cm.options, lineN),
                "CodeMirror-linenumber CodeMirror-gutter-elt",
                ("left: " + (dims.gutterLeft["CodeMirror-linenumbers"]) + "px; width: " + (cm.display.lineNumInnerWidth) + "px"))); }
        if (markers) { for (var k = 0; k < cm.options.gutters.length; ++k) {
          var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
          if (found)
            { gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt",
                                       ("left: " + (dims.gutterLeft[id]) + "px; width: " + (dims.gutterWidth[id]) + "px"))); }
        } }
      }
    }
  
    function updateLineWidgets(cm, lineView, dims) {
      if (lineView.alignable) { lineView.alignable = null; }
      for (var node = lineView.node.firstChild, next = (void 0); node; node = next) {
        next = node.nextSibling;
        if (node.className == "CodeMirror-linewidget")
          { lineView.node.removeChild(node); }
      }
      insertLineWidgets(cm, lineView, dims);
    }
  
    // Build a line's DOM representation from scratch
    function buildLineElement(cm, lineView, lineN, dims) {
      var built = getLineContent(cm, lineView);
      lineView.text = lineView.node = built.pre;
      if (built.bgClass) { lineView.bgClass = built.bgClass; }
      if (built.textClass) { lineView.textClass = built.textClass; }
  
      updateLineClasses(cm, lineView);
      updateLineGutter(cm, lineView, lineN, dims);
      insertLineWidgets(cm, lineView, dims);
      return lineView.node
    }
  
    // A lineView may contain multiple logical lines (when merged by
    // collapsed spans). The widgets for all of them need to be drawn.
    function insertLineWidgets(cm, lineView, dims) {
      insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
      if (lineView.rest) { for (var i = 0; i < lineView.rest.length; i++)
        { insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false); } }
    }
  
    function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
      if (!line.widgets) { return }
      var wrap = ensureLineWrapped(lineView);
      for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
        var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
        if (!widget.handleMouseEvents) { node.setAttribute("cm-ignore-events", "true"); }
        positionLineWidget(widget, node, lineView, dims);
        cm.display.input.setUneditable(node);
        if (allowAbove && widget.above)
          { wrap.insertBefore(node, lineView.gutter || lineView.text); }
        else
          { wrap.appendChild(node); }
        signalLater(widget, "redraw");
      }
    }
  
    function positionLineWidget(widget, node, lineView, dims) {
      if (widget.noHScroll) {
    (lineView.alignable || (lineView.alignable = [])).push(node);
        var width = dims.wrapperWidth;
        node.style.left = dims.fixedPos + "px";
        if (!widget.coverGutter) {
          width -= dims.gutterTotalWidth;
          node.style.paddingLeft = dims.gutterTotalWidth + "px";
        }
        node.style.width = width + "px";
      }
      if (widget.coverGutter) {
        node.style.zIndex = 5;
        node.style.position = "relative";
        if (!widget.noHScroll) { node.style.marginLeft = -dims.gutterTotalWidth + "px"; }
      }
    }
  
    function widgetHeight(widget) {
      if (widget.height != null) { return widget.height }
      var cm = widget.doc.cm;
      if (!cm) { return 0 }
      if (!contains(document.body, widget.node)) {
        var parentStyle = "position: relative;";
        if (widget.coverGutter)
          { parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;"; }
        if (widget.noHScroll)
          { parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;"; }
        removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
      }
      return widget.height = widget.node.parentNode.offsetHeight
    }
  
    // Return true when the given mouse event happened in a widget
    function eventInWidget(display, e) {
      for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
        if (!n || (n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true") ||
            (n.parentNode == display.sizer && n != display.mover))
          { return true }
      }
    }
  
    // POSITION MEASUREMENT
  
    function paddingTop(display) {return display.lineSpace.offsetTop}
    function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight}
    function paddingH(display) {
      if (display.cachedPaddingH) { return display.cachedPaddingH }
      var e = removeChildrenAndAdd(display.measure, elt("pre", "x"));
      var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
      var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
      if (!isNaN(data.left) && !isNaN(data.right)) { display.cachedPaddingH = data; }
      return data
    }
  
    function scrollGap(cm) { return scrollerGap - cm.display.nativeBarWidth }
    function displayWidth(cm) {
      return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth
    }
    function displayHeight(cm) {
      return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight
    }
  
    // Ensure the lineView.wrapping.heights array is populated. This is
    // an array of bottom offsets for the lines that make up a drawn
    // line. When lineWrapping is on, there might be more than one
    // height.
    function ensureLineHeights(cm, lineView, rect) {
      var wrapping = cm.options.lineWrapping;
      var curWidth = wrapping && displayWidth(cm);
      if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
        var heights = lineView.measure.heights = [];
        if (wrapping) {
          lineView.measure.width = curWidth;
          var rects = lineView.text.firstChild.getClientRects();
          for (var i = 0; i < rects.length - 1; i++) {
            var cur = rects[i], next = rects[i + 1];
            if (Math.abs(cur.bottom - next.bottom) > 2)
              { heights.push((cur.bottom + next.top) / 2 - rect.top); }
          }
        }
        heights.push(rect.bottom - rect.top);
      }
    }
  
    // Find a line map (mapping character offsets to text nodes) and a
    // measurement cache for the given line number. (A line view might
    // contain multiple lines when collapsed ranges are present.)
    function mapFromLineView(lineView, line, lineN) {
      if (lineView.line == line)
        { return {map: lineView.measure.map, cache: lineView.measure.cache} }
      for (var i = 0; i < lineView.rest.length; i++)
        { if (lineView.rest[i] == line)
          { return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i]} } }
      for (var i$1 = 0; i$1 < lineView.rest.length; i$1++)
        { if (lineNo(lineView.rest[i$1]) > lineN)
          { return {map: lineView.measure.maps[i$1], cache: lineView.measure.caches[i$1], before: true} } }
    }
  
    // Render a line into the hidden node display.externalMeasured. Used
    // when measurement is needed for a line that's not in the viewport.
    function updateExternalMeasurement(cm, line) {
      line = visualLine(line);
      var lineN = lineNo(line);
      var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
      view.lineN = lineN;
      var built = view.built = buildLineContent(cm, view);
      view.text = built.pre;
      removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
      return view
    }
  
    // Get a {top, bottom, left, right} box (in line-local coordinates)
    // for a given character.
    function measureChar(cm, line, ch, bias) {
      return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias)
    }
  
    // Find a line view that corresponds to the given line number.
    function findViewForLine(cm, lineN) {
      if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
        { return cm.display.view[findViewIndex(cm, lineN)] }
      var ext = cm.display.externalMeasured;
      if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
        { return ext }
    }
  
    // Measurement can be split in two steps, the set-up work that
    // applies to the whole line, and the measurement of the actual
    // character. Functions like coordsChar, that need to do a lot of
    // measurements in a row, can thus ensure that the set-up work is
    // only done once.
    function prepareMeasureForLine(cm, line) {
      var lineN = lineNo(line);
      var view = findViewForLine(cm, lineN);
      if (view && !view.text) {
        view = null;
      } else if (view && view.changes) {
        updateLineForChanges(cm, view, lineN, getDimensions(cm));
        cm.curOp.forceUpdate = true;
      }
      if (!view)
        { view = updateExternalMeasurement(cm, line); }
  
      var info = mapFromLineView(view, line, lineN);
      return {
        line: line, view: view, rect: null,
        map: info.map, cache: info.cache, before: info.before,
        hasHeights: false
      }
    }
  
    // Given a prepared measurement object, measures the position of an
    // actual character (or fetches it from the cache).
    function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
      if (prepared.before) { ch = -1; }
      var key = ch + (bias || ""), found;
      if (prepared.cache.hasOwnProperty(key)) {
        found = prepared.cache[key];
      } else {
        if (!prepared.rect)
          { prepared.rect = prepared.view.text.getBoundingClientRect(); }
        if (!prepared.hasHeights) {
          ensureLineHeights(cm, prepared.view, prepared.rect);
          prepared.hasHeights = true;
        }
        found = measureCharInner(cm, prepared, ch, bias);
        if (!found.bogus) { prepared.cache[key] = found; }
      }
      return {left: found.left, right: found.right,
              top: varHeight ? found.rtop : found.top,
              bottom: varHeight ? found.rbottom : found.bottom}
    }
  
    var nullRect = {left: 0, right: 0, top: 0, bottom: 0};
  
    function nodeAndOffsetInLineMap(map$$1, ch, bias) {
      var node, start, end, collapse, mStart, mEnd;
      // First, search the line map for the text node corresponding to,
      // or closest to, the target character.
      for (var i = 0; i < map$$1.length; i += 3) {
        mStart = map$$1[i];
        mEnd = map$$1[i + 1];
        if (ch < mStart) {
          start = 0; end = 1;
          collapse = "left";
        } else if (ch < mEnd) {
          start = ch - mStart;
          end = start + 1;
        } else if (i == map$$1.length - 3 || ch == mEnd && map$$1[i + 3] > ch) {
          end = mEnd - mStart;
          start = end - 1;
          if (ch >= mEnd) { collapse = "right"; }
        }
        if (start != null) {
          node = map$$1[i + 2];
          if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right"))
            { collapse = bias; }
          if (bias == "left" && start == 0)
            { while (i && map$$1[i - 2] == map$$1[i - 3] && map$$1[i - 1].insertLeft) {
              node = map$$1[(i -= 3) + 2];
              collapse = "left";
            } }
          if (bias == "right" && start == mEnd - mStart)
            { while (i < map$$1.length - 3 && map$$1[i + 3] == map$$1[i + 4] && !map$$1[i + 5].insertLeft) {
              node = map$$1[(i += 3) + 2];
              collapse = "right";
            } }
          break
        }
      }
      return {node: node, start: start, end: end, collapse: collapse, coverStart: mStart, coverEnd: mEnd}
    }
  
    function getUsefulRect(rects, bias) {
      var rect = nullRect;
      if (bias == "left") { for (var i = 0; i < rects.length; i++) {
        if ((rect = rects[i]).left != rect.right) { break }
      } } else { for (var i$1 = rects.length - 1; i$1 >= 0; i$1--) {
        if ((rect = rects[i$1]).left != rect.right) { break }
      } }
      return rect
    }
  
    function measureCharInner(cm, prepared, ch, bias) {
      var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
      var node = place.node, start = place.start, end = place.end, collapse = place.collapse;
  
      var rect;
      if (node.nodeType == 3) { // If it is a text node, use a range to retrieve the coordinates.
        for (var i$1 = 0; i$1 < 4; i$1++) { // Retry a maximum of 4 times when nonsense rectangles are returned
          while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) { --start; }
          while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) { ++end; }
          if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart)
            { rect = node.parentNode.getBoundingClientRect(); }
          else
            { rect = getUsefulRect(range(node, start, end).getClientRects(), bias); }
          if (rect.left || rect.right || start == 0) { break }
          end = start;
          start = start - 1;
          collapse = "right";
        }
        if (ie && ie_version < 11) { rect = maybeUpdateRectForZooming(cm.display.measure, rect); }
      } else { // If it is a widget, simply get the box for the whole widget.
        if (start > 0) { collapse = bias = "right"; }
        var rects;
        if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
          { rect = rects[bias == "right" ? rects.length - 1 : 0]; }
        else
          { rect = node.getBoundingClientRect(); }
      }
      if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
        var rSpan = node.parentNode.getClientRects()[0];
        if (rSpan)
          { rect = {left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom}; }
        else
          { rect = nullRect; }
      }
  
      var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
      var mid = (rtop + rbot) / 2;
      var heights = prepared.view.measure.heights;
      var i = 0;
      for (; i < heights.length - 1; i++)
        { if (mid < heights[i]) { break } }
      var top = i ? heights[i - 1] : 0, bot = heights[i];
      var result = {left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
                    right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
                    top: top, bottom: bot};
      if (!rect.left && !rect.right) { result.bogus = true; }
      if (!cm.options.singleCursorHeightPerLine) { result.rtop = rtop; result.rbottom = rbot; }
  
      return result
    }
  
    // Work around problem with bounding client rects on ranges being
    // returned incorrectly when zoomed on IE10 and below.
    function maybeUpdateRectForZooming(measure, rect) {
      if (!window.screen || screen.logicalXDPI == null ||
          screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure))
        { return rect }
      var scaleX = screen.logicalXDPI / screen.deviceXDPI;
      var scaleY = screen.logicalYDPI / screen.deviceYDPI;
      return {left: rect.left * scaleX, right: rect.right * scaleX,
              top: rect.top * scaleY, bottom: rect.bottom * scaleY}
    }
  
    function clearLineMeasurementCacheFor(lineView) {
      if (lineView.measure) {
        lineView.measure.cache = {};
        lineView.measure.heights = null;
        if (lineView.rest) { for (var i = 0; i < lineView.rest.length; i++)
          { lineView.measure.caches[i] = {}; } }
      }
    }
  
    function clearLineMeasurementCache(cm) {
      cm.display.externalMeasure = null;
      removeChildren(cm.display.lineMeasure);
      for (var i = 0; i < cm.display.view.length; i++)
        { clearLineMeasurementCacheFor(cm.display.view[i]); }
    }
  
    function clearCaches(cm) {
      clearLineMeasurementCache(cm);
      cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
      if (!cm.options.lineWrapping) { cm.display.maxLineChanged = true; }
      cm.display.lineNumChars = null;
    }
  
    function pageScrollX() {
      // Work around https://bugs.chromium.org/p/chromium/issues/detail?id=489206
      // which causes page_Offset and bounding client rects to use
      // different reference viewports and invalidate our calculations.
      if (chrome && android) { return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft)) }
      return window.pageXOffset || (document.documentElement || document.body).scrollLeft
    }
    function pageScrollY() {
      if (chrome && android) { return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop)) }
      return window.pageYOffset || (document.documentElement || document.body).scrollTop
    }
  
    function widgetTopHeight(lineObj) {
      var height = 0;
      if (lineObj.widgets) { for (var i = 0; i < lineObj.widgets.length; ++i) { if (lineObj.widgets[i].above)
        { height += widgetHeight(lineObj.widgets[i]); } } }
      return height
    }
  
    // Converts a {top, bottom, left, right} box from line-local
    // coordinates into another coordinate system. Context may be one of
    // "line", "div" (display.lineDiv), "local"./null (editor), "window",
    // or "page".
    function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
      if (!includeWidgets) {
        var height = widgetTopHeight(lineObj);
        rect.top += height; rect.bottom += height;
      }
      if (context == "line") { return rect }
      if (!context) { context = "local"; }
      var yOff = heightAtLine(lineObj);
      if (context == "local") { yOff += paddingTop(cm.display); }
      else { yOff -= cm.display.viewOffset; }
      if (context == "page" || context == "window") {
        var lOff = cm.display.lineSpace.getBoundingClientRect();
        yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
        var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
        rect.left += xOff; rect.right += xOff;
      }
      rect.top += yOff; rect.bottom += yOff;
      return rect
    }
  
    // Coverts a box from "div" coords to another coordinate system.
    // Context may be "window", "page", "div", or "local"./null.
    function fromCoordSystem(cm, coords, context) {
      if (context == "div") { return coords }
      var left = coords.left, top = coords.top;
      // First move into "page" coordinate system
      if (context == "page") {
        left -= pageScrollX();
        top -= pageScrollY();
      } else if (context == "local" || !context) {
        var localBox = cm.display.sizer.getBoundingClientRect();
        left += localBox.left;
        top += localBox.top;
      }
  
      var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
      return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top}
    }
  
    function charCoords(cm, pos, context, lineObj, bias) {
      if (!lineObj) { lineObj = getLine(cm.doc, pos.line); }
      return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context)
    }
  
    // Returns a box for a given cursor position, which may have an
    // 'other' property containing the position of the secondary cursor
    // on a bidi boundary.
    // A cursor Pos(line, char, "before") is on the same visual line as `char - 1`
    // and after `char - 1` in writing order of `char - 1`
    // A cursor Pos(line, char, "after") is on the same visual line as `char`
    // and before `char` in writing order of `char`
    // Examples (upper-case letters are RTL, lower-case are LTR):
    //     Pos(0, 1, ...)
    //     before   after
    // ab     a|b     a|b
    // aB     a|B     aB|
    // Ab     |Ab     A|b
    // AB     B|A     B|A
    // Every position after the last character on a line is considered to stick
    // to the last character on the line.
    function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
      lineObj = lineObj || getLine(cm.doc, pos.line);
      if (!preparedMeasure) { preparedMeasure = prepareMeasureForLine(cm, lineObj); }
      function get(ch, right) {
        var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
        if (right) { m.left = m.right; } else { m.right = m.left; }
        return intoCoordSystem(cm, lineObj, m, context)
      }
      var order = getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
      if (ch >= lineObj.text.length) {
        ch = lineObj.text.length;
        sticky = "before";
      } else if (ch <= 0) {
        ch = 0;
        sticky = "after";
      }
      if (!order) { return get(sticky == "before" ? ch - 1 : ch, sticky == "before") }
  
      function getBidi(ch, partPos, invert) {
        var part = order[partPos], right = part.level == 1;
        return get(invert ? ch - 1 : ch, right != invert)
      }
      var partPos = getBidiPartAt(order, ch, sticky);
      var other = bidiOther;
      var val = getBidi(ch, partPos, sticky == "before");
      if (other != null) { val.other = getBidi(ch, other, sticky != "before"); }
      return val
    }
  
    // Used to cheaply estimate the coordinates for a position. Used for
    // intermediate scroll updates.
    function estimateCoords(cm, pos) {
      var left = 0;
      pos = clipPos(cm.doc, pos);
      if (!cm.options.lineWrapping) { left = charWidth(cm.display) * pos.ch; }
      var lineObj = getLine(cm.doc, pos.line);
      var top = heightAtLine(lineObj) + paddingTop(cm.display);
      return {left: left, right: left, top: top, bottom: top + lineObj.height}
    }
  
    // Positions returned by coordsChar contain some extra information.
    // xRel is the relative x position of the input coordinates compared
    // to the found position (so xRel > 0 means the coordinates are to
    // the right of the character position, for example). When outside
    // is true, that means the coordinates lie outside the line's
    // vertical range.
    function PosWithInfo(line, ch, sticky, outside, xRel) {
      var pos = Pos(line, ch, sticky);
      pos.xRel = xRel;
      if (outside) { pos.outside = true; }
      return pos
    }
  
    // Compute the character position closest to the given coordinates.
    // Input must be lineSpace-local ("div" coordinate system).
    function coordsChar(cm, x, y) {
      var doc = cm.doc;
      y += cm.display.viewOffset;
      if (y < 0) { return PosWithInfo(doc.first, 0, null, true, -1) }
      var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
      if (lineN > last)
        { return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, null, true, 1) }
      if (x < 0) { x = 0; }
  
      var lineObj = getLine(doc, lineN);
      for (;;) {
        var found = coordsCharInner(cm, lineObj, lineN, x, y);
        var collapsed = collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 ? 1 : 0));
        if (!collapsed) { return found }
        var rangeEnd = collapsed.find(1);
        if (rangeEnd.line == lineN) { return rangeEnd }
        lineObj = getLine(doc, lineN = rangeEnd.line);
      }
    }
  
    function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
      y -= widgetTopHeight(lineObj);
      var end = lineObj.text.length;
      var begin = findFirst(function (ch) { return measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y; }, end, 0);
      end = findFirst(function (ch) { return measureCharPrepared(cm, preparedMeasure, ch).top > y; }, begin, end);
      return {begin: begin, end: end}
    }
  
    function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
      if (!preparedMeasure) { preparedMeasure = prepareMeasureForLine(cm, lineObj); }
      var targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), "line").top;
      return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop)
    }
  
    // Returns true if the given side of a box is after the given
    // coordinates, in top-to-bottom, left-to-right order.
    function boxIsAfter(box, x, y, left) {
      return box.bottom <= y ? false : box.top > y ? true : (left ? box.left : box.right) > x
    }
  
    function coordsCharInner(cm, lineObj, lineNo$$1, x, y) {
      // Move y into line-local coordinate space
      y -= heightAtLine(lineObj);
      var preparedMeasure = prepareMeasureForLine(cm, lineObj);
      // When directly calling `measureCharPrepared`, we have to adjust
      // for the widgets at this line.
      var widgetHeight$$1 = widgetTopHeight(lineObj);
      var begin = 0, end = lineObj.text.length, ltr = true;
  
      var order = getOrder(lineObj, cm.doc.direction);
      // If the line isn't plain left-to-right text, first figure out
      // which bidi section the coordinates fall into.
      if (order) {
        var part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)
                     (cm, lineObj, lineNo$$1, preparedMeasure, order, x, y);
        ltr = part.level != 1;
        // The awkward -1 offsets are needed because findFirst (called
        // on these below) will treat its first bound as inclusive,
        // second as exclusive, but we want to actually address the
        // characters in the part's range
        begin = ltr ? part.from : part.to - 1;
        end = ltr ? part.to : part.from - 1;
      }
  
      // A binary search to find the first character whose bounding box
      // starts after the coordinates. If we run across any whose box wrap
      // the coordinates, store that.
      var chAround = null, boxAround = null;
      var ch = findFirst(function (ch) {
        var box = measureCharPrepared(cm, preparedMeasure, ch);
        box.top += widgetHeight$$1; box.bottom += widgetHeight$$1;
        if (!boxIsAfter(box, x, y, false)) { return false }
        if (box.top <= y && box.left <= x) {
          chAround = ch;
          boxAround = box;
        }
        return true
      }, begin, end);
  
      var baseX, sticky, outside = false;
      // If a box around the coordinates was found, use that
      if (boxAround) {
        // Distinguish coordinates nearer to the left or right side of the box
        var atLeft = x - boxAround.left < boxAround.right - x, atStart = atLeft == ltr;
        ch = chAround + (atStart ? 0 : 1);
        sticky = atStart ? "after" : "before";
        baseX = atLeft ? boxAround.left : boxAround.right;
      } else {
        // (Adjust for extended bound, if necessary.)
        if (!ltr && (ch == end || ch == begin)) { ch++; }
        // To determine which side to associate with, get the box to the
        // left of the character and compare it's vertical position to the
        // coordinates
        sticky = ch == 0 ? "after" : ch == lineObj.text.length ? "before" :
          (measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgetHeight$$1 <= y) == ltr ?
          "after" : "before";
        // Now get accurate coordinates for this place, in order to get a
        // base X position
        var coords = cursorCoords(cm, Pos(lineNo$$1, ch, sticky), "line", lineObj, preparedMeasure);
        baseX = coords.left;
        outside = y < coords.top || y >= coords.bottom;
      }
  
      ch = skipExtendingChars(lineObj.text, ch, 1);
      return PosWithInfo(lineNo$$1, ch, sticky, outside, x - baseX)
    }
  
    function coordsBidiPart(cm, lineObj, lineNo$$1, preparedMeasure, order, x, y) {
      // Bidi parts are sorted left-to-right, and in a non-line-wrapping
      // situation, we can take this ordering to correspond to the visual
      // ordering. This finds the first part whose end is after the given
      // coordinates.
      var index = findFirst(function (i) {
        var part = order[i], ltr = part.level != 1;
        return boxIsAfter(cursorCoords(cm, Pos(lineNo$$1, ltr ? part.to : part.from, ltr ? "before" : "after"),
                                       "line", lineObj, preparedMeasure), x, y, true)
      }, 0, order.length - 1);
      var part = order[index];
      // If this isn't the first part, the part's start is also after
      // the coordinates, and the coordinates aren't on the same line as
      // that start, move one part back.
      if (index > 0) {
        var ltr = part.level != 1;
        var start = cursorCoords(cm, Pos(lineNo$$1, ltr ? part.from : part.to, ltr ? "after" : "before"),
                                 "line", lineObj, preparedMeasure);
        if (boxIsAfter(start, x, y, true) && start.top > y)
          { part = order[index - 1]; }
      }
      return part
    }
  
    function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
      // In a wrapped line, rtl text on wrapping boundaries can do things
      // that don't correspond to the ordering in our `order` array at
      // all, so a binary search doesn't work, and we want to return a
      // part that only spans one line so that the binary search in
      // coordsCharInner is safe. As such, we first find the extent of the
      // wrapped line, and then do a flat search in which we discard any
      // spans that aren't on the line.
      var ref = wrappedLineExtent(cm, lineObj, preparedMeasure, y);
      var begin = ref.begin;
      var end = ref.end;
      if (/\s/.test(lineObj.text.charAt(end - 1))) { end--; }
      var part = null, closestDist = null;
      for (var i = 0; i < order.length; i++) {
        var p = order[i];
        if (p.from >= end || p.to <= begin) { continue }
        var ltr = p.level != 1;
        var endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right;
        // Weigh against spans ending before this, so that they are only
        // picked if nothing ends after
        var dist = endX < x ? x - endX + 1e9 : endX - x;
        if (!part || closestDist > dist) {
          part = p;
          closestDist = dist;
        }
      }
      if (!part) { part = order[order.length - 1]; }
      // Clip the part to the wrapped line.
      if (part.from < begin) { part = {from: begin, to: part.to, level: part.level}; }
      if (part.to > end) { part = {from: part.from, to: end, level: part.level}; }
      return part
    }
  
    var measureText;
    // Compute the default text height.
    function textHeight(display) {
      if (display.cachedTextHeight != null) { return display.cachedTextHeight }
      if (measureText == null) {
        measureText = elt("pre");
        // Measure a bunch of lines, for browsers that compute
        // fractional heights.
        for (var i = 0; i < 49; ++i) {
          measureText.appendChild(document.createTextNode("x"));
          measureText.appendChild(elt("br"));
        }
        measureText.appendChild(document.createTextNode("x"));
      }
      removeChildrenAndAdd(display.measure, measureText);
      var height = measureText.offsetHeight / 50;
      if (height > 3) { display.cachedTextHeight = height; }
      removeChildren(display.measure);
      return height || 1
    }
  
    // Compute the default character width.
    function charWidth(display) {
      if (display.cachedCharWidth != null) { return display.cachedCharWidth }
      var anchor = elt("span", "xxxxxxxxxx");
      var pre = elt("pre", [anchor]);
      removeChildrenAndAdd(display.measure, pre);
      var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
      if (width > 2) { display.cachedCharWidth = width; }
      return width || 10
    }
  
    // Do a bulk-read of the DOM positions and sizes needed to draw the
    // view, so that we don't interleave reading and writing to the DOM.
    function getDimensions(cm) {
      var d = cm.display, left = {}, width = {};
      var gutterLeft = d.gutters.clientLeft;
      for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
        left[cm.options.gutters[i]] = n.offsetLeft + n.clientLeft + gutterLeft;
        width[cm.options.gutters[i]] = n.clientWidth;
      }
      return {fixedPos: compensateForHScroll(d),
              gutterTotalWidth: d.gutters.offsetWidth,
              gutterLeft: left,
              gutterWidth: width,
              wrapperWidth: d.wrapper.clientWidth}
    }
  
    // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
    // but using getBoundingClientRect to get a sub-pixel-accurate
    // result.
    function compensateForHScroll(display) {
      return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left
    }
  
    // Returns a function that estimates the height of a line, to use as
    // first approximation until the line becomes visible (and is thus
    // properly measurable).
    function estimateHeight(cm) {
      var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
      var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
      return function (line) {
        if (lineIsHidden(cm.doc, line)) { return 0 }
  
        var widgetsHeight = 0;
        if (line.widgets) { for (var i = 0; i < line.widgets.length; i++) {
          if (line.widgets[i].height) { widgetsHeight += line.widgets[i].height; }
        } }
  
        if (wrapping)
          { return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th }
        else
          { return widgetsHeight + th }
      }
    }
  
    function estimateLineHeights(cm) {
      var doc = cm.doc, est = estimateHeight(cm);
      doc.iter(function (line) {
        var estHeight = est(line);
        if (estHeight != line.height) { updateLineHeight(line, estHeight); }
      });
    }
  
    // Given a mouse event, find the corresponding position. If liberal
    // is false, it checks whether a gutter or scrollbar was clicked,
    // and returns null if it was. forRect is used by rectangular
    // selections, and tries to estimate a character position even for
    // coordinates beyond the right of the text.
    function posFromMouse(cm, e, liberal, forRect) {
      var display = cm.display;
      if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") { return null }
  
      var x, y, space = display.lineSpace.getBoundingClientRect();
      // Fails unpredictably on IE[67] when mouse is dragged around quickly.
      try { x = e.clientX - space.left; y = e.clientY - space.top; }
      catch (e) { return null }
      var coords = coordsChar(cm, x, y), line;
      if (forRect && coords.xRel == 1 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
        var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
        coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
      }
      return coords
    }
  
    // Find the view element corresponding to a given line. Return null
    // when the line isn't visible.
    function findViewIndex(cm, n) {
      if (n >= cm.display.viewTo) { return null }
      n -= cm.display.viewFrom;
      if (n < 0) { return null }
      var view = cm.display.view;
      for (var i = 0; i < view.length; i++) {
        n -= view[i].size;
        if (n < 0) { return i }
      }
    }
  
    function updateSelection(cm) {
      cm.display.input.showSelection(cm.display.input.prepareSelection());
    }
  
    function prepareSelection(cm, primary) {
      if ( primary === void 0 ) primary = true;
  
      var doc = cm.doc, result = {};
      var curFragment = result.cursors = document.createDocumentFragment();
      var selFragment = result.selection = document.createDocumentFragment();
  
      for (var i = 0; i < doc.sel.ranges.length; i++) {
        if (!primary && i == doc.sel.primIndex) { continue }
        var range$$1 = doc.sel.ranges[i];
        if (range$$1.from().line >= cm.display.viewTo || range$$1.to().line < cm.display.viewFrom) { continue }
        var collapsed = range$$1.empty();
        if (collapsed || cm.options.showCursorWhenSelecting)
          { drawSelectionCursor(cm, range$$1.head, curFragment); }
        if (!collapsed)
          { drawSelectionRange(cm, range$$1, selFragment); }
      }
      return result
    }
  
    // Draws a cursor for the given range
    function drawSelectionCursor(cm, head, output) {
      var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);
  
      var cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
      cursor.style.left = pos.left + "px";
      cursor.style.top = pos.top + "px";
      cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";
  
      if (pos.other) {
        // Secondary cursor, shown when on a 'jump' in bi-directional text
        var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
        otherCursor.style.display = "";
        otherCursor.style.left = pos.other.left + "px";
        otherCursor.style.top = pos.other.top + "px";
        otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
      }
    }
  
    function cmpCoords(a, b) { return a.top - b.top || a.left - b.left }
  
    // Draws the given range as a highlighted selection
    function drawSelectionRange(cm, range$$1, output) {
      var display = cm.display, doc = cm.doc;
      var fragment = document.createDocumentFragment();
      var padding = paddingH(cm.display), leftSide = padding.left;
      var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
      var docLTR = doc.direction == "ltr";
  
      function add(left, top, width, bottom) {
        if (top < 0) { top = 0; }
        top = Math.round(top);
        bottom = Math.round(bottom);
        fragment.appendChild(elt("div", null, "CodeMirror-selected", ("position: absolute; left: " + left + "px;\n                             top: " + top + "px; width: " + (width == null ? rightSide - left : width) + "px;\n                             height: " + (bottom - top) + "px")));
      }
  
      function drawForLine(line, fromArg, toArg) {
        var lineObj = getLine(doc, line);
        var lineLen = lineObj.text.length;
        var start, end;
        function coords(ch, bias) {
          return charCoords(cm, Pos(line, ch), "div", lineObj, bias)
        }
  
        function wrapX(pos, dir, side) {
          var extent = wrappedLineExtentChar(cm, lineObj, null, pos);
          var prop = (dir == "ltr") == (side == "after") ? "left" : "right";
          var ch = side == "after" ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
          return coords(ch, prop)[prop]
        }
  
        var order = getOrder(lineObj, doc.direction);
        iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, function (from, to, dir, i) {
          var ltr = dir == "ltr";
          var fromPos = coords(from, ltr ? "left" : "right");
          var toPos = coords(to - 1, ltr ? "right" : "left");
  
          var openStart = fromArg == null && from == 0, openEnd = toArg == null && to == lineLen;
          var first = i == 0, last = !order || i == order.length - 1;
          if (toPos.top - fromPos.top <= 3) { // Single line
            var openLeft = (docLTR ? openStart : openEnd) && first;
            var openRight = (docLTR ? openEnd : openStart) && last;
            var left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
            var right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
            add(left, fromPos.top, right - left, fromPos.bottom);
          } else { // Multiple lines
            var topLeft, topRight, botLeft, botRight;
            if (ltr) {
              topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
              topRight = docLTR ? rightSide : wrapX(from, dir, "before");
              botLeft = docLTR ? leftSide : wrapX(to, dir, "after");
              botRight = docLTR && openEnd && last ? rightSide : toPos.right;
            } else {
              topLeft = !docLTR ? leftSide : wrapX(from, dir, "before");
              topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
              botLeft = !docLTR && openEnd && last ? leftSide : toPos.left;
              botRight = !docLTR ? rightSide : wrapX(to, dir, "after");
            }
            add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
            if (fromPos.bottom < toPos.top) { add(leftSide, fromPos.bottom, null, toPos.top); }
            add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
          }
  
          if (!start || cmpCoords(fromPos, start) < 0) { start = fromPos; }
          if (cmpCoords(toPos, start) < 0) { start = toPos; }
          if (!end || cmpCoords(fromPos, end) < 0) { end = fromPos; }
          if (cmpCoords(toPos, end) < 0) { end = toPos; }
        });
        return {start: start, end: end}
      }
  
      var sFrom = range$$1.from(), sTo = range$$1.to();
      if (sFrom.line == sTo.line) {
        drawForLine(sFrom.line, sFrom.ch, sTo.ch);
      } else {
        var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
        var singleVLine = visualLine(fromLine) == visualLine(toLine);
        var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
        var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
        if (singleVLine) {
          if (leftEnd.top < rightStart.top - 2) {
            add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
            add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
          } else {
            add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
          }
        }
        if (leftEnd.bottom < rightStart.top)
          { add(leftSide, leftEnd.bottom, null, rightStart.top); }
      }
  
      output.appendChild(fragment);
    }
  
    // Cursor-blinking
    function restartBlink(cm) {
      if (!cm.state.focused) { return }
      var display = cm.display;
      clearInterval(display.blinker);
      var on = true;
      display.cursorDiv.style.visibility = "";
      if (cm.options.cursorBlinkRate > 0)
        { display.blinker = setInterval(function () { return display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden"; },
          cm.options.cursorBlinkRate); }
      else if (cm.options.cursorBlinkRate < 0)
        { display.cursorDiv.style.visibility = "hidden"; }
    }
  
    function ensureFocus(cm) {
      if (!cm.state.focused) { cm.display.input.focus(); onFocus(cm); }
    }
  
    function delayBlurEvent(cm) {
      cm.state.delayingBlurEvent = true;
      setTimeout(function () { if (cm.state.delayingBlurEvent) {
        cm.state.delayingBlurEvent = false;
        onBlur(cm);
      } }, 100);
    }
  
    function onFocus(cm, e) {
      if (cm.state.delayingBlurEvent) { cm.state.delayingBlurEvent = false; }
  
      if (cm.options.readOnly == "nocursor") { return }
      if (!cm.state.focused) {
        signal(cm, "focus", cm, e);
        cm.state.focused = true;
        addClass(cm.display.wrapper, "CodeMirror-focused");
        // This test prevents this from firing when a context
        // menu is closed (since the input reset would kill the
        // select-all detection hack)
        if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
          cm.display.input.reset();
          if (webkit) { setTimeout(function () { return cm.display.input.reset(true); }, 20); } // Issue #1730
        }
        cm.display.input.receivedFocus();
      }
      restartBlink(cm);
    }
    function onBlur(cm, e) {
      if (cm.state.delayingBlurEvent) { return }
  
      if (cm.state.focused) {
        signal(cm, "blur", cm, e);
        cm.state.focused = false;
        rmClass(cm.display.wrapper, "CodeMirror-focused");
      }
      clearInterval(cm.display.blinker);
      setTimeout(function () { if (!cm.state.focused) { cm.display.shift = false; } }, 150);
    }
  
    // Read the actual heights of the rendered lines, and update their
    // stored heights to match.
    function updateHeightsInViewport(cm) {
      var display = cm.display;
      var prevBottom = display.lineDiv.offsetTop;
      for (var i = 0; i < display.view.length; i++) {
        var cur = display.view[i], wrapping = cm.options.lineWrapping;
        var height = (void 0), width = 0;
        if (cur.hidden) { continue }
        if (ie && ie_version < 8) {
          var bot = cur.node.offsetTop + cur.node.offsetHeight;
          height = bot - prevBottom;
          prevBottom = bot;
        } else {
          var box = cur.node.getBoundingClientRect();
          height = box.bottom - box.top;
          // Check that lines don't extend past the right of the current
          // editor width
          if (!wrapping && cur.text.firstChild)
            { width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1; }
        }
        var diff = cur.line.height - height;
        if (diff > .005 || diff < -.005) {
          updateLineHeight(cur.line, height);
          updateWidgetHeight(cur.line);
          if (cur.rest) { for (var j = 0; j < cur.rest.length; j++)
            { updateWidgetHeight(cur.rest[j]); } }
        }
        if (width > cm.display.sizerWidth) {
          var chWidth = Math.ceil(width / charWidth(cm.display));
          if (chWidth > cm.display.maxLineLength) {
            cm.display.maxLineLength = chWidth;
            cm.display.maxLine = cur.line;
            cm.display.maxLineChanged = true;
          }
        }
      }
    }
  
    // Read and store the height of line widgets associated with the
    // given line.
    function updateWidgetHeight(line) {
      if (line.widgets) { for (var i = 0; i < line.widgets.length; ++i) {
        var w = line.widgets[i], parent = w.node.parentNode;
        if (parent) { w.height = parent.offsetHeight; }
      } }
    }
  
    // Compute the lines that are visible in a given viewport (defaults
    // the the current scroll position). viewport may contain top,
    // height, and ensure (see op.scrollToPos) properties.
    function visibleLines(display, doc, viewport) {
      var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
      top = Math.floor(top - paddingTop(display));
      var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
  
      var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
      // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
      // forces those lines into the viewport (if possible).
      if (viewport && viewport.ensure) {
        var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
        if (ensureFrom < from) {
          from = ensureFrom;
          to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
        } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
          from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
          to = ensureTo;
        }
      }
      return {from: from, to: Math.max(to, from + 1)}
    }
  
    // Re-align line numbers and gutter marks to compensate for
    // horizontal scrolling.
    function alignHorizontally(cm) {
      var display = cm.display, view = display.view;
      if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) { return }
      var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
      var gutterW = display.gutters.offsetWidth, left = comp + "px";
      for (var i = 0; i < view.length; i++) { if (!view[i].hidden) {
        if (cm.options.fixedGutter) {
          if (view[i].gutter)
            { view[i].gutter.style.left = left; }
          if (view[i].gutterBackground)
            { view[i].gutterBackground.style.left = left; }
        }
        var align = view[i].alignable;
        if (align) { for (var j = 0; j < align.length; j++)
          { align[j].style.left = left; } }
      } }
      if (cm.options.fixedGutter)
        { display.gutters.style.left = (comp + gutterW) + "px"; }
    }
  
    // Used to ensure that the line number gutter is still the right
    // size for the current document size. Returns true when an update
    // is needed.
    function maybeUpdateLineNumberWidth(cm) {
      if (!cm.options.lineNumbers) { return false }
      var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
      if (last.length != display.lineNumChars) {
        var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                   "CodeMirror-linenumber CodeMirror-gutter-elt"));
        var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
        display.lineGutter.style.width = "";
        display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
        display.lineNumWidth = display.lineNumInnerWidth + padding;
        display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
        display.lineGutter.style.width = display.lineNumWidth + "px";
        updateGutterSpace(cm);
        return true
      }
      return false
    }
  
    // SCROLLING THINGS INTO VIEW
  
    // If an editor sits on the top or bottom of the window, partially
    // scrolled out of view, this ensures that the cursor is visible.
    function maybeScrollWindow(cm, rect) {
      if (signalDOMEvent(cm, "scrollCursorIntoView")) { return }
  
      var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
      if (rect.top + box.top < 0) { doScroll = true; }
      else if (rect.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) { doScroll = false; }
      if (doScroll != null && !phantom) {
        var scrollNode = elt("div", "\u200b", null, ("position: absolute;\n                         top: " + (rect.top - display.viewOffset - paddingTop(cm.display)) + "px;\n                         height: " + (rect.bottom - rect.top + scrollGap(cm) + display.barHeight) + "px;\n                         left: " + (rect.left) + "px; width: " + (Math.max(2, rect.right - rect.left)) + "px;"));
        cm.display.lineSpace.appendChild(scrollNode);
        scrollNode.scrollIntoView(doScroll);
        cm.display.lineSpace.removeChild(scrollNode);
      }
    }
  
    // Scroll a given position into view (immediately), verifying that
    // it actually became visible (as line heights are accurately
    // measured, the position of something may 'drift' during drawing).
    function scrollPosIntoView(cm, pos, end, margin) {
      if (margin == null) { margin = 0; }
      var rect;
      if (!cm.options.lineWrapping && pos == end) {
        // Set pos and end to the cursor positions around the character pos sticks to
        // If pos.sticky == "before", that is around pos.ch - 1, otherwise around pos.ch
        // If pos == Pos(_, 0, "before"), pos and end are unchanged
        pos = pos.ch ? Pos(pos.line, pos.sticky == "before" ? pos.ch - 1 : pos.ch, "after") : pos;
        end = pos.sticky == "before" ? Pos(pos.line, pos.ch + 1, "before") : pos;
      }
      for (var limit = 0; limit < 5; limit++) {
        var changed = false;
        var coords = cursorCoords(cm, pos);
        var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
        rect = {left: Math.min(coords.left, endCoords.left),
                top: Math.min(coords.top, endCoords.top) - margin,
                right: Math.max(coords.left, endCoords.left),
                bottom: Math.max(coords.bottom, endCoords.bottom) + margin};
        var scrollPos = calculateScrollPos(cm, rect);
        var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
        if (scrollPos.scrollTop != null) {
          updateScrollTop(cm, scrollPos.scrollTop);
          if (Math.abs(cm.doc.scrollTop - startTop) > 1) { changed = true; }
        }
        if (scrollPos.scrollLeft != null) {
          setScrollLeft(cm, scrollPos.scrollLeft);
          if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) { changed = true; }
        }
        if (!changed) { break }
      }
      return rect
    }
  
    // Scroll a given set of coordinates into view (immediately).
    function scrollIntoView(cm, rect) {
      var scrollPos = calculateScrollPos(cm, rect);
      if (scrollPos.scrollTop != null) { updateScrollTop(cm, scrollPos.scrollTop); }
      if (scrollPos.scrollLeft != null) { setScrollLeft(cm, scrollPos.scrollLeft); }
    }
  
    // Calculate a new scroll position needed to scroll the given
    // rectangle into view. Returns an object with scrollTop and
    // scrollLeft properties. When these are undefined, the
    // vertical/horizontal position does not need to be adjusted.
    function calculateScrollPos(cm, rect) {
      var display = cm.display, snapMargin = textHeight(cm.display);
      if (rect.top < 0) { rect.top = 0; }
      var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
      var screen = displayHeight(cm), result = {};
      if (rect.bottom - rect.top > screen) { rect.bottom = rect.top + screen; }
      var docBottom = cm.doc.height + paddingVert(display);
      var atTop = rect.top < snapMargin, atBottom = rect.bottom > docBottom - snapMargin;
      if (rect.top < screentop) {
        result.scrollTop = atTop ? 0 : rect.top;
      } else if (rect.bottom > screentop + screen) {
        var newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen);
        if (newTop != screentop) { result.scrollTop = newTop; }
      }
  
      var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft;
      var screenw = displayWidth(cm) - (cm.options.fixedGutter ? display.gutters.offsetWidth : 0);
      var tooWide = rect.right - rect.left > screenw;
      if (tooWide) { rect.right = rect.left + screenw; }
      if (rect.left < 10)
        { result.scrollLeft = 0; }
      else if (rect.left < screenleft)
        { result.scrollLeft = Math.max(0, rect.left - (tooWide ? 0 : 10)); }
      else if (rect.right > screenw + screenleft - 3)
        { result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw; }
      return result
    }
  
    // Store a relative adjustment to the scroll position in the current
    // operation (to be applied when the operation finishes).
    function addToScrollTop(cm, top) {
      if (top == null) { return }
      resolveScrollToPos(cm);
      cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
    }
  
    // Make sure that at the end of the operation the current cursor is
    // shown.
    function ensureCursorVisible(cm) {
      resolveScrollToPos(cm);
      var cur = cm.getCursor();
      cm.curOp.scrollToPos = {from: cur, to: cur, margin: cm.options.cursorScrollMargin};
    }
  
    function scrollToCoords(cm, x, y) {
      if (x != null || y != null) { resolveScrollToPos(cm); }
      if (x != null) { cm.curOp.scrollLeft = x; }
      if (y != null) { cm.curOp.scrollTop = y; }
    }
  
    function scrollToRange(cm, range$$1) {
      resolveScrollToPos(cm);
      cm.curOp.scrollToPos = range$$1;
    }
  
    // When an operation has its scrollToPos property set, and another
    // scroll action is applied before the end of the operation, this
    // 'simulates' scrolling that position into view in a cheap way, so
    // that the effect of intermediate scroll commands is not ignored.
    function resolveScrollToPos(cm) {
      var range$$1 = cm.curOp.scrollToPos;
      if (range$$1) {
        cm.curOp.scrollToPos = null;
        var from = estimateCoords(cm, range$$1.from), to = estimateCoords(cm, range$$1.to);
        scrollToCoordsRange(cm, from, to, range$$1.margin);
      }
    }
  
    function scrollToCoordsRange(cm, from, to, margin) {
      var sPos = calculateScrollPos(cm, {
        left: Math.min(from.left, to.left),
        top: Math.min(from.top, to.top) - margin,
        right: Math.max(from.right, to.right),
        bottom: Math.max(from.bottom, to.bottom) + margin
      });
      scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
    }
  
    // Sync the scrollable area and scrollbars, ensure the viewport
    // covers the visible area.
    function updateScrollTop(cm, val) {
      if (Math.abs(cm.doc.scrollTop - val) < 2) { return }
      if (!gecko) { updateDisplaySimple(cm, {top: val}); }
      setScrollTop(cm, val, true);
      if (gecko) { updateDisplaySimple(cm); }
      startWorker(cm, 100);
    }
  
    function setScrollTop(cm, val, forceScroll) {
      val = Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val);
      if (cm.display.scroller.scrollTop == val && !forceScroll) { return }
      cm.doc.scrollTop = val;
      cm.display.scrollbars.setScrollTop(val);
      if (cm.display.scroller.scrollTop != val) { cm.display.scroller.scrollTop = val; }
    }
  
    // Sync scroller and scrollbar, ensure the gutter elements are
    // aligned.
    function setScrollLeft(cm, val, isScroller, forceScroll) {
      val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
      if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll) { return }
      cm.doc.scrollLeft = val;
      alignHorizontally(cm);
      if (cm.display.scroller.scrollLeft != val) { cm.display.scroller.scrollLeft = val; }
      cm.display.scrollbars.setScrollLeft(val);
    }
  
    // SCROLLBARS
  
    // Prepare DOM reads needed to update the scrollbars. Done in one
    // shot to minimize update/measure roundtrips.
    function measureForScrollbars(cm) {
      var d = cm.display, gutterW = d.gutters.offsetWidth;
      var docH = Math.round(cm.doc.height + paddingVert(cm.display));
      return {
        clientHeight: d.scroller.clientHeight,
        viewHeight: d.wrapper.clientHeight,
        scrollWidth: d.scroller.scrollWidth, clientWidth: d.scroller.clientWidth,
        viewWidth: d.wrapper.clientWidth,
        barLeft: cm.options.fixedGutter ? gutterW : 0,
        docHeight: docH,
        scrollHeight: docH + scrollGap(cm) + d.barHeight,
        nativeBarWidth: d.nativeBarWidth,
        gutterWidth: gutterW
      }
    }
  
    var NativeScrollbars = function(place, scroll, cm) {
      this.cm = cm;
      var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
      var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
      vert.tabIndex = horiz.tabIndex = -1;
      place(vert); place(horiz);
  
      on(vert, "scroll", function () {
        if (vert.clientHeight) { scroll(vert.scrollTop, "vertical"); }
      });
      on(horiz, "scroll", function () {
        if (horiz.clientWidth) { scroll(horiz.scrollLeft, "horizontal"); }
      });
  
      this.checkedZeroWidth = false;
      // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
      if (ie && ie_version < 8) { this.horiz.style.minHeight = this.vert.style.minWidth = "18px"; }
    };
  
    NativeScrollbars.prototype.update = function (measure) {
      var needsH = measure.scrollWidth > measure.clientWidth + 1;
      var needsV = measure.scrollHeight > measure.clientHeight + 1;
      var sWidth = measure.nativeBarWidth;
  
      if (needsV) {
        this.vert.style.display = "block";
        this.vert.style.bottom = needsH ? sWidth + "px" : "0";
        var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
        // A bug in IE8 can cause this value to be negative, so guard it.
        this.vert.firstChild.style.height =
          Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
      } else {
        this.vert.style.display = "";
        this.vert.firstChild.style.height = "0";
      }
  
      if (needsH) {
        this.horiz.style.display = "block";
        this.horiz.style.right = needsV ? sWidth + "px" : "0";
        this.horiz.style.left = measure.barLeft + "px";
        var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
        this.horiz.firstChild.style.width =
          Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
      } else {
        this.horiz.style.display = "";
        this.horiz.firstChild.style.width = "0";
      }
  
      if (!this.checkedZeroWidth && measure.clientHeight > 0) {
        if (sWidth == 0) { this.zeroWidthHack(); }
        this.checkedZeroWidth = true;
      }
  
      return {right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0}
    };
  
    NativeScrollbars.prototype.setScrollLeft = function (pos) {
      if (this.horiz.scrollLeft != pos) { this.horiz.scrollLeft = pos; }
      if (this.disableHoriz) { this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz"); }
    };
  
    NativeScrollbars.prototype.setScrollTop = function (pos) {
      if (this.vert.scrollTop != pos) { this.vert.scrollTop = pos; }
      if (this.disableVert) { this.enableZeroWidthBar(this.vert, this.disableVert, "vert"); }
    };
  
    NativeScrollbars.prototype.zeroWidthHack = function () {
      var w = mac && !mac_geMountainLion ? "12px" : "18px";
      this.horiz.style.height = this.vert.style.width = w;
      this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
      this.disableHoriz = new Delayed;
      this.disableVert = new Delayed;
    };
  
    NativeScrollbars.prototype.enableZeroWidthBar = function (bar, delay, type) {
      bar.style.pointerEvents = "auto";
      function maybeDisable() {
        // To find out whether the scrollbar is still visible, we
        // check whether the element under the pixel in the bottom
        // right corner of the scrollbar box is the scrollbar box
        // itself (when the bar is still visible) or its filler child
        // (when the bar is hidden). If it is still visible, we keep
        // it enabled, if it's hidden, we disable pointer events.
        var box = bar.getBoundingClientRect();
        var elt$$1 = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2)
            : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
        if (elt$$1 != bar) { bar.style.pointerEvents = "none"; }
        else { delay.set(1000, maybeDisable); }
      }
      delay.set(1000, maybeDisable);
    };
  
    NativeScrollbars.prototype.clear = function () {
      var parent = this.horiz.parentNode;
      parent.removeChild(this.horiz);
      parent.removeChild(this.vert);
    };
  
    var NullScrollbars = function () {};
  
    NullScrollbars.prototype.update = function () { return {bottom: 0, right: 0} };
    NullScrollbars.prototype.setScrollLeft = function () {};
    NullScrollbars.prototype.setScrollTop = function () {};
    NullScrollbars.prototype.clear = function () {};
  
    function updateScrollbars(cm, measure) {
      if (!measure) { measure = measureForScrollbars(cm); }
      var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
      updateScrollbarsInner(cm, measure);
      for (var i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
        if (startWidth != cm.display.barWidth && cm.options.lineWrapping)
          { updateHeightsInViewport(cm); }
        updateScrollbarsInner(cm, measureForScrollbars(cm));
        startWidth = cm.display.barWidth; startHeight = cm.display.barHeight;
      }
    }
  
    // Re-synchronize the fake scrollbars with the actual size of the
    // content.
    function updateScrollbarsInner(cm, measure) {
      var d = cm.display;
      var sizes = d.scrollbars.update(measure);
  
      d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
      d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
      d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";
  
      if (sizes.right && sizes.bottom) {
        d.scrollbarFiller.style.display = "block";
        d.scrollbarFiller.style.height = sizes.bottom + "px";
        d.scrollbarFiller.style.width = sizes.right + "px";
      } else { d.scrollbarFiller.style.display = ""; }
      if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
        d.gutterFiller.style.display = "block";
        d.gutterFiller.style.height = sizes.bottom + "px";
        d.gutterFiller.style.width = measure.gutterWidth + "px";
      } else { d.gutterFiller.style.display = ""; }
    }
  
    var scrollbarModel = {"native": NativeScrollbars, "null": NullScrollbars};
  
    function initScrollbars(cm) {
      if (cm.display.scrollbars) {
        cm.display.scrollbars.clear();
        if (cm.display.scrollbars.addClass)
          { rmClass(cm.display.wrapper, cm.display.scrollbars.addClass); }
      }
  
      cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](function (node) {
        cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
        // Prevent clicks in the scrollbars from killing focus
        on(node, "mousedown", function () {
          if (cm.state.focused) { setTimeout(function () { return cm.display.input.focus(); }, 0); }
        });
        node.setAttribute("cm-not-content", "true");
      }, function (pos, axis) {
        if (axis == "horizontal") { setScrollLeft(cm, pos); }
        else { updateScrollTop(cm, pos); }
      }, cm);
      if (cm.display.scrollbars.addClass)
        { addClass(cm.display.wrapper, cm.display.scrollbars.addClass); }
    }
  
    // Operations are used to wrap a series of changes to the editor
    // state in such a way that each change won't have to update the
    // cursor and display (which would be awkward, slow, and
    // error-prone). Instead, display updates are batched and then all
    // combined and executed at once.
  
    var nextOpId = 0;
    // Start a new operation.
    function startOperation(cm) {
      cm.curOp = {
        cm: cm,
        viewChanged: false,      // Flag that indicates that lines might need to be redrawn
        startHeight: cm.doc.height, // Used to detect need to update scrollbar
        forceUpdate: false,      // Used to force a redraw
        updateInput: 0,       // Whether to reset the input textarea
        typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
        changeObjs: null,        // Accumulated changes, for firing change events
        cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
        cursorActivityCalled: 0, // Tracks which cursorActivity handlers have been called already
        selectionChanged: false, // Whether the selection needs to be redrawn
        updateMaxLine: false,    // Set when the widest line needs to be determined anew
        scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
        scrollToPos: null,       // Used to scroll to a specific position
        focus: false,
        id: ++nextOpId           // Unique ID
      };
      pushOperation(cm.curOp);
    }
  
    // Finish an operation, updating the display and signalling delayed events
    function endOperation(cm) {
      var op = cm.curOp;
      if (op) { finishOperation(op, function (group) {
        for (var i = 0; i < group.ops.length; i++)
          { group.ops[i].cm.curOp = null; }
        endOperations(group);
      }); }
    }
  
    // The DOM updates done when an operation finishes are batched so
    // that the minimum number of relayouts are required.
    function endOperations(group) {
      var ops = group.ops;
      for (var i = 0; i < ops.length; i++) // Read DOM
        { endOperation_R1(ops[i]); }
      for (var i$1 = 0; i$1 < ops.length; i$1++) // Write DOM (maybe)
        { endOperation_W1(ops[i$1]); }
      for (var i$2 = 0; i$2 < ops.length; i$2++) // Read DOM
        { endOperation_R2(ops[i$2]); }
      for (var i$3 = 0; i$3 < ops.length; i$3++) // Write DOM (maybe)
        { endOperation_W2(ops[i$3]); }
      for (var i$4 = 0; i$4 < ops.length; i$4++) // Read DOM
        { endOperation_finish(ops[i$4]); }
    }
  
    function endOperation_R1(op) {
      var cm = op.cm, display = cm.display;
      maybeClipScrollbars(cm);
      if (op.updateMaxLine) { findMaxLine(cm); }
  
      op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null ||
        op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
                           op.scrollToPos.to.line >= display.viewTo) ||
        display.maxLineChanged && cm.options.lineWrapping;
      op.update = op.mustUpdate &&
        new DisplayUpdate(cm, op.mustUpdate && {top: op.scrollTop, ensure: op.scrollToPos}, op.forceUpdate);
    }
  
    function endOperation_W1(op) {
      op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
    }
  
    function endOperation_R2(op) {
      var cm = op.cm, display = cm.display;
      if (op.updatedDisplay) { updateHeightsInViewport(cm); }
  
      op.barMeasure = measureForScrollbars(cm);
  
      // If the max line changed since it was last measured, measure it,
      // and ensure the document's width matches it.
      // updateDisplay_W2 will use these properties to do the actual resizing
      if (display.maxLineChanged && !cm.options.lineWrapping) {
        op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
        cm.display.sizerWidth = op.adjustWidthTo;
        op.barMeasure.scrollWidth =
          Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
        op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
      }
  
      if (op.updatedDisplay || op.selectionChanged)
        { op.preparedSelection = display.input.prepareSelection(); }
    }
  
    function endOperation_W2(op) {
      var cm = op.cm;
  
      if (op.adjustWidthTo != null) {
        cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
        if (op.maxScrollLeft < cm.doc.scrollLeft)
          { setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true); }
        cm.display.maxLineChanged = false;
      }
  
      var takeFocus = op.focus && op.focus == activeElt();
      if (op.preparedSelection)
        { cm.display.input.showSelection(op.preparedSelection, takeFocus); }
      if (op.updatedDisplay || op.startHeight != cm.doc.height)
        { updateScrollbars(cm, op.barMeasure); }
      if (op.updatedDisplay)
        { setDocumentHeight(cm, op.barMeasure); }
  
      if (op.selectionChanged) { restartBlink(cm); }
  
      if (cm.state.focused && op.updateInput)
        { cm.display.input.reset(op.typing); }
      if (takeFocus) { ensureFocus(op.cm); }
    }
  
    function endOperation_finish(op) {
      var cm = op.cm, display = cm.display, doc = cm.doc;
  
      if (op.updatedDisplay) { postUpdateDisplay(cm, op.update); }
  
      // Abort mouse wheel delta measurement, when scrolling explicitly
      if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
        { display.wheelStartX = display.wheelStartY = null; }
  
      // Propagate the scroll position to the actual DOM scroller
      if (op.scrollTop != null) { setScrollTop(cm, op.scrollTop, op.forceScroll); }
  
      if (op.scrollLeft != null) { setScrollLeft(cm, op.scrollLeft, true, true); }
      // If we need to scroll a specific position into view, do so.
      if (op.scrollToPos) {
        var rect = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from),
                                     clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
        maybeScrollWindow(cm, rect);
      }
  
      // Fire events for markers that are hidden/unidden by editing or
      // undoing
      var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
      if (hidden) { for (var i = 0; i < hidden.length; ++i)
        { if (!hidden[i].lines.length) { signal(hidden[i], "hide"); } } }
      if (unhidden) { for (var i$1 = 0; i$1 < unhidden.length; ++i$1)
        { if (unhidden[i$1].lines.length) { signal(unhidden[i$1], "unhide"); } } }
  
      if (display.wrapper.offsetHeight)
        { doc.scrollTop = cm.display.scroller.scrollTop; }
  
      // Fire change events, and delayed event handlers
      if (op.changeObjs)
        { signal(cm, "changes", cm, op.changeObjs); }
      if (op.update)
        { op.update.finish(); }
    }
  
    // Run the given function in an operation
    function runInOp(cm, f) {
      if (cm.curOp) { return f() }
      startOperation(cm);
      try { return f() }
      finally { endOperation(cm); }
    }
    // Wraps a function in an operation. Returns the wrapped function.
    function operation(cm, f) {
      return function() {
        if (cm.curOp) { return f.apply(cm, arguments) }
        startOperation(cm);
        try { return f.apply(cm, arguments) }
        finally { endOperation(cm); }
      }
    }
    // Used to add methods to editor and doc instances, wrapping them in
    // operations.
    function methodOp(f) {
      return function() {
        if (this.curOp) { return f.apply(this, arguments) }
        startOperation(this);
        try { return f.apply(this, arguments) }
        finally { endOperation(this); }
      }
    }
    function docMethodOp(f) {
      return function() {
        var cm = this.cm;
        if (!cm || cm.curOp) { return f.apply(this, arguments) }
        startOperation(cm);
        try { return f.apply(this, arguments) }
        finally { endOperation(cm); }
      }
    }
  
    // Updates the display.view data structure for a given change to the
    // document. From and to are in pre-change coordinates. Lendiff is
    // the amount of lines added or subtracted by the change. This is
    // used for changes that span multiple lines, or change the way
    // lines are divided into visual lines. regLineChange (below)
    // registers single-line changes.
    function regChange(cm, from, to, lendiff) {
      if (from == null) { from = cm.doc.first; }
      if (to == null) { to = cm.doc.first + cm.doc.size; }
      if (!lendiff) { lendiff = 0; }
  
      var display = cm.display;
      if (lendiff && to < display.viewTo &&
          (display.updateLineNumbers == null || display.updateLineNumbers > from))
        { display.updateLineNumbers = from; }
  
      cm.curOp.viewChanged = true;
  
      if (from >= display.viewTo) { // Change after
        if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo)
          { resetView(cm); }
      } else if (to <= display.viewFrom) { // Change before
        if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
          resetView(cm);
        } else {
          display.viewFrom += lendiff;
          display.viewTo += lendiff;
        }
      } else if (from <= display.viewFrom && to >= display.viewTo) { // Full overlap
        resetView(cm);
      } else if (from <= display.viewFrom) { // Top overlap
        var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
        if (cut) {
          display.view = display.view.slice(cut.index);
          display.viewFrom = cut.lineN;
          display.viewTo += lendiff;
        } else {
          resetView(cm);
        }
      } else if (to >= display.viewTo) { // Bottom overlap
        var cut$1 = viewCuttingPoint(cm, from, from, -1);
        if (cut$1) {
          display.view = display.view.slice(0, cut$1.index);
          display.viewTo = cut$1.lineN;
        } else {
          resetView(cm);
        }
      } else { // Gap in the middle
        var cutTop = viewCuttingPoint(cm, from, from, -1);
        var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
        if (cutTop && cutBot) {
          display.view = display.view.slice(0, cutTop.index)
            .concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN))
            .concat(display.view.slice(cutBot.index));
          display.viewTo += lendiff;
        } else {
          resetView(cm);
        }
      }
  
      var ext = display.externalMeasured;
      if (ext) {
        if (to < ext.lineN)
          { ext.lineN += lendiff; }
        else if (from < ext.lineN + ext.size)
          { display.externalMeasured = null; }
      }
    }
  
    // Register a change to a single line. Type must be one of "text",
    // "gutter", "class", "widget"
    function regLineChange(cm, line, type) {
      cm.curOp.viewChanged = true;
      var display = cm.display, ext = cm.display.externalMeasured;
      if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
        { display.externalMeasured = null; }
  
      if (line < display.viewFrom || line >= display.viewTo) { return }
      var lineView = display.view[findViewIndex(cm, line)];
      if (lineView.node == null) { return }
      var arr = lineView.changes || (lineView.changes = []);
      if (indexOf(arr, type) == -1) { arr.push(type); }
    }
  
    // Clear the view.
    function resetView(cm) {
      cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
      cm.display.view = [];
      cm.display.viewOffset = 0;
    }
  
    function viewCuttingPoint(cm, oldN, newN, dir) {
      var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
      if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
        { return {index: index, lineN: newN} }
      var n = cm.display.viewFrom;
      for (var i = 0; i < index; i++)
        { n += view[i].size; }
      if (n != oldN) {
        if (dir > 0) {
          if (index == view.length - 1) { return null }
          diff = (n + view[index].size) - oldN;
          index++;
        } else {
          diff = n - oldN;
        }
        oldN += diff; newN += diff;
      }
      while (visualLineNo(cm.doc, newN) != newN) {
        if (index == (dir < 0 ? 0 : view.length - 1)) { return null }
        newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
        index += dir;
      }
      return {index: index, lineN: newN}
    }
  
    // Force the view to cover a given range, adding empty view element
    // or clipping off existing ones as needed.
    function adjustView(cm, from, to) {
      var display = cm.display, view = display.view;
      if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
        display.view = buildViewArray(cm, from, to);
        display.viewFrom = from;
      } else {
        if (display.viewFrom > from)
          { display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view); }
        else if (display.viewFrom < from)
          { display.view = display.view.slice(findViewIndex(cm, from)); }
        display.viewFrom = from;
        if (display.viewTo < to)
          { display.view = display.view.concat(buildViewArray(cm, display.viewTo, to)); }
        else if (display.viewTo > to)
          { display.view = display.view.slice(0, findViewIndex(cm, to)); }
      }
      display.viewTo = to;
    }
  
    // Count the number of lines in the view whose DOM representation is
    // out of date (or nonexistent).
    function countDirtyView(cm) {
      var view = cm.display.view, dirty = 0;
      for (var i = 0; i < view.length; i++) {
        var lineView = view[i];
        if (!lineView.hidden && (!lineView.node || lineView.changes)) { ++dirty; }
      }
      return dirty
    }
  
    // HIGHLIGHT WORKER
  
    function startWorker(cm, time) {
      if (cm.doc.highlightFrontier < cm.display.viewTo)
        { cm.state.highlight.set(time, bind(highlightWorker, cm)); }
    }
  
    function highlightWorker(cm) {
      var doc = cm.doc;
      if (doc.highlightFrontier >= cm.display.viewTo) { return }
      var end = +new Date + cm.options.workTime;
      var context = getContextBefore(cm, doc.highlightFrontier);
      var changedLines = [];
  
      doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function (line) {
        if (context.line >= cm.display.viewFrom) { // Visible
          var oldStyles = line.styles;
          var resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc.mode, context.state) : null;
          var highlighted = highlightLine(cm, line, context, true);
          if (resetState) { context.state = resetState; }
          line.styles = highlighted.styles;
          var oldCls = line.styleClasses, newCls = highlighted.classes;
          if (newCls) { line.styleClasses = newCls; }
          else if (oldCls) { line.styleClasses = null; }
          var ischange = !oldStyles || oldStyles.length != line.styles.length ||
            oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
          for (var i = 0; !ischange && i < oldStyles.length; ++i) { ischange = oldStyles[i] != line.styles[i]; }
          if (ischange) { changedLines.push(context.line); }
          line.stateAfter = context.save();
          context.nextLine();
        } else {
          if (line.text.length <= cm.options.maxHighlightLength)
            { processLine(cm, line.text, context); }
          line.stateAfter = context.line % 5 == 0 ? context.save() : null;
          context.nextLine();
        }
        if (+new Date > end) {
          startWorker(cm, cm.options.workDelay);
          return true
        }
      });
      doc.highlightFrontier = context.line;
      doc.modeFrontier = Math.max(doc.modeFrontier, context.line);
      if (changedLines.length) { runInOp(cm, function () {
        for (var i = 0; i < changedLines.length; i++)
          { regLineChange(cm, changedLines[i], "text"); }
      }); }
    }
  
    // DISPLAY DRAWING
  
    var DisplayUpdate = function(cm, viewport, force) {
      var display = cm.display;
  
      this.viewport = viewport;
      // Store some values that we'll need later (but don't want to force a relayout for)
      this.visible = visibleLines(display, cm.doc, viewport);
      this.editorIsHidden = !display.wrapper.offsetWidth;
      this.wrapperHeight = display.wrapper.clientHeight;
      this.wrapperWidth = display.wrapper.clientWidth;
      this.oldDisplayWidth = displayWidth(cm);
      this.force = force;
      this.dims = getDimensions(cm);
      this.events = [];
    };
  
    DisplayUpdate.prototype.signal = function (emitter, type) {
      if (hasHandler(emitter, type))
        { this.events.push(arguments); }
    };
    DisplayUpdate.prototype.finish = function () {
        var this$1 = this;
  
      for (var i = 0; i < this.events.length; i++)
        { signal.apply(null, this$1.events[i]); }
    };
  
    function maybeClipScrollbars(cm) {
      var display = cm.display;
      if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
        display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
        display.heightForcer.style.height = scrollGap(cm) + "px";
        display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
        display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
        display.scrollbarsClipped = true;
      }
    }
  
    function selectionSnapshot(cm) {
      if (cm.hasFocus()) { return null }
      var active = activeElt();
      if (!active || !contains(cm.display.lineDiv, active)) { return null }
      var result = {activeElt: active};
      if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode)) {
          result.anchorNode = sel.anchorNode;
          result.anchorOffset = sel.anchorOffset;
          result.focusNode = sel.focusNode;
          result.focusOffset = sel.focusOffset;
        }
      }
      return result
    }
  
    function restoreSelection(snapshot) {
      if (!snapshot || !snapshot.activeElt || snapshot.activeElt == activeElt()) { return }
      snapshot.activeElt.focus();
      if (snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode)) {
        var sel = window.getSelection(), range$$1 = document.createRange();
        range$$1.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
        range$$1.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range$$1);
        sel.extend(snapshot.focusNode, snapshot.focusOffset);
      }
    }
  
    // Does the actual updating of the line display. Bails out
    // (returning false) when there is nothing to be done and forced is
    // false.
    function updateDisplayIfNeeded(cm, update) {
      var display = cm.display, doc = cm.doc;
  
      if (update.editorIsHidden) {
        resetView(cm);
        return false
      }
  
      // Bail out if the visible area is already rendered and nothing changed.
      if (!update.force &&
          update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo &&
          (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) &&
          display.renderedView == display.view && countDirtyView(cm) == 0)
        { return false }
  
      if (maybeUpdateLineNumberWidth(cm)) {
        resetView(cm);
        update.dims = getDimensions(cm);
      }
  
      // Compute a suitable new viewport (from & to)
      var end = doc.first + doc.size;
      var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
      var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
      if (display.viewFrom < from && from - display.viewFrom < 20) { from = Math.max(doc.first, display.viewFrom); }
      if (display.viewTo > to && display.viewTo - to < 20) { to = Math.min(end, display.viewTo); }
      if (sawCollapsedSpans) {
        from = visualLineNo(cm.doc, from);
        to = visualLineEndNo(cm.doc, to);
      }
  
      var different = from != display.viewFrom || to != display.viewTo ||
        display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
      adjustView(cm, from, to);
  
      display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
      // Position the mover div to align with the current scroll position
      cm.display.mover.style.top = display.viewOffset + "px";
  
      var toUpdate = countDirtyView(cm);
      if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view &&
          (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
        { return false }
  
      // For big changes, we hide the enclosing element during the
      // update, since that speeds up the operations on most browsers.
      var selSnapshot = selectionSnapshot(cm);
      if (toUpdate > 4) { display.lineDiv.style.display = "none"; }
      patchDisplay(cm, display.updateLineNumbers, update.dims);
      if (toUpdate > 4) { display.lineDiv.style.display = ""; }
      display.renderedView = display.view;
      // There might have been a widget with a focused element that got
      // hidden or updated, if so re-focus it.
      restoreSelection(selSnapshot);
  
      // Prevent selection and cursors from interfering with the scroll
      // width and height.
      removeChildren(display.cursorDiv);
      removeChildren(display.selectionDiv);
      display.gutters.style.height = display.sizer.style.minHeight = 0;
  
      if (different) {
        display.lastWrapHeight = update.wrapperHeight;
        display.lastWrapWidth = update.wrapperWidth;
        startWorker(cm, 400);
      }
  
      display.updateLineNumbers = null;
  
      return true
    }
  
    function postUpdateDisplay(cm, update) {
      var viewport = update.viewport;
  
      for (var first = true;; first = false) {
        if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
          // Clip forced viewport to actual scrollable area.
          if (viewport && viewport.top != null)
            { viewport = {top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)}; }
          // Updated line heights might result in the drawn area not
          // actually covering the viewport. Keep looping until it does.
          update.visible = visibleLines(cm.display, cm.doc, viewport);
          if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
            { break }
        }
        if (!updateDisplayIfNeeded(cm, update)) { break }
        updateHeightsInViewport(cm);
        var barMeasure = measureForScrollbars(cm);
        updateSelection(cm);
        updateScrollbars(cm, barMeasure);
        setDocumentHeight(cm, barMeasure);
        update.force = false;
      }
  
      update.signal(cm, "update", cm);
      if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
        update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
        cm.display.reportedViewFrom = cm.display.viewFrom; cm.display.reportedViewTo = cm.display.viewTo;
      }
    }
  
    function updateDisplaySimple(cm, viewport) {
      var update = new DisplayUpdate(cm, viewport);
      if (updateDisplayIfNeeded(cm, update)) {
        updateHeightsInViewport(cm);
        postUpdateDisplay(cm, update);
        var barMeasure = measureForScrollbars(cm);
        updateSelection(cm);
        updateScrollbars(cm, barMeasure);
        setDocumentHeight(cm, barMeasure);
        update.finish();
      }
    }
  
    // Sync the actual display DOM structure with display.view, removing
    // nodes for lines that are no longer in view, and creating the ones
    // that are not there yet, and updating the ones that are out of
    // date.
    function patchDisplay(cm, updateNumbersFrom, dims) {
      var display = cm.display, lineNumbers = cm.options.lineNumbers;
      var container = display.lineDiv, cur = container.firstChild;
  
      function rm(node) {
        var next = node.nextSibling;
        // Works around a throw-scroll bug in OS X Webkit
        if (webkit && mac && cm.display.currentWheelTarget == node)
          { node.style.display = "none"; }
        else
          { node.parentNode.removeChild(node); }
        return next
      }
  
      var view = display.view, lineN = display.viewFrom;
      // Loop over the elements in the view, syncing cur (the DOM nodes
      // in display.lineDiv) with the view as we go.
      for (var i = 0; i < view.length; i++) {
        var lineView = view[i];
        if (lineView.hidden) ; else if (!lineView.node || lineView.node.parentNode != container) { // Not drawn yet
          var node = buildLineElement(cm, lineView, lineN, dims);
          container.insertBefore(node, cur);
        } else { // Already drawn
          while (cur != lineView.node) { cur = rm(cur); }
          var updateNumber = lineNumbers && updateNumbersFrom != null &&
            updateNumbersFrom <= lineN && lineView.lineNumber;
          if (lineView.changes) {
            if (indexOf(lineView.changes, "gutter") > -1) { updateNumber = false; }
            updateLineForChanges(cm, lineView, lineN, dims);
          }
          if (updateNumber) {
            removeChildren(lineView.lineNumber);
            lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
          }
          cur = lineView.node.nextSibling;
        }
        lineN += lineView.size;
      }
      while (cur) { cur = rm(cur); }
    }
  
    function updateGutterSpace(cm) {
      var width = cm.display.gutters.offsetWidth;
      cm.display.sizer.style.marginLeft = width + "px";
    }
  
    function setDocumentHeight(cm, measure) {
      cm.display.sizer.style.minHeight = measure.docHeight + "px";
      cm.display.heightForcer.style.top = measure.docHeight + "px";
      cm.display.gutters.style.height = (measure.docHeight + cm.display.barHeight + scrollGap(cm)) + "px";
    }
  
    // Rebuild the gutter elements, ensure the margin to the left of the
    // code matches their width.
    function updateGutters(cm) {
      var gutters = cm.display.gutters, specs = cm.options.gutters;
      removeChildren(gutters);
      var i = 0;
      for (; i < specs.length; ++i) {
        var gutterClass = specs[i];
        var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
        if (gutterClass == "CodeMirror-linenumbers") {
          cm.display.lineGutter = gElt;
          gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
        }
      }
      gutters.style.display = i ? "" : "none";
      updateGutterSpace(cm);
    }
  
    // Make sure the gutters options contains the element
    // "CodeMirror-linenumbers" when the lineNumbers option is true.
    function setGuttersForLineNumbers(options) {
      var found = indexOf(options.gutters, "CodeMirror-linenumbers");
      if (found == -1 && options.lineNumbers) {
        options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
      } else if (found > -1 && !options.lineNumbers) {
        options.gutters = options.gutters.slice(0);
        options.gutters.splice(found, 1);
      }
    }
  
    // Since the delta values reported on mouse wheel events are
    // unstandardized between browsers and even browser versions, and
    // generally horribly unpredictable, this code starts by measuring
    // the scroll effect that the first few mouse wheel events have,
    // and, from that, detects the way it can convert deltas to pixel
    // offsets afterwards.
    //
    // The reason we want to know the amount a wheel event will scroll
    // is that it gives us a chance to update the display before the
    // actual scrolling happens, reducing flickering.
  
    var wheelSamples = 0, wheelPixelsPerUnit = null;
    // Fill in a browser-detected starting value on browsers where we
    // know one. These don't have to be accurate -- the result of them
    // being wrong would just be a slight flicker on the first wheel
    // scroll (if it is large enough).
    if (ie) { wheelPixelsPerUnit = -.53; }
    else if (gecko) { wheelPixelsPerUnit = 15; }
    else if (chrome) { wheelPixelsPerUnit = -.7; }
    else if (safari) { wheelPixelsPerUnit = -1/3; }
  
    function wheelEventDelta(e) {
      var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
      if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) { dx = e.detail; }
      if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) { dy = e.detail; }
      else if (dy == null) { dy = e.wheelDelta; }
      return {x: dx, y: dy}
    }
    function wheelEventPixels(e) {
      var delta = wheelEventDelta(e);
      delta.x *= wheelPixelsPerUnit;
      delta.y *= wheelPixelsPerUnit;
      return delta
    }
  
    function onScrollWheel(cm, e) {
      var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;
  
      var display = cm.display, scroll = display.scroller;
      // Quit if there's nothing to scroll here
      var canScrollX = scroll.scrollWidth > scroll.clientWidth;
      var canScrollY = scroll.scrollHeight > scroll.clientHeight;
      if (!(dx && canScrollX || dy && canScrollY)) { return }
  
      // Webkit browsers on OS X abort momentum scrolls when the target
      // of the scroll event is removed from the scrollable element.
      // This hack (see related code in patchDisplay) makes sure the
      // element is kept around.
      if (dy && mac && webkit) {
        outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
          for (var i = 0; i < view.length; i++) {
            if (view[i].node == cur) {
              cm.display.currentWheelTarget = cur;
              break outer
            }
          }
        }
      }
  
      // On some browsers, horizontal scrolling will cause redraws to
      // happen before the gutter has been realigned, causing it to
      // wriggle around in a most unseemly way. When we have an
      // estimated pixels/delta value, we just handle horizontal
      // scrolling entirely here. It'll be slightly off from native, but
      // better than glitching out.
      if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
        if (dy && canScrollY)
          { updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * wheelPixelsPerUnit)); }
        setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * wheelPixelsPerUnit));
        // Only prevent default scrolling if vertical scrolling is
        // actually possible. Otherwise, it causes vertical scroll
        // jitter on OSX trackpads when deltaX is small and deltaY
        // is large (issue #3579)
        if (!dy || (dy && canScrollY))
          { e_preventDefault(e); }
        display.wheelStartX = null; // Abort measurement, if in progress
        return
      }
  
      // 'Project' the visible viewport to cover the area that is being
      // scrolled into view (if we know enough to estimate it).
      if (dy && wheelPixelsPerUnit != null) {
        var pixels = dy * wheelPixelsPerUnit;
        var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
        if (pixels < 0) { top = Math.max(0, top + pixels - 50); }
        else { bot = Math.min(cm.doc.height, bot + pixels + 50); }
        updateDisplaySimple(cm, {top: top, bottom: bot});
      }
  
      if (wheelSamples < 20) {
        if (display.wheelStartX == null) {
          display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
          display.wheelDX = dx; display.wheelDY = dy;
          setTimeout(function () {
            if (display.wheelStartX == null) { return }
            var movedX = scroll.scrollLeft - display.wheelStartX;
            var movedY = scroll.scrollTop - display.wheelStartY;
            var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
              (movedX && display.wheelDX && movedX / display.wheelDX);
            display.wheelStartX = display.wheelStartY = null;
            if (!sample) { return }
            wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
            ++wheelSamples;
          }, 200);
        } else {
          display.wheelDX += dx; display.wheelDY += dy;
        }
      }
    }
  
    // Selection objects are immutable. A new one is created every time
    // the selection changes. A selection is one or more non-overlapping
    // (and non-touching) ranges, sorted, and an integer that indicates
    // which one is the primary selection (the one that's scrolled into
    // view, that getCursor returns, etc).
    var Selection = function(ranges, primIndex) {
      this.ranges = ranges;
      this.primIndex = primIndex;
    };
  
    Selection.prototype.primary = function () { return this.ranges[this.primIndex] };
  
    Selection.prototype.equals = function (other) {
        var this$1 = this;
  
      if (other == this) { return true }
      if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) { return false }
      for (var i = 0; i < this.ranges.length; i++) {
        var here = this$1.ranges[i], there = other.ranges[i];
        if (!equalCursorPos(here.anchor, there.anchor) || !equalCursorPos(here.head, there.head)) { return false }
      }
      return true
    };
  
    Selection.prototype.deepCopy = function () {
        var this$1 = this;
  
      var out = [];
      for (var i = 0; i < this.ranges.length; i++)
        { out[i] = new Range(copyPos(this$1.ranges[i].anchor), copyPos(this$1.ranges[i].head)); }
      return new Selection(out, this.primIndex)
    };
  
    Selection.prototype.somethingSelected = function () {
        var this$1 = this;
  
      for (var i = 0; i < this.ranges.length; i++)
        { if (!this$1.ranges[i].empty()) { return true } }
      return false
    };
  
    Selection.prototype.contains = function (pos, end) {
        var this$1 = this;
  
      if (!end) { end = pos; }
      for (var i = 0; i < this.ranges.length; i++) {
        var range = this$1.ranges[i];
        if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0)
          { return i }
      }
      return -1
    };
  
    var Range = function(anchor, head) {
      this.anchor = anchor; this.head = head;
    };
  
    Range.prototype.from = function () { return minPos(this.anchor, this.head) };
    Range.prototype.to = function () { return maxPos(this.anchor, this.head) };
    Range.prototype.empty = function () { return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch };
  
    // Take an unsorted, potentially overlapping set of ranges, and
    // build a selection out of it. 'Consumes' ranges array (modifying
    // it).
    function normalizeSelection(cm, ranges, primIndex) {
      var mayTouch = cm && cm.options.selectionsMayTouch;
      var prim = ranges[primIndex];
      ranges.sort(function (a, b) { return cmp(a.from(), b.from()); });
      primIndex = indexOf(ranges, prim);
      for (var i = 1; i < ranges.length; i++) {
        var cur = ranges[i], prev = ranges[i - 1];
        var diff = cmp(prev.to(), cur.from());
        if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
          var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
          var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
          if (i <= primIndex) { --primIndex; }
          ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
        }
      }
      return new Selection(ranges, primIndex)
    }
  
    function simpleSelection(anchor, head) {
      return new Selection([new Range(anchor, head || anchor)], 0)
    }
  
    // Compute the position of the end of a change (its 'to' property
    // refers to the pre-change end).
    function changeEnd(change) {
      if (!change.text) { return change.to }
      return Pos(change.from.line + change.text.length - 1,
                 lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0))
    }
  
    // Adjust a position to refer to the post-change position of the
    // same text, or the end of the change if the change covers it.
    function adjustForChange(pos, change) {
      if (cmp(pos, change.from) < 0) { return pos }
      if (cmp(pos, change.to) <= 0) { return changeEnd(change) }
  
      var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
      if (pos.line == change.to.line) { ch += changeEnd(change).ch - change.to.ch; }
      return Pos(line, ch)
    }
  
    function computeSelAfterChange(doc, change) {
      var out = [];
      for (var i = 0; i < doc.sel.ranges.length; i++) {
        var range = doc.sel.ranges[i];
        out.push(new Range(adjustForChange(range.anchor, change),
                           adjustForChange(range.head, change)));
      }
      return normalizeSelection(doc.cm, out, doc.sel.primIndex)
    }
  
    function offsetPos(pos, old, nw) {
      if (pos.line == old.line)
        { return Pos(nw.line, pos.ch - old.ch + nw.ch) }
      else
        { return Pos(nw.line + (pos.line - old.line), pos.ch) }
    }
  
    // Used by replaceSelections to allow moving the selection to the
    // start or around the replaced test. Hint may be "start" or "around".
    function computeReplacedSel(doc, changes, hint) {
      var out = [];
      var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
      for (var i = 0; i < changes.length; i++) {
        var change = changes[i];
        var from = offsetPos(change.from, oldPrev, newPrev);
        var to = offsetPos(changeEnd(change), oldPrev, newPrev);
        oldPrev = change.to;
        newPrev = to;
        if (hint == "around") {
          var range = doc.sel.ranges[i], inv = cmp(range.head, range.anchor) < 0;
          out[i] = new Range(inv ? to : from, inv ? from : to);
        } else {
          out[i] = new Range(from, from);
        }
      }
      return new Selection(out, doc.sel.primIndex)
    }
  
    // Used to get the editor into a consistent state again when options change.
  
    function loadMode(cm) {
      cm.doc.mode = getMode(cm.options, cm.doc.modeOption);
      resetModeState(cm);
    }
  
    function resetModeState(cm) {
      cm.doc.iter(function (line) {
        if (line.stateAfter) { line.stateAfter = null; }
        if (line.styles) { line.styles = null; }
      });
      cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
      startWorker(cm, 100);
      cm.state.modeGen++;
      if (cm.curOp) { regChange(cm); }
    }
  
    // DOCUMENT DATA STRUCTURE
  
    // By default, updates that start and end at the beginning of a line
    // are treated specially, in order to make the association of line
    // widgets and marker elements with the text behave more intuitive.
    function isWholeLineUpdate(doc, change) {
      return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" &&
        (!doc.cm || doc.cm.options.wholeLineUpdateBefore)
    }
  
    // Perform a change on the document data structure.
    function updateDoc(doc, change, markedSpans, estimateHeight$$1) {
      function spansFor(n) {return markedSpans ? markedSpans[n] : null}
      function update(line, text, spans) {
        updateLine(line, text, spans, estimateHeight$$1);
        signalLater(line, "change", line, change);
      }
      function linesFor(start, end) {
        var result = [];
        for (var i = start; i < end; ++i)
          { result.push(new Line(text[i], spansFor(i), estimateHeight$$1)); }
        return result
      }
  
      var from = change.from, to = change.to, text = change.text;
      var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
      var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
  
      // Adjust the line structure
      if (change.full) {
        doc.insert(0, linesFor(0, text.length));
        doc.remove(text.length, doc.size - text.length);
      } else if (isWholeLineUpdate(doc, change)) {
        // This is a whole-line replace. Treated specially to make
        // sure line objects move the way they are supposed to.
        var added = linesFor(0, text.length - 1);
        update(lastLine, lastLine.text, lastSpans);
        if (nlines) { doc.remove(from.line, nlines); }
        if (added.length) { doc.insert(from.line, added); }
      } else if (firstLine == lastLine) {
        if (text.length == 1) {
          update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
        } else {
          var added$1 = linesFor(1, text.length - 1);
          added$1.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight$$1));
          update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
          doc.insert(from.line + 1, added$1);
        }
      } else if (text.length == 1) {
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
        doc.remove(from.line + 1, nlines);
      } else {
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
        update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
        var added$2 = linesFor(1, text.length - 1);
        if (nlines > 1) { doc.remove(from.line + 1, nlines - 1); }
        doc.insert(from.line + 1, added$2);
      }
  
      signalLater(doc, "change", doc, change);
    }
  
    // Call f for all linked documents.
    function linkedDocs(doc, f, sharedHistOnly) {
      function propagate(doc, skip, sharedHist) {
        if (doc.linked) { for (var i = 0; i < doc.linked.length; ++i) {
          var rel = doc.linked[i];
          if (rel.doc == skip) { continue }
          var shared = sharedHist && rel.sharedHist;
          if (sharedHistOnly && !shared) { continue }
          f(rel.doc, shared);
          propagate(rel.doc, doc, shared);
        } }
      }
      propagate(doc, null, true);
    }
  
    // Attach a document to an editor.
    function attachDoc(cm, doc) {
      if (doc.cm) { throw new Error("This document is already in use.") }
      cm.doc = doc;
      doc.cm = cm;
      estimateLineHeights(cm);
      loadMode(cm);
      setDirectionClass(cm);
      if (!cm.options.lineWrapping) { findMaxLine(cm); }
      cm.options.mode = doc.modeOption;
      regChange(cm);
    }
  
    function setDirectionClass(cm) {
    (cm.doc.direction == "rtl" ? addClass : rmClass)(cm.display.lineDiv, "CodeMirror-rtl");
    }
  
    function directionChanged(cm) {
      runInOp(cm, function () {
        setDirectionClass(cm);
        regChange(cm);
      });
    }
  
    function History(startGen) {
      // Arrays of change events and selections. Doing something adds an
      // event to done and clears undo. Undoing moves events from done
      // to undone, redoing moves them in the other direction.
      this.done = []; this.undone = [];
      this.undoDepth = Infinity;
      // Used to track when changes can be merged into a single undo
      // event
      this.lastModTime = this.lastSelTime = 0;
      this.lastOp = this.lastSelOp = null;
      this.lastOrigin = this.lastSelOrigin = null;
      // Used by the isClean() method
      this.generation = this.maxGeneration = startGen || 1;
    }
  
    // Create a history change event from an updateDoc-style change
    // object.
    function historyChangeFromChange(doc, change) {
      var histChange = {from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
      attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
      linkedDocs(doc, function (doc) { return attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1); }, true);
      return histChange
    }
  
    // Pop all selection events off the end of a history array. Stop at
    // a change event.
    function clearSelectionEvents(array) {
      while (array.length) {
        var last = lst(array);
        if (last.ranges) { array.pop(); }
        else { break }
      }
    }
  
    // Find the top change event in the history. Pop off selection
    // events that are in the way.
    function lastChangeEvent(hist, force) {
      if (force) {
        clearSelectionEvents(hist.done);
        return lst(hist.done)
      } else if (hist.done.length && !lst(hist.done).ranges) {
        return lst(hist.done)
      } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
        hist.done.pop();
        return lst(hist.done)
      }
    }
  
    // Register a change in the history. Merges changes that are within
    // a single operation, or are close together with an origin that
    // allows merging (starting with "+") into a single event.
    function addChangeToHistory(doc, change, selAfter, opId) {
      var hist = doc.history;
      hist.undone.length = 0;
      var time = +new Date, cur;
      var last;
  
      if ((hist.lastOp == opId ||
           hist.lastOrigin == change.origin && change.origin &&
           ((change.origin.charAt(0) == "+" && hist.lastModTime > time - (doc.cm ? doc.cm.options.historyEventDelay : 500)) ||
            change.origin.charAt(0) == "*")) &&
          (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
        // Merge this change into the last event
        last = lst(cur.changes);
        if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
          // Optimized case for simple insertion -- don't want to add
          // new changesets for every character typed
          last.to = changeEnd(change);
        } else {
          // Add new sub-event
          cur.changes.push(historyChangeFromChange(doc, change));
        }
      } else {
        // Can not be merged, start a new event.
        var before = lst(hist.done);
        if (!before || !before.ranges)
          { pushSelectionToHistory(doc.sel, hist.done); }
        cur = {changes: [historyChangeFromChange(doc, change)],
               generation: hist.generation};
        hist.done.push(cur);
        while (hist.done.length > hist.undoDepth) {
          hist.done.shift();
          if (!hist.done[0].ranges) { hist.done.shift(); }
        }
      }
      hist.done.push(selAfter);
      hist.generation = ++hist.maxGeneration;
      hist.lastModTime = hist.lastSelTime = time;
      hist.lastOp = hist.lastSelOp = opId;
      hist.lastOrigin = hist.lastSelOrigin = change.origin;
  
      if (!last) { signal(doc, "historyAdded"); }
    }
  
    function selectionEventCanBeMerged(doc, origin, prev, sel) {
      var ch = origin.charAt(0);
      return ch == "*" ||
        ch == "+" &&
        prev.ranges.length == sel.ranges.length &&
        prev.somethingSelected() == sel.somethingSelected() &&
        new Date - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500)
    }
  
    // Called whenever the selection changes, sets the new selection as
    // the pending selection in the history, and pushes the old pending
    // selection into the 'done' array when it was significantly
    // different (in number of selected ranges, emptiness, or time).
    function addSelectionToHistory(doc, sel, opId, options) {
      var hist = doc.history, origin = options && options.origin;
  
      // A new event is started when the previous origin does not match
      // the current, or the origins don't allow matching. Origins
      // starting with * are always merged, those starting with + are
      // merged when similar and close together in time.
      if (opId == hist.lastSelOp ||
          (origin && hist.lastSelOrigin == origin &&
           (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin ||
            selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))))
        { hist.done[hist.done.length - 1] = sel; }
      else
        { pushSelectionToHistory(sel, hist.done); }
  
      hist.lastSelTime = +new Date;
      hist.lastSelOrigin = origin;
      hist.lastSelOp = opId;
      if (options && options.clearRedo !== false)
        { clearSelectionEvents(hist.undone); }
    }
  
    function pushSelectionToHistory(sel, dest) {
      var top = lst(dest);
      if (!(top && top.ranges && top.equals(sel)))
        { dest.push(sel); }
    }
  
    // Used to store marked span information in the history.
    function attachLocalSpans(doc, change, from, to) {
      var existing = change["spans_" + doc.id], n = 0;
      doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function (line) {
        if (line.markedSpans)
          { (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans; }
        ++n;
      });
    }
  
    // When un/re-doing restores text containing marked spans, those
    // that have been explicitly cleared should not be restored.
    function removeClearedSpans(spans) {
      if (!spans) { return null }
      var out;
      for (var i = 0; i < spans.length; ++i) {
        if (spans[i].marker.explicitlyCleared) { if (!out) { out = spans.slice(0, i); } }
        else if (out) { out.push(spans[i]); }
      }
      return !out ? spans : out.length ? out : null
    }
  
    // Retrieve and filter the old marked spans stored in a change event.
    function getOldSpans(doc, change) {
      var found = change["spans_" + doc.id];
      if (!found) { return null }
      var nw = [];
      for (var i = 0; i < change.text.length; ++i)
        { nw.push(removeClearedSpans(found[i])); }
      return nw
    }
  
    // Used for un/re-doing changes from the history. Combines the
    // result of computing the existing spans with the set of spans that
    // existed in the history (so that deleting around a span and then
    // undoing brings back the span).
    function mergeOldSpans(doc, change) {
      var old = getOldSpans(doc, change);
      var stretched = stretchSpansOverChange(doc, change);
      if (!old) { return stretched }
      if (!stretched) { return old }
  
      for (var i = 0; i < old.length; ++i) {
        var oldCur = old[i], stretchCur = stretched[i];
        if (oldCur && stretchCur) {
          spans: for (var j = 0; j < stretchCur.length; ++j) {
            var span = stretchCur[j];
            for (var k = 0; k < oldCur.length; ++k)
              { if (oldCur[k].marker == span.marker) { continue spans } }
            oldCur.push(span);
          }
        } else if (stretchCur) {
          old[i] = stretchCur;
        }
      }
      return old
    }
  
    // Used both to provide a JSON-safe object in .getHistory, and, when
    // detaching a document, to split the history in two
    function copyHistoryArray(events, newGroup, instantiateSel) {
      var copy = [];
      for (var i = 0; i < events.length; ++i) {
        var event = events[i];
        if (event.ranges) {
          copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
          continue
        }
        var changes = event.changes, newChanges = [];
        copy.push({changes: newChanges});
        for (var j = 0; j < changes.length; ++j) {
          var change = changes[j], m = (void 0);
          newChanges.push({from: change.from, to: change.to, text: change.text});
          if (newGroup) { for (var prop in change) { if (m = prop.match(/^spans_(\d+)$/)) {
            if (indexOf(newGroup, Number(m[1])) > -1) {
              lst(newChanges)[prop] = change[prop];
              delete change[prop];
            }
          } } }
        }
      }
      return copy
    }
  
    // The 'scroll' parameter given to many of these indicated whether
    // the new cursor position should be scrolled into view after
    // modifying the selection.
  
    // If shift is held or the extend flag is set, extends a range to
    // include a given position (and optionally a second position).
    // Otherwise, simply returns the range between the given positions.
    // Used for cursor motion and such.
    function extendRange(range, head, other, extend) {
      if (extend) {
        var anchor = range.anchor;
        if (other) {
          var posBefore = cmp(head, anchor) < 0;
          if (posBefore != (cmp(other, anchor) < 0)) {
            anchor = head;
            head = other;
          } else if (posBefore != (cmp(head, other) < 0)) {
            head = other;
          }
        }
        return new Range(anchor, head)
      } else {
        return new Range(other || head, head)
      }
    }
  
    // Extend the primary selection range, discard the rest.
    function extendSelection(doc, head, other, options, extend) {
      if (extend == null) { extend = doc.cm && (doc.cm.display.shift || doc.extend); }
      setSelection(doc, new Selection([extendRange(doc.sel.primary(), head, other, extend)], 0), options);
    }
  
    // Extend all selections (pos is an array of selections with length
    // equal the number of selections)
    function extendSelections(doc, heads, options) {
      var out = [];
      var extend = doc.cm && (doc.cm.display.shift || doc.extend);
      for (var i = 0; i < doc.sel.ranges.length; i++)
        { out[i] = extendRange(doc.sel.ranges[i], heads[i], null, extend); }
      var newSel = normalizeSelection(doc.cm, out, doc.sel.primIndex);
      setSelection(doc, newSel, options);
    }
  
    // Updates a single range in the selection.
    function replaceOneSelection(doc, i, range, options) {
      var ranges = doc.sel.ranges.slice(0);
      ranges[i] = range;
      setSelection(doc, normalizeSelection(doc.cm, ranges, doc.sel.primIndex), options);
    }
  
    // Reset the selection to a single range.
    function setSimpleSelection(doc, anchor, head, options) {
      setSelection(doc, simpleSelection(anchor, head), options);
    }
  
    // Give beforeSelectionChange handlers a change to influence a
    // selection update.
    function filterSelectionChange(doc, sel, options) {
      var obj = {
        ranges: sel.ranges,
        update: function(ranges) {
          var this$1 = this;
  
          this.ranges = [];
          for (var i = 0; i < ranges.length; i++)
            { this$1.ranges[i] = new Range(clipPos(doc, ranges[i].anchor),
                                       clipPos(doc, ranges[i].head)); }
        },
        origin: options && options.origin
      };
      signal(doc, "beforeSelectionChange", doc, obj);
      if (doc.cm) { signal(doc.cm, "beforeSelectionChange", doc.cm, obj); }
      if (obj.ranges != sel.ranges) { return normalizeSelection(doc.cm, obj.ranges, obj.ranges.length - 1) }
      else { return sel }
    }
  
    function setSelectionReplaceHistory(doc, sel, options) {
      var done = doc.history.done, last = lst(done);
      if (last && last.ranges) {
        done[done.length - 1] = sel;
        setSelectionNoUndo(doc, sel, options);
      } else {
        setSelection(doc, sel, options);
      }
    }
  
    // Set a new selection.
    function setSelection(doc, sel, options) {
      setSelectionNoUndo(doc, sel, options);
      addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
    }
  
    function setSelectionNoUndo(doc, sel, options) {
      if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange"))
        { sel = filterSelectionChange(doc, sel, options); }
  
      var bias = options && options.bias ||
        (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
      setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));
  
      if (!(options && options.scroll === false) && doc.cm)
        { ensureCursorVisible(doc.cm); }
    }
  
    function setSelectionInner(doc, sel) {
      if (sel.equals(doc.sel)) { return }
  
      doc.sel = sel;
  
      if (doc.cm) {
        doc.cm.curOp.updateInput = 1;
        doc.cm.curOp.selectionChanged = true;
        signalCursorActivity(doc.cm);
      }
      signalLater(doc, "cursorActivity", doc);
    }
  
    // Verify that the selection does not partially select any atomic
    // marked ranges.
    function reCheckSelection(doc) {
      setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false));
    }
  
    // Return a selection that does not partially select any atomic
    // ranges.
    function skipAtomicInSelection(doc, sel, bias, mayClear) {
      var out;
      for (var i = 0; i < sel.ranges.length; i++) {
        var range = sel.ranges[i];
        var old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i];
        var newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear);
        var newHead = skipAtomic(doc, range.head, old && old.head, bias, mayClear);
        if (out || newAnchor != range.anchor || newHead != range.head) {
          if (!out) { out = sel.ranges.slice(0, i); }
          out[i] = new Range(newAnchor, newHead);
        }
      }
      return out ? normalizeSelection(doc.cm, out, sel.primIndex) : sel
    }
  
    function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
      var line = getLine(doc, pos.line);
      if (line.markedSpans) { for (var i = 0; i < line.markedSpans.length; ++i) {
        var sp = line.markedSpans[i], m = sp.marker;
        if ((sp.from == null || (m.inclusiveLeft ? sp.from <= pos.ch : sp.from < pos.ch)) &&
            (sp.to == null || (m.inclusiveRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
          if (mayClear) {
            signal(m, "beforeCursorEnter");
            if (m.explicitlyCleared) {
              if (!line.markedSpans) { break }
              else {--i; continue}
            }
          }
          if (!m.atomic) { continue }
  
          if (oldPos) {
            var near = m.find(dir < 0 ? 1 : -1), diff = (void 0);
            if (dir < 0 ? m.inclusiveRight : m.inclusiveLeft)
              { near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null); }
            if (near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0))
              { return skipAtomicInner(doc, near, pos, dir, mayClear) }
          }
  
          var far = m.find(dir < 0 ? -1 : 1);
          if (dir < 0 ? m.inclusiveLeft : m.inclusiveRight)
            { far = movePos(doc, far, dir, far.line == pos.line ? line : null); }
          return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null
        }
      } }
      return pos
    }
  
    // Ensure a given position is not inside an atomic range.
    function skipAtomic(doc, pos, oldPos, bias, mayClear) {
      var dir = bias || 1;
      var found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) ||
          (!mayClear && skipAtomicInner(doc, pos, oldPos, dir, true)) ||
          skipAtomicInner(doc, pos, oldPos, -dir, mayClear) ||
          (!mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true));
      if (!found) {
        doc.cantEdit = true;
        return Pos(doc.first, 0)
      }
      return found
    }
  
    function movePos(doc, pos, dir, line) {
      if (dir < 0 && pos.ch == 0) {
        if (pos.line > doc.first) { return clipPos(doc, Pos(pos.line - 1)) }
        else { return null }
      } else if (dir > 0 && pos.ch == (line || getLine(doc, pos.line)).text.length) {
        if (pos.line < doc.first + doc.size - 1) { return Pos(pos.line + 1, 0) }
        else { return null }
      } else {
        return new Pos(pos.line, pos.ch + dir)
      }
    }
  
    function selectAll(cm) {
      cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);
    }
  
    // UPDATING
  
    // Allow "beforeChange" event handlers to influence a change
    function filterChange(doc, change, update) {
      var obj = {
        canceled: false,
        from: change.from,
        to: change.to,
        text: change.text,
        origin: change.origin,
        cancel: function () { return obj.canceled = true; }
      };
      if (update) { obj.update = function (from, to, text, origin) {
        if (from) { obj.from = clipPos(doc, from); }
        if (to) { obj.to = clipPos(doc, to); }
        if (text) { obj.text = text; }
        if (origin !== undefined) { obj.origin = origin; }
      }; }
      signal(doc, "beforeChange", doc, obj);
      if (doc.cm) { signal(doc.cm, "beforeChange", doc.cm, obj); }
  
      if (obj.canceled) {
        if (doc.cm) { doc.cm.curOp.updateInput = 2; }
        return null
      }
      return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin}
    }
  
    // Apply a change to a document, and add it to the document's
    // history, and propagating it to all linked documents.
    function makeChange(doc, change, ignoreReadOnly) {
      if (doc.cm) {
        if (!doc.cm.curOp) { return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly) }
        if (doc.cm.state.suppressEdits) { return }
      }
  
      if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
        change = filterChange(doc, change, true);
        if (!change) { return }
      }
  
      // Possibly split or suppress the update based on the presence
      // of read-only spans in its range.
      var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
      if (split) {
        for (var i = split.length - 1; i >= 0; --i)
          { makeChangeInner(doc, {from: split[i].from, to: split[i].to, text: i ? [""] : change.text, origin: change.origin}); }
      } else {
        makeChangeInner(doc, change);
      }
    }
  
    function makeChangeInner(doc, change) {
      if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) { return }
      var selAfter = computeSelAfterChange(doc, change);
      addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);
  
      makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
      var rebased = [];
  
      linkedDocs(doc, function (doc, sharedHist) {
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
          rebaseHist(doc.history, change);
          rebased.push(doc.history);
        }
        makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
      });
    }
  
    // Revert a change stored in a document's history.
    function makeChangeFromHistory(doc, type, allowSelectionOnly) {
      var suppress = doc.cm && doc.cm.state.suppressEdits;
      if (suppress && !allowSelectionOnly) { return }
  
      var hist = doc.history, event, selAfter = doc.sel;
      var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;
  
      // Verify that there is a useable event (so that ctrl-z won't
      // needlessly clear selection events)
      var i = 0;
      for (; i < source.length; i++) {
        event = source[i];
        if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
          { break }
      }
      if (i == source.length) { return }
      hist.lastOrigin = hist.lastSelOrigin = null;
  
      for (;;) {
        event = source.pop();
        if (event.ranges) {
          pushSelectionToHistory(event, dest);
          if (allowSelectionOnly && !event.equals(doc.sel)) {
            setSelection(doc, event, {clearRedo: false});
            return
          }
          selAfter = event;
        } else if (suppress) {
          source.push(event);
          return
        } else { break }
      }
  
      // Build up a reverse change object to add to the opposite history
      // stack (redo when undoing, and vice versa).
      var antiChanges = [];
      pushSelectionToHistory(selAfter, dest);
      dest.push({changes: antiChanges, generation: hist.generation});
      hist.generation = event.generation || ++hist.maxGeneration;
  
      var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");
  
      var loop = function ( i ) {
        var change = event.changes[i];
        change.origin = type;
        if (filter && !filterChange(doc, change, false)) {
          source.length = 0;
          return {}
        }
  
        antiChanges.push(historyChangeFromChange(doc, change));
  
        var after = i ? computeSelAfterChange(doc, change) : lst(source);
        makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
        if (!i && doc.cm) { doc.cm.scrollIntoView({from: change.from, to: changeEnd(change)}); }
        var rebased = [];
  
        // Propagate to the linked documents
        linkedDocs(doc, function (doc, sharedHist) {
          if (!sharedHist && indexOf(rebased, doc.history) == -1) {
            rebaseHist(doc.history, change);
            rebased.push(doc.history);
          }
          makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
        });
      };
  
      for (var i$1 = event.changes.length - 1; i$1 >= 0; --i$1) {
        var returned = loop( i$1 );
  
        if ( returned ) return returned.v;
      }
    }
  
    // Sub-views need their line numbers shifted when text is added
    // above or below them in the parent document.
    function shiftDoc(doc, distance) {
      if (distance == 0) { return }
      doc.first += distance;
      doc.sel = new Selection(map(doc.sel.ranges, function (range) { return new Range(
        Pos(range.anchor.line + distance, range.anchor.ch),
        Pos(range.head.line + distance, range.head.ch)
      ); }), doc.sel.primIndex);
      if (doc.cm) {
        regChange(doc.cm, doc.first, doc.first - distance, distance);
        for (var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
          { regLineChange(doc.cm, l, "gutter"); }
      }
    }
  
    // More lower-level change function, handling only a single document
    // (not linked ones).
    function makeChangeSingleDoc(doc, change, selAfter, spans) {
      if (doc.cm && !doc.cm.curOp)
        { return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans) }
  
      if (change.to.line < doc.first) {
        shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
        return
      }
      if (change.from.line > doc.lastLine()) { return }
  
      // Clip the change to the size of this doc
      if (change.from.line < doc.first) {
        var shift = change.text.length - 1 - (doc.first - change.from.line);
        shiftDoc(doc, shift);
        change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
                  text: [lst(change.text)], origin: change.origin};
      }
      var last = doc.lastLine();
      if (change.to.line > last) {
        change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
                  text: [change.text[0]], origin: change.origin};
      }
  
      change.removed = getBetween(doc, change.from, change.to);
  
      if (!selAfter) { selAfter = computeSelAfterChange(doc, change); }
      if (doc.cm) { makeChangeSingleDocInEditor(doc.cm, change, spans); }
      else { updateDoc(doc, change, spans); }
      setSelectionNoUndo(doc, selAfter, sel_dontScroll);
    }
  
    // Handle the interaction of a change to a document with the editor
    // that this document is part of.
    function makeChangeSingleDocInEditor(cm, change, spans) {
      var doc = cm.doc, display = cm.display, from = change.from, to = change.to;
  
      var recomputeMaxLength = false, checkWidthStart = from.line;
      if (!cm.options.lineWrapping) {
        checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
        doc.iter(checkWidthStart, to.line + 1, function (line) {
          if (line == display.maxLine) {
            recomputeMaxLength = true;
            return true
          }
        });
      }
  
      if (doc.sel.contains(change.from, change.to) > -1)
        { signalCursorActivity(cm); }
  
      updateDoc(doc, change, spans, estimateHeight(cm));
  
      if (!cm.options.lineWrapping) {
        doc.iter(checkWidthStart, from.line + change.text.length, function (line) {
          var len = lineLength(line);
          if (len > display.maxLineLength) {
            display.maxLine = line;
            display.maxLineLength = len;
            display.maxLineChanged = true;
            recomputeMaxLength = false;
          }
        });
        if (recomputeMaxLength) { cm.curOp.updateMaxLine = true; }
      }
  
      retreatFrontier(doc, from.line);
      startWorker(cm, 400);
  
      var lendiff = change.text.length - (to.line - from.line) - 1;
      // Remember that these lines changed, for updating the display
      if (change.full)
        { regChange(cm); }
      else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change))
        { regLineChange(cm, from.line, "text"); }
      else
        { regChange(cm, from.line, to.line + 1, lendiff); }
  
      var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
      if (changeHandler || changesHandler) {
        var obj = {
          from: from, to: to,
          text: change.text,
          removed: change.removed,
          origin: change.origin
        };
        if (changeHandler) { signalLater(cm, "change", cm, obj); }
        if (changesHandler) { (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj); }
      }
      cm.display.selForContextMenu = null;
    }
  
    function replaceRange(doc, code, from, to, origin) {
      var assign;
  
      if (!to) { to = from; }
      if (cmp(to, from) < 0) { (assign = [to, from], from = assign[0], to = assign[1]); }
      if (typeof code == "string") { code = doc.splitLines(code); }
      makeChange(doc, {from: from, to: to, text: code, origin: origin});
    }
  
    // Rebasing/resetting history to deal with externally-sourced changes
  
    function rebaseHistSelSingle(pos, from, to, diff) {
      if (to < pos.line) {
        pos.line += diff;
      } else if (from < pos.line) {
        pos.line = from;
        pos.ch = 0;
      }
    }
  
    // Tries to rebase an array of history events given a change in the
    // document. If the change touches the same lines as the event, the
    // event, and everything 'behind' it, is discarded. If the change is
    // before the event, the event's positions are updated. Uses a
    // copy-on-write scheme for the positions, to avoid having to
    // reallocate them all on every rebase, but also avoid problems with
    // shared position objects being unsafely updated.
    function rebaseHistArray(array, from, to, diff) {
      for (var i = 0; i < array.length; ++i) {
        var sub = array[i], ok = true;
        if (sub.ranges) {
          if (!sub.copied) { sub = array[i] = sub.deepCopy(); sub.copied = true; }
          for (var j = 0; j < sub.ranges.length; j++) {
            rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
            rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
          }
          continue
        }
        for (var j$1 = 0; j$1 < sub.changes.length; ++j$1) {
          var cur = sub.changes[j$1];
          if (to < cur.from.line) {
            cur.from = Pos(cur.from.line + diff, cur.from.ch);
            cur.to = Pos(cur.to.line + diff, cur.to.ch);
          } else if (from <= cur.to.line) {
            ok = false;
            break
          }
        }
        if (!ok) {
          array.splice(0, i + 1);
          i = 0;
        }
      }
    }
  
    function rebaseHist(hist, change) {
      var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
      rebaseHistArray(hist.done, from, to, diff);
      rebaseHistArray(hist.undone, from, to, diff);
    }
  
    // Utility for applying a change to a line by handle or number,
    // returning the number and optionally registering the line as
    // changed.
    function changeLine(doc, handle, changeType, op) {
      var no = handle, line = handle;
      if (typeof handle == "number") { line = getLine(doc, clipLine(doc, handle)); }
      else { no = lineNo(handle); }
      if (no == null) { return null }
      if (op(line, no) && doc.cm) { regLineChange(doc.cm, no, changeType); }
      return line
    }
  
    // The document is represented as a BTree consisting of leaves, with
    // chunk of lines in them, and branches, with up to ten leaves or
    // other branch nodes below them. The top node is always a branch
    // node, and is the document object itself (meaning it has
    // additional methods and properties).
    //
    // All nodes have parent links. The tree is used both to go from
    // line numbers to line objects, and to go from objects to numbers.
    // It also indexes by height, and is used to convert between height
    // and line object, and to find the total height of the document.
    //
    // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html
  
    function LeafChunk(lines) {
      var this$1 = this;
  
      this.lines = lines;
      this.parent = null;
      var height = 0;
      for (var i = 0; i < lines.length; ++i) {
        lines[i].parent = this$1;
        height += lines[i].height;
      }
      this.height = height;
    }
  
    LeafChunk.prototype = {
      chunkSize: function() { return this.lines.length },
  
      // Remove the n lines at offset 'at'.
      removeInner: function(at, n) {
        var this$1 = this;
  
        for (var i = at, e = at + n; i < e; ++i) {
          var line = this$1.lines[i];
          this$1.height -= line.height;
          cleanUpLine(line);
          signalLater(line, "delete");
        }
        this.lines.splice(at, n);
      },
  
      // Helper used to collapse a small branch into a single leaf.
      collapse: function(lines) {
        lines.push.apply(lines, this.lines);
      },
  
      // Insert the given array of lines at offset 'at', count them as
      // having the given height.
      insertInner: function(at, lines, height) {
        var this$1 = this;
  
        this.height += height;
        this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
        for (var i = 0; i < lines.length; ++i) { lines[i].parent = this$1; }
      },
  
      // Used to iterate over a part of the tree.
      iterN: function(at, n, op) {
        var this$1 = this;
  
        for (var e = at + n; at < e; ++at)
          { if (op(this$1.lines[at])) { return true } }
      }
    };
  
    function BranchChunk(children) {
      var this$1 = this;
  
      this.children = children;
      var size = 0, height = 0;
      for (var i = 0; i < children.length; ++i) {
        var ch = children[i];
        size += ch.chunkSize(); height += ch.height;
        ch.parent = this$1;
      }
      this.size = size;
      this.height = height;
      this.parent = null;
    }
  
    BranchChunk.prototype = {
      chunkSize: function() { return this.size },
  
      removeInner: function(at, n) {
        var this$1 = this;
  
        this.size -= n;
        for (var i = 0; i < this.children.length; ++i) {
          var child = this$1.children[i], sz = child.chunkSize();
          if (at < sz) {
            var rm = Math.min(n, sz - at), oldHeight = child.height;
            child.removeInner(at, rm);
            this$1.height -= oldHeight - child.height;
            if (sz == rm) { this$1.children.splice(i--, 1); child.parent = null; }
            if ((n -= rm) == 0) { break }
            at = 0;
          } else { at -= sz; }
        }
        // If the result is smaller than 25 lines, ensure that it is a
        // single leaf node.
        if (this.size - n < 25 &&
            (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
          var lines = [];
          this.collapse(lines);
          this.children = [new LeafChunk(lines)];
          this.children[0].parent = this;
        }
      },
  
      collapse: function(lines) {
        var this$1 = this;
  
        for (var i = 0; i < this.children.length; ++i) { this$1.children[i].collapse(lines); }
      },
  
      insertInner: function(at, lines, height) {
        var this$1 = this;
  
        this.size += lines.length;
        this.height += height;
        for (var i = 0; i < this.children.length; ++i) {
          var child = this$1.children[i], sz = child.chunkSize();
          if (at <= sz) {
            child.insertInner(at, lines, height);
            if (child.lines && child.lines.length > 50) {
              // To avoid memory thrashing when child.lines is huge (e.g. first view of a large file), it's never spliced.
              // Instead, small slices are taken. They're taken in order because sequential memory accesses are fastest.
              var remaining = child.lines.length % 25 + 25;
              for (var pos = remaining; pos < child.lines.length;) {
                var leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                child.height -= leaf.height;
                this$1.children.splice(++i, 0, leaf);
                leaf.parent = this$1;
              }
              child.lines = child.lines.slice(0, remaining);
              this$1.maybeSpill();
            }
            break
          }
          at -= sz;
        }
      },
  
      // When a node has grown, check whether it should be split.
      maybeSpill: function() {
        if (this.children.length <= 10) { return }
        var me = this;
        do {
          var spilled = me.children.splice(me.children.length - 5, 5);
          var sibling = new BranchChunk(spilled);
          if (!me.parent) { // Become the parent node
            var copy = new BranchChunk(me.children);
            copy.parent = me;
            me.children = [copy, sibling];
            me = copy;
         } else {
            me.size -= sibling.size;
            me.height -= sibling.height;
            var myIndex = indexOf(me.parent.children, me);
            me.parent.children.splice(myIndex + 1, 0, sibling);
          }
          sibling.parent = me.parent;
        } while (me.children.length > 10)
        me.parent.maybeSpill();
      },
  
      iterN: function(at, n, op) {
        var this$1 = this;
  
        for (var i = 0; i < this.children.length; ++i) {
          var child = this$1.children[i], sz = child.chunkSize();
          if (at < sz) {
            var used = Math.min(n, sz - at);
            if (child.iterN(at, used, op)) { return true }
            if ((n -= used) == 0) { break }
            at = 0;
          } else { at -= sz; }
        }
      }
    };
  
    // Line widgets are block elements displayed above or below a line.
  
    var LineWidget = function(doc, node, options) {
      var this$1 = this;
  
      if (options) { for (var opt in options) { if (options.hasOwnProperty(opt))
        { this$1[opt] = options[opt]; } } }
      this.doc = doc;
      this.node = node;
    };
  
    LineWidget.prototype.clear = function () {
        var this$1 = this;
  
      var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
      if (no == null || !ws) { return }
      for (var i = 0; i < ws.length; ++i) { if (ws[i] == this$1) { ws.splice(i--, 1); } }
      if (!ws.length) { line.widgets = null; }
      var height = widgetHeight(this);
      updateLineHeight(line, Math.max(0, line.height - height));
      if (cm) {
        runInOp(cm, function () {
          adjustScrollWhenAboveVisible(cm, line, -height);
          regLineChange(cm, no, "widget");
        });
        signalLater(cm, "lineWidgetCleared", cm, this, no);
      }
    };
  
    LineWidget.prototype.changed = function () {
        var this$1 = this;
  
      var oldH = this.height, cm = this.doc.cm, line = this.line;
      this.height = null;
      var diff = widgetHeight(this) - oldH;
      if (!diff) { return }
      if (!lineIsHidden(this.doc, line)) { updateLineHeight(line, line.height + diff); }
      if (cm) {
        runInOp(cm, function () {
          cm.curOp.forceUpdate = true;
          adjustScrollWhenAboveVisible(cm, line, diff);
          signalLater(cm, "lineWidgetChanged", cm, this$1, lineNo(line));
        });
      }
    };
    eventMixin(LineWidget);
  
    function adjustScrollWhenAboveVisible(cm, line, diff) {
      if (heightAtLine(line) < ((cm.curOp && cm.curOp.scrollTop) || cm.doc.scrollTop))
        { addToScrollTop(cm, diff); }
    }
  
    function addLineWidget(doc, handle, node, options) {
      var widget = new LineWidget(doc, node, options);
      var cm = doc.cm;
      if (cm && widget.noHScroll) { cm.display.alignWidgets = true; }
      changeLine(doc, handle, "widget", function (line) {
        var widgets = line.widgets || (line.widgets = []);
        if (widget.insertAt == null) { widgets.push(widget); }
        else { widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget); }
        widget.line = line;
        if (cm && !lineIsHidden(doc, line)) {
          var aboveVisible = heightAtLine(line) < doc.scrollTop;
          updateLineHeight(line, line.height + widgetHeight(widget));
          if (aboveVisible) { addToScrollTop(cm, widget.height); }
          cm.curOp.forceUpdate = true;
        }
        return true
      });
      if (cm) { signalLater(cm, "lineWidgetAdded", cm, widget, typeof handle == "number" ? handle : lineNo(handle)); }
      return widget
    }
  
    // TEXTMARKERS
  
    // Created with markText and setBookmark methods. A TextMarker is a
    // handle that can be used to clear or find a marked position in the
    // document. Line objects hold arrays (markedSpans) containing
    // {from, to, marker} object pointing to such marker objects, and
    // indicating that such a marker is present on that line. Multiple
    // lines may point to the same marker when it spans across lines.
    // The spans will have null for their from/to properties when the
    // marker continues beyond the start/end of the line. Markers have
    // links back to the lines they currently touch.
  
    // Collapsed markers have unique ids, in order to be able to order
    // them, which is needed for uniquely determining an outer marker
    // when they overlap (they may nest, but not partially overlap).
    var nextMarkerId = 0;
  
    var TextMarker = function(doc, type) {
      this.lines = [];
      this.type = type;
      this.doc = doc;
      this.id = ++nextMarkerId;
    };
  
    // Clear the marker.
    TextMarker.prototype.clear = function () {
        var this$1 = this;
  
      if (this.explicitlyCleared) { return }
      var cm = this.doc.cm, withOp = cm && !cm.curOp;
      if (withOp) { startOperation(cm); }
      if (hasHandler(this, "clear")) {
        var found = this.find();
        if (found) { signalLater(this, "clear", found.from, found.to); }
      }
      var min = null, max = null;
      for (var i = 0; i < this.lines.length; ++i) {
        var line = this$1.lines[i];
        var span = getMarkedSpanFor(line.markedSpans, this$1);
        if (cm && !this$1.collapsed) { regLineChange(cm, lineNo(line), "text"); }
        else if (cm) {
          if (span.to != null) { max = lineNo(line); }
          if (span.from != null) { min = lineNo(line); }
        }
        line.markedSpans = removeMarkedSpan(line.markedSpans, span);
        if (span.from == null && this$1.collapsed && !lineIsHidden(this$1.doc, line) && cm)
          { updateLineHeight(line, textHeight(cm.display)); }
      }
      if (cm && this.collapsed && !cm.options.lineWrapping) { for (var i$1 = 0; i$1 < this.lines.length; ++i$1) {
        var visual = visualLine(this$1.lines[i$1]), len = lineLength(visual);
        if (len > cm.display.maxLineLength) {
          cm.display.maxLine = visual;
          cm.display.maxLineLength = len;
          cm.display.maxLineChanged = true;
        }
      } }
  
      if (min != null && cm && this.collapsed) { regChange(cm, min, max + 1); }
      this.lines.length = 0;
      this.explicitlyCleared = true;
      if (this.atomic && this.doc.cantEdit) {
        this.doc.cantEdit = false;
        if (cm) { reCheckSelection(cm.doc); }
      }
      if (cm) { signalLater(cm, "markerCleared", cm, this, min, max); }
      if (withOp) { endOperation(cm); }
      if (this.parent) { this.parent.clear(); }
    };
  
    // Find the position of the marker in the document. Returns a {from,
    // to} object by default. Side can be passed to get a specific side
    // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
    // Pos objects returned contain a line object, rather than a line
    // number (used to prevent looking up the same line twice).
    TextMarker.prototype.find = function (side, lineObj) {
        var this$1 = this;
  
      if (side == null && this.type == "bookmark") { side = 1; }
      var from, to;
      for (var i = 0; i < this.lines.length; ++i) {
        var line = this$1.lines[i];
        var span = getMarkedSpanFor(line.markedSpans, this$1);
        if (span.from != null) {
          from = Pos(lineObj ? line : lineNo(line), span.from);
          if (side == -1) { return from }
        }
        if (span.to != null) {
          to = Pos(lineObj ? line : lineNo(line), span.to);
          if (side == 1) { return to }
        }
      }
      return from && {from: from, to: to}
    };
  
    // Signals that the marker's widget changed, and surrounding layout
    // should be recomputed.
    TextMarker.prototype.changed = function () {
        var this$1 = this;
  
      var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
      if (!pos || !cm) { return }
      runInOp(cm, function () {
        var line = pos.line, lineN = lineNo(pos.line);
        var view = findViewForLine(cm, lineN);
        if (view) {
          clearLineMeasurementCacheFor(view);
          cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
        }
        cm.curOp.updateMaxLine = true;
        if (!lineIsHidden(widget.doc, line) && widget.height != null) {
          var oldHeight = widget.height;
          widget.height = null;
          var dHeight = widgetHeight(widget) - oldHeight;
          if (dHeight)
            { updateLineHeight(line, line.height + dHeight); }
        }
        signalLater(cm, "markerChanged", cm, this$1);
      });
    };
  
    TextMarker.prototype.attachLine = function (line) {
      if (!this.lines.length && this.doc.cm) {
        var op = this.doc.cm.curOp;
        if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
          { (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this); }
      }
      this.lines.push(line);
    };
  
    TextMarker.prototype.detachLine = function (line) {
      this.lines.splice(indexOf(this.lines, line), 1);
      if (!this.lines.length && this.doc.cm) {
        var op = this.doc.cm.curOp
        ;(op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
      }
    };
    eventMixin(TextMarker);
  
    // Create a marker, wire it up to the right lines, and
    function markText(doc, from, to, options, type) {
      // Shared markers (across linked documents) are handled separately
      // (markTextShared will call out to this again, once per
      // document).
      if (options && options.shared) { return markTextShared(doc, from, to, options, type) }
      // Ensure we are in an operation.
      if (doc.cm && !doc.cm.curOp) { return operation(doc.cm, markText)(doc, from, to, options, type) }
  
      var marker = new TextMarker(doc, type), diff = cmp(from, to);
      if (options) { copyObj(options, marker, false); }
      // Don't connect empty markers unless clearWhenEmpty is false
      if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
        { return marker }
      if (marker.replacedWith) {
        // Showing up as a widget implies collapsed (widget replaces text)
        marker.collapsed = true;
        marker.widgetNode = eltP("span", [marker.replacedWith], "CodeMirror-widget");
        if (!options.handleMouseEvents) { marker.widgetNode.setAttribute("cm-ignore-events", "true"); }
        if (options.insertLeft) { marker.widgetNode.insertLeft = true; }
      }
      if (marker.collapsed) {
        if (conflictingCollapsedRange(doc, from.line, from, to, marker) ||
            from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker))
          { throw new Error("Inserting collapsed marker partially overlapping an existing one") }
        seeCollapsedSpans();
      }
  
      if (marker.addToHistory)
        { addChangeToHistory(doc, {from: from, to: to, origin: "markText"}, doc.sel, NaN); }
  
      var curLine = from.line, cm = doc.cm, updateMaxLine;
      doc.iter(curLine, to.line + 1, function (line) {
        if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine)
          { updateMaxLine = true; }
        if (marker.collapsed && curLine != from.line) { updateLineHeight(line, 0); }
        addMarkedSpan(line, new MarkedSpan(marker,
                                           curLine == from.line ? from.ch : null,
                                           curLine == to.line ? to.ch : null));
        ++curLine;
      });
      // lineIsHidden depends on the presence of the spans, so needs a second pass
      if (marker.collapsed) { doc.iter(from.line, to.line + 1, function (line) {
        if (lineIsHidden(doc, line)) { updateLineHeight(line, 0); }
      }); }
  
      if (marker.clearOnEnter) { on(marker, "beforeCursorEnter", function () { return marker.clear(); }); }
  
      if (marker.readOnly) {
        seeReadOnlySpans();
        if (doc.history.done.length || doc.history.undone.length)
          { doc.clearHistory(); }
      }
      if (marker.collapsed) {
        marker.id = ++nextMarkerId;
        marker.atomic = true;
      }
      if (cm) {
        // Sync editor state
        if (updateMaxLine) { cm.curOp.updateMaxLine = true; }
        if (marker.collapsed)
          { regChange(cm, from.line, to.line + 1); }
        else if (marker.className || marker.startStyle || marker.endStyle || marker.css ||
                 marker.attributes || marker.title)
          { for (var i = from.line; i <= to.line; i++) { regLineChange(cm, i, "text"); } }
        if (marker.atomic) { reCheckSelection(cm.doc); }
        signalLater(cm, "markerAdded", cm, marker);
      }
      return marker
    }
  
    // SHARED TEXTMARKERS
  
    // A shared marker spans multiple linked documents. It is
    // implemented as a meta-marker-object controlling multiple normal
    // markers.
    var SharedTextMarker = function(markers, primary) {
      var this$1 = this;
  
      this.markers = markers;
      this.primary = primary;
      for (var i = 0; i < markers.length; ++i)
        { markers[i].parent = this$1; }
    };
  
    SharedTextMarker.prototype.clear = function () {
        var this$1 = this;
  
      if (this.explicitlyCleared) { return }
      this.explicitlyCleared = true;
      for (var i = 0; i < this.markers.length; ++i)
        { this$1.markers[i].clear(); }
      signalLater(this, "clear");
    };
  
    SharedTextMarker.prototype.find = function (side, lineObj) {
      return this.primary.find(side, lineObj)
    };
    eventMixin(SharedTextMarker);
  
    function markTextShared(doc, from, to, options, type) {
      options = copyObj(options);
      options.shared = false;
      var markers = [markText(doc, from, to, options, type)], primary = markers[0];
      var widget = options.widgetNode;
      linkedDocs(doc, function (doc) {
        if (widget) { options.widgetNode = widget.cloneNode(true); }
        markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
        for (var i = 0; i < doc.linked.length; ++i)
          { if (doc.linked[i].isParent) { return } }
        primary = lst(markers);
      });
      return new SharedTextMarker(markers, primary)
    }
  
    function findSharedMarkers(doc) {
      return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())), function (m) { return m.parent; })
    }
  
    function copySharedMarkers(doc, markers) {
      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i], pos = marker.find();
        var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
        if (cmp(mFrom, mTo)) {
          var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
          marker.markers.push(subMark);
          subMark.parent = marker;
        }
      }
    }
  
    function detachSharedMarkers(markers) {
      var loop = function ( i ) {
        var marker = markers[i], linked = [marker.primary.doc];
        linkedDocs(marker.primary.doc, function (d) { return linked.push(d); });
        for (var j = 0; j < marker.markers.length; j++) {
          var subMarker = marker.markers[j];
          if (indexOf(linked, subMarker.doc) == -1) {
            subMarker.parent = null;
            marker.markers.splice(j--, 1);
          }
        }
      };
  
      for (var i = 0; i < markers.length; i++) loop( i );
    }
  
    var nextDocId = 0;
    var Doc = function(text, mode, firstLine, lineSep, direction) {
      if (!(this instanceof Doc)) { return new Doc(text, mode, firstLine, lineSep, direction) }
      if (firstLine == null) { firstLine = 0; }
  
      BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
      this.first = firstLine;
      this.scrollTop = this.scrollLeft = 0;
      this.cantEdit = false;
      this.cleanGeneration = 1;
      this.modeFrontier = this.highlightFrontier = firstLine;
      var start = Pos(firstLine, 0);
      this.sel = simpleSelection(start);
      this.history = new History(null);
      this.id = ++nextDocId;
      this.modeOption = mode;
      this.lineSep = lineSep;
      this.direction = (direction == "rtl") ? "rtl" : "ltr";
      this.extend = false;
  
      if (typeof text == "string") { text = this.splitLines(text); }
      updateDoc(this, {from: start, to: start, text: text});
      setSelection(this, simpleSelection(start), sel_dontScroll);
    };
  
    Doc.prototype = createObj(BranchChunk.prototype, {
      constructor: Doc,
      // Iterate over the document. Supports two forms -- with only one
      // argument, it calls that for each line in the document. With
      // three, it iterates over the range given by the first two (with
      // the second being non-inclusive).
      iter: function(from, to, op) {
        if (op) { this.iterN(from - this.first, to - from, op); }
        else { this.iterN(this.first, this.first + this.size, from); }
      },
  
      // Non-public interface for adding and removing lines.
      insert: function(at, lines) {
        var height = 0;
        for (var i = 0; i < lines.length; ++i) { height += lines[i].height; }
        this.insertInner(at - this.first, lines, height);
      },
      remove: function(at, n) { this.removeInner(at - this.first, n); },
  
      // From here, the methods are part of the public interface. Most
      // are also available from CodeMirror (editor) instances.
  
      getValue: function(lineSep) {
        var lines = getLines(this, this.first, this.first + this.size);
        if (lineSep === false) { return lines }
        return lines.join(lineSep || this.lineSeparator())
      },
      setValue: docMethodOp(function(code) {
        var top = Pos(this.first, 0), last = this.first + this.size - 1;
        makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
                          text: this.splitLines(code), origin: "setValue", full: true}, true);
        if (this.cm) { scrollToCoords(this.cm, 0, 0); }
        setSelection(this, simpleSelection(top), sel_dontScroll);
      }),
      replaceRange: function(code, from, to, origin) {
        from = clipPos(this, from);
        to = to ? clipPos(this, to) : from;
        replaceRange(this, code, from, to, origin);
      },
      getRange: function(from, to, lineSep) {
        var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
        if (lineSep === false) { return lines }
        return lines.join(lineSep || this.lineSeparator())
      },
  
      getLine: function(line) {var l = this.getLineHandle(line); return l && l.text},
  
      getLineHandle: function(line) {if (isLine(this, line)) { return getLine(this, line) }},
      getLineNumber: function(line) {return lineNo(line)},
  
      getLineHandleVisualStart: function(line) {
        if (typeof line == "number") { line = getLine(this, line); }
        return visualLine(line)
      },
  
      lineCount: function() {return this.size},
      firstLine: function() {return this.first},
      lastLine: function() {return this.first + this.size - 1},
  
      clipPos: function(pos) {return clipPos(this, pos)},
  
      getCursor: function(start) {
        var range$$1 = this.sel.primary(), pos;
        if (start == null || start == "head") { pos = range$$1.head; }
        else if (start == "anchor") { pos = range$$1.anchor; }
        else if (start == "end" || start == "to" || start === false) { pos = range$$1.to(); }
        else { pos = range$$1.from(); }
        return pos
      },
      listSelections: function() { return this.sel.ranges },
      somethingSelected: function() {return this.sel.somethingSelected()},
  
      setCursor: docMethodOp(function(line, ch, options) {
        setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
      }),
      setSelection: docMethodOp(function(anchor, head, options) {
        setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
      }),
      extendSelection: docMethodOp(function(head, other, options) {
        extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
      }),
      extendSelections: docMethodOp(function(heads, options) {
        extendSelections(this, clipPosArray(this, heads), options);
      }),
      extendSelectionsBy: docMethodOp(function(f, options) {
        var heads = map(this.sel.ranges, f);
        extendSelections(this, clipPosArray(this, heads), options);
      }),
      setSelections: docMethodOp(function(ranges, primary, options) {
        var this$1 = this;
  
        if (!ranges.length) { return }
        var out = [];
        for (var i = 0; i < ranges.length; i++)
          { out[i] = new Range(clipPos(this$1, ranges[i].anchor),
                             clipPos(this$1, ranges[i].head)); }
        if (primary == null) { primary = Math.min(ranges.length - 1, this.sel.primIndex); }
        setSelection(this, normalizeSelection(this.cm, out, primary), options);
      }),
      addSelection: docMethodOp(function(anchor, head, options) {
        var ranges = this.sel.ranges.slice(0);
        ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
        setSelection(this, normalizeSelection(this.cm, ranges, ranges.length - 1), options);
      }),
  
      getSelection: function(lineSep) {
        var this$1 = this;
  
        var ranges = this.sel.ranges, lines;
        for (var i = 0; i < ranges.length; i++) {
          var sel = getBetween(this$1, ranges[i].from(), ranges[i].to());
          lines = lines ? lines.concat(sel) : sel;
        }
        if (lineSep === false) { return lines }
        else { return lines.join(lineSep || this.lineSeparator()) }
      },
      getSelections: function(lineSep) {
        var this$1 = this;
  
        var parts = [], ranges = this.sel.ranges;
        for (var i = 0; i < ranges.length; i++) {
          var sel = getBetween(this$1, ranges[i].from(), ranges[i].to());
          if (lineSep !== false) { sel = sel.join(lineSep || this$1.lineSeparator()); }
          parts[i] = sel;
        }
        return parts
      },
      replaceSelection: function(code, collapse, origin) {
        var dup = [];
        for (var i = 0; i < this.sel.ranges.length; i++)
          { dup[i] = code; }
        this.replaceSelections(dup, collapse, origin || "+input");
      },
      replaceSelections: docMethodOp(function(code, collapse, origin) {
        var this$1 = this;
  
        var changes = [], sel = this.sel;
        for (var i = 0; i < sel.ranges.length; i++) {
          var range$$1 = sel.ranges[i];
          changes[i] = {from: range$$1.from(), to: range$$1.to(), text: this$1.splitLines(code[i]), origin: origin};
        }
        var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
        for (var i$1 = changes.length - 1; i$1 >= 0; i$1--)
          { makeChange(this$1, changes[i$1]); }
        if (newSel) { setSelectionReplaceHistory(this, newSel); }
        else if (this.cm) { ensureCursorVisible(this.cm); }
      }),
      undo: docMethodOp(function() {makeChangeFromHistory(this, "undo");}),
      redo: docMethodOp(function() {makeChangeFromHistory(this, "redo");}),
      undoSelection: docMethodOp(function() {makeChangeFromHistory(this, "undo", true);}),
      redoSelection: docMethodOp(function() {makeChangeFromHistory(this, "redo", true);}),
  
      setExtending: function(val) {this.extend = val;},
      getExtending: function() {return this.extend},
  
      historySize: function() {
        var hist = this.history, done = 0, undone = 0;
        for (var i = 0; i < hist.done.length; i++) { if (!hist.done[i].ranges) { ++done; } }
        for (var i$1 = 0; i$1 < hist.undone.length; i$1++) { if (!hist.undone[i$1].ranges) { ++undone; } }
        return {undo: done, redo: undone}
      },
      clearHistory: function() {this.history = new History(this.history.maxGeneration);},
  
      markClean: function() {
        this.cleanGeneration = this.changeGeneration(true);
      },
      changeGeneration: function(forceSplit) {
        if (forceSplit)
          { this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null; }
        return this.history.generation
      },
      isClean: function (gen) {
        return this.history.generation == (gen || this.cleanGeneration)
      },
  
      getHistory: function() {
        return {done: copyHistoryArray(this.history.done),
                undone: copyHistoryArray(this.history.undone)}
      },
      setHistory: function(histData) {
        var hist = this.history = new History(this.history.maxGeneration);
        hist.done = copyHistoryArray(histData.done.slice(0), null, true);
        hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
      },
  
      setGutterMarker: docMethodOp(function(line, gutterID, value) {
        return changeLine(this, line, "gutter", function (line) {
          var markers = line.gutterMarkers || (line.gutterMarkers = {});
          markers[gutterID] = value;
          if (!value && isEmpty(markers)) { line.gutterMarkers = null; }
          return true
        })
      }),
  
      clearGutter: docMethodOp(function(gutterID) {
        var this$1 = this;
  
        this.iter(function (line) {
          if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
            changeLine(this$1, line, "gutter", function () {
              line.gutterMarkers[gutterID] = null;
              if (isEmpty(line.gutterMarkers)) { line.gutterMarkers = null; }
              return true
            });
          }
        });
      }),
  
      lineInfo: function(line) {
        var n;
        if (typeof line == "number") {
          if (!isLine(this, line)) { return null }
          n = line;
          line = getLine(this, line);
          if (!line) { return null }
        } else {
          n = lineNo(line);
          if (n == null) { return null }
        }
        return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
                textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
                widgets: line.widgets}
      },
  
      addLineClass: docMethodOp(function(handle, where, cls) {
        return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function (line) {
          var prop = where == "text" ? "textClass"
                   : where == "background" ? "bgClass"
                   : where == "gutter" ? "gutterClass" : "wrapClass";
          if (!line[prop]) { line[prop] = cls; }
          else if (classTest(cls).test(line[prop])) { return false }
          else { line[prop] += " " + cls; }
          return true
        })
      }),
      removeLineClass: docMethodOp(function(handle, where, cls) {
        return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function (line) {
          var prop = where == "text" ? "textClass"
                   : where == "background" ? "bgClass"
                   : where == "gutter" ? "gutterClass" : "wrapClass";
          var cur = line[prop];
          if (!cur) { return false }
          else if (cls == null) { line[prop] = null; }
          else {
            var found = cur.match(classTest(cls));
            if (!found) { return false }
            var end = found.index + found[0].length;
            line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
          }
          return true
        })
      }),
  
      addLineWidget: docMethodOp(function(handle, node, options) {
        return addLineWidget(this, handle, node, options)
      }),
      removeLineWidget: function(widget) { widget.clear(); },
  
      markText: function(from, to, options) {
        return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range")
      },
      setBookmark: function(pos, options) {
        var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
                        insertLeft: options && options.insertLeft,
                        clearWhenEmpty: false, shared: options && options.shared,
                        handleMouseEvents: options && options.handleMouseEvents};
        pos = clipPos(this, pos);
        return markText(this, pos, pos, realOpts, "bookmark")
      },
      findMarksAt: function(pos) {
        pos = clipPos(this, pos);
        var markers = [], spans = getLine(this, pos.line).markedSpans;
        if (spans) { for (var i = 0; i < spans.length; ++i) {
          var span = spans[i];
          if ((span.from == null || span.from <= pos.ch) &&
              (span.to == null || span.to >= pos.ch))
            { markers.push(span.marker.parent || span.marker); }
        } }
        return markers
      },
      findMarks: function(from, to, filter) {
        from = clipPos(this, from); to = clipPos(this, to);
        var found = [], lineNo$$1 = from.line;
        this.iter(from.line, to.line + 1, function (line) {
          var spans = line.markedSpans;
          if (spans) { for (var i = 0; i < spans.length; i++) {
            var span = spans[i];
            if (!(span.to != null && lineNo$$1 == from.line && from.ch >= span.to ||
                  span.from == null && lineNo$$1 != from.line ||
                  span.from != null && lineNo$$1 == to.line && span.from >= to.ch) &&
                (!filter || filter(span.marker)))
              { found.push(span.marker.parent || span.marker); }
          } }
          ++lineNo$$1;
        });
        return found
      },
      getAllMarks: function() {
        var markers = [];
        this.iter(function (line) {
          var sps = line.markedSpans;
          if (sps) { for (var i = 0; i < sps.length; ++i)
            { if (sps[i].from != null) { markers.push(sps[i].marker); } } }
        });
        return markers
      },
  
      posFromIndex: function(off) {
        var ch, lineNo$$1 = this.first, sepSize = this.lineSeparator().length;
        this.iter(function (line) {
          var sz = line.text.length + sepSize;
          if (sz > off) { ch = off; return true }
          off -= sz;
          ++lineNo$$1;
        });
        return clipPos(this, Pos(lineNo$$1, ch))
      },
      indexFromPos: function (coords) {
        coords = clipPos(this, coords);
        var index = coords.ch;
        if (coords.line < this.first || coords.ch < 0) { return 0 }
        var sepSize = this.lineSeparator().length;
        this.iter(this.first, coords.line, function (line) { // iter aborts when callback returns a truthy value
          index += line.text.length + sepSize;
        });
        return index
      },
  
      copy: function(copyHistory) {
        var doc = new Doc(getLines(this, this.first, this.first + this.size),
                          this.modeOption, this.first, this.lineSep, this.direction);
        doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
        doc.sel = this.sel;
        doc.extend = false;
        if (copyHistory) {
          doc.history.undoDepth = this.history.undoDepth;
          doc.setHistory(this.getHistory());
        }
        return doc
      },
  
      linkedDoc: function(options) {
        if (!options) { options = {}; }
        var from = this.first, to = this.first + this.size;
        if (options.from != null && options.from > from) { from = options.from; }
        if (options.to != null && options.to < to) { to = options.to; }
        var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
        if (options.sharedHist) { copy.history = this.history
        ; }(this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
        copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
        copySharedMarkers(copy, findSharedMarkers(this));
        return copy
      },
      unlinkDoc: function(other) {
        var this$1 = this;
  
        if (other instanceof CodeMirror) { other = other.doc; }
        if (this.linked) { for (var i = 0; i < this.linked.length; ++i) {
          var link = this$1.linked[i];
          if (link.doc != other) { continue }
          this$1.linked.splice(i, 1);
          other.unlinkDoc(this$1);
          detachSharedMarkers(findSharedMarkers(this$1));
          break
        } }
        // If the histories were shared, split them again
        if (other.history == this.history) {
          var splitIds = [other.id];
          linkedDocs(other, function (doc) { return splitIds.push(doc.id); }, true);
          other.history = new History(null);
          other.history.done = copyHistoryArray(this.history.done, splitIds);
          other.history.undone = copyHistoryArray(this.history.undone, splitIds);
        }
      },
      iterLinkedDocs: function(f) {linkedDocs(this, f);},
  
      getMode: function() {return this.mode},
      getEditor: function() {return this.cm},
  
      splitLines: function(str) {
        if (this.lineSep) { return str.split(this.lineSep) }
        return splitLinesAuto(str)
      },
      lineSeparator: function() { return this.lineSep || "\n" },
  
      setDirection: docMethodOp(function (dir) {
        if (dir != "rtl") { dir = "ltr"; }
        if (dir == this.direction) { return }
        this.direction = dir;
        this.iter(function (line) { return line.order = null; });
        if (this.cm) { directionChanged(this.cm); }
      })
    });
  
    // Public alias.
    Doc.prototype.eachLine = Doc.prototype.iter;
  
    // Kludge to work around strange IE behavior where it'll sometimes
    // re-fire a series of drag-related events right after the drop (#1551)
    var lastDrop = 0;
  
    function onDrop(e) {
      var cm = this;
      clearDragCursor(cm);
      if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e))
        { return }
      e_preventDefault(e);
      if (ie) { lastDrop = +new Date; }
      var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
      if (!pos || cm.isReadOnly()) { return }
      // Might be a file drop, in which case we simply extract the text
      // and insert it.
      if (files && files.length && window.FileReader && window.File) {
        var n = files.length, text = Array(n), read = 0;
        var loadFile = function (file, i) {
          if (cm.options.allowDropFileTypes &&
              indexOf(cm.options.allowDropFileTypes, file.type) == -1)
            { return }
  
          var reader = new FileReader;
          reader.onload = operation(cm, function () {
            var content = reader.result;
            if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) { content = ""; }
            text[i] = content;
            if (++read == n) {
              pos = clipPos(cm.doc, pos);
              var change = {from: pos, to: pos,
                            text: cm.doc.splitLines(text.join(cm.doc.lineSeparator())),
                            origin: "paste"};
              makeChange(cm.doc, change);
              setSelectionReplaceHistory(cm.doc, simpleSelection(pos, changeEnd(change)));
            }
          });
          reader.readAsText(file);
        };
        for (var i = 0; i < n; ++i) { loadFile(files[i], i); }
      } else { // Normal drop
        // Don't do a replace if the drop happened inside of the selected text.
        if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
          cm.state.draggingText(e);
          // Ensure the editor is re-focused
          setTimeout(function () { return cm.display.input.focus(); }, 20);
          return
        }
        try {
          var text$1 = e.dataTransfer.getData("Text");
          if (text$1) {
            var selected;
            if (cm.state.draggingText && !cm.state.draggingText.copy)
              { selected = cm.listSelections(); }
            setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
            if (selected) { for (var i$1 = 0; i$1 < selected.length; ++i$1)
              { replaceRange(cm.doc, "", selected[i$1].anchor, selected[i$1].head, "drag"); } }
            cm.replaceSelection(text$1, "around", "paste");
            cm.display.input.focus();
          }
        }
        catch(e){}
      }
    }
  
    function onDragStart(cm, e) {
      if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return }
      if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) { return }
  
      e.dataTransfer.setData("Text", cm.getSelection());
      e.dataTransfer.effectAllowed = "copyMove";
  
      // Use dummy image instead of default browsers image.
      // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
      if (e.dataTransfer.setDragImage && !safari) {
        var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
        img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        if (presto) {
          img.width = img.height = 1;
          cm.display.wrapper.appendChild(img);
          // Force a relayout, or Opera won't use our image for some obscure reason
          img._top = img.offsetTop;
        }
        e.dataTransfer.setDragImage(img, 0, 0);
        if (presto) { img.parentNode.removeChild(img); }
      }
    }
  
    function onDragOver(cm, e) {
      var pos = posFromMouse(cm, e);
      if (!pos) { return }
      var frag = document.createDocumentFragment();
      drawSelectionCursor(cm, pos, frag);
      if (!cm.display.dragCursor) {
        cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
        cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
      }
      removeChildrenAndAdd(cm.display.dragCursor, frag);
    }
  
    function clearDragCursor(cm) {
      if (cm.display.dragCursor) {
        cm.display.lineSpace.removeChild(cm.display.dragCursor);
        cm.display.dragCursor = null;
      }
    }
  
    // These must be handled carefully, because naively registering a
    // handler for each editor will cause the editors to never be
    // garbage collected.
  
    function forEachCodeMirror(f) {
      if (!document.getElementsByClassName) { return }
      var byClass = document.getElementsByClassName("CodeMirror"), editors = [];
      for (var i = 0; i < byClass.length; i++) {
        var cm = byClass[i].CodeMirror;
        if (cm) { editors.push(cm); }
      }
      if (editors.length) { editors[0].operation(function () {
        for (var i = 0; i < editors.length; i++) { f(editors[i]); }
      }); }
    }
  
    var globalsRegistered = false;
    function ensureGlobalHandlers() {
      if (globalsRegistered) { return }
      registerGlobalHandlers();
      globalsRegistered = true;
    }
    function registerGlobalHandlers() {
      // When the window resizes, we need to refresh active editors.
      var resizeTimer;
      on(window, "resize", function () {
        if (resizeTimer == null) { resizeTimer = setTimeout(function () {
          resizeTimer = null;
          forEachCodeMirror(onResize);
        }, 100); }
      });
      // When the window loses focus, we want to show the editor as blurred
      on(window, "blur", function () { return forEachCodeMirror(onBlur); });
    }
    // Called when the window resizes
    function onResize(cm) {
      var d = cm.display;
      // Might be a text scaling operation, clear size caches.
      d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
      d.scrollbarsClipped = false;
      cm.setSize();
    }
  
    var keyNames = {
      3: "Pause", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
      19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
      36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
      46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod",
      106: "*", 107: "=", 109: "-", 110: ".", 111: "/", 127: "Delete", 145: "ScrollLock",
      173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
      221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
      63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"
    };
  
    // Number keys
    for (var i = 0; i < 10; i++) { keyNames[i + 48] = keyNames[i + 96] = String(i); }
    // Alphabetic keys
    for (var i$1 = 65; i$1 <= 90; i$1++) { keyNames[i$1] = String.fromCharCode(i$1); }
    // Function keys
    for (var i$2 = 1; i$2 <= 12; i$2++) { keyNames[i$2 + 111] = keyNames[i$2 + 63235] = "F" + i$2; }
  
    var keyMap = {};
  
    keyMap.basic = {
      "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
      "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
      "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
      "Tab": "defaultTab", "Shift-Tab": "indentAuto",
      "Enter": "newlineAndIndent", "Insert": "toggleOverwrite",
      "Esc": "singleSelection"
    };
    // Note that the save and find-related commands aren't defined by
    // default. User code or addons can define them. Unknown commands
    // are simply ignored.
    keyMap.pcDefault = {
      "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
      "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown",
      "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
      "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
      "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
      "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
      "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
      "fallthrough": "basic"
    };
    // Very basic readline/emacs-style bindings, which are standard on Mac.
    keyMap.emacsy = {
      "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
      "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
      "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
      "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars",
      "Ctrl-O": "openLine"
    };
    keyMap.macDefault = {
      "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
      "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
      "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore",
      "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
      "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
      "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight",
      "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd",
      "fallthrough": ["basic", "emacsy"]
    };
    keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
  
    // KEYMAP DISPATCH
  
    function normalizeKeyName(name) {
      var parts = name.split(/-(?!$)/);
      name = parts[parts.length - 1];
      var alt, ctrl, shift, cmd;
      for (var i = 0; i < parts.length - 1; i++) {
        var mod = parts[i];
        if (/^(cmd|meta|m)$/i.test(mod)) { cmd = true; }
        else if (/^a(lt)?$/i.test(mod)) { alt = true; }
        else if (/^(c|ctrl|control)$/i.test(mod)) { ctrl = true; }
        else if (/^s(hift)?$/i.test(mod)) { shift = true; }
        else { throw new Error("Unrecognized modifier name: " + mod) }
      }
      if (alt) { name = "Alt-" + name; }
      if (ctrl) { name = "Ctrl-" + name; }
      if (cmd) { name = "Cmd-" + name; }
      if (shift) { name = "Shift-" + name; }
      return name
    }
  
    // This is a kludge to keep keymaps mostly working as raw objects
    // (backwards compatibility) while at the same time support features
    // like normalization and multi-stroke key bindings. It compiles a
    // new normalized keymap, and then updates the old object to reflect
    // this.
    function normalizeKeyMap(keymap) {
      var copy = {};
      for (var keyname in keymap) { if (keymap.hasOwnProperty(keyname)) {
        var value = keymap[keyname];
        if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) { continue }
        if (value == "...") { delete keymap[keyname]; continue }
  
        var keys = map(keyname.split(" "), normalizeKeyName);
        for (var i = 0; i < keys.length; i++) {
          var val = (void 0), name = (void 0);
          if (i == keys.length - 1) {
            name = keys.join(" ");
            val = value;
          } else {
            name = keys.slice(0, i + 1).join(" ");
            val = "...";
          }
          var prev = copy[name];
          if (!prev) { copy[name] = val; }
          else if (prev != val) { throw new Error("Inconsistent bindings for " + name) }
        }
        delete keymap[keyname];
      } }
      for (var prop in copy) { keymap[prop] = copy[prop]; }
      return keymap
    }
  
    function lookupKey(key, map$$1, handle, context) {
      map$$1 = getKeyMap(map$$1);
      var found = map$$1.call ? map$$1.call(key, context) : map$$1[key];
      if (found === false) { return "nothing" }
      if (found === "...") { return "multi" }
      if (found != null && handle(found)) { return "handled" }
  
      if (map$$1.fallthrough) {
        if (Object.prototype.toString.call(map$$1.fallthrough) != "[object Array]")
          { return lookupKey(key, map$$1.fallthrough, handle, context) }
        for (var i = 0; i < map$$1.fallthrough.length; i++) {
          var result = lookupKey(key, map$$1.fallthrough[i], handle, context);
          if (result) { return result }
        }
      }
    }
  
    // Modifier key presses don't count as 'real' key presses for the
    // purpose of keymap fallthrough.
    function isModifierKey(value) {
      var name = typeof value == "string" ? value : keyNames[value.keyCode];
      return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod"
    }
  
    function addModifierNames(name, event, noShift) {
      var base = name;
      if (event.altKey && base != "Alt") { name = "Alt-" + name; }
      if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") { name = "Ctrl-" + name; }
      if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Cmd") { name = "Cmd-" + name; }
      if (!noShift && event.shiftKey && base != "Shift") { name = "Shift-" + name; }
      return name
    }
  
    // Look up the name of a key as indicated by an event object.
    function keyName(event, noShift) {
      if (presto && event.keyCode == 34 && event["char"]) { return false }
      var name = keyNames[event.keyCode];
      if (name == null || event.altGraphKey) { return false }
      // Ctrl-ScrollLock has keyCode 3, same as Ctrl-Pause,
      // so we'll use event.code when available (Chrome 48+, FF 38+, Safari 10.1+)
      if (event.keyCode == 3 && event.code) { name = event.code; }
      return addModifierNames(name, event, noShift)
    }
  
    function getKeyMap(val) {
      return typeof val == "string" ? keyMap[val] : val
    }
  
    // Helper for deleting text near the selection(s), used to implement
    // backspace, delete, and similar functionality.
    function deleteNearSelection(cm, compute) {
      var ranges = cm.doc.sel.ranges, kill = [];
      // Build up a set of ranges to kill first, merging overlapping
      // ranges.
      for (var i = 0; i < ranges.length; i++) {
        var toKill = compute(ranges[i]);
        while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
          var replaced = kill.pop();
          if (cmp(replaced.from, toKill.from) < 0) {
            toKill.from = replaced.from;
            break
          }
        }
        kill.push(toKill);
      }
      // Next, remove those actual ranges.
      runInOp(cm, function () {
        for (var i = kill.length - 1; i >= 0; i--)
          { replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete"); }
        ensureCursorVisible(cm);
      });
    }
  
    function moveCharLogically(line, ch, dir) {
      var target = skipExtendingChars(line.text, ch + dir, dir);
      return target < 0 || target > line.text.length ? null : target
    }
  
    function moveLogically(line, start, dir) {
      var ch = moveCharLogically(line, start.ch, dir);
      return ch == null ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before")
    }
  
    function endOfLine(visually, cm, lineObj, lineNo, dir) {
      if (visually) {
        var order = getOrder(lineObj, cm.doc.direction);
        if (order) {
          var part = dir < 0 ? lst(order) : order[0];
          var moveInStorageOrder = (dir < 0) == (part.level == 1);
          var sticky = moveInStorageOrder ? "after" : "before";
          var ch;
          // With a wrapped rtl chunk (possibly spanning multiple bidi parts),
          // it could be that the last bidi part is not on the last visual line,
          // since visual lines contain content order-consecutive chunks.
          // Thus, in rtl, we are looking for the first (content-order) character
          // in the rtl chunk that is on the last line (that is, the same line
          // as the last (content-order) character).
          if (part.level > 0 || cm.doc.direction == "rtl") {
            var prep = prepareMeasureForLine(cm, lineObj);
            ch = dir < 0 ? lineObj.text.length - 1 : 0;
            var targetTop = measureCharPrepared(cm, prep, ch).top;
            ch = findFirst(function (ch) { return measureCharPrepared(cm, prep, ch).top == targetTop; }, (dir < 0) == (part.level == 1) ? part.from : part.to - 1, ch);
            if (sticky == "before") { ch = moveCharLogically(lineObj, ch, 1); }
          } else { ch = dir < 0 ? part.to : part.from; }
          return new Pos(lineNo, ch, sticky)
        }
      }
      return new Pos(lineNo, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after")
    }
  
    function moveVisually(cm, line, start, dir) {
      var bidi = getOrder(line, cm.doc.direction);
      if (!bidi) { return moveLogically(line, start, dir) }
      if (start.ch >= line.text.length) {
        start.ch = line.text.length;
        start.sticky = "before";
      } else if (start.ch <= 0) {
        start.ch = 0;
        start.sticky = "after";
      }
      var partPos = getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
      if (cm.doc.direction == "ltr" && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
        // Case 1: We move within an ltr part in an ltr editor. Even with wrapped lines,
        // nothing interesting happens.
        return moveLogically(line, start, dir)
      }
  
      var mv = function (pos, dir) { return moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir); };
      var prep;
      var getWrappedLineExtent = function (ch) {
        if (!cm.options.lineWrapping) { return {begin: 0, end: line.text.length} }
        prep = prep || prepareMeasureForLine(cm, line);
        return wrappedLineExtentChar(cm, line, prep, ch)
      };
      var wrappedLineExtent = getWrappedLineExtent(start.sticky == "before" ? mv(start, -1) : start.ch);
  
      if (cm.doc.direction == "rtl" || part.level == 1) {
        var moveInStorageOrder = (part.level == 1) == (dir < 0);
        var ch = mv(start, moveInStorageOrder ? 1 : -1);
        if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent.begin : ch <= part.to && ch <= wrappedLineExtent.end)) {
          // Case 2: We move within an rtl part or in an rtl editor on the same visual line
          var sticky = moveInStorageOrder ? "before" : "after";
          return new Pos(start.line, ch, sticky)
        }
      }
  
      // Case 3: Could not move within this bidi part in this visual line, so leave
      // the current bidi part
  
      var searchInVisualLine = function (partPos, dir, wrappedLineExtent) {
        var getRes = function (ch, moveInStorageOrder) { return moveInStorageOrder
          ? new Pos(start.line, mv(ch, 1), "before")
          : new Pos(start.line, ch, "after"); };
  
        for (; partPos >= 0 && partPos < bidi.length; partPos += dir) {
          var part = bidi[partPos];
          var moveInStorageOrder = (dir > 0) == (part.level != 1);
          var ch = moveInStorageOrder ? wrappedLineExtent.begin : mv(wrappedLineExtent.end, -1);
          if (part.from <= ch && ch < part.to) { return getRes(ch, moveInStorageOrder) }
          ch = moveInStorageOrder ? part.from : mv(part.to, -1);
          if (wrappedLineExtent.begin <= ch && ch < wrappedLineExtent.end) { return getRes(ch, moveInStorageOrder) }
        }
      };
  
      // Case 3a: Look for other bidi parts on the same visual line
      var res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent);
      if (res) { return res }
  
      // Case 3b: Look for other bidi parts on the next visual line
      var nextCh = dir > 0 ? wrappedLineExtent.end : mv(wrappedLineExtent.begin, -1);
      if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
        res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
        if (res) { return res }
      }
  
      // Case 4: Nowhere to move
      return null
    }
  
    // Commands are parameter-less actions that can be performed on an
    // editor, mostly used for keybindings.
    var commands = {
      selectAll: selectAll,
      singleSelection: function (cm) { return cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll); },
      killLine: function (cm) { return deleteNearSelection(cm, function (range) {
        if (range.empty()) {
          var len = getLine(cm.doc, range.head.line).text.length;
          if (range.head.ch == len && range.head.line < cm.lastLine())
            { return {from: range.head, to: Pos(range.head.line + 1, 0)} }
          else
            { return {from: range.head, to: Pos(range.head.line, len)} }
        } else {
          return {from: range.from(), to: range.to()}
        }
      }); },
      deleteLine: function (cm) { return deleteNearSelection(cm, function (range) { return ({
        from: Pos(range.from().line, 0),
        to: clipPos(cm.doc, Pos(range.to().line + 1, 0))
      }); }); },
      delLineLeft: function (cm) { return deleteNearSelection(cm, function (range) { return ({
        from: Pos(range.from().line, 0), to: range.from()
      }); }); },
      delWrappedLineLeft: function (cm) { return deleteNearSelection(cm, function (range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var leftPos = cm.coordsChar({left: 0, top: top}, "div");
        return {from: leftPos, to: range.from()}
      }); },
      delWrappedLineRight: function (cm) { return deleteNearSelection(cm, function (range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var rightPos = cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
        return {from: range.from(), to: rightPos }
      }); },
      undo: function (cm) { return cm.undo(); },
      redo: function (cm) { return cm.redo(); },
      undoSelection: function (cm) { return cm.undoSelection(); },
      redoSelection: function (cm) { return cm.redoSelection(); },
      goDocStart: function (cm) { return cm.extendSelection(Pos(cm.firstLine(), 0)); },
      goDocEnd: function (cm) { return cm.extendSelection(Pos(cm.lastLine())); },
      goLineStart: function (cm) { return cm.extendSelectionsBy(function (range) { return lineStart(cm, range.head.line); },
        {origin: "+move", bias: 1}
      ); },
      goLineStartSmart: function (cm) { return cm.extendSelectionsBy(function (range) { return lineStartSmart(cm, range.head); },
        {origin: "+move", bias: 1}
      ); },
      goLineEnd: function (cm) { return cm.extendSelectionsBy(function (range) { return lineEnd(cm, range.head.line); },
        {origin: "+move", bias: -1}
      ); },
      goLineRight: function (cm) { return cm.extendSelectionsBy(function (range) {
        var top = cm.cursorCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div")
      }, sel_move); },
      goLineLeft: function (cm) { return cm.extendSelectionsBy(function (range) {
        var top = cm.cursorCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: 0, top: top}, "div")
      }, sel_move); },
      goLineLeftSmart: function (cm) { return cm.extendSelectionsBy(function (range) {
        var top = cm.cursorCoords(range.head, "div").top + 5;
        var pos = cm.coordsChar({left: 0, top: top}, "div");
        if (pos.ch < cm.getLine(pos.line).search(/\S/)) { return lineStartSmart(cm, range.head) }
        return pos
      }, sel_move); },
      goLineUp: function (cm) { return cm.moveV(-1, "line"); },
      goLineDown: function (cm) { return cm.moveV(1, "line"); },
      goPageUp: function (cm) { return cm.moveV(-1, "page"); },
      goPageDown: function (cm) { return cm.moveV(1, "page"); },
      goCharLeft: function (cm) { return cm.moveH(-1, "char"); },
      goCharRight: function (cm) { return cm.moveH(1, "char"); },
      goColumnLeft: function (cm) { return cm.moveH(-1, "column"); },
      goColumnRight: function (cm) { return cm.moveH(1, "column"); },
      goWordLeft: function (cm) { return cm.moveH(-1, "word"); },
      goGroupRight: function (cm) { return cm.moveH(1, "group"); },
      goGroupLeft: function (cm) { return cm.moveH(-1, "group"); },
      goWordRight: function (cm) { return cm.moveH(1, "word"); },
      delCharBefore: function (cm) { return cm.deleteH(-1, "char"); },
      delCharAfter: function (cm) { return cm.deleteH(1, "char"); },
      delWordBefore: function (cm) { return cm.deleteH(-1, "word"); },
      delWordAfter: function (cm) { return cm.deleteH(1, "word"); },
      delGroupBefore: function (cm) { return cm.deleteH(-1, "group"); },
      delGroupAfter: function (cm) { return cm.deleteH(1, "group"); },
      indentAuto: function (cm) { return cm.indentSelection("smart"); },
      indentMore: function (cm) { return cm.indentSelection("add"); },
      indentLess: function (cm) { return cm.indentSelection("subtract"); },
      insertTab: function (cm) { return cm.replaceSelection("\t"); },
      insertSoftTab: function (cm) {
        var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
        for (var i = 0; i < ranges.length; i++) {
          var pos = ranges[i].from();
          var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
          spaces.push(spaceStr(tabSize - col % tabSize));
        }
        cm.replaceSelections(spaces);
      },
      defaultTab: function (cm) {
        if (cm.somethingSelected()) { cm.indentSelection("add"); }
        else { cm.execCommand("insertTab"); }
      },
      // Swap the two chars left and right of each selection's head.
      // Move cursor behind the two swapped characters afterwards.
      //
      // Doesn't consider line feeds a character.
      // Doesn't scan more than one line above to find a character.
      // Doesn't do anything on an empty line.
      // Doesn't do anything with non-empty selections.
      transposeChars: function (cm) { return runInOp(cm, function () {
        var ranges = cm.listSelections(), newSel = [];
        for (var i = 0; i < ranges.length; i++) {
          if (!ranges[i].empty()) { continue }
          var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
          if (line) {
            if (cur.ch == line.length) { cur = new Pos(cur.line, cur.ch - 1); }
            if (cur.ch > 0) {
              cur = new Pos(cur.line, cur.ch + 1);
              cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
                              Pos(cur.line, cur.ch - 2), cur, "+transpose");
            } else if (cur.line > cm.doc.first) {
              var prev = getLine(cm.doc, cur.line - 1).text;
              if (prev) {
                cur = new Pos(cur.line, 1);
                cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() +
                                prev.charAt(prev.length - 1),
                                Pos(cur.line - 1, prev.length - 1), cur, "+transpose");
              }
            }
          }
          newSel.push(new Range(cur, cur));
        }
        cm.setSelections(newSel);
      }); },
      newlineAndIndent: function (cm) { return runInOp(cm, function () {
        var sels = cm.listSelections();
        for (var i = sels.length - 1; i >= 0; i--)
          { cm.replaceRange(cm.doc.lineSeparator(), sels[i].anchor, sels[i].head, "+input"); }
        sels = cm.listSelections();
        for (var i$1 = 0; i$1 < sels.length; i$1++)
          { cm.indentLine(sels[i$1].from().line, null, true); }
        ensureCursorVisible(cm);
      }); },
      openLine: function (cm) { return cm.replaceSelection("\n", "start"); },
      toggleOverwrite: function (cm) { return cm.toggleOverwrite(); }
    };
  
  
    function lineStart(cm, lineN) {
      var line = getLine(cm.doc, lineN);
      var visual = visualLine(line);
      if (visual != line) { lineN = lineNo(visual); }
      return endOfLine(true, cm, visual, lineN, 1)
    }
    function lineEnd(cm, lineN) {
      var line = getLine(cm.doc, lineN);
      var visual = visualLineEnd(line);
      if (visual != line) { lineN = lineNo(visual); }
      return endOfLine(true, cm, line, lineN, -1)
    }
    function lineStartSmart(cm, pos) {
      var start = lineStart(cm, pos.line);
      var line = getLine(cm.doc, start.line);
      var order = getOrder(line, cm.doc.direction);
      if (!order || order[0].level == 0) {
        var firstNonWS = Math.max(0, line.text.search(/\S/));
        var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
        return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky)
      }
      return start
    }
  
    // Run a handler that was bound to a key.
    function doHandleBinding(cm, bound, dropShift) {
      if (typeof bound == "string") {
        bound = commands[bound];
        if (!bound) { return false }
      }
      // Ensure previous input has been read, so that the handler sees a
      // consistent view of the document
      cm.display.input.ensurePolled();
      var prevShift = cm.display.shift, done = false;
      try {
        if (cm.isReadOnly()) { cm.state.suppressEdits = true; }
        if (dropShift) { cm.display.shift = false; }
        done = bound(cm) != Pass;
      } finally {
        cm.display.shift = prevShift;
        cm.state.suppressEdits = false;
      }
      return done
    }
  
    function lookupKeyForEditor(cm, name, handle) {
      for (var i = 0; i < cm.state.keyMaps.length; i++) {
        var result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
        if (result) { return result }
      }
      return (cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm))
        || lookupKey(name, cm.options.keyMap, handle, cm)
    }
  
    // Note that, despite the name, this function is also used to check
    // for bound mouse clicks.
  
    var stopSeq = new Delayed;
  
    function dispatchKey(cm, name, e, handle) {
      var seq = cm.state.keySeq;
      if (seq) {
        if (isModifierKey(name)) { return "handled" }
        if (/\'$/.test(name))
          { cm.state.keySeq = null; }
        else
          { stopSeq.set(50, function () {
            if (cm.state.keySeq == seq) {
              cm.state.keySeq = null;
              cm.display.input.reset();
            }
          }); }
        if (dispatchKeyInner(cm, seq + " " + name, e, handle)) { return true }
      }
      return dispatchKeyInner(cm, name, e, handle)
    }
  
    function dispatchKeyInner(cm, name, e, handle) {
      var result = lookupKeyForEditor(cm, name, handle);
  
      if (result == "multi")
        { cm.state.keySeq = name; }
      if (result == "handled")
        { signalLater(cm, "keyHandled", cm, name, e); }
  
      if (result == "handled" || result == "multi") {
        e_preventDefault(e);
        restartBlink(cm);
      }
  
      return !!result
    }
  
    // Handle a key from the keydown event.
    function handleKeyBinding(cm, e) {
      var name = keyName(e, true);
      if (!name) { return false }
  
      if (e.shiftKey && !cm.state.keySeq) {
        // First try to resolve full name (including 'Shift-'). Failing
        // that, see if there is a cursor-motion command (starting with
        // 'go') bound to the keyname without 'Shift-'.
        return dispatchKey(cm, "Shift-" + name, e, function (b) { return doHandleBinding(cm, b, true); })
            || dispatchKey(cm, name, e, function (b) {
                 if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
                   { return doHandleBinding(cm, b) }
               })
      } else {
        return dispatchKey(cm, name, e, function (b) { return doHandleBinding(cm, b); })
      }
    }
  
    // Handle a key from the keypress event
    function handleCharBinding(cm, e, ch) {
      return dispatchKey(cm, "'" + ch + "'", e, function (b) { return doHandleBinding(cm, b, true); })
    }
  
    var lastStoppedKey = null;
    function onKeyDown(e) {
      var cm = this;
      cm.curOp.focus = activeElt();
      if (signalDOMEvent(cm, e)) { return }
      // IE does strange things with escape.
      if (ie && ie_version < 11 && e.keyCode == 27) { e.returnValue = false; }
      var code = e.keyCode;
      cm.display.shift = code == 16 || e.shiftKey;
      var handled = handleKeyBinding(cm, e);
      if (presto) {
        lastStoppedKey = handled ? code : null;
        // Opera has no cut event... we try to at least catch the key combo
        if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
          { cm.replaceSelection("", null, "cut"); }
      }
  
      // Turn mouse into crosshair when Alt is held on Mac.
      if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
        { showCrossHair(cm); }
    }
  
    function showCrossHair(cm) {
      var lineDiv = cm.display.lineDiv;
      addClass(lineDiv, "CodeMirror-crosshair");
  
      function up(e) {
        if (e.keyCode == 18 || !e.altKey) {
          rmClass(lineDiv, "CodeMirror-crosshair");
          off(document, "keyup", up);
          off(document, "mouseover", up);
        }
      }
      on(document, "keyup", up);
      on(document, "mouseover", up);
    }
  
    function onKeyUp(e) {
      if (e.keyCode == 16) { this.doc.sel.shift = false; }
      signalDOMEvent(this, e);
    }
  
    function onKeyPress(e) {
      var cm = this;
      if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) { return }
      var keyCode = e.keyCode, charCode = e.charCode;
      if (presto && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return}
      if ((presto && (!e.which || e.which < 10)) && handleKeyBinding(cm, e)) { return }
      var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
      // Some browsers fire keypress events for backspace
      if (ch == "\x08") { return }
      if (handleCharBinding(cm, e, ch)) { return }
      cm.display.input.onKeyPress(e);
    }
  
    var DOUBLECLICK_DELAY = 400;
  
    var PastClick = function(time, pos, button) {
      this.time = time;
      this.pos = pos;
      this.button = button;
    };
  
    PastClick.prototype.compare = function (time, pos, button) {
      return this.time + DOUBLECLICK_DELAY > time &&
        cmp(pos, this.pos) == 0 && button == this.button
    };
  
    var lastClick, lastDoubleClick;
    function clickRepeat(pos, button) {
      var now = +new Date;
      if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
        lastClick = lastDoubleClick = null;
        return "triple"
      } else if (lastClick && lastClick.compare(now, pos, button)) {
        lastDoubleClick = new PastClick(now, pos, button);
        lastClick = null;
        return "double"
      } else {
        lastClick = new PastClick(now, pos, button);
        lastDoubleClick = null;
        return "single"
      }
    }
  
    // A mouse down can be a single click, double click, triple click,
    // start of selection drag, start of text drag, new cursor
    // (ctrl-click), rectangle drag (alt-drag), or xwin
    // middle-click-paste. Or it might be a click on something we should
    // not interfere with, such as a scrollbar or widget.
    function onMouseDown(e) {
      var cm = this, display = cm.display;
      if (signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch()) { return }
      display.input.ensurePolled();
      display.shift = e.shiftKey;
  
      if (eventInWidget(display, e)) {
        if (!webkit) {
          // Briefly turn off draggability, to allow widgets to do
          // normal dragging things.
          display.scroller.draggable = false;
          setTimeout(function () { return display.scroller.draggable = true; }, 100);
        }
        return
      }
      if (clickInGutter(cm, e)) { return }
      var pos = posFromMouse(cm, e), button = e_button(e), repeat = pos ? clickRepeat(pos, button) : "single";
      window.focus();
  
      // #3261: make sure, that we're not starting a second selection
      if (button == 1 && cm.state.selectingText)
        { cm.state.selectingText(e); }
  
      if (pos && handleMappedButton(cm, button, pos, repeat, e)) { return }
  
      if (button == 1) {
        if (pos) { leftButtonDown(cm, pos, repeat, e); }
        else if (e_target(e) == display.scroller) { e_preventDefault(e); }
      } else if (button == 2) {
        if (pos) { extendSelection(cm.doc, pos); }
        setTimeout(function () { return display.input.focus(); }, 20);
      } else if (button == 3) {
        if (captureRightClick) { cm.display.input.onContextMenu(e); }
        else { delayBlurEvent(cm); }
      }
    }
  
    function handleMappedButton(cm, button, pos, repeat, event) {
      var name = "Click";
      if (repeat == "double") { name = "Double" + name; }
      else if (repeat == "triple") { name = "Triple" + name; }
      name = (button == 1 ? "Left" : button == 2 ? "Middle" : "Right") + name;
  
      return dispatchKey(cm,  addModifierNames(name, event), event, function (bound) {
        if (typeof bound == "string") { bound = commands[bound]; }
        if (!bound) { return false }
        var done = false;
        try {
          if (cm.isReadOnly()) { cm.state.suppressEdits = true; }
          done = bound(cm, pos) != Pass;
        } finally {
          cm.state.suppressEdits = false;
        }
        return done
      })
    }
  
    function configureMouse(cm, repeat, event) {
      var option = cm.getOption("configureMouse");
      var value = option ? option(cm, repeat, event) : {};
      if (value.unit == null) {
        var rect = chromeOS ? event.shiftKey && event.metaKey : event.altKey;
        value.unit = rect ? "rectangle" : repeat == "single" ? "char" : repeat == "double" ? "word" : "line";
      }
      if (value.extend == null || cm.doc.extend) { value.extend = cm.doc.extend || event.shiftKey; }
      if (value.addNew == null) { value.addNew = mac ? event.metaKey : event.ctrlKey; }
      if (value.moveOnDrag == null) { value.moveOnDrag = !(mac ? event.altKey : event.ctrlKey); }
      return value
    }
  
    function leftButtonDown(cm, pos, repeat, event) {
      if (ie) { setTimeout(bind(ensureFocus, cm), 0); }
      else { cm.curOp.focus = activeElt(); }
  
      var behavior = configureMouse(cm, repeat, event);
  
      var sel = cm.doc.sel, contained;
      if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() &&
          repeat == "single" && (contained = sel.contains(pos)) > -1 &&
          (cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) &&
          (cmp(contained.to(), pos) > 0 || pos.xRel < 0))
        { leftButtonStartDrag(cm, event, pos, behavior); }
      else
        { leftButtonSelect(cm, event, pos, behavior); }
    }
  
    // Start a text drag. When it ends, see if any dragging actually
    // happen, and treat as a click if it didn't.
    function leftButtonStartDrag(cm, event, pos, behavior) {
      var display = cm.display, moved = false;
      var dragEnd = operation(cm, function (e) {
        if (webkit) { display.scroller.draggable = false; }
        cm.state.draggingText = false;
        off(display.wrapper.ownerDocument, "mouseup", dragEnd);
        off(display.wrapper.ownerDocument, "mousemove", mouseMove);
        off(display.scroller, "dragstart", dragStart);
        off(display.scroller, "drop", dragEnd);
        if (!moved) {
          e_preventDefault(e);
          if (!behavior.addNew)
            { extendSelection(cm.doc, pos, null, null, behavior.extend); }
          // Work around unexplainable focus problem in IE9 (#2127) and Chrome (#3081)
          if (webkit || ie && ie_version == 9)
            { setTimeout(function () {display.wrapper.ownerDocument.body.focus(); display.input.focus();}, 20); }
          else
            { display.input.focus(); }
        }
      });
      var mouseMove = function(e2) {
        moved = moved || Math.abs(event.clientX - e2.clientX) + Math.abs(event.clientY - e2.clientY) >= 10;
      };
      var dragStart = function () { return moved = true; };
      // Let the drag handler handle this.
      if (webkit) { display.scroller.draggable = true; }
      cm.state.draggingText = dragEnd;
      dragEnd.copy = !behavior.moveOnDrag;
      // IE's approach to draggable
      if (display.scroller.dragDrop) { display.scroller.dragDrop(); }
      on(display.wrapper.ownerDocument, "mouseup", dragEnd);
      on(display.wrapper.ownerDocument, "mousemove", mouseMove);
      on(display.scroller, "dragstart", dragStart);
      on(display.scroller, "drop", dragEnd);
  
      delayBlurEvent(cm);
      setTimeout(function () { return display.input.focus(); }, 20);
    }
  
    function rangeForUnit(cm, pos, unit) {
      if (unit == "char") { return new Range(pos, pos) }
      if (unit == "word") { return cm.findWordAt(pos) }
      if (unit == "line") { return new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0))) }
      var result = unit(cm, pos);
      return new Range(result.from, result.to)
    }
  
    // Normal selection, as opposed to text dragging.
    function leftButtonSelect(cm, event, start, behavior) {
      var display = cm.display, doc = cm.doc;
      e_preventDefault(event);
  
      var ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
      if (behavior.addNew && !behavior.extend) {
        ourIndex = doc.sel.contains(start);
        if (ourIndex > -1)
          { ourRange = ranges[ourIndex]; }
        else
          { ourRange = new Range(start, start); }
      } else {
        ourRange = doc.sel.primary();
        ourIndex = doc.sel.primIndex;
      }
  
      if (behavior.unit == "rectangle") {
        if (!behavior.addNew) { ourRange = new Range(start, start); }
        start = posFromMouse(cm, event, true, true);
        ourIndex = -1;
      } else {
        var range$$1 = rangeForUnit(cm, start, behavior.unit);
        if (behavior.extend)
          { ourRange = extendRange(ourRange, range$$1.anchor, range$$1.head, behavior.extend); }
        else
          { ourRange = range$$1; }
      }
  
      if (!behavior.addNew) {
        ourIndex = 0;
        setSelection(doc, new Selection([ourRange], 0), sel_mouse);
        startSel = doc.sel;
      } else if (ourIndex == -1) {
        ourIndex = ranges.length;
        setSelection(doc, normalizeSelection(cm, ranges.concat([ourRange]), ourIndex),
                     {scroll: false, origin: "*mouse"});
      } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == "char" && !behavior.extend) {
        setSelection(doc, normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0),
                     {scroll: false, origin: "*mouse"});
        startSel = doc.sel;
      } else {
        replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
      }
  
      var lastPos = start;
      function extendTo(pos) {
        if (cmp(lastPos, pos) == 0) { return }
        lastPos = pos;
  
        if (behavior.unit == "rectangle") {
          var ranges = [], tabSize = cm.options.tabSize;
          var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
          var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
          var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
          for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line));
               line <= end; line++) {
            var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
            if (left == right)
              { ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos))); }
            else if (text.length > leftPos)
              { ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize)))); }
          }
          if (!ranges.length) { ranges.push(new Range(start, start)); }
          setSelection(doc, normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex),
                       {origin: "*mouse", scroll: false});
          cm.scrollIntoView(pos);
        } else {
          var oldRange = ourRange;
          var range$$1 = rangeForUnit(cm, pos, behavior.unit);
          var anchor = oldRange.anchor, head;
          if (cmp(range$$1.anchor, anchor) > 0) {
            head = range$$1.head;
            anchor = minPos(oldRange.from(), range$$1.anchor);
          } else {
            head = range$$1.anchor;
            anchor = maxPos(oldRange.to(), range$$1.head);
          }
          var ranges$1 = startSel.ranges.slice(0);
          ranges$1[ourIndex] = bidiSimplify(cm, new Range(clipPos(doc, anchor), head));
          setSelection(doc, normalizeSelection(cm, ranges$1, ourIndex), sel_mouse);
        }
      }
  
      var editorSize = display.wrapper.getBoundingClientRect();
      // Used to ensure timeout re-tries don't fire when another extend
      // happened in the meantime (clearTimeout isn't reliable -- at
      // least on Chrome, the timeouts still happen even when cleared,
      // if the clear happens after their scheduled firing time).
      var counter = 0;
  
      function extend(e) {
        var curCount = ++counter;
        var cur = posFromMouse(cm, e, true, behavior.unit == "rectangle");
        if (!cur) { return }
        if (cmp(cur, lastPos) != 0) {
          cm.curOp.focus = activeElt();
          extendTo(cur);
          var visible = visibleLines(display, doc);
          if (cur.line >= visible.to || cur.line < visible.from)
            { setTimeout(operation(cm, function () {if (counter == curCount) { extend(e); }}), 150); }
        } else {
          var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
          if (outside) { setTimeout(operation(cm, function () {
            if (counter != curCount) { return }
            display.scroller.scrollTop += outside;
            extend(e);
          }), 50); }
        }
      }
  
      function done(e) {
        cm.state.selectingText = false;
        counter = Infinity;
        e_preventDefault(e);
        display.input.focus();
        off(display.wrapper.ownerDocument, "mousemove", move);
        off(display.wrapper.ownerDocument, "mouseup", up);
        doc.history.lastSelOrigin = null;
      }
  
      var move = operation(cm, function (e) {
        if (e.buttons === 0 || !e_button(e)) { done(e); }
        else { extend(e); }
      });
      var up = operation(cm, done);
      cm.state.selectingText = up;
      on(display.wrapper.ownerDocument, "mousemove", move);
      on(display.wrapper.ownerDocument, "mouseup", up);
    }
  
    // Used when mouse-selecting to adjust the anchor to the proper side
    // of a bidi jump depending on the visual position of the head.
    function bidiSimplify(cm, range$$1) {
      var anchor = range$$1.anchor;
      var head = range$$1.head;
      var anchorLine = getLine(cm.doc, anchor.line);
      if (cmp(anchor, head) == 0 && anchor.sticky == head.sticky) { return range$$1 }
      var order = getOrder(anchorLine);
      if (!order) { return range$$1 }
      var index = getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
      if (part.from != anchor.ch && part.to != anchor.ch) { return range$$1 }
      var boundary = index + ((part.from == anchor.ch) == (part.level != 1) ? 0 : 1);
      if (boundary == 0 || boundary == order.length) { return range$$1 }
  
      // Compute the relative visual position of the head compared to the
      // anchor (<0 is to the left, >0 to the right)
      var leftSide;
      if (head.line != anchor.line) {
        leftSide = (head.line - anchor.line) * (cm.doc.direction == "ltr" ? 1 : -1) > 0;
      } else {
        var headIndex = getBidiPartAt(order, head.ch, head.sticky);
        var dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
        if (headIndex == boundary - 1 || headIndex == boundary)
          { leftSide = dir < 0; }
        else
          { leftSide = dir > 0; }
      }
  
      var usePart = order[boundary + (leftSide ? -1 : 0)];
      var from = leftSide == (usePart.level == 1);
      var ch = from ? usePart.from : usePart.to, sticky = from ? "after" : "before";
      return anchor.ch == ch && anchor.sticky == sticky ? range$$1 : new Range(new Pos(anchor.line, ch, sticky), head)
    }
  
  
    // Determines whether an event happened in the gutter, and fires the
    // handlers for the corresponding event.
    function gutterEvent(cm, e, type, prevent) {
      var mX, mY;
      if (e.touches) {
        mX = e.touches[0].clientX;
        mY = e.touches[0].clientY;
      } else {
        try { mX = e.clientX; mY = e.clientY; }
        catch(e) { return false }
      }
      if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) { return false }
      if (prevent) { e_preventDefault(e); }
  
      var display = cm.display;
      var lineBox = display.lineDiv.getBoundingClientRect();
  
      if (mY > lineBox.bottom || !hasHandler(cm, type)) { return e_defaultPrevented(e) }
      mY -= lineBox.top - display.viewOffset;
  
      for (var i = 0; i < cm.options.gutters.length; ++i) {
        var g = display.gutters.childNodes[i];
        if (g && g.getBoundingClientRect().right >= mX) {
          var line = lineAtHeight(cm.doc, mY);
          var gutter = cm.options.gutters[i];
          signal(cm, type, cm, line, gutter, e);
          return e_defaultPrevented(e)
        }
      }
    }
  
    function clickInGutter(cm, e) {
      return gutterEvent(cm, e, "gutterClick", true)
    }
  
    // CONTEXT MENU HANDLING
  
    // To make the context menu work, we need to briefly unhide the
    // textarea (making it as unobtrusive as possible) to let the
    // right-click take effect on it.
    function onContextMenu(cm, e) {
      if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) { return }
      if (signalDOMEvent(cm, e, "contextmenu")) { return }
      if (!captureRightClick) { cm.display.input.onContextMenu(e); }
    }
  
    function contextMenuInGutter(cm, e) {
      if (!hasHandler(cm, "gutterContextMenu")) { return false }
      return gutterEvent(cm, e, "gutterContextMenu", false)
    }
  
    function themeChanged(cm) {
      cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
        cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
      clearCaches(cm);
    }
  
    var Init = {toString: function(){return "CodeMirror.Init"}};
  
    var defaults = {};
    var optionHandlers = {};
  
    function defineOptions(CodeMirror) {
      var optionHandlers = CodeMirror.optionHandlers;
  
      function option(name, deflt, handle, notOnInit) {
        CodeMirror.defaults[name] = deflt;
        if (handle) { optionHandlers[name] =
          notOnInit ? function (cm, val, old) {if (old != Init) { handle(cm, val, old); }} : handle; }
      }
  
      CodeMirror.defineOption = option;
  
      // Passed to option handlers when there is no old value.
      CodeMirror.Init = Init;
  
      // These two are, on init, called from the constructor because they
      // have to be initialized before the editor can start at all.
      option("value", "", function (cm, val) { return cm.setValue(val); }, true);
      option("mode", null, function (cm, val) {
        cm.doc.modeOption = val;
        loadMode(cm);
      }, true);
  
      option("indentUnit", 2, loadMode, true);
      option("indentWithTabs", false);
      option("smartIndent", true);
      option("tabSize", 4, function (cm) {
        resetModeState(cm);
        clearCaches(cm);
        regChange(cm);
      }, true);
  
      option("lineSeparator", null, function (cm, val) {
        cm.doc.lineSep = val;
        if (!val) { return }
        var newBreaks = [], lineNo = cm.doc.first;
        cm.doc.iter(function (line) {
          for (var pos = 0;;) {
            var found = line.text.indexOf(val, pos);
            if (found == -1) { break }
            pos = found + val.length;
            newBreaks.push(Pos(lineNo, found));
          }
          lineNo++;
        });
        for (var i = newBreaks.length - 1; i >= 0; i--)
          { replaceRange(cm.doc, val, newBreaks[i], Pos(newBreaks[i].line, newBreaks[i].ch + val.length)); }
      });
      option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff]/g, function (cm, val, old) {
        cm.state.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
        if (old != Init) { cm.refresh(); }
      });
      option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function (cm) { return cm.refresh(); }, true);
      option("electricChars", true);
      option("inputStyle", mobile ? "contenteditable" : "textarea", function () {
        throw new Error("inputStyle can not (yet) be changed in a running editor") // FIXME
      }, true);
      option("spellcheck", false, function (cm, val) { return cm.getInputField().spellcheck = val; }, true);
      option("autocorrect", false, function (cm, val) { return cm.getInputField().autocorrect = val; }, true);
      option("autocapitalize", false, function (cm, val) { return cm.getInputField().autocapitalize = val; }, true);
      option("rtlMoveVisually", !windows);
      option("wholeLineUpdateBefore", true);
  
      option("theme", "default", function (cm) {
        themeChanged(cm);
        guttersChanged(cm);
      }, true);
      option("keyMap", "default", function (cm, val, old) {
        var next = getKeyMap(val);
        var prev = old != Init && getKeyMap(old);
        if (prev && prev.detach) { prev.detach(cm, next); }
        if (next.attach) { next.attach(cm, prev || null); }
      });
      option("extraKeys", null);
      option("configureMouse", null);
  
      option("lineWrapping", false, wrappingChanged, true);
      option("gutters", [], function (cm) {
        setGuttersForLineNumbers(cm.options);
        guttersChanged(cm);
      }, true);
      option("fixedGutter", true, function (cm, val) {
        cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
        cm.refresh();
      }, true);
      option("coverGutterNextToScrollbar", false, function (cm) { return updateScrollbars(cm); }, true);
      option("scrollbarStyle", "native", function (cm) {
        initScrollbars(cm);
        updateScrollbars(cm);
        cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
        cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
      }, true);
      option("lineNumbers", false, function (cm) {
        setGuttersForLineNumbers(cm.options);
        guttersChanged(cm);
      }, true);
      option("firstLineNumber", 1, guttersChanged, true);
      option("lineNumberFormatter", function (integer) { return integer; }, guttersChanged, true);
      option("showCursorWhenSelecting", false, updateSelection, true);
  
      option("resetSelectionOnContextMenu", true);
      option("lineWiseCopyCut", true);
      option("pasteLinesPerSelection", true);
      option("selectionsMayTouch", false);
  
      option("readOnly", false, function (cm, val) {
        if (val == "nocursor") {
          onBlur(cm);
          cm.display.input.blur();
        }
        cm.display.input.readOnlyChanged(val);
      });
      option("disableInput", false, function (cm, val) {if (!val) { cm.display.input.reset(); }}, true);
      option("dragDrop", true, dragDropChanged);
      option("allowDropFileTypes", null);
  
      option("cursorBlinkRate", 530);
      option("cursorScrollMargin", 0);
      option("cursorHeight", 1, updateSelection, true);
      option("singleCursorHeightPerLine", true, updateSelection, true);
      option("workTime", 100);
      option("workDelay", 100);
      option("flattenSpans", true, resetModeState, true);
      option("addModeClass", false, resetModeState, true);
      option("pollInterval", 100);
      option("undoDepth", 200, function (cm, val) { return cm.doc.history.undoDepth = val; });
      option("historyEventDelay", 1250);
      option("viewportMargin", 10, function (cm) { return cm.refresh(); }, true);
      option("maxHighlightLength", 10000, resetModeState, true);
      option("moveInputWithCursor", true, function (cm, val) {
        if (!val) { cm.display.input.resetPosition(); }
      });
  
      option("tabindex", null, function (cm, val) { return cm.display.input.getField().tabIndex = val || ""; });
      option("autofocus", null);
      option("direction", "ltr", function (cm, val) { return cm.doc.setDirection(val); }, true);
      option("phrases", null);
    }
  
    function guttersChanged(cm) {
      updateGutters(cm);
      regChange(cm);
      alignHorizontally(cm);
    }
  
    function dragDropChanged(cm, value, old) {
      var wasOn = old && old != Init;
      if (!value != !wasOn) {
        var funcs = cm.display.dragFunctions;
        var toggle = value ? on : off;
        toggle(cm.display.scroller, "dragstart", funcs.start);
        toggle(cm.display.scroller, "dragenter", funcs.enter);
        toggle(cm.display.scroller, "dragover", funcs.over);
        toggle(cm.display.scroller, "dragleave", funcs.leave);
        toggle(cm.display.scroller, "drop", funcs.drop);
      }
    }
  
    function wrappingChanged(cm) {
      if (cm.options.lineWrapping) {
        addClass(cm.display.wrapper, "CodeMirror-wrap");
        cm.display.sizer.style.minWidth = "";
        cm.display.sizerWidth = null;
      } else {
        rmClass(cm.display.wrapper, "CodeMirror-wrap");
        findMaxLine(cm);
      }
      estimateLineHeights(cm);
      regChange(cm);
      clearCaches(cm);
      setTimeout(function () { return updateScrollbars(cm); }, 100);
    }
  
    // A CodeMirror instance represents an editor. This is the object
    // that user code is usually dealing with.
  
    function CodeMirror(place, options) {
      var this$1 = this;
  
      if (!(this instanceof CodeMirror)) { return new CodeMirror(place, options) }
  
      this.options = options = options ? copyObj(options) : {};
      // Determine effective options based on given values and defaults.
      copyObj(defaults, options, false);
      setGuttersForLineNumbers(options);
  
      var doc = options.value;
      if (typeof doc == "string") { doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction); }
      else if (options.mode) { doc.modeOption = options.mode; }
      this.doc = doc;
  
      var input = new CodeMirror.inputStyles[options.inputStyle](this);
      var display = this.display = new Display(place, doc, input);
      display.wrapper.CodeMirror = this;
      updateGutters(this);
      themeChanged(this);
      if (options.lineWrapping)
        { this.display.wrapper.className += " CodeMirror-wrap"; }
      initScrollbars(this);
  
      this.state = {
        keyMaps: [],  // stores maps added by addKeyMap
        overlays: [], // highlighting overlays, as added by addOverlay
        modeGen: 0,   // bumped when mode/overlay changes, used to invalidate highlighting info
        overwrite: false,
        delayingBlurEvent: false,
        focused: false,
        suppressEdits: false, // used to disable editing during key handlers when in readOnly mode
        pasteIncoming: -1, cutIncoming: -1, // help recognize paste/cut edits in input.poll
        selectingText: false,
        draggingText: false,
        highlight: new Delayed(), // stores highlight worker timeout
        keySeq: null,  // Unfinished key sequence
        specialChars: null
      };
  
      if (options.autofocus && !mobile) { display.input.focus(); }
  
      // Override magic textarea content restore that IE sometimes does
      // on our hidden textarea on reload
      if (ie && ie_version < 11) { setTimeout(function () { return this$1.display.input.reset(true); }, 20); }
  
      registerEventHandlers(this);
      ensureGlobalHandlers();
  
      startOperation(this);
      this.curOp.forceUpdate = true;
      attachDoc(this, doc);
  
      if ((options.autofocus && !mobile) || this.hasFocus())
        { setTimeout(bind(onFocus, this), 20); }
      else
        { onBlur(this); }
  
      for (var opt in optionHandlers) { if (optionHandlers.hasOwnProperty(opt))
        { optionHandlers[opt](this$1, options[opt], Init); } }
      maybeUpdateLineNumberWidth(this);
      if (options.finishInit) { options.finishInit(this); }
      for (var i = 0; i < initHooks.length; ++i) { initHooks[i](this$1); }
      endOperation(this);
      // Suppress optimizelegibility in Webkit, since it breaks text
      // measuring on line wrapping boundaries.
      if (webkit && options.lineWrapping &&
          getComputedStyle(display.lineDiv).textRendering == "optimizelegibility")
        { display.lineDiv.style.textRendering = "auto"; }
    }
  
    // The default configuration options.
    CodeMirror.defaults = defaults;
    // Functions to run when options are changed.
    CodeMirror.optionHandlers = optionHandlers;
  
    // Attach the necessary event handlers when initializing the editor
    function registerEventHandlers(cm) {
      var d = cm.display;
      on(d.scroller, "mousedown", operation(cm, onMouseDown));
      // Older IE's will not fire a second mousedown for a double click
      if (ie && ie_version < 11)
        { on(d.scroller, "dblclick", operation(cm, function (e) {
          if (signalDOMEvent(cm, e)) { return }
          var pos = posFromMouse(cm, e);
          if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) { return }
          e_preventDefault(e);
          var word = cm.findWordAt(pos);
          extendSelection(cm.doc, word.anchor, word.head);
        })); }
      else
        { on(d.scroller, "dblclick", function (e) { return signalDOMEvent(cm, e) || e_preventDefault(e); }); }
      // Some browsers fire contextmenu *after* opening the menu, at
      // which point we can't mess with it anymore. Context menu is
      // handled in onMouseDown for these browsers.
      on(d.scroller, "contextmenu", function (e) { return onContextMenu(cm, e); });
  
      // Used to suppress mouse event handling when a touch happens
      var touchFinished, prevTouch = {end: 0};
      function finishTouch() {
        if (d.activeTouch) {
          touchFinished = setTimeout(function () { return d.activeTouch = null; }, 1000);
          prevTouch = d.activeTouch;
          prevTouch.end = +new Date;
        }
      }
      function isMouseLikeTouchEvent(e) {
        if (e.touches.length != 1) { return false }
        var touch = e.touches[0];
        return touch.radiusX <= 1 && touch.radiusY <= 1
      }
      function farAway(touch, other) {
        if (other.left == null) { return true }
        var dx = other.left - touch.left, dy = other.top - touch.top;
        return dx * dx + dy * dy > 20 * 20
      }
      on(d.scroller, "touchstart", function (e) {
        if (!signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !clickInGutter(cm, e)) {
          d.input.ensurePolled();
          clearTimeout(touchFinished);
          var now = +new Date;
          d.activeTouch = {start: now, moved: false,
                           prev: now - prevTouch.end <= 300 ? prevTouch : null};
          if (e.touches.length == 1) {
            d.activeTouch.left = e.touches[0].pageX;
            d.activeTouch.top = e.touches[0].pageY;
          }
        }
      });
      on(d.scroller, "touchmove", function () {
        if (d.activeTouch) { d.activeTouch.moved = true; }
      });
      on(d.scroller, "touchend", function (e) {
        var touch = d.activeTouch;
        if (touch && !eventInWidget(d, e) && touch.left != null &&
            !touch.moved && new Date - touch.start < 300) {
          var pos = cm.coordsChar(d.activeTouch, "page"), range;
          if (!touch.prev || farAway(touch, touch.prev)) // Single tap
            { range = new Range(pos, pos); }
          else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) // Double tap
            { range = cm.findWordAt(pos); }
          else // Triple tap
            { range = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0))); }
          cm.setSelection(range.anchor, range.head);
          cm.focus();
          e_preventDefault(e);
        }
        finishTouch();
      });
      on(d.scroller, "touchcancel", finishTouch);
  
      // Sync scrolling between fake scrollbars and real scrollable
      // area, ensure viewport is updated when scrolling.
      on(d.scroller, "scroll", function () {
        if (d.scroller.clientHeight) {
          updateScrollTop(cm, d.scroller.scrollTop);
          setScrollLeft(cm, d.scroller.scrollLeft, true);
          signal(cm, "scroll", cm);
        }
      });
  
      // Listen to wheel events in order to try and update the viewport on time.
      on(d.scroller, "mousewheel", function (e) { return onScrollWheel(cm, e); });
      on(d.scroller, "DOMMouseScroll", function (e) { return onScrollWheel(cm, e); });
  
      // Prevent wrapper from ever scrolling
      on(d.wrapper, "scroll", function () { return d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });
  
      d.dragFunctions = {
        enter: function (e) {if (!signalDOMEvent(cm, e)) { e_stop(e); }},
        over: function (e) {if (!signalDOMEvent(cm, e)) { onDragOver(cm, e); e_stop(e); }},
        start: function (e) { return onDragStart(cm, e); },
        drop: operation(cm, onDrop),
        leave: function (e) {if (!signalDOMEvent(cm, e)) { clearDragCursor(cm); }}
      };
  
      var inp = d.input.getField();
      on(inp, "keyup", function (e) { return onKeyUp.call(cm, e); });
      on(inp, "keydown", operation(cm, onKeyDown));
      on(inp, "keypress", operation(cm, onKeyPress));
      on(inp, "focus", function (e) { return onFocus(cm, e); });
      on(inp, "blur", function (e) { return onBlur(cm, e); });
    }
  
    var initHooks = [];
    CodeMirror.defineInitHook = function (f) { return initHooks.push(f); };
  
    // Indent the given line. The how parameter can be "smart",
    // "add"/null, "subtract", or "prev". When aggressive is false
    // (typically set to true for forced single-line indents), empty
    // lines are not indented, and places where the mode returns Pass
    // are left alone.
    function indentLine(cm, n, how, aggressive) {
      var doc = cm.doc, state;
      if (how == null) { how = "add"; }
      if (how == "smart") {
        // Fall back to "prev" when the mode doesn't have an indentation
        // method.
        if (!doc.mode.indent) { how = "prev"; }
        else { state = getContextBefore(cm, n).state; }
      }
  
      var tabSize = cm.options.tabSize;
      var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
      if (line.stateAfter) { line.stateAfter = null; }
      var curSpaceString = line.text.match(/^\s*/)[0], indentation;
      if (!aggressive && !/\S/.test(line.text)) {
        indentation = 0;
        how = "not";
      } else if (how == "smart") {
        indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
        if (indentation == Pass || indentation > 150) {
          if (!aggressive) { return }
          how = "prev";
        }
      }
      if (how == "prev") {
        if (n > doc.first) { indentation = countColumn(getLine(doc, n-1).text, null, tabSize); }
        else { indentation = 0; }
      } else if (how == "add") {
        indentation = curSpace + cm.options.indentUnit;
      } else if (how == "subtract") {
        indentation = curSpace - cm.options.indentUnit;
      } else if (typeof how == "number") {
        indentation = curSpace + how;
      }
      indentation = Math.max(0, indentation);
  
      var indentString = "", pos = 0;
      if (cm.options.indentWithTabs)
        { for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";} }
      if (pos < indentation) { indentString += spaceStr(indentation - pos); }
  
      if (indentString != curSpaceString) {
        replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
        line.stateAfter = null;
        return true
      } else {
        // Ensure that, if the cursor was in the whitespace at the start
        // of the line, it is moved to the end of that space.
        for (var i$1 = 0; i$1 < doc.sel.ranges.length; i$1++) {
          var range = doc.sel.ranges[i$1];
          if (range.head.line == n && range.head.ch < curSpaceString.length) {
            var pos$1 = Pos(n, curSpaceString.length);
            replaceOneSelection(doc, i$1, new Range(pos$1, pos$1));
            break
          }
        }
      }
    }
  
    // This will be set to a {lineWise: bool, text: [string]} object, so
    // that, when pasting, we know what kind of selections the copied
    // text was made out of.
    var lastCopied = null;
  
    function setLastCopied(newLastCopied) {
      lastCopied = newLastCopied;
    }
  
    function applyTextInput(cm, inserted, deleted, sel, origin) {
      var doc = cm.doc;
      cm.display.shift = false;
      if (!sel) { sel = doc.sel; }
  
      var recent = +new Date - 200;
      var paste = origin == "paste" || cm.state.pasteIncoming > recent;
      var textLines = splitLinesAuto(inserted), multiPaste = null;
      // When pasting N lines into N selections, insert one line per selection
      if (paste && sel.ranges.length > 1) {
        if (lastCopied && lastCopied.text.join("\n") == inserted) {
          if (sel.ranges.length % lastCopied.text.length == 0) {
            multiPaste = [];
            for (var i = 0; i < lastCopied.text.length; i++)
              { multiPaste.push(doc.splitLines(lastCopied.text[i])); }
          }
        } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) {
          multiPaste = map(textLines, function (l) { return [l]; });
        }
      }
  
      var updateInput = cm.curOp.updateInput;
      // Normal behavior is to insert the new text into every selection
      for (var i$1 = sel.ranges.length - 1; i$1 >= 0; i$1--) {
        var range$$1 = sel.ranges[i$1];
        var from = range$$1.from(), to = range$$1.to();
        if (range$$1.empty()) {
          if (deleted && deleted > 0) // Handle deletion
            { from = Pos(from.line, from.ch - deleted); }
          else if (cm.state.overwrite && !paste) // Handle overwrite
            { to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length)); }
          else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == inserted)
            { from = to = Pos(from.line, 0); }
        }
        var changeEvent = {from: from, to: to, text: multiPaste ? multiPaste[i$1 % multiPaste.length] : textLines,
                           origin: origin || (paste ? "paste" : cm.state.cutIncoming > recent ? "cut" : "+input")};
        makeChange(cm.doc, changeEvent);
        signalLater(cm, "inputRead", cm, changeEvent);
      }
      if (inserted && !paste)
        { triggerElectric(cm, inserted); }
  
      ensureCursorVisible(cm);
      if (cm.curOp.updateInput < 2) { cm.curOp.updateInput = updateInput; }
      cm.curOp.typing = true;
      cm.state.pasteIncoming = cm.state.cutIncoming = -1;
    }
  
    function handlePaste(e, cm) {
      var pasted = e.clipboardData && e.clipboardData.getData("Text");
      if (pasted) {
        e.preventDefault();
        if (!cm.isReadOnly() && !cm.options.disableInput)
          { runInOp(cm, function () { return applyTextInput(cm, pasted, 0, null, "paste"); }); }
        return true
      }
    }
  
    function triggerElectric(cm, inserted) {
      // When an 'electric' character is inserted, immediately trigger a reindent
      if (!cm.options.electricChars || !cm.options.smartIndent) { return }
      var sel = cm.doc.sel;
  
      for (var i = sel.ranges.length - 1; i >= 0; i--) {
        var range$$1 = sel.ranges[i];
        if (range$$1.head.ch > 100 || (i && sel.ranges[i - 1].head.line == range$$1.head.line)) { continue }
        var mode = cm.getModeAt(range$$1.head);
        var indented = false;
        if (mode.electricChars) {
          for (var j = 0; j < mode.electricChars.length; j++)
            { if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
              indented = indentLine(cm, range$$1.head.line, "smart");
              break
            } }
        } else if (mode.electricInput) {
          if (mode.electricInput.test(getLine(cm.doc, range$$1.head.line).text.slice(0, range$$1.head.ch)))
            { indented = indentLine(cm, range$$1.head.line, "smart"); }
        }
        if (indented) { signalLater(cm, "electricInput", cm, range$$1.head.line); }
      }
    }
  
    function copyableRanges(cm) {
      var text = [], ranges = [];
      for (var i = 0; i < cm.doc.sel.ranges.length; i++) {
        var line = cm.doc.sel.ranges[i].head.line;
        var lineRange = {anchor: Pos(line, 0), head: Pos(line + 1, 0)};
        ranges.push(lineRange);
        text.push(cm.getRange(lineRange.anchor, lineRange.head));
      }
      return {text: text, ranges: ranges}
    }
  
    function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
      field.setAttribute("autocorrect", !!autocorrect);
      field.setAttribute("autocapitalize", !!autocapitalize);
      field.setAttribute("spellcheck", !!spellcheck);
    }
  
    function hiddenTextarea() {
      var te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none");
      var div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
      // The textarea is kept positioned near the cursor to prevent the
      // fact that it'll be scrolled into view on input from scrolling
      // our fake cursor out of view. On webkit, when wrap=off, paste is
      // very slow. So make the area wide instead.
      if (webkit) { te.style.width = "1000px"; }
      else { te.setAttribute("wrap", "off"); }
      // If border: 0; -- iOS fails to open keyboard (issue #1287)
      if (ios) { te.style.border = "1px solid black"; }
      disableBrowserMagic(te);
      return div
    }
  
    // The publicly visible API. Note that methodOp(f) means
    // 'wrap f in an operation, performed on its `this` parameter'.
  
    // This is not the complete set of editor methods. Most of the
    // methods defined on the Doc type are also injected into
    // CodeMirror.prototype, for backwards compatibility and
    // convenience.
  
    function addEditorMethods(CodeMirror) {
      var optionHandlers = CodeMirror.optionHandlers;
  
      var helpers = CodeMirror.helpers = {};
  
      CodeMirror.prototype = {
        constructor: CodeMirror,
        focus: function(){window.focus(); this.display.input.focus();},
  
        setOption: function(option, value) {
          var options = this.options, old = options[option];
          if (options[option] == value && option != "mode") { return }
          options[option] = value;
          if (optionHandlers.hasOwnProperty(option))
            { operation(this, optionHandlers[option])(this, value, old); }
          signal(this, "optionChange", this, option);
        },
  
        getOption: function(option) {return this.options[option]},
        getDoc: function() {return this.doc},
  
        addKeyMap: function(map$$1, bottom) {
          this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map$$1));
        },
        removeKeyMap: function(map$$1) {
          var maps = this.state.keyMaps;
          for (var i = 0; i < maps.length; ++i)
            { if (maps[i] == map$$1 || maps[i].name == map$$1) {
              maps.splice(i, 1);
              return true
            } }
        },
  
        addOverlay: methodOp(function(spec, options) {
          var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
          if (mode.startState) { throw new Error("Overlays may not be stateful.") }
          insertSorted(this.state.overlays,
                       {mode: mode, modeSpec: spec, opaque: options && options.opaque,
                        priority: (options && options.priority) || 0},
                       function (overlay) { return overlay.priority; });
          this.state.modeGen++;
          regChange(this);
        }),
        removeOverlay: methodOp(function(spec) {
          var this$1 = this;
  
          var overlays = this.state.overlays;
          for (var i = 0; i < overlays.length; ++i) {
            var cur = overlays[i].modeSpec;
            if (cur == spec || typeof spec == "string" && cur.name == spec) {
              overlays.splice(i, 1);
              this$1.state.modeGen++;
              regChange(this$1);
              return
            }
          }
        }),
  
        indentLine: methodOp(function(n, dir, aggressive) {
          if (typeof dir != "string" && typeof dir != "number") {
            if (dir == null) { dir = this.options.smartIndent ? "smart" : "prev"; }
            else { dir = dir ? "add" : "subtract"; }
          }
          if (isLine(this.doc, n)) { indentLine(this, n, dir, aggressive); }
        }),
        indentSelection: methodOp(function(how) {
          var this$1 = this;
  
          var ranges = this.doc.sel.ranges, end = -1;
          for (var i = 0; i < ranges.length; i++) {
            var range$$1 = ranges[i];
            if (!range$$1.empty()) {
              var from = range$$1.from(), to = range$$1.to();
              var start = Math.max(end, from.line);
              end = Math.min(this$1.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
              for (var j = start; j < end; ++j)
                { indentLine(this$1, j, how); }
              var newRanges = this$1.doc.sel.ranges;
              if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0)
                { replaceOneSelection(this$1.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll); }
            } else if (range$$1.head.line > end) {
              indentLine(this$1, range$$1.head.line, how, true);
              end = range$$1.head.line;
              if (i == this$1.doc.sel.primIndex) { ensureCursorVisible(this$1); }
            }
          }
        }),
  
        // Fetch the parser token for a given character. Useful for hacks
        // that want to inspect the mode state (say, for completion).
        getTokenAt: function(pos, precise) {
          return takeToken(this, pos, precise)
        },
  
        getLineTokens: function(line, precise) {
          return takeToken(this, Pos(line), precise, true)
        },
  
        getTokenTypeAt: function(pos) {
          pos = clipPos(this.doc, pos);
          var styles = getLineStyles(this, getLine(this.doc, pos.line));
          var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
          var type;
          if (ch == 0) { type = styles[2]; }
          else { for (;;) {
            var mid = (before + after) >> 1;
            if ((mid ? styles[mid * 2 - 1] : 0) >= ch) { after = mid; }
            else if (styles[mid * 2 + 1] < ch) { before = mid + 1; }
            else { type = styles[mid * 2 + 2]; break }
          } }
          var cut = type ? type.indexOf("overlay ") : -1;
          return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1)
        },
  
        getModeAt: function(pos) {
          var mode = this.doc.mode;
          if (!mode.innerMode) { return mode }
          return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode
        },
  
        getHelper: function(pos, type) {
          return this.getHelpers(pos, type)[0]
        },
  
        getHelpers: function(pos, type) {
          var this$1 = this;
  
          var found = [];
          if (!helpers.hasOwnProperty(type)) { return found }
          var help = helpers[type], mode = this.getModeAt(pos);
          if (typeof mode[type] == "string") {
            if (help[mode[type]]) { found.push(help[mode[type]]); }
          } else if (mode[type]) {
            for (var i = 0; i < mode[type].length; i++) {
              var val = help[mode[type][i]];
              if (val) { found.push(val); }
            }
          } else if (mode.helperType && help[mode.helperType]) {
            found.push(help[mode.helperType]);
          } else if (help[mode.name]) {
            found.push(help[mode.name]);
          }
          for (var i$1 = 0; i$1 < help._global.length; i$1++) {
            var cur = help._global[i$1];
            if (cur.pred(mode, this$1) && indexOf(found, cur.val) == -1)
              { found.push(cur.val); }
          }
          return found
        },
  
        getStateAfter: function(line, precise) {
          var doc = this.doc;
          line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
          return getContextBefore(this, line + 1, precise).state
        },
  
        cursorCoords: function(start, mode) {
          var pos, range$$1 = this.doc.sel.primary();
          if (start == null) { pos = range$$1.head; }
          else if (typeof start == "object") { pos = clipPos(this.doc, start); }
          else { pos = start ? range$$1.from() : range$$1.to(); }
          return cursorCoords(this, pos, mode || "page")
        },
  
        charCoords: function(pos, mode) {
          return charCoords(this, clipPos(this.doc, pos), mode || "page")
        },
  
        coordsChar: function(coords, mode) {
          coords = fromCoordSystem(this, coords, mode || "page");
          return coordsChar(this, coords.left, coords.top)
        },
  
        lineAtHeight: function(height, mode) {
          height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
          return lineAtHeight(this.doc, height + this.display.viewOffset)
        },
        heightAtLine: function(line, mode, includeWidgets) {
          var end = false, lineObj;
          if (typeof line == "number") {
            var last = this.doc.first + this.doc.size - 1;
            if (line < this.doc.first) { line = this.doc.first; }
            else if (line > last) { line = last; end = true; }
            lineObj = getLine(this.doc, line);
          } else {
            lineObj = line;
          }
          return intoCoordSystem(this, lineObj, {top: 0, left: 0}, mode || "page", includeWidgets || end).top +
            (end ? this.doc.height - heightAtLine(lineObj) : 0)
        },
  
        defaultTextHeight: function() { return textHeight(this.display) },
        defaultCharWidth: function() { return charWidth(this.display) },
  
        getViewport: function() { return {from: this.display.viewFrom, to: this.display.viewTo}},
  
        addWidget: function(pos, node, scroll, vert, horiz) {
          var display = this.display;
          pos = cursorCoords(this, clipPos(this.doc, pos));
          var top = pos.bottom, left = pos.left;
          node.style.position = "absolute";
          node.setAttribute("cm-ignore-events", "true");
          this.display.input.setUneditable(node);
          display.sizer.appendChild(node);
          if (vert == "over") {
            top = pos.top;
          } else if (vert == "above" || vert == "near") {
            var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
            hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
            // Default to positioning above (if specified and possible); otherwise default to positioning below
            if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
              { top = pos.top - node.offsetHeight; }
            else if (pos.bottom + node.offsetHeight <= vspace)
              { top = pos.bottom; }
            if (left + node.offsetWidth > hspace)
              { left = hspace - node.offsetWidth; }
          }
          node.style.top = top + "px";
          node.style.left = node.style.right = "";
          if (horiz == "right") {
            left = display.sizer.clientWidth - node.offsetWidth;
            node.style.right = "0px";
          } else {
            if (horiz == "left") { left = 0; }
            else if (horiz == "middle") { left = (display.sizer.clientWidth - node.offsetWidth) / 2; }
            node.style.left = left + "px";
          }
          if (scroll)
            { scrollIntoView(this, {left: left, top: top, right: left + node.offsetWidth, bottom: top + node.offsetHeight}); }
        },
  
        triggerOnKeyDown: methodOp(onKeyDown),
        triggerOnKeyPress: methodOp(onKeyPress),
        triggerOnKeyUp: onKeyUp,
        triggerOnMouseDown: methodOp(onMouseDown),
  
        execCommand: function(cmd) {
          if (commands.hasOwnProperty(cmd))
            { return commands[cmd].call(null, this) }
        },
  
        triggerElectric: methodOp(function(text) { triggerElectric(this, text); }),
  
        findPosH: function(from, amount, unit, visually) {
          var this$1 = this;
  
          var dir = 1;
          if (amount < 0) { dir = -1; amount = -amount; }
          var cur = clipPos(this.doc, from);
          for (var i = 0; i < amount; ++i) {
            cur = findPosH(this$1.doc, cur, dir, unit, visually);
            if (cur.hitSide) { break }
          }
          return cur
        },
  
        moveH: methodOp(function(dir, unit) {
          var this$1 = this;
  
          this.extendSelectionsBy(function (range$$1) {
            if (this$1.display.shift || this$1.doc.extend || range$$1.empty())
              { return findPosH(this$1.doc, range$$1.head, dir, unit, this$1.options.rtlMoveVisually) }
            else
              { return dir < 0 ? range$$1.from() : range$$1.to() }
          }, sel_move);
        }),
  
        deleteH: methodOp(function(dir, unit) {
          var sel = this.doc.sel, doc = this.doc;
          if (sel.somethingSelected())
            { doc.replaceSelection("", null, "+delete"); }
          else
            { deleteNearSelection(this, function (range$$1) {
              var other = findPosH(doc, range$$1.head, dir, unit, false);
              return dir < 0 ? {from: other, to: range$$1.head} : {from: range$$1.head, to: other}
            }); }
        }),
  
        findPosV: function(from, amount, unit, goalColumn) {
          var this$1 = this;
  
          var dir = 1, x = goalColumn;
          if (amount < 0) { dir = -1; amount = -amount; }
          var cur = clipPos(this.doc, from);
          for (var i = 0; i < amount; ++i) {
            var coords = cursorCoords(this$1, cur, "div");
            if (x == null) { x = coords.left; }
            else { coords.left = x; }
            cur = findPosV(this$1, coords, dir, unit);
            if (cur.hitSide) { break }
          }
          return cur
        },
  
        moveV: methodOp(function(dir, unit) {
          var this$1 = this;
  
          var doc = this.doc, goals = [];
          var collapse = !this.display.shift && !doc.extend && doc.sel.somethingSelected();
          doc.extendSelectionsBy(function (range$$1) {
            if (collapse)
              { return dir < 0 ? range$$1.from() : range$$1.to() }
            var headPos = cursorCoords(this$1, range$$1.head, "div");
            if (range$$1.goalColumn != null) { headPos.left = range$$1.goalColumn; }
            goals.push(headPos.left);
            var pos = findPosV(this$1, headPos, dir, unit);
            if (unit == "page" && range$$1 == doc.sel.primary())
              { addToScrollTop(this$1, charCoords(this$1, pos, "div").top - headPos.top); }
            return pos
          }, sel_move);
          if (goals.length) { for (var i = 0; i < doc.sel.ranges.length; i++)
            { doc.sel.ranges[i].goalColumn = goals[i]; } }
        }),
  
        // Find the word at the given position (as returned by coordsChar).
        findWordAt: function(pos) {
          var doc = this.doc, line = getLine(doc, pos.line).text;
          var start = pos.ch, end = pos.ch;
          if (line) {
            var helper = this.getHelper(pos, "wordChars");
            if ((pos.sticky == "before" || end == line.length) && start) { --start; } else { ++end; }
            var startChar = line.charAt(start);
            var check = isWordChar(startChar, helper)
              ? function (ch) { return isWordChar(ch, helper); }
              : /\s/.test(startChar) ? function (ch) { return /\s/.test(ch); }
              : function (ch) { return (!/\s/.test(ch) && !isWordChar(ch)); };
            while (start > 0 && check(line.charAt(start - 1))) { --start; }
            while (end < line.length && check(line.charAt(end))) { ++end; }
          }
          return new Range(Pos(pos.line, start), Pos(pos.line, end))
        },
  
        toggleOverwrite: function(value) {
          if (value != null && value == this.state.overwrite) { return }
          if (this.state.overwrite = !this.state.overwrite)
            { addClass(this.display.cursorDiv, "CodeMirror-overwrite"); }
          else
            { rmClass(this.display.cursorDiv, "CodeMirror-overwrite"); }
  
          signal(this, "overwriteToggle", this, this.state.overwrite);
        },
        hasFocus: function() { return this.display.input.getField() == activeElt() },
        isReadOnly: function() { return !!(this.options.readOnly || this.doc.cantEdit) },
  
        scrollTo: methodOp(function (x, y) { scrollToCoords(this, x, y); }),
        getScrollInfo: function() {
          var scroller = this.display.scroller;
          return {left: scroller.scrollLeft, top: scroller.scrollTop,
                  height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
                  width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
                  clientHeight: displayHeight(this), clientWidth: displayWidth(this)}
        },
  
        scrollIntoView: methodOp(function(range$$1, margin) {
          if (range$$1 == null) {
            range$$1 = {from: this.doc.sel.primary().head, to: null};
            if (margin == null) { margin = this.options.cursorScrollMargin; }
          } else if (typeof range$$1 == "number") {
            range$$1 = {from: Pos(range$$1, 0), to: null};
          } else if (range$$1.from == null) {
            range$$1 = {from: range$$1, to: null};
          }
          if (!range$$1.to) { range$$1.to = range$$1.from; }
          range$$1.margin = margin || 0;
  
          if (range$$1.from.line != null) {
            scrollToRange(this, range$$1);
          } else {
            scrollToCoordsRange(this, range$$1.from, range$$1.to, range$$1.margin);
          }
        }),
  
        setSize: methodOp(function(width, height) {
          var this$1 = this;
  
          var interpret = function (val) { return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val; };
          if (width != null) { this.display.wrapper.style.width = interpret(width); }
          if (height != null) { this.display.wrapper.style.height = interpret(height); }
          if (this.options.lineWrapping) { clearLineMeasurementCache(this); }
          var lineNo$$1 = this.display.viewFrom;
          this.doc.iter(lineNo$$1, this.display.viewTo, function (line) {
            if (line.widgets) { for (var i = 0; i < line.widgets.length; i++)
              { if (line.widgets[i].noHScroll) { regLineChange(this$1, lineNo$$1, "widget"); break } } }
            ++lineNo$$1;
          });
          this.curOp.forceUpdate = true;
          signal(this, "refresh", this);
        }),
  
        operation: function(f){return runInOp(this, f)},
        startOperation: function(){return startOperation(this)},
        endOperation: function(){return endOperation(this)},
  
        refresh: methodOp(function() {
          var oldHeight = this.display.cachedTextHeight;
          regChange(this);
          this.curOp.forceUpdate = true;
          clearCaches(this);
          scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
          updateGutterSpace(this);
          if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5)
            { estimateLineHeights(this); }
          signal(this, "refresh", this);
        }),
  
        swapDoc: methodOp(function(doc) {
          var old = this.doc;
          old.cm = null;
          attachDoc(this, doc);
          clearCaches(this);
          this.display.input.reset();
          scrollToCoords(this, doc.scrollLeft, doc.scrollTop);
          this.curOp.forceScroll = true;
          signalLater(this, "swapDoc", this, old);
          return old
        }),
  
        phrase: function(phraseText) {
          var phrases = this.options.phrases;
          return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText
        },
  
        getInputField: function(){return this.display.input.getField()},
        getWrapperElement: function(){return this.display.wrapper},
        getScrollerElement: function(){return this.display.scroller},
        getGutterElement: function(){return this.display.gutters}
      };
      eventMixin(CodeMirror);
  
      CodeMirror.registerHelper = function(type, name, value) {
        if (!helpers.hasOwnProperty(type)) { helpers[type] = CodeMirror[type] = {_global: []}; }
        helpers[type][name] = value;
      };
      CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
        CodeMirror.registerHelper(type, name, value);
        helpers[type]._global.push({pred: predicate, val: value});
      };
    }
  
    // Used for horizontal relative motion. Dir is -1 or 1 (left or
    // right), unit can be "char", "column" (like char, but doesn't
    // cross line boundaries), "word" (across next word), or "group" (to
    // the start of next group of word or non-word-non-whitespace
    // chars). The visually param controls whether, in right-to-left
    // text, direction 1 means to move towards the next index in the
    // string, or towards the character to the right of the current
    // position. The resulting position will have a hitSide=true
    // property if it reached the end of the document.
    function findPosH(doc, pos, dir, unit, visually) {
      var oldPos = pos;
      var origDir = dir;
      var lineObj = getLine(doc, pos.line);
      function findNextLine() {
        var l = pos.line + dir;
        if (l < doc.first || l >= doc.first + doc.size) { return false }
        pos = new Pos(l, pos.ch, pos.sticky);
        return lineObj = getLine(doc, l)
      }
      function moveOnce(boundToLine) {
        var next;
        if (visually) {
          next = moveVisually(doc.cm, lineObj, pos, dir);
        } else {
          next = moveLogically(lineObj, pos, dir);
        }
        if (next == null) {
          if (!boundToLine && findNextLine())
            { pos = endOfLine(visually, doc.cm, lineObj, pos.line, dir); }
          else
            { return false }
        } else {
          pos = next;
        }
        return true
      }
  
      if (unit == "char") {
        moveOnce();
      } else if (unit == "column") {
        moveOnce(true);
      } else if (unit == "word" || unit == "group") {
        var sawType = null, group = unit == "group";
        var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
        for (var first = true;; first = false) {
          if (dir < 0 && !moveOnce(!first)) { break }
          var cur = lineObj.text.charAt(pos.ch) || "\n";
          var type = isWordChar(cur, helper) ? "w"
            : group && cur == "\n" ? "n"
            : !group || /\s/.test(cur) ? null
            : "p";
          if (group && !first && !type) { type = "s"; }
          if (sawType && sawType != type) {
            if (dir < 0) {dir = 1; moveOnce(); pos.sticky = "after";}
            break
          }
  
          if (type) { sawType = type; }
          if (dir > 0 && !moveOnce(!first)) { break }
        }
      }
      var result = skipAtomic(doc, pos, oldPos, origDir, true);
      if (equalCursorPos(oldPos, result)) { result.hitSide = true; }
      return result
    }
  
    // For relative vertical movement. Dir may be -1 or 1. Unit can be
    // "page" or "line". The resulting position will have a hitSide=true
    // property if it reached the end of the document.
    function findPosV(cm, pos, dir, unit) {
      var doc = cm.doc, x = pos.left, y;
      if (unit == "page") {
        var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
        var moveAmount = Math.max(pageSize - .5 * textHeight(cm.display), 3);
        y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
  
      } else if (unit == "line") {
        y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
      }
      var target;
      for (;;) {
        target = coordsChar(cm, x, y);
        if (!target.outside) { break }
        if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break }
        y += dir * 5;
      }
      return target
    }
  
    // CONTENTEDITABLE INPUT STYLE
  
    var ContentEditableInput = function(cm) {
      this.cm = cm;
      this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
      this.polling = new Delayed();
      this.composing = null;
      this.gracePeriod = false;
      this.readDOMTimeout = null;
    };
  
    ContentEditableInput.prototype.init = function (display) {
        var this$1 = this;
  
      var input = this, cm = input.cm;
      var div = input.div = display.lineDiv;
      disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);
  
      on(div, "paste", function (e) {
        if (signalDOMEvent(cm, e) || handlePaste(e, cm)) { return }
        // IE doesn't fire input events, so we schedule a read for the pasted content in this way
        if (ie_version <= 11) { setTimeout(operation(cm, function () { return this$1.updateFromDOM(); }), 20); }
      });
  
      on(div, "compositionstart", function (e) {
        this$1.composing = {data: e.data, done: false};
      });
      on(div, "compositionupdate", function (e) {
        if (!this$1.composing) { this$1.composing = {data: e.data, done: false}; }
      });
      on(div, "compositionend", function (e) {
        if (this$1.composing) {
          if (e.data != this$1.composing.data) { this$1.readFromDOMSoon(); }
          this$1.composing.done = true;
        }
      });
  
      on(div, "touchstart", function () { return input.forceCompositionEnd(); });
  
      on(div, "input", function () {
        if (!this$1.composing) { this$1.readFromDOMSoon(); }
      });
  
      function onCopyCut(e) {
        if (signalDOMEvent(cm, e)) { return }
        if (cm.somethingSelected()) {
          setLastCopied({lineWise: false, text: cm.getSelections()});
          if (e.type == "cut") { cm.replaceSelection("", null, "cut"); }
        } else if (!cm.options.lineWiseCopyCut) {
          return
        } else {
          var ranges = copyableRanges(cm);
          setLastCopied({lineWise: true, text: ranges.text});
          if (e.type == "cut") {
            cm.operation(function () {
              cm.setSelections(ranges.ranges, 0, sel_dontScroll);
              cm.replaceSelection("", null, "cut");
            });
          }
        }
        if (e.clipboardData) {
          e.clipboardData.clearData();
          var content = lastCopied.text.join("\n");
          // iOS exposes the clipboard API, but seems to discard content inserted into it
          e.clipboardData.setData("Text", content);
          if (e.clipboardData.getData("Text") == content) {
            e.preventDefault();
            return
          }
        }
        // Old-fashioned briefly-focus-a-textarea hack
        var kludge = hiddenTextarea(), te = kludge.firstChild;
        cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
        te.value = lastCopied.text.join("\n");
        var hadFocus = document.activeElement;
        selectInput(te);
        setTimeout(function () {
          cm.display.lineSpace.removeChild(kludge);
          hadFocus.focus();
          if (hadFocus == div) { input.showPrimarySelection(); }
        }, 50);
      }
      on(div, "copy", onCopyCut);
      on(div, "cut", onCopyCut);
    };
  
    ContentEditableInput.prototype.prepareSelection = function () {
      var result = prepareSelection(this.cm, false);
      result.focus = this.cm.state.focused;
      return result
    };
  
    ContentEditableInput.prototype.showSelection = function (info, takeFocus) {
      if (!info || !this.cm.display.view.length) { return }
      if (info.focus || takeFocus) { this.showPrimarySelection(); }
      this.showMultipleSelections(info);
    };
  
    ContentEditableInput.prototype.getSelection = function () {
      return this.cm.display.wrapper.ownerDocument.getSelection()
    };
  
    ContentEditableInput.prototype.showPrimarySelection = function () {
      var sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary();
      var from = prim.from(), to = prim.to();
  
      if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
        sel.removeAllRanges();
        return
      }
  
      var curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
      var curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
      if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad &&
          cmp(minPos(curAnchor, curFocus), from) == 0 &&
          cmp(maxPos(curAnchor, curFocus), to) == 0)
        { return }
  
      var view = cm.display.view;
      var start = (from.line >= cm.display.viewFrom && posToDOM(cm, from)) ||
          {node: view[0].measure.map[2], offset: 0};
      var end = to.line < cm.display.viewTo && posToDOM(cm, to);
      if (!end) {
        var measure = view[view.length - 1].measure;
        var map$$1 = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
        end = {node: map$$1[map$$1.length - 1], offset: map$$1[map$$1.length - 2] - map$$1[map$$1.length - 3]};
      }
  
      if (!start || !end) {
        sel.removeAllRanges();
        return
      }
  
      var old = sel.rangeCount && sel.getRangeAt(0), rng;
      try { rng = range(start.node, start.offset, end.offset, end.node); }
      catch(e) {} // Our model of the DOM might be outdated, in which case the range we try to set can be impossible
      if (rng) {
        if (!gecko && cm.state.focused) {
          sel.collapse(start.node, start.offset);
          if (!rng.collapsed) {
            sel.removeAllRanges();
            sel.addRange(rng);
          }
        } else {
          sel.removeAllRanges();
          sel.addRange(rng);
        }
        if (old && sel.anchorNode == null) { sel.addRange(old); }
        else if (gecko) { this.startGracePeriod(); }
      }
      this.rememberSelection();
    };
  
    ContentEditableInput.prototype.startGracePeriod = function () {
        var this$1 = this;
  
      clearTimeout(this.gracePeriod);
      this.gracePeriod = setTimeout(function () {
        this$1.gracePeriod = false;
        if (this$1.selectionChanged())
          { this$1.cm.operation(function () { return this$1.cm.curOp.selectionChanged = true; }); }
      }, 20);
    };
  
    ContentEditableInput.prototype.showMultipleSelections = function (info) {
      removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
      removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
    };
  
    ContentEditableInput.prototype.rememberSelection = function () {
      var sel = this.getSelection();
      this.lastAnchorNode = sel.anchorNode; this.lastAnchorOffset = sel.anchorOffset;
      this.lastFocusNode = sel.focusNode; this.lastFocusOffset = sel.focusOffset;
    };
  
    ContentEditableInput.prototype.selectionInEditor = function () {
      var sel = this.getSelection();
      if (!sel.rangeCount) { return false }
      var node = sel.getRangeAt(0).commonAncestorContainer;
      return contains(this.div, node)
    };
  
    ContentEditableInput.prototype.focus = function () {
      if (this.cm.options.readOnly != "nocursor") {
        if (!this.selectionInEditor())
          { this.showSelection(this.prepareSelection(), true); }
        this.div.focus();
      }
    };
    ContentEditableInput.prototype.blur = function () { this.div.blur(); };
    ContentEditableInput.prototype.getField = function () { return this.div };
  
    ContentEditableInput.prototype.supportsTouch = function () { return true };
  
    ContentEditableInput.prototype.receivedFocus = function () {
      var input = this;
      if (this.selectionInEditor())
        { this.pollSelection(); }
      else
        { runInOp(this.cm, function () { return input.cm.curOp.selectionChanged = true; }); }
  
      function poll() {
        if (input.cm.state.focused) {
          input.pollSelection();
          input.polling.set(input.cm.options.pollInterval, poll);
        }
      }
      this.polling.set(this.cm.options.pollInterval, poll);
    };
  
    ContentEditableInput.prototype.selectionChanged = function () {
      var sel = this.getSelection();
      return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset ||
        sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset
    };
  
    ContentEditableInput.prototype.pollSelection = function () {
      if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) { return }
      var sel = this.getSelection(), cm = this.cm;
      // On Android Chrome (version 56, at least), backspacing into an
      // uneditable block element will put the cursor in that element,
      // and then, because it's not editable, hide the virtual keyboard.
      // Because Android doesn't allow us to actually detect backspace
      // presses in a sane way, this code checks for when that happens
      // and simulates a backspace press in this case.
      if (android && chrome && this.cm.options.gutters.length && isInGutter(sel.anchorNode)) {
        this.cm.triggerOnKeyDown({type: "keydown", keyCode: 8, preventDefault: Math.abs});
        this.blur();
        this.focus();
        return
      }
      if (this.composing) { return }
      this.rememberSelection();
      var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
      var head = domToPos(cm, sel.focusNode, sel.focusOffset);
      if (anchor && head) { runInOp(cm, function () {
        setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
        if (anchor.bad || head.bad) { cm.curOp.selectionChanged = true; }
      }); }
    };
  
    ContentEditableInput.prototype.pollContent = function () {
      if (this.readDOMTimeout != null) {
        clearTimeout(this.readDOMTimeout);
        this.readDOMTimeout = null;
      }
  
      var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
      var from = sel.from(), to = sel.to();
      if (from.ch == 0 && from.line > cm.firstLine())
        { from = Pos(from.line - 1, getLine(cm.doc, from.line - 1).length); }
      if (to.ch == getLine(cm.doc, to.line).text.length && to.line < cm.lastLine())
        { to = Pos(to.line + 1, 0); }
      if (from.line < display.viewFrom || to.line > display.viewTo - 1) { return false }
  
      var fromIndex, fromLine, fromNode;
      if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
        fromLine = lineNo(display.view[0].line);
        fromNode = display.view[0].node;
      } else {
        fromLine = lineNo(display.view[fromIndex].line);
        fromNode = display.view[fromIndex - 1].node.nextSibling;
      }
      var toIndex = findViewIndex(cm, to.line);
      var toLine, toNode;
      if (toIndex == display.view.length - 1) {
        toLine = display.viewTo - 1;
        toNode = display.lineDiv.lastChild;
      } else {
        toLine = lineNo(display.view[toIndex + 1].line) - 1;
        toNode = display.view[toIndex + 1].node.previousSibling;
      }
  
      if (!fromNode) { return false }
      var newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
      var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
      while (newText.length > 1 && oldText.length > 1) {
        if (lst(newText) == lst(oldText)) { newText.pop(); oldText.pop(); toLine--; }
        else if (newText[0] == oldText[0]) { newText.shift(); oldText.shift(); fromLine++; }
        else { break }
      }
  
      var cutFront = 0, cutEnd = 0;
      var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
      while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront))
        { ++cutFront; }
      var newBot = lst(newText), oldBot = lst(oldText);
      var maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0),
                               oldBot.length - (oldText.length == 1 ? cutFront : 0));
      while (cutEnd < maxCutEnd &&
             newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1))
        { ++cutEnd; }
      // Try to move start of change to start of selection if ambiguous
      if (newText.length == 1 && oldText.length == 1 && fromLine == from.line) {
        while (cutFront && cutFront > from.ch &&
               newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
          cutFront--;
          cutEnd++;
        }
      }
  
      newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, "");
      newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, "");
  
      var chFrom = Pos(fromLine, cutFront);
      var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
      if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
        replaceRange(cm.doc, newText, chFrom, chTo, "+input");
        return true
      }
    };
  
    ContentEditableInput.prototype.ensurePolled = function () {
      this.forceCompositionEnd();
    };
    ContentEditableInput.prototype.reset = function () {
      this.forceCompositionEnd();
    };
    ContentEditableInput.prototype.forceCompositionEnd = function () {
      if (!this.composing) { return }
      clearTimeout(this.readDOMTimeout);
      this.composing = null;
      this.updateFromDOM();
      this.div.blur();
      this.div.focus();
    };
    ContentEditableInput.prototype.readFromDOMSoon = function () {
        var this$1 = this;
  
      if (this.readDOMTimeout != null) { return }
      this.readDOMTimeout = setTimeout(function () {
        this$1.readDOMTimeout = null;
        if (this$1.composing) {
          if (this$1.composing.done) { this$1.composing = null; }
          else { return }
        }
        this$1.updateFromDOM();
      }, 80);
    };
  
    ContentEditableInput.prototype.updateFromDOM = function () {
        var this$1 = this;
  
      if (this.cm.isReadOnly() || !this.pollContent())
        { runInOp(this.cm, function () { return regChange(this$1.cm); }); }
    };
  
    ContentEditableInput.prototype.setUneditable = function (node) {
      node.contentEditable = "false";
    };
  
    ContentEditableInput.prototype.onKeyPress = function (e) {
      if (e.charCode == 0 || this.composing) { return }
      e.preventDefault();
      if (!this.cm.isReadOnly())
        { operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0); }
    };
  
    ContentEditableInput.prototype.readOnlyChanged = function (val) {
      this.div.contentEditable = String(val != "nocursor");
    };
  
    ContentEditableInput.prototype.onContextMenu = function () {};
    ContentEditableInput.prototype.resetPosition = function () {};
  
    ContentEditableInput.prototype.needsContentAttribute = true;
  
    function posToDOM(cm, pos) {
      var view = findViewForLine(cm, pos.line);
      if (!view || view.hidden) { return null }
      var line = getLine(cm.doc, pos.line);
      var info = mapFromLineView(view, line, pos.line);
  
      var order = getOrder(line, cm.doc.direction), side = "left";
      if (order) {
        var partPos = getBidiPartAt(order, pos.ch);
        side = partPos % 2 ? "right" : "left";
      }
      var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
      result.offset = result.collapse == "right" ? result.end : result.start;
      return result
    }
  
    function isInGutter(node) {
      for (var scan = node; scan; scan = scan.parentNode)
        { if (/CodeMirror-gutter-wrapper/.test(scan.className)) { return true } }
      return false
    }
  
    function badPos(pos, bad) { if (bad) { pos.bad = true; } return pos }
  
    function domTextBetween(cm, from, to, fromLine, toLine) {
      var text = "", closing = false, lineSep = cm.doc.lineSeparator(), extraLinebreak = false;
      function recognizeMarker(id) { return function (marker) { return marker.id == id; } }
      function close() {
        if (closing) {
          text += lineSep;
          if (extraLinebreak) { text += lineSep; }
          closing = extraLinebreak = false;
        }
      }
      function addText(str) {
        if (str) {
          close();
          text += str;
        }
      }
      function walk(node) {
        if (node.nodeType == 1) {
          var cmText = node.getAttribute("cm-text");
          if (cmText) {
            addText(cmText);
            return
          }
          var markerID = node.getAttribute("cm-marker"), range$$1;
          if (markerID) {
            var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
            if (found.length && (range$$1 = found[0].find(0)))
              { addText(getBetween(cm.doc, range$$1.from, range$$1.to).join(lineSep)); }
            return
          }
          if (node.getAttribute("contenteditable") == "false") { return }
          var isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
          if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0) { return }
  
          if (isBlock) { close(); }
          for (var i = 0; i < node.childNodes.length; i++)
            { walk(node.childNodes[i]); }
  
          if (/^(pre|p)$/i.test(node.nodeName)) { extraLinebreak = true; }
          if (isBlock) { closing = true; }
        } else if (node.nodeType == 3) {
          addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
        }
      }
      for (;;) {
        walk(from);
        if (from == to) { break }
        from = from.nextSibling;
        extraLinebreak = false;
      }
      return text
    }
  
    function domToPos(cm, node, offset) {
      var lineNode;
      if (node == cm.display.lineDiv) {
        lineNode = cm.display.lineDiv.childNodes[offset];
        if (!lineNode) { return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true) }
        node = null; offset = 0;
      } else {
        for (lineNode = node;; lineNode = lineNode.parentNode) {
          if (!lineNode || lineNode == cm.display.lineDiv) { return null }
          if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) { break }
        }
      }
      for (var i = 0; i < cm.display.view.length; i++) {
        var lineView = cm.display.view[i];
        if (lineView.node == lineNode)
          { return locateNodeInLineView(lineView, node, offset) }
      }
    }
  
    function locateNodeInLineView(lineView, node, offset) {
      var wrapper = lineView.text.firstChild, bad = false;
      if (!node || !contains(wrapper, node)) { return badPos(Pos(lineNo(lineView.line), 0), true) }
      if (node == wrapper) {
        bad = true;
        node = wrapper.childNodes[offset];
        offset = 0;
        if (!node) {
          var line = lineView.rest ? lst(lineView.rest) : lineView.line;
          return badPos(Pos(lineNo(line), line.text.length), bad)
        }
      }
  
      var textNode = node.nodeType == 3 ? node : null, topNode = node;
      if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
        textNode = node.firstChild;
        if (offset) { offset = textNode.nodeValue.length; }
      }
      while (topNode.parentNode != wrapper) { topNode = topNode.parentNode; }
      var measure = lineView.measure, maps = measure.maps;
  
      function find(textNode, topNode, offset) {
        for (var i = -1; i < (maps ? maps.length : 0); i++) {
          var map$$1 = i < 0 ? measure.map : maps[i];
          for (var j = 0; j < map$$1.length; j += 3) {
            var curNode = map$$1[j + 2];
            if (curNode == textNode || curNode == topNode) {
              var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
              var ch = map$$1[j] + offset;
              if (offset < 0 || curNode != textNode) { ch = map$$1[j + (offset ? 1 : 0)]; }
              return Pos(line, ch)
            }
          }
        }
      }
      var found = find(textNode, topNode, offset);
      if (found) { return badPos(found, bad) }
  
      // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
      for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
        found = find(after, after.firstChild, 0);
        if (found)
          { return badPos(Pos(found.line, found.ch - dist), bad) }
        else
          { dist += after.textContent.length; }
      }
      for (var before = topNode.previousSibling, dist$1 = offset; before; before = before.previousSibling) {
        found = find(before, before.firstChild, -1);
        if (found)
          { return badPos(Pos(found.line, found.ch + dist$1), bad) }
        else
          { dist$1 += before.textContent.length; }
      }
    }
  
    // TEXTAREA INPUT STYLE
  
    var TextareaInput = function(cm) {
      this.cm = cm;
      // See input.poll and input.reset
      this.prevInput = "";
  
      // Flag that indicates whether we expect input to appear real soon
      // now (after some event like 'keypress' or 'input') and are
      // polling intensively.
      this.pollingFast = false;
      // Self-resetting timeout for the poller
      this.polling = new Delayed();
      // Used to work around IE issue with selection being forgotten when focus moves away from textarea
      this.hasSelection = false;
      this.composing = null;
    };
  
    TextareaInput.prototype.init = function (display) {
        var this$1 = this;
  
      var input = this, cm = this.cm;
      this.createField(display);
      var te = this.textarea;
  
      display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
  
      // Needed to hide big blue blinking cursor on Mobile Safari (doesn't seem to work in iOS 8 anymore)
      if (ios) { te.style.width = "0px"; }
  
      on(te, "input", function () {
        if (ie && ie_version >= 9 && this$1.hasSelection) { this$1.hasSelection = null; }
        input.poll();
      });
  
      on(te, "paste", function (e) {
        if (signalDOMEvent(cm, e) || handlePaste(e, cm)) { return }
  
        cm.state.pasteIncoming = +new Date;
        input.fastPoll();
      });
  
      function prepareCopyCut(e) {
        if (signalDOMEvent(cm, e)) { return }
        if (cm.somethingSelected()) {
          setLastCopied({lineWise: false, text: cm.getSelections()});
        } else if (!cm.options.lineWiseCopyCut) {
          return
        } else {
          var ranges = copyableRanges(cm);
          setLastCopied({lineWise: true, text: ranges.text});
          if (e.type == "cut") {
            cm.setSelections(ranges.ranges, null, sel_dontScroll);
          } else {
            input.prevInput = "";
            te.value = ranges.text.join("\n");
            selectInput(te);
          }
        }
        if (e.type == "cut") { cm.state.cutIncoming = +new Date; }
      }
      on(te, "cut", prepareCopyCut);
      on(te, "copy", prepareCopyCut);
  
      on(display.scroller, "paste", function (e) {
        if (eventInWidget(display, e) || signalDOMEvent(cm, e)) { return }
        if (!te.dispatchEvent) {
          cm.state.pasteIncoming = +new Date;
          input.focus();
          return
        }
  
        // Pass the `paste` event to the textarea so it's handled by its event listener.
        var event = new Event("paste");
        event.clipboardData = e.clipboardData;
        te.dispatchEvent(event);
      });
  
      // Prevent normal selection in the editor (we handle our own)
      on(display.lineSpace, "selectstart", function (e) {
        if (!eventInWidget(display, e)) { e_preventDefault(e); }
      });
  
      on(te, "compositionstart", function () {
        var start = cm.getCursor("from");
        if (input.composing) { input.composing.range.clear(); }
        input.composing = {
          start: start,
          range: cm.markText(start, cm.getCursor("to"), {className: "CodeMirror-composing"})
        };
      });
      on(te, "compositionend", function () {
        if (input.composing) {
          input.poll();
          input.composing.range.clear();
          input.composing = null;
        }
      });
    };
  
    TextareaInput.prototype.createField = function (_display) {
      // Wraps and hides input textarea
      this.wrapper = hiddenTextarea();
      // The semihidden textarea that is focused when the editor is
      // focused, and receives input.
      this.textarea = this.wrapper.firstChild;
    };
  
    TextareaInput.prototype.prepareSelection = function () {
      // Redraw the selection and/or cursor
      var cm = this.cm, display = cm.display, doc = cm.doc;
      var result = prepareSelection(cm);
  
      // Move the hidden textarea near the cursor to prevent scrolling artifacts
      if (cm.options.moveInputWithCursor) {
        var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
        var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
        result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
                                            headPos.top + lineOff.top - wrapOff.top));
        result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
                                             headPos.left + lineOff.left - wrapOff.left));
      }
  
      return result
    };
  
    TextareaInput.prototype.showSelection = function (drawn) {
      var cm = this.cm, display = cm.display;
      removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
      removeChildrenAndAdd(display.selectionDiv, drawn.selection);
      if (drawn.teTop != null) {
        this.wrapper.style.top = drawn.teTop + "px";
        this.wrapper.style.left = drawn.teLeft + "px";
      }
    };
  
    // Reset the input to correspond to the selection (or to be empty,
    // when not typing and nothing is selected)
    TextareaInput.prototype.reset = function (typing) {
      if (this.contextMenuPending || this.composing) { return }
      var cm = this.cm;
      if (cm.somethingSelected()) {
        this.prevInput = "";
        var content = cm.getSelection();
        this.textarea.value = content;
        if (cm.state.focused) { selectInput(this.textarea); }
        if (ie && ie_version >= 9) { this.hasSelection = content; }
      } else if (!typing) {
        this.prevInput = this.textarea.value = "";
        if (ie && ie_version >= 9) { this.hasSelection = null; }
      }
    };
  
    TextareaInput.prototype.getField = function () { return this.textarea };
  
    TextareaInput.prototype.supportsTouch = function () { return false };
  
    TextareaInput.prototype.focus = function () {
      if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt() != this.textarea)) {
        try { this.textarea.focus(); }
        catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM
      }
    };
  
    TextareaInput.prototype.blur = function () { this.textarea.blur(); };
  
    TextareaInput.prototype.resetPosition = function () {
      this.wrapper.style.top = this.wrapper.style.left = 0;
    };
  
    TextareaInput.prototype.receivedFocus = function () { this.slowPoll(); };
  
    // Poll for input changes, using the normal rate of polling. This
    // runs as long as the editor is focused.
    TextareaInput.prototype.slowPoll = function () {
        var this$1 = this;
  
      if (this.pollingFast) { return }
      this.polling.set(this.cm.options.pollInterval, function () {
        this$1.poll();
        if (this$1.cm.state.focused) { this$1.slowPoll(); }
      });
    };
  
    // When an event has just come in that is likely to add or change
    // something in the input textarea, we poll faster, to ensure that
    // the change appears on the screen quickly.
    TextareaInput.prototype.fastPoll = function () {
      var missed = false, input = this;
      input.pollingFast = true;
      function p() {
        var changed = input.poll();
        if (!changed && !missed) {missed = true; input.polling.set(60, p);}
        else {input.pollingFast = false; input.slowPoll();}
      }
      input.polling.set(20, p);
    };
  
    // Read input from the textarea, and update the document to match.
    // When something is selected, it is present in the textarea, and
    // selected (unless it is huge, in which case a placeholder is
    // used). When nothing is selected, the cursor sits after previously
    // seen text (can be empty), which is stored in prevInput (we must
    // not reset the textarea when typing, because that breaks IME).
    TextareaInput.prototype.poll = function () {
        var this$1 = this;
  
      var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
      // Since this is called a *lot*, try to bail out as cheaply as
      // possible when it is clear that nothing happened. hasSelection
      // will be the case when there is a lot of text in the textarea,
      // in which case reading its value would be expensive.
      if (this.contextMenuPending || !cm.state.focused ||
          (hasSelection(input) && !prevInput && !this.composing) ||
          cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq)
        { return false }
  
      var text = input.value;
      // If nothing changed, bail.
      if (text == prevInput && !cm.somethingSelected()) { return false }
      // Work around nonsensical selection resetting in IE9/10, and
      // inexplicable appearance of private area unicode characters on
      // some key combos in Mac (#2689).
      if (ie && ie_version >= 9 && this.hasSelection === text ||
          mac && /[\uf700-\uf7ff]/.test(text)) {
        cm.display.input.reset();
        return false
      }
  
      if (cm.doc.sel == cm.display.selForContextMenu) {
        var first = text.charCodeAt(0);
        if (first == 0x200b && !prevInput) { prevInput = "\u200b"; }
        if (first == 0x21da) { this.reset(); return this.cm.execCommand("undo") }
      }
      // Find the part of the input that is actually new
      var same = 0, l = Math.min(prevInput.length, text.length);
      while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) { ++same; }
  
      runInOp(cm, function () {
        applyTextInput(cm, text.slice(same), prevInput.length - same,
                       null, this$1.composing ? "*compose" : null);
  
        // Don't leave long text in the textarea, since it makes further polling slow
        if (text.length > 1000 || text.indexOf("\n") > -1) { input.value = this$1.prevInput = ""; }
        else { this$1.prevInput = text; }
  
        if (this$1.composing) {
          this$1.composing.range.clear();
          this$1.composing.range = cm.markText(this$1.composing.start, cm.getCursor("to"),
                                             {className: "CodeMirror-composing"});
        }
      });
      return true
    };
  
    TextareaInput.prototype.ensurePolled = function () {
      if (this.pollingFast && this.poll()) { this.pollingFast = false; }
    };
  
    TextareaInput.prototype.onKeyPress = function () {
      if (ie && ie_version >= 9) { this.hasSelection = null; }
      this.fastPoll();
    };
  
    TextareaInput.prototype.onContextMenu = function (e) {
      var input = this, cm = input.cm, display = cm.display, te = input.textarea;
      if (input.contextMenuPending) { input.contextMenuPending(); }
      var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
      if (!pos || presto) { return } // Opera is difficult.
  
      // Reset the current text selection only if the click is done outside of the selection
      // and 'resetSelectionOnContextMenu' option is true.
      var reset = cm.options.resetSelectionOnContextMenu;
      if (reset && cm.doc.sel.contains(pos) == -1)
        { operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll); }
  
      var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
      var wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
      input.wrapper.style.cssText = "position: static";
      te.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - wrapperBox.top - 5) + "px; left: " + (e.clientX - wrapperBox.left - 5) + "px;\n      z-index: 1000; background: " + (ie ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
      var oldScrollY;
      if (webkit) { oldScrollY = window.scrollY; } // Work around Chrome issue (#2712)
      display.input.focus();
      if (webkit) { window.scrollTo(null, oldScrollY); }
      display.input.reset();
      // Adds "Select all" to context menu in FF
      if (!cm.somethingSelected()) { te.value = input.prevInput = " "; }
      input.contextMenuPending = rehide;
      display.selForContextMenu = cm.doc.sel;
      clearTimeout(display.detectingSelectAll);
  
      // Select-all will be greyed out if there's nothing to select, so
      // this adds a zero-width space so that we can later check whether
      // it got selected.
      function prepareSelectAllHack() {
        if (te.selectionStart != null) {
          var selected = cm.somethingSelected();
          var extval = "\u200b" + (selected ? te.value : "");
          te.value = "\u21da"; // Used to catch context-menu undo
          te.value = extval;
          input.prevInput = selected ? "" : "\u200b";
          te.selectionStart = 1; te.selectionEnd = extval.length;
          // Re-set this, in case some other handler touched the
          // selection in the meantime.
          display.selForContextMenu = cm.doc.sel;
        }
      }
      function rehide() {
        if (input.contextMenuPending != rehide) { return }
        input.contextMenuPending = false;
        input.wrapper.style.cssText = oldWrapperCSS;
        te.style.cssText = oldCSS;
        if (ie && ie_version < 9) { display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos); }
  
        // Try to detect the user choosing select-all
        if (te.selectionStart != null) {
          if (!ie || (ie && ie_version < 9)) { prepareSelectAllHack(); }
          var i = 0, poll = function () {
            if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 &&
                te.selectionEnd > 0 && input.prevInput == "\u200b") {
              operation(cm, selectAll)(cm);
            } else if (i++ < 10) {
              display.detectingSelectAll = setTimeout(poll, 500);
            } else {
              display.selForContextMenu = null;
              display.input.reset();
            }
          };
          display.detectingSelectAll = setTimeout(poll, 200);
        }
      }
  
      if (ie && ie_version >= 9) { prepareSelectAllHack(); }
      if (captureRightClick) {
        e_stop(e);
        var mouseup = function () {
          off(window, "mouseup", mouseup);
          setTimeout(rehide, 20);
        };
        on(window, "mouseup", mouseup);
      } else {
        setTimeout(rehide, 50);
      }
    };
  
    TextareaInput.prototype.readOnlyChanged = function (val) {
      if (!val) { this.reset(); }
      this.textarea.disabled = val == "nocursor";
    };
  
    TextareaInput.prototype.setUneditable = function () {};
  
    TextareaInput.prototype.needsContentAttribute = false;
  
    function fromTextArea(textarea, options) {
      options = options ? copyObj(options) : {};
      options.value = textarea.value;
      if (!options.tabindex && textarea.tabIndex)
        { options.tabindex = textarea.tabIndex; }
      if (!options.placeholder && textarea.placeholder)
        { options.placeholder = textarea.placeholder; }
      // Set autofocus to true if this textarea is focused, or if it has
      // autofocus and no other element is focused.
      if (options.autofocus == null) {
        var hasFocus = activeElt();
        options.autofocus = hasFocus == textarea ||
          textarea.getAttribute("autofocus") != null && hasFocus == document.body;
      }
  
      function save() {textarea.value = cm.getValue();}
  
      var realSubmit;
      if (textarea.form) {
        on(textarea.form, "submit", save);
        // Deplorable hack to make the submit method do the right thing.
        if (!options.leaveSubmitMethodAlone) {
          var form = textarea.form;
          realSubmit = form.submit;
          try {
            var wrappedSubmit = form.submit = function () {
              save();
              form.submit = realSubmit;
              form.submit();
              form.submit = wrappedSubmit;
            };
          } catch(e) {}
        }
      }
  
      options.finishInit = function (cm) {
        cm.save = save;
        cm.getTextArea = function () { return textarea; };
        cm.toTextArea = function () {
          cm.toTextArea = isNaN; // Prevent this from being ran twice
          save();
          textarea.parentNode.removeChild(cm.getWrapperElement());
          textarea.style.display = "";
          if (textarea.form) {
            off(textarea.form, "submit", save);
            if (typeof textarea.form.submit == "function")
              { textarea.form.submit = realSubmit; }
          }
        };
      };
  
      textarea.style.display = "none";
      var cm = CodeMirror(function (node) { return textarea.parentNode.insertBefore(node, textarea.nextSibling); },
        options);
      return cm
    }
  
    function addLegacyProps(CodeMirror) {
      CodeMirror.off = off;
      CodeMirror.on = on;
      CodeMirror.wheelEventPixels = wheelEventPixels;
      CodeMirror.Doc = Doc;
      CodeMirror.splitLines = splitLinesAuto;
      CodeMirror.countColumn = countColumn;
      CodeMirror.findColumn = findColumn;
      CodeMirror.isWordChar = isWordCharBasic;
      CodeMirror.Pass = Pass;
      CodeMirror.signal = signal;
      CodeMirror.Line = Line;
      CodeMirror.changeEnd = changeEnd;
      CodeMirror.scrollbarModel = scrollbarModel;
      CodeMirror.Pos = Pos;
      CodeMirror.cmpPos = cmp;
      CodeMirror.modes = modes;
      CodeMirror.mimeModes = mimeModes;
      CodeMirror.resolveMode = resolveMode;
      CodeMirror.getMode = getMode;
      CodeMirror.modeExtensions = modeExtensions;
      CodeMirror.extendMode = extendMode;
      CodeMirror.copyState = copyState;
      CodeMirror.startState = startState;
      CodeMirror.innerMode = innerMode;
      CodeMirror.commands = commands;
      CodeMirror.keyMap = keyMap;
      CodeMirror.keyName = keyName;
      CodeMirror.isModifierKey = isModifierKey;
      CodeMirror.lookupKey = lookupKey;
      CodeMirror.normalizeKeyMap = normalizeKeyMap;
      CodeMirror.StringStream = StringStream;
      CodeMirror.SharedTextMarker = SharedTextMarker;
      CodeMirror.TextMarker = TextMarker;
      CodeMirror.LineWidget = LineWidget;
      CodeMirror.e_preventDefault = e_preventDefault;
      CodeMirror.e_stopPropagation = e_stopPropagation;
      CodeMirror.e_stop = e_stop;
      CodeMirror.addClass = addClass;
      CodeMirror.contains = contains;
      CodeMirror.rmClass = rmClass;
      CodeMirror.keyNames = keyNames;
    }
  
    // EDITOR CONSTRUCTOR
  
    defineOptions(CodeMirror);
  
    addEditorMethods(CodeMirror);
  
    // Set up methods on CodeMirror's prototype to redirect to the editor's document.
    var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
    for (var prop in Doc.prototype) { if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
      { CodeMirror.prototype[prop] = (function(method) {
        return function() {return method.apply(this.doc, arguments)}
      })(Doc.prototype[prop]); } }
  
    eventMixin(Doc);
    CodeMirror.inputStyles = {"textarea": TextareaInput, "contenteditable": ContentEditableInput};
  
    // Extra arguments are stored as the mode's dependencies, which is
    // used by (legacy) mechanisms like loadmode.js to automatically
    // load a mode. (Preferred mechanism is the require/define calls.)
    CodeMirror.defineMode = function(name/*, mode, …*/) {
      if (!CodeMirror.defaults.mode && name != "null") { CodeMirror.defaults.mode = name; }
      defineMode.apply(this, arguments);
    };
  
    CodeMirror.defineMIME = defineMIME;
  
    // Minimal default mode.
    CodeMirror.defineMode("null", function () { return ({token: function (stream) { return stream.skipToEnd(); }}); });
    CodeMirror.defineMIME("text/plain", "null");
  
    // EXTENSIONS
  
    CodeMirror.defineExtension = function (name, func) {
      CodeMirror.prototype[name] = func;
    };
    CodeMirror.defineDocExtension = function (name, func) {
      Doc.prototype[name] = func;
    };
  
    CodeMirror.fromTextArea = fromTextArea;
  
    addLegacyProps(CodeMirror);
  
    CodeMirror.version = "5.45.0";
  
    return CodeMirror;
  
  })));
  ;
  
  // CodeMirror, copyright (c) by Marijn Haverbeke and others
  // Distributed under an MIT license: https://codemirror.net/LICENSE
  
  ;(function(mod) {
    if (typeof exports == "object" && typeof module == "object")
      // CommonJS
      mod(require("../../lib/codemirror"))
    else if (typeof define == "function" && define.amd)
      // AMD
      define(["../../lib/codemirror"], mod)
    // Plain browser env
    else mod(CodeMirror)
  })(function(CodeMirror) {
    "use strict"
  
    var HINT_ELEMENT_CLASS = "CodeMirror-hint"
    var ACTIVE_HINT_ELEMENT_CLASS = "CodeMirror-hint-active"
  
    // This is the old interface, kept around for now to stay
    // backwards-compatible.
    CodeMirror.showHint = function(cm, getHints, options) {
      if (!getHints) return cm.showHint(options)
      if (options && options.async) getHints.async = true
      var newOpts = { hint: getHints }
      if (options) for (var prop in options) newOpts[prop] = options[prop]
      return cm.showHint(newOpts)
    }
  
    CodeMirror.defineExtension("showHint", function(options) {
      options = parseOptions(this, this.getCursor("start"), options)
      var selections = this.listSelections()
      if (selections.length > 1) return
      // By default, don't allow completion when something is selected.
      // A hint function can have a `supportsSelection` property to
      // indicate that it can handle selections.
      if (this.somethingSelected()) {
        if (!options.hint.supportsSelection) return
        // Don't try with cross-line selections
        for (var i = 0; i < selections.length; i++) if (selections[i].head.line != selections[i].anchor.line) return
      }
  
      if (this.state.completionActive) this.state.completionActive.close()
      var completion = (this.state.completionActive = new Completion(this, options))
      if (!completion.options.hint) return
  
      CodeMirror.signal(this, "startCompletion", this)
      completion.update(true)
    })
  
    CodeMirror.defineExtension("closeHint", function() {
      if (this.state.completionActive) this.state.completionActive.close()
    })
  
    function Completion(cm, options) {
      this.cm = cm
      this.options = options
      this.widget = null
      this.debounce = 0
      this.tick = 0
      this.startPos = this.cm.getCursor("start")
      this.startLen = this.cm.getLine(this.startPos.line).length - this.cm.getSelection().length
  
      var self = this
      cm.on(
        "cursorActivity",
        (this.activityFunc = function() {
          self.cursorActivity()
        })
      )
    }
  
    var requestAnimationFrame =
      window.requestAnimationFrame ||
      function(fn) {
        return setTimeout(fn, 1000 / 60)
      }
    var cancelAnimationFrame = window.cancelAnimationFrame || clearTimeout
  
    Completion.prototype = {
      close: function() {
        if (!this.active()) return
        this.cm.state.completionActive = null
        this.tick = null
        this.cm.off("cursorActivity", this.activityFunc)
  
        if (this.widget && this.data) CodeMirror.signal(this.data, "close")
        if (this.widget) this.widget.close()
        CodeMirror.signal(this.cm, "endCompletion", this.cm)
      },
  
      active: function() {
        return this.cm.state.completionActive == this
      },
  
      pick: function(data, i) {
        var completion = data.list[i]
        if (completion.hint) completion.hint(this.cm, data, completion)
        else this.cm.replaceRange(getText(completion), completion.from || data.from, completion.to || data.to, "complete")
        CodeMirror.signal(data, "pick", completion)
        this.close()
      },
  
      cursorActivity: function() {
        if (this.debounce) {
          cancelAnimationFrame(this.debounce)
          this.debounce = 0
        }
  
        var pos = this.cm.getCursor(),
          line = this.cm.getLine(pos.line)
        if (
          pos.line != this.startPos.line ||
          line.length - pos.ch != this.startLen - this.startPos.ch ||
          pos.ch < this.startPos.ch ||
          this.cm.somethingSelected() ||
          (!pos.ch || this.options.closeCharacters.test(line.charAt(pos.ch - 1)))
        ) {
          this.close()
        } else {
          var self = this
          this.debounce = requestAnimationFrame(function() {
            self.update()
          })
          if (this.widget) this.widget.disable()
        }
      },
  
      update: function(first) {
        if (this.tick == null) return
        var self = this,
          myTick = ++this.tick
        fetchHints(this.options.hint, this.cm, this.options, function(data) {
          if (self.tick == myTick) self.finishUpdate(data, first)
        })
      },
  
      finishUpdate: function(data, first) {
        if (this.data) CodeMirror.signal(this.data, "update")
  
        var picked = (this.widget && this.widget.picked) || (first && this.options.completeSingle)
        if (this.widget) this.widget.close()
  
        this.data = data
  
        if (data && data.list.length) {
          if (picked && data.list.length == 1) {
            this.pick(data, 0)
          } else {
            this.widget = new Widget(this, data)
            CodeMirror.signal(data, "shown")
          }
        }
      }
    }
  
    function parseOptions(cm, pos, options) {
      var editor = cm.options.hintOptions
      var out = {}
      for (var prop in defaultOptions) out[prop] = defaultOptions[prop]
      if (editor) for (var prop in editor) if (editor[prop] !== undefined) out[prop] = editor[prop]
      if (options) for (var prop in options) if (options[prop] !== undefined) out[prop] = options[prop]
      if (out.hint.resolve) out.hint = out.hint.resolve(cm, pos)
      return out
    }
  
    function getText(completion) {
      if (typeof completion == "string") return completion
      else return completion.text
    }
  
    function buildKeyMap(completion, handle) {
      var baseMap = {
        Up: function() {
          handle.moveFocus(-1)
        },
        Down: function() {
          handle.moveFocus(1)
        },
        PageUp: function() {
          handle.moveFocus(-handle.menuSize() + 1, true)
        },
        PageDown: function() {
          handle.moveFocus(handle.menuSize() - 1, true)
        },
        Home: function() {
          handle.setFocus(0)
        },
        End: function() {
          handle.setFocus(handle.length - 1)
        },
        Enter: handle.pick,
        Tab: handle.pick,
        Esc: handle.close
      }
  
      var mac = /Mac/.test(navigator.platform)
  
      if (mac) {
        baseMap["Ctrl-P"] = function() {
          handle.moveFocus(-1)
        }
        baseMap["Ctrl-N"] = function() {
          handle.moveFocus(1)
        }
      }
  
      var custom = completion.options.customKeys
      var ourMap = custom ? {} : baseMap
      function addBinding(key, val) {
        var bound
        if (typeof val != "string")
          bound = function(cm) {
            return val(cm, handle)
          }
        // This mechanism is deprecated
        else if (baseMap.hasOwnProperty(val)) bound = baseMap[val]
        else bound = val
        ourMap[key] = bound
      }
      if (custom) for (var key in custom) if (custom.hasOwnProperty(key)) addBinding(key, custom[key])
      var extra = completion.options.extraKeys
      if (extra) for (var key in extra) if (extra.hasOwnProperty(key)) addBinding(key, extra[key])
      return ourMap
    }
  
    function getHintElement(hintsElement, el) {
      while (el && el != hintsElement) {
        if (el.nodeName.toUpperCase() === "LI" && el.parentNode == hintsElement) return el
        el = el.parentNode
      }
    }
  
    function Widget(completion, data) {
      this.completion = completion
      this.data = data
      this.picked = false
      var widget = this,
        cm = completion.cm
      var ownerDocument = cm.getInputField().ownerDocument
      var parentWindow = ownerDocument.defaultView || ownerDocument.parentWindow
  
      var hints = (this.hints = ownerDocument.createElement("ul"))
      var theme = completion.cm.options.theme
      hints.className = "CodeMirror-hints " + theme
      this.selectedHint = data.selectedHint || 0
  
      var completions = data.list
      for (var i = 0; i < completions.length; ++i) {
        var elt = hints.appendChild(ownerDocument.createElement("li")),
          cur = completions[i]
        var className = HINT_ELEMENT_CLASS + (i != this.selectedHint ? "" : " " + ACTIVE_HINT_ELEMENT_CLASS)
        if (cur.className != null) className = cur.className + " " + className
        elt.className = className
        if (cur.render) cur.render(elt, data, cur)
        else elt.appendChild(ownerDocument.createTextNode(cur.displayText || getText(cur)))
        elt.hintId = i
      }
  
      var pos = cm.cursorCoords(completion.options.alignWithWord ? data.from : null)
      var left = pos.left,
        top = pos.bottom,
        below = true
      hints.style.left = left + "px"
      hints.style.top = top + "px"
      // If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
      var winW =
        parentWindow.innerWidth || Math.max(ownerDocument.body.offsetWidth, ownerDocument.documentElement.offsetWidth)
      var winH =
        parentWindow.innerHeight || Math.max(ownerDocument.body.offsetHeight, ownerDocument.documentElement.offsetHeight)
      ;(completion.options.container || ownerDocument.body).appendChild(hints)
      var box = hints.getBoundingClientRect(),
        overlapY = box.bottom - winH
      var scrolls = hints.scrollHeight > hints.clientHeight + 1
      var startScroll = cm.getScrollInfo()
  
      if (overlapY > 0) {
        var height = box.bottom - box.top,
          curTop = pos.top - (pos.bottom - box.top)
        if (curTop - height > 0) {
          // Fits above cursor
          hints.style.top = (top = pos.top - height) + "px"
          below = false
        } else if (height > winH) {
          hints.style.height = winH - 5 + "px"
          hints.style.top = (top = pos.bottom - box.top) + "px"
          var cursor = cm.getCursor()
          if (data.from.ch != cursor.ch) {
            pos = cm.cursorCoords(cursor)
            hints.style.left = (left = pos.left) + "px"
            box = hints.getBoundingClientRect()
          }
        }
      }
      var overlapX = box.right - winW
      if (overlapX > 0) {
        if (box.right - box.left > winW) {
          hints.style.width = winW - 5 + "px"
          overlapX -= box.right - box.left - winW
        }
        hints.style.left = (left = pos.left - overlapX) + "px"
      }
      if (scrolls)
        for (var node = hints.firstChild; node; node = node.nextSibling)
          node.style.paddingRight = cm.display.nativeBarWidth + "px"
  
      cm.addKeyMap(
        (this.keyMap = buildKeyMap(completion, {
          moveFocus: function(n, avoidWrap) {
            widget.changeActive(widget.selectedHint + n, avoidWrap)
          },
          setFocus: function(n) {
            widget.changeActive(n)
          },
          menuSize: function() {
            return widget.screenAmount()
          },
          length: completions.length,
          close: function() {
            completion.close()
          },
          pick: function() {
            widget.pick()
          },
          data: data
        }))
      )
  
      if (completion.options.closeOnUnfocus) {
        var closingOnBlur
        cm.on(
          "blur",
          (this.onBlur = function() {
            closingOnBlur = setTimeout(function() {
              completion.close()
            }, 100)
          })
        )
        cm.on(
          "focus",
          (this.onFocus = function() {
            clearTimeout(closingOnBlur)
          })
        )
      }
  
      cm.on(
        "scroll",
        (this.onScroll = function() {
          var curScroll = cm.getScrollInfo(),
            editor = cm.getWrapperElement().getBoundingClientRect()
          var newTop = top + startScroll.top - curScroll.top
          var point =
            newTop - (parentWindow.pageYOffset || (ownerDocument.documentElement || ownerDocument.body).scrollTop)
          if (!below) point += hints.offsetHeight
          if (point <= editor.top || point >= editor.bottom) return completion.close()
          hints.style.top = newTop + "px"
          hints.style.left = left + startScroll.left - curScroll.left + "px"
        })
      )
  
      CodeMirror.on(hints, "dblclick", function(e) {
        var t = getHintElement(hints, e.target || e.srcElement)
        if (t && t.hintId != null) {
          widget.changeActive(t.hintId)
          widget.pick()
        }
      })
  
      CodeMirror.on(hints, "click", function(e) {
        var t = getHintElement(hints, e.target || e.srcElement)
        if (t && t.hintId != null) {
          widget.changeActive(t.hintId)
          if (completion.options.completeOnSingleClick) widget.pick()
        }
      })
  
      CodeMirror.on(hints, "mousedown", function() {
        setTimeout(function() {
          cm.focus()
        }, 20)
      })
  
      CodeMirror.signal(data, "select", completions[this.selectedHint], hints.childNodes[this.selectedHint])
      return true
    }
  
    Widget.prototype = {
      close: function() {
        if (this.completion.widget != this) return
        this.completion.widget = null
        this.hints.parentNode.removeChild(this.hints)
        this.completion.cm.removeKeyMap(this.keyMap)
  
        var cm = this.completion.cm
        if (this.completion.options.closeOnUnfocus) {
          cm.off("blur", this.onBlur)
          cm.off("focus", this.onFocus)
        }
        cm.off("scroll", this.onScroll)
      },
  
      disable: function() {
        this.completion.cm.removeKeyMap(this.keyMap)
        var widget = this
        this.keyMap = {
          Enter: function() {
            widget.picked = true
          }
        }
        this.completion.cm.addKeyMap(this.keyMap)
      },
  
      pick: function() {
        this.completion.pick(this.data, this.selectedHint)
      },
  
      changeActive: function(i, avoidWrap) {
        if (i >= this.data.list.length) i = avoidWrap ? this.data.list.length - 1 : 0
        else if (i < 0) i = avoidWrap ? 0 : this.data.list.length - 1
        if (this.selectedHint == i) return
        var node = this.hints.childNodes[this.selectedHint]
        if (node) node.className = node.className.replace(" " + ACTIVE_HINT_ELEMENT_CLASS, "")
        node = this.hints.childNodes[(this.selectedHint = i)]
        node.className += " " + ACTIVE_HINT_ELEMENT_CLASS
        if (node.offsetTop < this.hints.scrollTop) this.hints.scrollTop = node.offsetTop - 3
        else if (node.offsetTop + node.offsetHeight > this.hints.scrollTop + this.hints.clientHeight)
          this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3
        CodeMirror.signal(this.data, "select", this.data.list[this.selectedHint], node)
      },
  
      screenAmount: function() {
        return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1
      }
    }
  
    function applicableHelpers(cm, helpers) {
      if (!cm.somethingSelected()) return helpers
      var result = []
      for (var i = 0; i < helpers.length; i++) if (helpers[i].supportsSelection) result.push(helpers[i])
      return result
    }
  
    function fetchHints(hint, cm, options, callback) {
      if (hint.async) {
        hint(cm, callback, options)
      } else {
        var result = hint(cm, options)
        if (result && result.then) result.then(callback)
        else callback(result)
      }
    }
  
    function resolveAutoHints(cm, pos) {
      var helpers = cm.getHelpers(pos, "hint"),
        words
      if (helpers.length) {
        var resolved = function(cm, callback, options) {
          var app = applicableHelpers(cm, helpers)
          function run(i) {
            if (i == app.length) return callback(null)
            fetchHints(app[i], cm, options, function(result) {
              if (result && result.list.length > 0) callback(result)
              else run(i + 1)
            })
          }
          run(0)
        }
        resolved.async = true
        resolved.supportsSelection = true
        return resolved
      } else if ((words = cm.getHelper(cm.getCursor(), "hintWords"))) {
        return function(cm) {
          return CodeMirror.hint.fromList(cm, { words: words })
        }
      } else if (CodeMirror.hint.anyword) {
        return function(cm, options) {
          return CodeMirror.hint.anyword(cm, options)
        }
      } else {
        return function() {}
      }
    }
  
    CodeMirror.registerHelper("hint", "auto", {
      resolve: resolveAutoHints
    })
  
    CodeMirror.registerHelper("hint", "fromList", function(cm, options) {
      var cur = cm.getCursor(),
        token = cm.getTokenAt(cur)
      var term,
        from = CodeMirror.Pos(cur.line, token.start),
        to = cur
      if (token.start < cur.ch && /\w/.test(token.string.charAt(cur.ch - token.start - 1))) {
        term = token.string.substr(0, cur.ch - token.start)
      } else {
        term = ""
        from = cur
      }
      var found = []
      for (var i = 0; i < options.words.length; i++) {
        var word = options.words[i]
        if (word.slice(0, term.length) == term) found.push(word)
      }
  
      if (found.length) return { list: found, from: from, to: to }
    })
  
    CodeMirror.commands.autocomplete = CodeMirror.showHint
  
    var defaultOptions = {
      hint: CodeMirror.hint.auto,
      completeSingle: true,
      alignWithWord: true,
      closeCharacters: /[\s()\[\]{};:>,]/,
      closeOnUnfocus: true,
      completeOnSingleClick: true,
      container: null,
      customKeys: null,
      extraKeys: null
    }
  
    CodeMirror.defineOption("hintOptions", null)
  })
  
  
  {
  
  
  class abstractFactNode extends GrammarBackedNode {
        get keywordCell() {
        return this.getWord(0)
      }
      }
  
  class abstractUrlNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get urlCell() {
        return this.getWord(1)
      }
      }
  
  class annualReportsUrlNode extends abstractUrlNode {
        
      }
  
  class abstractChatUrlNode extends abstractUrlNode {
        
      }
  
  class discordNode extends abstractChatUrlNode {
        
      }
  
  class ircNode extends abstractChatUrlNode {
        
      }
  
  class zulipNode extends abstractChatUrlNode {
        
      }
  
  class cheatSheetUrlNode extends abstractUrlNode {
        
      }
  
  class demoVideoNode extends abstractUrlNode {
        
      }
  
  class documentationNode extends abstractUrlNode {
        
      }
  
  class downloadPageUrlNode extends abstractUrlNode {
        
      }
  
  class ebookNode extends abstractUrlNode {
        
      }
  
  class emailListNode extends abstractUrlNode {
        
      }
  
  class esolangNode extends abstractUrlNode {
        get sourceDomain() { return `esolangs.org` }
      }
  
  class eventsPageUrlNode extends abstractUrlNode {
        
      }
  
  class faqPageUrlNode extends abstractUrlNode {
        
      }
  
  class abstractGitRepoUrlNode extends abstractUrlNode {
        
      }
  
  class gitRepoNode extends abstractGitRepoUrlNode {
        
      }
  
  class githubRepoNode extends abstractGitRepoUrlNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"description" : githubDescriptionNode,
  "subscribers" : githubSubscribersNode,
  "forks" : githubForksNode,
  "stars" : githubStarsNode,
  "issues" : githubIssuesNode,
  "created" : githubCreatedNode,
  "updated" : githubUpdatedNode,
  "firstCommit" : githubFirstCommitNode}), undefined)
    }
  get keywordCell() {
        return this.getWord(0)
      }
  get githubRepoUrlCell() {
        return this.getWord(1)
      }
  get sourceDomain() { return `github.com` }
      }
  
  class gitlabRepoNode extends abstractGitRepoUrlNode {
        get sourceDomain() { return `gitlab.com` }
      }
  
  class sourcehutRepoNode extends abstractGitRepoUrlNode {
        get sourceDomain() { return `sr.ht` }
      }
  
  class firstAnnouncementNode extends abstractUrlNode {
        
      }
  
  class screenshotNode extends abstractUrlNode {
        
      }
  
  class photoNode extends abstractUrlNode {
        
      }
  
  class languageServerProtocolProjectNode extends abstractUrlNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"writtenIn" : writtenInNode}), undefined)
    }
  get sourceDomain() { return `langserver.org` }
      }
  
  class officialBlogUrlNode extends abstractUrlNode {
        
      }
  
  class packageRepositoryNode extends abstractUrlNode {
        
      }
  
  class redditDiscussionNode extends abstractUrlNode {
        get sourceDomain() { return `reddit.com` }
      }
  
  class referenceNode extends abstractUrlNode {
        
      }
  
  class rijuReplNode extends abstractUrlNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"gitRepo" : gitRepoNode,
  "website" : websiteNode,
  "description" : githubDescriptionNode,
  "example" : wikipediaExampleNode,
  "helloWorldCollection" : helloWorldCollectionNode,
  "fileExtensions" : githubLanguageFileExtensionsNode}), undefined)
    }
  get sourceDomain() { return `riju.codes` }
      }
  
  class specNode extends abstractUrlNode {
        
      }
  
  class releaseNotesUrlNode extends abstractUrlNode {
        
      }
  
  class websiteNode extends abstractUrlNode {
        
      }
  
  class webReplNode extends abstractUrlNode {
        
      }
  
  class abstractUrlGuidNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get urlCell() {
        return this.getWord(1)
      }
      }
  
  class antlrNode extends abstractUrlGuidNode {
        get sourceDomain() { return `www.antlr.org` }
      }
  
  class hoplNode extends abstractUrlGuidNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get urlCell() {
        return this.getWord(1)
      }
  get sourceDomain() { return `hopl.info` }
      }
  
  class jupyterKernelNode extends abstractUrlGuidNode {
        get sourceDomain() { return `jupyter.org` }
      }
  
  class meetupNode extends abstractUrlGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"memberCount" : meetupMemberCountNode,
  "groupCount" : meetupGroupCountNode}), undefined)
    }
  get sourceDomain() { return `meetup.com` }
      }
  
  class subredditNode extends abstractUrlGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"memberCount" : subredditMemberCountNode}), undefined)
    }
  get sourceDomain() { return `reddit.com` }
      }
  
  class replitNode extends abstractUrlGuidNode {
        get sourceDomain() { return `replit.com` }
      }
  
  class rosettaCodeNode extends abstractUrlGuidNode {
        get sourceDomain() { return `rosettacode.org` }
      }
  
  class twitterNode extends abstractUrlGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"followers" : twitterFollowersNode}), undefined)
    }
  get sourceDomain() { return `twitter.com` }
      }
  
  class abstractOneWordGuidNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get externalGuidCell() {
        return this.getWord(1)
      }
      }
  
  class codeMirrorNode extends abstractOneWordGuidNode {
        get sourceDomain() { return `codemirror.net` }
      }
  
  class monacoNode extends abstractOneWordGuidNode {
        get sourceDomain() { return `microsoft.github.io/monaco-editor/` }
      }
  
  class tryItOnlineNode extends abstractOneWordGuidNode {
        get sourceDomain() { return `tio.run` }
      }
  
  class ubuntuPackageNode extends abstractOneWordGuidNode {
        get sourceDomain() { return `ubuntu.com` }
      }
  
  class abstractMultiwordGuidNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get externalGuidCell() {
        return this.getWordsFrom(1)
      }
      }
  
  class compilerExplorerNode extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"example" : wikipediaExampleNode,
  "helloWorldCollection" : helloWorldCollectionNode}), undefined)
    }
  get sourceDomain() { return `godbolt.org` }
      }
  
  class githubBigQueryNode extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"users" : githubBigQueryUserCountNode,
  "repos" : githubBigQueryRepoCountNode}), undefined)
    }
  get sourceDomain() { return `cloud.google.com` }
      }
  
  class githubLanguageNode extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"trendingProjects" : githubTrendingProjectsNode,
  "fileExtensions" : githubLanguageFileExtensionsNode,
  "filenames" : fileNamesNode,
  "interpreters" : githubLanguageInterpretersNode,
  "aliases" : githubLanguageAliasesNode,
  "trendingProjectsCount" : githubTrendingProjectsCountNode,
  "repos" : githubRepoCountNode,
  "ace_mode" : githubLanguageAceModeNode,
  "codemirror_mode" : githubLanguageCodemirrorModeNode,
  "codemirror_mime_type" : githubLanguageCodemirrorMimeTypeNode,
  "tm_scope" : githubLanguageTmScopeNode,
  "wrap" : githubLanguageWrapNode,
  "type" : githubLanguageTypeNode,
  "group" : githubLanguageGroupNode}), undefined)
    }
  get sourceDomain() { return `github.com` }
      }
  
  class leachim6Node extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"example" : leachim6ExampleNode,
  "fileExtensions" : githubLanguageFileExtensionsNode,
  "filepath" : filepathNode}), undefined)
    }
  get sourceDomain() { return `github.com/leachim6/hello-world` }
      }
  
  class projectEulerNode extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"memberCount" : projectEulerMemberCountNode}), undefined)
    }
  get sourceDomain() { return `projecteuler.net` }
      }
  
  class pygmentsHighlighterNode extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"fileExtensions" : githubLanguageFileExtensionsNode,
  "filename" : pygmentsFilenameNode}), undefined)
    }
  get sourceDomain() { return `pygments.org` }
      }
  
  class pyplNode extends abstractMultiwordGuidNode {
        get sourceDomain() { return `pypl.github.io` }
      }
  
  class quineRelayNode extends abstractMultiwordGuidNode {
        get sourceDomain() { return `github.com/mame/quine-relay` }
      }
  
  class stackOverflowSurveyNode extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, undefined, [{regex: /\d+/, nodeConstructor: stackOverflowSurveyYearNode}])
    }
  get sourceDomain() { return `insights.stackoverflow.com` }
      }
  
  class tiobeNode extends abstractMultiwordGuidNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"currentRank" : tiobeCurrentRankNode}), undefined)
    }
  get sourceDomain() { return `tiobe.com` }
      }
  
  class conferenceNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get urlCell() {
        return this.getWord(1)
      }
  get conferenceNameCell() {
        return this.getWordsFrom(2)
      }
      }
  
  class dblpNode extends abstractFactNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"publications" : dblpPublicationsNode}), undefined)
    }
  get sourceDomain() { return `dblp.org` }
  get fromCrawler() { return true }
      }
  
  class abstractDelimitedBlobNode extends abstractFactNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get includeChildrenInCsv() { return false }
      }
  
  class dblpPublicationsNode extends abstractDelimitedBlobNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get keywordCell() {
        return this.getWord(0)
      }
      }
  
  class githubTrendingProjectsNode extends abstractDelimitedBlobNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get fromCrawler() { return true }
      }
  
  class goodreadsNode extends abstractDelimitedBlobNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get sourceDomain() { return `goodreads.com` }
  get fromCrawler() { return true }
      }
  
  class hackerNewsDiscussionsNode extends abstractDelimitedBlobNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get sourceDomain() { return `news.ycombinator.com` }
  get fromCrawler() { return true }
      }
  
  class isbndbNode extends abstractDelimitedBlobNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get sourceDomain() { return `isbndb.com` }
  get fromCrawler() { return true }
      }
  
  class semanticScholarNode extends abstractDelimitedBlobNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get sourceDomain() { return `semanticscholar.org` }
  get fromCrawler() { return true }
      }
  
  class descriptionNode extends abstractFactNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get includeChildrenInCsv() { return false }
  get alwaysRecommended() { return true }
      }
  
  class githubDescriptionNode extends descriptionNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
      }
  
  class abstractCodeNode extends abstractFactNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get includeChildrenInCsv() { return false }
      }
  
  class equationNode extends abstractCodeNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
      }
  
  class exampleNode extends abstractCodeNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
      }
  
  class helloWorldCollectionNode extends exampleNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get keywordCell() {
        return this.getWord(0)
      }
  get helloWorldCollectionIdCell() {
        return this.getWordsFrom(1)
      }
  get sourceDomain() { return `helloworldcollection.de` }
      }
  
  class leachim6ExampleNode extends exampleNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
      }
  
  class linguistExampleNode extends exampleNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
      }
  
  class wikipediaExampleNode extends exampleNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
      }
  
  class funFactNode extends abstractCodeNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get keywordCell() {
        return this.getWord(0)
      }
  get urlCell() {
        return this.getWord(1)
      }
      }
  
  class keywordsNode extends abstractFactNode {
        get tokenCell() {
        return this.getWordsFrom(0)
      }
      }
  
  class abstractCommonTokenNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get tokenCell() {
        return this.getWordsFrom(1)
      }
      }
  
  class lineCommentTokenNode extends abstractCommonTokenNode {
        
      }
  
  class multiLineCommentTokensNode extends abstractCommonTokenNode {
        
      }
  
  class printTokenNode extends abstractCommonTokenNode {
        
      }
  
  class stringTokenNode extends abstractCommonTokenNode {
        
      }
  
  class assignmentTokenNode extends abstractCommonTokenNode {
        
      }
  
  class booleanTokensNode extends abstractCommonTokenNode {
        
      }
  
  class includeTokenNode extends abstractCommonTokenNode {
        
      }
  
  class abstractSectionNode extends abstractFactNode {
        
      }
  
  class featuresNode extends abstractSectionNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"canDoShebang" : canDoShebangNode,
  "canReadCommandLineArgs" : canReadCommandLineArgsNode,
  "canUseQuestionMarksAsPartOfIdentifier" : canUseQuestionMarksAsPartOfIdentifierNode,
  "canWriteToDisk" : canWriteToDiskNode,
  "hasAbstractTypes" : hasAbstractTypesNode,
  "hasAccessModifiers" : hasAccessModifiersNode,
  "hasAlgebraicTypes" : hasAlgebraicTypesNode,
  "hasAnonymousFunctions" : hasAnonymousFunctionsNode,
  "hasArraySlicingSyntax" : hasArraySlicingSyntaxNode,
  "hasAssertStatements" : hasAssertStatementsNode,
  "hasAssignment" : hasAssignmentNode,
  "hasAsyncAwait" : hasAsyncAwaitNode,
  "hasBinaryNumbers" : hasBinaryNumbersNode,
  "hasBinaryOperators" : hasBinaryOperatorsNode,
  "hasBitWiseOperators" : hasBitWiseOperatorsNode,
  "hasBlobs" : hasBlobsNode,
  "hasBooleans" : hasBooleansNode,
  "hasBoundedCheckedArrays" : hasBoundedCheckedArraysNode,
  "hasBreak" : hasBreakNode,
  "hasBuiltInRegex" : hasBuiltInRegexNode,
  "hasCaseInsensitiveIdentifiers" : hasCaseInsensitiveIdentifiersNode,
  "hasCharacters" : hasCharactersNode,
  "hasClasses" : hasClassesNode,
  "hasClobs" : hasClobsNode,
  "hasComments" : hasCommentsNode,
  "hasConditionals" : hasConditionalsNode,
  "hasConstants" : hasConstantsNode,
  "hasConstructors" : hasConstructorsNode,
  "hasContinue" : hasContinueNode,
  "hasDecimals" : hasDecimalsNode,
  "hasDefaultParameters" : hasDefaultParametersNode,
  "hasDependentTypes" : hasDependentTypesNode,
  "hasDestructuring" : hasDestructuringNode,
  "hasDirectives" : hasDirectivesNode,
  "hasDisposeBlocks" : hasDisposeBlocksNode,
  "hasDocComments" : hasDocCommentsNode,
  "hasDuckTyping" : hasDuckTypingNode,
  "hasDynamicProperties" : hasDynamicPropertiesNode,
  "hasDynamicSizedArrays" : hasDynamicSizedArraysNode,
  "hasDynamicTyping" : hasDynamicTypingNode,
  "hasEnums" : hasEnumsNode,
  "hasEscapeCharacters" : hasEscapeCharactersNode,
  "hasExceptions" : hasExceptionsNode,
  "hasExplicitTypeCasting" : hasExplicitTypeCastingNode,
  "hasExports" : hasExportsNode,
  "hasExpressions" : hasExpressionsNode,
  "hasFirstClassFunctions" : hasFirstClassFunctionsNode,
  "hasFixedPoint" : hasFixedPointNode,
  "hasFloats" : hasFloatsNode,
  "hasFnArguments" : hasFnArgumentsNode,
  "hasForEachLoops" : hasForEachLoopsNode,
  "hasForLoops" : hasForLoopsNode,
  "hasFunctionComposition" : hasFunctionCompositionNode,
  "hasFunctionOverloading" : hasFunctionOverloadingNode,
  "hasFunctions" : hasFunctionsNode,
  "hasGarbageCollection" : hasGarbageCollectionNode,
  "hasGenerators" : hasGeneratorsNode,
  "hasGenerics" : hasGenericsNode,
  "hasGlobalScope" : hasGlobalScopeNode,
  "hasGotos" : hasGotosNode,
  "hasHereDocs" : hasHereDocsNode,
  "hasHexadecimals" : hasHexadecimalsNode,
  "hasHomoiconicity" : hasHomoiconicityNode,
  "hasIds" : hasIdsNode,
  "hasIfElses" : hasIfElsesNode,
  "hasIfs" : hasIfsNode,
  "hasImplicitArguments" : hasImplicitArgumentsNode,
  "hasImplicitTypeConversions" : hasImplicitTypeConversionsNode,
  "hasImports" : hasImportsNode,
  "hasIncrementAndDecrementOperators" : hasIncrementAndDecrementOperatorsNode,
  "hasInfixNotation" : hasInfixNotationNode,
  "hasInheritance" : hasInheritanceNode,
  "hasIntegers" : hasIntegersNode,
  "hasInterfaces" : hasInterfacesNode,
  "hasIterators" : hasIteratorsNode,
  "hasLabels" : hasLabelsNode,
  "hasLazyEvaluation" : hasLazyEvaluationNode,
  "hasLineComments" : hasLineCommentsNode,
  "hasLists" : hasListsNode,
  "hasMacros" : hasMacrosNode,
  "hasMagicGettersAndSetters" : hasMagicGettersAndSettersNode,
  "hasManualMemoryManagement" : hasManualMemoryManagementNode,
  "hasMapFunctions" : hasMapFunctionsNode,
  "hasMaps" : hasMapsNode,
  "hasMemberVariables" : hasMemberVariablesNode,
  "hasMessagePassing" : hasMessagePassingNode,
  "hasMethodChaining" : hasMethodChainingNode,
  "hasMethodOverloading" : hasMethodOverloadingNode,
  "hasMethods" : hasMethodsNode,
  "hasMixins" : hasMixinsNode,
  "hasModules" : hasModulesNode,
  "hasMonads" : hasMonadsNode,
  "hasMultiLineComments" : hasMultiLineCommentsNode,
  "hasMultilineStrings" : hasMultilineStringsNode,
  "hasMultipleDispatch" : hasMultipleDispatchNode,
  "hasMultipleInheritance" : hasMultipleInheritanceNode,
  "hasNamespaces" : hasNamespacesNode,
  "hasNull" : hasNullNode,
  "hasOctals" : hasOctalsNode,
  "hasOperatorOverloading" : hasOperatorOverloadingNode,
  "hasPairs" : hasPairsNode,
  "hasPartialApplication" : hasPartialApplicationNode,
  "hasPatternMatching" : hasPatternMatchingNode,
  "hasPipes" : hasPipesNode,
  "hasPointers" : hasPointersNode,
  "hasPolymorphism" : hasPolymorphismNode,
  "hasPostfixNotation" : hasPostfixNotationNode,
  "hasPrefixNotation" : hasPrefixNotationNode,
  "hasPrintDebugging" : hasPrintDebuggingNode,
  "hasProcessorRegisters" : hasProcessorRegistersNode,
  "hasRangeOperators" : hasRangeOperatorsNode,
  "hasReferences" : hasReferencesNode,
  "hasRefinementTypes" : hasRefinementTypesNode,
  "hasRegularExpressionsSyntaxSugar" : hasRegularExpressionsSyntaxSugarNode,
  "hasRequiredMainFunction" : hasRequiredMainFunctionNode,
  "hasReservedWords" : hasReservedWordsNode,
  "hasRunTimeGuards" : hasRunTimeGuardsNode,
  "hasSExpressions" : hasSExpressionsNode,
  "hasScientificNotation" : hasScientificNotationNode,
  "hasSelfOrThisWord" : hasSelfOrThisWordNode,
  "hasSemanticIndentation" : hasSemanticIndentationNode,
  "hasSets" : hasSetsNode,
  "hasSingleDispatch" : hasSingleDispatchNode,
  "hasSingleTypeArrays" : hasSingleTypeArraysNode,
  "hasSourceMaps" : hasSourceMapsNode,
  "hasStatementTerminatorCharacter" : hasStatementTerminatorCharacterNode,
  "hasStatements" : hasStatementsNode,
  "hasStaticMethods" : hasStaticMethodsNode,
  "hasStaticTyping" : hasStaticTypingNode,
  "hasStreams" : hasStreamsNode,
  "hasStringConcatOperator" : hasStringConcatOperatorNode,
  "hasStrings" : hasStringsNode,
  "hasStructs" : hasStructsNode,
  "hasSwitch" : hasSwitchNode,
  "hasSymbolTables" : hasSymbolTablesNode,
  "hasSymbols" : hasSymbolsNode,
  "hasTemplates" : hasTemplatesNode,
  "hasTernaryOperators" : hasTernaryOperatorsNode,
  "hasThreads" : hasThreadsNode,
  "hasTimestamps" : hasTimestampsNode,
  "hasTraits" : hasTraitsNode,
  "hasTriples" : hasTriplesNode,
  "hasTryCatch" : hasTryCatchNode,
  "hasTypeAnnotations" : hasTypeAnnotationsNode,
  "hasTypeInference" : hasTypeInferenceNode,
  "hasTypeParameters" : hasTypeParametersNode,
  "hasTypedHoles" : hasTypedHolesNode,
  "hasUnaryOperators" : hasUnaryOperatorsNode,
  "hasUnicodeIdentifiers" : hasUnicodeIdentifiersNode,
  "hasUnionTypes" : hasUnionTypesNode,
  "hasUnitsOfMeasure" : hasUnitsOfMeasureNode,
  "hasUserDefinedOperators" : hasUserDefinedOperatorsNode,
  "hasValueReturnedFunctions" : hasValueReturnedFunctionsNode,
  "hasVariableSubstitutionSyntax" : hasVariableSubstitutionSyntaxNode,
  "hasVariadicFunctions" : hasVariadicFunctionsNode,
  "hasVirtualFunctions" : hasVirtualFunctionsNode,
  "hasVoidFunctions" : hasVoidFunctionsNode,
  "hasWhileLoops" : hasWhileLoopsNode,
  "hasZeroBasedNumbering" : hasZeroBasedNumberingNode,
  "hasZippers" : hasZippersNode,
  "isCaseSensitive" : isCaseSensitiveNode,
  "isLisp" : isLispNode,
  "letterFirstIdentifiers" : letterFirstIdentifiersNode,
  "mergesWhitespace" : mergesWhitespaceNode,
  "supportsBreakpoints" : supportsBreakpointsNode}), undefined)
    }
      }
  
  class linguistGrammarRepoNode extends abstractSectionNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"example" : linguistExampleNode,
  "committerCount" : linguistCommitterCountNode,
  "commitCount" : linguistCommitsNode,
  "sampleCount" : linguistSampleCountNode,
  "firstCommit" : linguistFirstCommitNode,
  "lastCommit" : linguistLastCommitNode}), undefined)
    }
  get keywordCell() {
        return this.getWord(0)
      }
  get urlCell() {
        return this.getWord(1)
      }
  get sourceDomain() { return `github.com` }
      }
  
  class wikipediaNode extends abstractSectionNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"example" : wikipediaExampleNode,
  "fileExtensions" : githubLanguageFileExtensionsNode,
  "related" : wikipediaRelatedNode,
  "dailyPageViews" : wikipediaDailyPageViewsNode,
  "backlinksCount" : wikipediaBacklinksCountNode,
  "revisionCount" : wikipediaRevisionCountNode,
  "created" : wikipediaCreatedNode,
  "appeared" : wikipediaYearNode,
  "pageId" : wikipediaPageIdNode,
  "summary" : wikipediaSummaryNode}), undefined)
    }
  get keywordCell() {
        return this.getWord(0)
      }
  get urlCell() {
        return this.getWord(1)
      }
  get sourceDomain() { return `wikipedia.org` }
      }
  
  class abstractArrayNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get stringCell() {
        return this.getWordsFrom(1)
      }
      }
  
  class fileExtensionsNode extends abstractArrayNode {
        get fileExtensionCell() {
        return this.getWordsFrom(0)
      }
      }
  
  class githubLanguageFileExtensionsNode extends fileExtensionsNode {
        
      }
  
  class fileNamesNode extends abstractArrayNode {
        get fileNameCell() {
        return this.getWordsFrom(0)
      }
      }
  
  class abstractGitHubLanguageArrayNode extends abstractArrayNode {
        
      }
  
  class githubLanguageInterpretersNode extends abstractGitHubLanguageArrayNode {
        
      }
  
  class githubLanguageAliasesNode extends abstractGitHubLanguageArrayNode {
        
      }
  
  class abstractPermalinksNode extends abstractArrayNode {
        get permalinkCell() {
        return this.getWordsFrom(0)
      }
  get providesPermalinks() { return true }
      }
  
  class forLanguagesNode extends abstractPermalinksNode {
        
      }
  
  class abstractRelationshipNode extends abstractPermalinksNode {
        
      }
  
  class relatedNode extends abstractRelationshipNode {
        
      }
  
  class runsOnVmNode extends abstractRelationshipNode {
        
      }
  
  class influencedByNode extends abstractRelationshipNode {
        
      }
  
  class successorOfNode extends abstractRelationshipNode {
        
      }
  
  class subsetOfNode extends abstractRelationshipNode {
        
      }
  
  class renamedToNode extends abstractRelationshipNode {
        
      }
  
  class supersetOfNode extends abstractRelationshipNode {
        
      }
  
  class writtenInNode extends abstractRelationshipNode {
        
      }
  
  class extensionOfNode extends abstractRelationshipNode {
        
      }
  
  class forkOfNode extends abstractRelationshipNode {
        
      }
  
  class compilesToNode extends abstractRelationshipNode {
        
      }
  
  class inputLanguagesNode extends abstractRelationshipNode {
        
      }
  
  class wikipediaRelatedNode extends abstractPermalinksNode {
        
      }
  
  class abstractIntNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get intCell() {
        return parseInt(this.getWord(1))
      }
      }
  
  class abstractCountNode extends abstractIntNode {
        
      }
  
  class abstractPopulationCountNode extends abstractCountNode {
        
      }
  
  class githubBigQueryUserCountNode extends abstractPopulationCountNode {
        
      }
  
  class linguistCommitterCountNode extends abstractPopulationCountNode {
        
      }
  
  class meetupMemberCountNode extends abstractPopulationCountNode {
        
      }
  
  class packageAuthorsNode extends abstractPopulationCountNode {
        
      }
  
  class stackOverflowSurveyUsersNode extends abstractPopulationCountNode {
        
      }
  
  class stackOverflowSurveyFansNode extends abstractPopulationCountNode {
        
      }
  
  class twitterFollowersNode extends abstractPopulationCountNode {
        
      }
  
  class githubBigQueryRepoCountNode extends abstractCountNode {
        
      }
  
  class githubTrendingProjectsCountNode extends abstractCountNode {
        get fromCrawler() { return true }
      }
  
  class githubRepoCountNode extends abstractCountNode {
        get fromCrawler() { return true }
      }
  
  class abstractGithubCountNode extends abstractCountNode {
        
      }
  
  class githubSubscribersNode extends abstractGithubCountNode {
        
      }
  
  class githubForksNode extends abstractGithubCountNode {
        
      }
  
  class githubStarsNode extends abstractGithubCountNode {
        
      }
  
  class githubIssuesNode extends abstractGithubCountNode {
        
      }
  
  class linguistCommitsNode extends abstractCountNode {
        
      }
  
  class linguistSampleCountNode extends abstractCountNode {
        
      }
  
  class meetupGroupCountNode extends abstractCountNode {
        
      }
  
  class centralPackageRepositoryCountNode extends abstractCountNode {
        
      }
  
  class packageInstallsNode extends abstractCountNode {
        
      }
  
  class packageCountNode extends abstractCountNode {
        
      }
  
  class packagesIncludingVersionsNode extends abstractCountNode {
        
      }
  
  class wikipediaDailyPageViewsNode extends abstractCountNode {
        
      }
  
  class wikipediaBacklinksCountNode extends abstractCountNode {
        
      }
  
  class wikipediaRevisionCountNode extends abstractCountNode {
        
      }
  
  class abstractYearNode extends abstractIntNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get yearCell() {
        return parseInt(this.getWord(1))
      }
      }
  
  class abstractGithubYearNode extends abstractYearNode {
        
      }
  
  class githubCreatedNode extends abstractGithubYearNode {
        
      }
  
  class githubUpdatedNode extends abstractGithubYearNode {
        
      }
  
  class githubFirstCommitNode extends abstractGithubYearNode {
        
      }
  
  class appearedNode extends abstractYearNode {
        
      }
  
  class linguistFirstCommitNode extends abstractYearNode {
        
      }
  
  class linguistLastCommitNode extends abstractYearNode {
        
      }
  
  class domainRegisteredNode extends abstractYearNode {
        
      }
  
  class wikipediaCreatedNode extends abstractYearNode {
        
      }
  
  class wikipediaYearNode extends abstractYearNode {
        
      }
  
  class wordRankNode extends abstractIntNode {
        
      }
  
  class stackOverflowSurveyMedianSalaryNode extends abstractIntNode {
        
      }
  
  class tiobeCurrentRankNode extends abstractIntNode {
        
      }
  
  class wikipediaPageIdNode extends abstractIntNode {
        
      }
  
  class abstractFlagNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
      }
  
  class githubCopilotOptimizedNode extends abstractFlagNode {
        
      }
  
  class abstractGitHubLanguageNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get stringCell() {
        return this.getWord(1)
      }
      }
  
  class githubLanguageAceModeNode extends abstractGitHubLanguageNode {
        
      }
  
  class githubLanguageCodemirrorModeNode extends abstractGitHubLanguageNode {
        
      }
  
  class githubLanguageCodemirrorMimeTypeNode extends abstractGitHubLanguageNode {
        
      }
  
  class githubLanguageTmScopeNode extends abstractGitHubLanguageNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get externalGuidCell() {
        return this.getWordsFrom(1)
      }
      }
  
  class githubLanguageWrapNode extends abstractGitHubLanguageNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get boolCell() {
        return this.getWord(1)
      }
      }
  
  class githubLanguageTypeNode extends abstractGitHubLanguageNode {
        
      }
  
  class creatorsNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get creatorNameCell() {
        return this.getWordsFrom(1)
      }
  get alwaysRecommended() { return true }
      }
  
  class nativeLanguageNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get nativeLanguageWordCell() {
        return this.getWord(1)
      }
      }
  
  class announcementMethodNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get announcementMethodCell() {
        return this.getWord(1)
      }
      }
  
  class countryNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get countryNameCell() {
        return this.getWordsFrom(1)
      }
  get alwaysRecommended() { return true }
      }
  
  class abstractAnnualPopulationCountMapNode extends abstractFactNode {
        createParser() {
    return new TreeNode.Parser(annualPopulationCountNode, undefined, undefined)
    }
      }
  
  class indeedJobsNode extends abstractAnnualPopulationCountMapNode {
        get searchQueryCell() {
        return this.getWordsFrom(0)
      }
  get sourceDomain() { return `indeed.com` }
      }
  
  class linkedInSkillNode extends abstractAnnualPopulationCountMapNode {
        get searchQueryCell() {
        return this.getWordsFrom(0)
      }
  get sourceDomain() { return `linkedin.com` }
      }
  
  class projectEulerMemberCountNode extends abstractAnnualPopulationCountMapNode {
        
      }
  
  class subredditMemberCountNode extends abstractAnnualPopulationCountMapNode {
        
      }
  
  class filepathNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get stringCell() {
        return this.getWordsFrom(1)
      }
      }
  
  class abstractStringNode extends abstractFactNode {
        get stringCell() {
        return this.getWordsFrom(0)
      }
      }
  
  class titleNode extends abstractStringNode {
        
      }
  
  class standsForNode extends abstractStringNode {
        
      }
  
  class akaNode extends abstractStringNode {
        
      }
  
  class oldNameNode extends abstractStringNode {
        
      }
  
  class originCommunityNode extends abstractFactNode {
        get stringCell() {
        return this.getWordsFrom(0)
      }
  get alwaysRecommended() { return true }
      }
  
  class abstractParadigmNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get boolCell() {
        return this.getWord(1)
      }
      }
  
  class visualParadigmNode extends abstractParadigmNode {
        
      }
  
  class abstractDecimalNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get numberCell() {
        return parseFloat(this.getWord(1))
      }
      }
  
  class stackOverflowSurveyPercentageUsingNode extends abstractDecimalNode {
        
      }
  
  class abstractAnnualRankMapNode extends abstractFactNode {
        createParser() {
    return new TreeNode.Parser(annualRankNode, undefined, undefined)
    }
      }
  
  class awisRankNode extends abstractAnnualRankMapNode {
        get sourceDomain() { return `aws.amazon.com` }
      }
  
  class pygmentsFilenameNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get fileNameCell() {
        return this.getWord(1)
      }
      }
  
  class typeNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get typeCell() {
        return this.getWord(1)
      }
      }
  
  class fileTypeNode extends abstractFactNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get fileTypeWordCell() {
        return this.getWord(1)
      }
      }
  
  class domainNameNode extends abstractFactNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"registered" : domainRegisteredNode,
  "awisRank" : awisRankNode}), undefined)
    }
  get keywordCell() {
        return this.getWord(0)
      }
  get domainNameCell() {
        return this.getWord(1)
      }
      }
  
  class wikipediaSummaryNode extends abstractFactNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
  get includeChildrenInCsv() { return false }
      }
  
  class abstractFeatureNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(featureExampleCodeNode, undefined, undefined)
    }
  get keywordCell() {
        return this.getWord(0)
      }
  get boolCell() {
        return this.getWord(1)
      }
  get includeChildrenInCsv() { return false }
      }
  
  class canDoShebangNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Shebang_(Unix)` }
  get pseudoExample() { return `#! /run` }
  get title() { return `Shebang` }
      }
  
  class canReadCommandLineArgsNode extends abstractFeatureNode {
        
      }
  
  class canUseQuestionMarksAsPartOfIdentifierNode extends abstractFeatureNode {
        
      }
  
  class canWriteToDiskNode extends abstractFeatureNode {
        get pseudoExample() { return `write("pldb.csv", "...")` }
  get title() { return `Disk Output` }
      }
  
  class hasAbstractTypesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Abstract_type` }
  get pseudoExample() { return `abstract class PLDBFile {}` }
  get title() { return `Abstract Types` }
      }
  
  class hasAccessModifiersNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Access_modifiers` }
  get pseudoExample() { return `class PLDBFile { public title }` }
  get title() { return `Access Modifiers` }
      }
  
  class hasAlgebraicTypesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Algebraic_data_type` }
  get pseudoExample() { return `garageContents = empty | vehicle` }
  get title() { return `Algebraic Data Type` }
      }
  
  class hasAnonymousFunctionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Anonymous_function` }
  get pseudoExample() { return `() => printPldb()` }
  get aka() { return `Lambdas` }
  get title() { return `Anonymous Functions` }
      }
  
  class hasArraySlicingSyntaxNode extends abstractFeatureNode {
        
      }
  
  class hasAssertStatementsNode extends abstractFeatureNode {
        get pseudoExample() { return `assert(isTrue)` }
  get reference() { return `https://en.wikipedia.org/wiki/Debug_code#Assert_Statements` }
  get title() { return `Assert Statements` }
      }
  
  class hasAssignmentNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Assignment_(computer_science)` }
  get tokenKeyword() { return `assignmentToken` }
  get pseudoExample() { return `name = "PLDB"` }
  get title() { return `Assignment` }
      }
  
  class hasAsyncAwaitNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Async/await` }
  get pseudoExample() { return `async downloadPldb => await getFiles()` }
  get title() { return `Async Await` }
      }
  
  class hasBinaryNumbersNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Binary_number` }
  get pseudoExample() { return `0b100110100000110011110010010` }
  get title() { return `Binary Literals` }
      }
  
  class hasBinaryOperatorsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Binary_operation` }
  get pseudoExample() { return `1 + 1` }
  get title() { return `Binary Operators` }
      }
  
  class hasBitWiseOperatorsNode extends abstractFeatureNode {
        get pseudoExample() { return `3 == (2 | 1)` }
  get reference() { return `https://en.wikipedia.org/wiki/Bitwise_operations_in_C https://en.wikipedia.org/wiki/Bitwise_operation` }
  get title() { return `Bitwise Operators` }
      }
  
  class hasBlobsNode extends abstractFeatureNode {
        
      }
  
  class hasBooleansNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Boolean_data_type` }
  get tokenKeyword() { return `booleanTokens` }
  get pseudoExample() { return `pldb = true` }
  get title() { return `Booleans` }
      }
  
  class hasBoundedCheckedArraysNode extends abstractFeatureNode {
        
      }
  
  class hasBreakNode extends abstractFeatureNode {
        
      }
  
  class hasBuiltInRegexNode extends abstractFeatureNode {
        
      }
  
  class hasCaseInsensitiveIdentifiersNode extends abstractFeatureNode {
        get pseudoExample() { return `pLdB = "PLDB"` }
  get reference() { return `https://rosettacode.org/wiki/Case-sensitivity_of_identifiers` }
  get title() { return `Case Insensitive Identifiers` }
      }
  
  class hasCharactersNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Character_(computing)` }
  get pseudoExample() { return `char character = 'P';` }
  get title() { return `Characters` }
      }
  
  class hasClassesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Class_(computer_programming)` }
  get pseudoExample() { return `class PLDBFile {}` }
  get title() { return `Classes` }
      }
  
  class hasClobsNode extends abstractFeatureNode {
        
      }
  
  class hasCommentsNode extends abstractFeatureNode {
        get pseudoExample() { return `# Hello PLDB` }
  get reference() { return `https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(syntax)#Comments https://en.wikipedia.org/wiki/Comment_(computer_programming)` }
  get title() { return `Comments` }
      }
  
  class hasConditionalsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Conditional_(computer_programming)` }
  get pseudoExample() { return `if (isTrue) printPldb()` }
  get title() { return `Conditionals` }
      }
  
  class hasConstantsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Const_(computer_programming)` }
  get pseudoExample() { return `const name = "PLDB"` }
  get title() { return `Constants` }
      }
  
  class hasConstructorsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Constructor_(object-oriented_programming)` }
  get pseudoExample() { return `PLDBFile { constructor() {} }` }
  get title() { return `Constructors` }
      }
  
  class hasContinueNode extends abstractFeatureNode {
        
      }
  
  class hasDecimalsNode extends abstractFeatureNode {
        
      }
  
  class hasDefaultParametersNode extends abstractFeatureNode {
        get pseudoExample() { return `say(message = "Hello PLDB")` }
  get reference() { return `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters` }
  get title() { return `Default Parameters Pattern` }
      }
  
  class hasDependentTypesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Dependent_type` }
  get pseudoExample() { return `pldbSortedList // a list where is sorted is true` }
  get title() { return `Dependent types` }
      }
  
  class hasDestructuringNode extends abstractFeatureNode {
        get pseudoExample() { return `{title, rank} = pldbFile` }
  get reference() { return `https://reasonml.github.io/docs/en/destructuring` }
  get website() { return `https://github.com/facebook/reason` }
  get title() { return `Destructuring` }
      }
  
  class hasDirectivesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Directive_(programming)` }
  get pseudoExample() { return `use strict;` }
  get title() { return `Directives` }
      }
  
  class hasDisposeBlocksNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Dispose_pattern` }
  get pseudoExample() { return `with pldb: do computeRanks()` }
  get title() { return `Dispose Blocks Pattern` }
      }
  
  class hasDocCommentsNode extends abstractFeatureNode {
        get pseudoExample() { return `// param1: A comment about the first param` }
  get title() { return `Doc comments` }
      }
  
  class hasDuckTypingNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Duck_typing` }
  get pseudoExample() { return `length() // makes me an iterator` }
  get title() { return `Duck Typing` }
      }
  
  class hasDynamicPropertiesNode extends abstractFeatureNode {
        get pseudoExample() { return `pldb.score = 50` }
  get title() { return `Dynamic Properties` }
      }
  
  class hasDynamicSizedArraysNode extends abstractFeatureNode {
        
      }
  
  class hasDynamicTypingNode extends abstractFeatureNode {
        
      }
  
  class hasEnumsNode extends abstractFeatureNode {
        get pseudoExample() { return `colorsEnum { "red", "white", "blue"}` }
  get reference() { return `https://en.wikipedia.org/wiki/Enumerated_type` }
  get title() { return `Enums` }
      }
  
  class hasEscapeCharactersNode extends abstractFeatureNode {
        
      }
  
  class hasExceptionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Exception_handling` }
  get pseudoExample() { return `throw new Error("PLDB uh oh")` }
  get title() { return `Exceptions` }
      }
  
  class hasExplicitTypeCastingNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Type_conversion` }
  get pseudoExample() { return `(float)pldbRank;` }
  get title() { return `Type Casting` }
      }
  
  class hasExportsNode extends abstractFeatureNode {
        
      }
  
  class hasExpressionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Expression_(computer_science)` }
  get pseudoExample() { return `(1 + 2)` }
  get title() { return `Expressions` }
      }
  
  class hasFirstClassFunctionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/First-class_function` }
  get pseudoExample() { return `[2.1].map(Math.round)` }
  get title() { return `First-Class Functions` }
      }
  
  class hasFixedPointNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Fixed-point_arithmetic` }
  get pseudoExample() { return `80766866.00` }
  get title() { return `Fixed Point Numbers` }
      }
  
  class hasFloatsNode extends abstractFeatureNode {
        get pseudoExample() { return `80766866.0` }
  get reference() { return `https://evanw.github.io/float-toy/ https://en.wikipedia.org/wiki/Floating-point_arithmetic` }
  get title() { return `Floats` }
      }
  
  class hasFnArgumentsNode extends abstractFeatureNode {
        
      }
  
  class hasForEachLoopsNode extends abstractFeatureNode {
        
      }
  
  class hasForLoopsNode extends abstractFeatureNode {
        
      }
  
  class hasFunctionCompositionNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Function_composition_(computer_science)` }
  get pseudoExample() { return `o = (f, g) => x => f(g(x))` }
  get title() { return `Function Composition` }
      }
  
  class hasFunctionOverloadingNode extends abstractFeatureNode {
        get pseudoExample() { return `add(string: str, string2: str)` }
  get aka() { return `Ad hoc polymorphism` }
  get reference() { return `https://en.wikibooks.org/wiki/Introduction_to_Programming_Languages/Overloading https://en.wikipedia.org/wiki/Function_overloading` }
  get title() { return `Function Overloading` }
      }
  
  class hasFunctionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Subroutine` }
  get pseudoExample() { return `function computePLDBRanks() {}` }
  get aka() { return `routines` }
  get title() { return `Functions` }
      }
  
  class hasGarbageCollectionNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)` }
  get pseudoExample() { return `var iDontNeedToFreeThis` }
  get title() { return `Garbage Collection` }
      }
  
  class hasGeneratorsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Generator_(computer_programming)` }
  get pseudoExample() { return `yield 2` }
  get title() { return `Generators` }
      }
  
  class hasGenericsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Generic_programming` }
  get pseudoExample() { return `function identity<T>(arg: T): T` }
  get title() { return `Generics` }
      }
  
  class hasGlobalScopeNode extends abstractFeatureNode {
        
      }
  
  class hasGotosNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Goto` }
  get pseudoExample() { return `goto 10` }
  get title() { return `Gotos` }
      }
  
  class hasHereDocsNode extends abstractFeatureNode {
        get pseudoExample() { return `\`A big multliline text block\`` }
  get reference() { return `https://en.wikipedia.org/wiki/Here_document` }
  get title() { return `Here Document` }
      }
  
  class hasHexadecimalsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Hexadecimal` }
  get pseudoExample() { return `0x4D06792` }
  get aka() { return `Base16` }
  get title() { return `Hexadecimals` }
      }
  
  class hasHomoiconicityNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Homoiconicity` }
  get pseudoExample() { return `(list ())` }
  get title() { return `Homoiconicity` }
      }
  
  class hasIdsNode extends abstractFeatureNode {
        
      }
  
  class hasIfElsesNode extends abstractFeatureNode {
        
      }
  
  class hasIfsNode extends abstractFeatureNode {
        
      }
  
  class hasImplicitArgumentsNode extends abstractFeatureNode {
        get pseudoExample() { return `shout(implicit message: string)` }
  get reference() { return `https://docs.scala-lang.org/tour/implicit-parameters.html` }
  get title() { return `Implicit Arguments` }
      }
  
  class hasImplicitTypeConversionsNode extends abstractFeatureNode {
        get pseudoExample() { return `console.log("hello " + 2)` }
  get reference() { return `https://en.wikipedia.org/wiki/Type_conversion` }
  get title() { return `Implicit Type Casting` }
      }
  
  class hasImportsNode extends abstractFeatureNode {
        get tokenKeyword() { return `includeToken` }
  get pseudoExample() { return `import pldb` }
  get title() { return `File Imports` }
      }
  
  class hasIncrementAndDecrementOperatorsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Increment_and_decrement_operators` }
  get pseudoExample() { return `i++` }
  get title() { return `Increment and decrement operators` }
      }
  
  class hasInfixNotationNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Infix_notation` }
  get pseudoExample() { return `1 + 2` }
  get title() { return `Infix Notation` }
      }
  
  class hasInheritanceNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)` }
  get pseudoExample() { return `class PLDBFile extends File` }
  get title() { return `Inheritance` }
      }
  
  class hasIntegersNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Integer_(computer_science)` }
  get pseudoExample() { return `80766866` }
  get title() { return `Integers` }
      }
  
  class hasInterfacesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Protocol_(object-oriented_programming)` }
  get pseudoExample() { return `interface PLDBFile` }
  get title() { return `Interfaces` }
      }
  
  class hasIteratorsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Iterator` }
  get pseudoExample() { return `for lang in pldb()` }
  get title() { return `Iterators` }
      }
  
  class hasLabelsNode extends abstractFeatureNode {
        
      }
  
  class hasLazyEvaluationNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Lazy_evaluation` }
  get pseudoExample() { return `print(range(1000000)[2])` }
  get title() { return `Lazy Evaluation` }
      }
  
  class hasLineCommentsNode extends abstractFeatureNode {
        get tokenKeyword() { return `lineCommentToken` }
  get pseudoExample() { return `# Hello PLDB` }
  get reference() { return `https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(syntax)#Comments` }
  get title() { return `Line Comments` }
      }
  
  class hasListsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/List_(abstract_data_type)` }
  get pseudoExample() { return `[2, 3, 10]` }
  get aka() { return `array` }
  get title() { return `Lists` }
      }
  
  class hasMacrosNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Macro_(computer_science)` }
  get pseudoExample() { return `#define pldbItems 4000` }
  get title() { return `Macros` }
      }
  
  class hasMagicGettersAndSettersNode extends abstractFeatureNode {
        get pseudoExample() { return `get(name) => obj[name]` }
  get reference() { return `https://www.php.net/manual/en/language.oop5.overloading.php#object.get` }
  get title() { return `Magic Getters and Setters` }
      }
  
  class hasManualMemoryManagementNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Manual_memory_management` }
  get pseudoExample() { return `malloc(4);` }
  get title() { return `Manual Memory Management` }
      }
  
  class hasMapFunctionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Map_(higher-order_function)` }
  get pseudoExample() { return `pldbFiles.map(downloadFilesFn)` }
  get title() { return `Map Functions` }
      }
  
  class hasMapsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Associative_array` }
  get pseudoExample() { return `{name: "PLDB"}` }
  get aka() { return `dict` }
  get title() { return `Maps` }
      }
  
  class hasMemberVariablesNode extends abstractFeatureNode {
        
      }
  
  class hasMessagePassingNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Message_passing` }
  get pseudoExample() { return `"get pldb"` }
  get title() { return `Message Passing` }
      }
  
  class hasMethodChainingNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Method_chaining` }
  get pseudoExample() { return `pldbFile.toString().length` }
  get title() { return `Method Chaining` }
      }
  
  class hasMethodOverloadingNode extends abstractFeatureNode {
        
      }
  
  class hasMethodsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Method_(computer_programming)` }
  get pseudoExample() { return `pldbFile.downloadWebsite()` }
  get title() { return `Methods` }
      }
  
  class hasMixinsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Mixin` }
  get pseudoExample() { return `extends pldbFile, diskFile` }
  get title() { return `Mixins` }
      }
  
  class hasModulesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Module_pattern` }
  get pseudoExample() { return `module PLDB {}` }
  get title() { return `Module Pattern` }
      }
  
  class hasMonadsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Monad_(functional_programming)` }
  get pseudoExample() { return `g >>= f` }
  get title() { return `Monad` }
      }
  
  class hasMultiLineCommentsNode extends abstractFeatureNode {
        get tokenKeyword() { return `multiLineCommentTokens` }
  get pseudoExample() { return `/* Hello PLDB */` }
  get reference() { return `https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(syntax)#Comments` }
  get title() { return `MultiLine Comments` }
      }
  
  class hasMultilineStringsNode extends abstractFeatureNode {
        get pseudoExample() { return `hello = """Hello\nPLDB"""` }
  get title() { return `Multiline Strings` }
      }
  
  class hasMultipleDispatchNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Multiple_dispatch` }
  get pseudoExample() { return `collide_with(x::Spaceship, y::Spaceship)` }
  get title() { return `Multiple Dispatch` }
      }
  
  class hasMultipleInheritanceNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Multiple_inheritance` }
  get pseudoExample() { return `extends parentWhichExtendsSomethingElse` }
  get title() { return `Multiple Inheritance` }
      }
  
  class hasNamespacesNode extends abstractFeatureNode {
        get pseudoExample() { return `namespace PLDB {}` }
  get title() { return `Namespaces` }
      }
  
  class hasNullNode extends abstractFeatureNode {
        get pseudoExample() { return `uhOh = null` }
  get reference() { return `https://en.wikipedia.org/wiki/Null_pointer` }
  get title() { return `Null` }
      }
  
  class hasOctalsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Octal` }
  get pseudoExample() { return `0o464063622` }
  get aka() { return `Base8` }
  get title() { return `Octals` }
      }
  
  class hasOperatorOverloadingNode extends abstractFeatureNode {
        get pseudoExample() { return `def __add__(): doSomethingDifferent()` }
  get reference() { return `https://en.wikibooks.org/wiki/Introduction_to_Programming_Languages/Overloading https://en.wikipedia.org/wiki/Operator_overloading` }
  get title() { return `Operator Overloading` }
      }
  
  class hasPairsNode extends abstractFeatureNode {
        get pseudoExample() { return `(pl . db)` }
  get title() { return `Pairs` }
      }
  
  class hasPartialApplicationNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Partial_application` }
  get pseudoExample() { return `add5 = num => addNumbers(10, num)` }
  get title() { return `Partial Application` }
      }
  
  class hasPatternMatchingNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Pattern_matching` }
  get pseudoExample() { return `fib 0 = 1; fib 1 = 1` }
  get title() { return `Pattern Matching` }
      }
  
  class hasPipesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Pipeline_(software)` }
  get pseudoExample() { return `ls pldb | wc` }
  get title() { return `Pipes` }
      }
  
  class hasPointersNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Pointer_(computer_programming)` }
  get pseudoExample() { return `int *pldb` }
  get title() { return `Pointers` }
      }
  
  class hasPolymorphismNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Polymorphism_(computer_science)` }
  get pseudoExample() { return `a + "b"; 1 + 2` }
  get title() { return `Polymorphism` }
      }
  
  class hasPostfixNotationNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Reverse_Polish_notation` }
  get pseudoExample() { return `2 3 4 + 2 -` }
  get title() { return `Postfix Notation` }
      }
  
  class hasPrefixNotationNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Polish_notation` }
  get pseudoExample() { return `+ 1 2` }
  get title() { return `Prefix Notation` }
      }
  
  class hasPrintDebuggingNode extends abstractFeatureNode {
        get tokenKeyword() { return `printToken` }
  get pseudoExample() { return `print "Hello PLDB"` }
  get reference() { return `https://en.wikipedia.org/wiki/Debug_code#Print_debugging` }
  get title() { return `Print() Debugging` }
      }
  
  class hasProcessorRegistersNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Processor_register` }
  get pseudoExample() { return `eax 2` }
  get title() { return `Processor Registers` }
      }
  
  class hasRangeOperatorsNode extends abstractFeatureNode {
        get pseudoExample() { return `1 ... 10` }
  get reference() { return `https://docstore.mik.ua/orelly/perl4/prog/ch03_15.htm` }
  get title() { return `Range Operator` }
      }
  
  class hasReferencesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Reference_(computer_science)` }
  get pseudoExample() { return `fn(objPointer)` }
  get title() { return `References` }
      }
  
  class hasRefinementTypesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Refinement_type` }
  get pseudoExample() { return `evenInt where int % 2 = 0` }
  get title() { return `Refinement Types` }
      }
  
  class hasRegularExpressionsSyntaxSugarNode extends abstractFeatureNode {
        get pseudoExample() { return `/pldb/` }
  get reference() { return `https://pldb.com/truebase/regex.html` }
  get title() { return `Regular Expression Syntax Sugar` }
      }
  
  class hasRequiredMainFunctionNode extends abstractFeatureNode {
        
      }
  
  class hasReservedWordsNode extends abstractFeatureNode {
        
      }
  
  class hasRunTimeGuardsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Guard_(computer_science)` }
  get pseudoExample() { return `f x | x > 0 = 1 | otherwise = 0` }
  get title() { return `Runtime Guards` }
      }
  
  class hasSExpressionsNode extends abstractFeatureNode {
        
      }
  
  class hasScientificNotationNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Scientific_notation` }
  get pseudoExample() { return `8076686.6e1` }
  get aka() { return `E Notation` }
  get title() { return `Scientific Notation` }
      }
  
  class hasSelfOrThisWordNode extends abstractFeatureNode {
        
      }
  
  class hasSemanticIndentationNode extends abstractFeatureNode {
        get pseudoExample() { return `line0 if true line1  print "Hello PLDB"` }
  get reference() { return `https://pldb.com/posts/which-programming-languages-use-indentation.html` }
  get title() { return `Semantic Indentation` }
      }
  
  class hasSetsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Set_(abstract_data_type)` }
  get pseudoExample() { return `{"pldb", "PLDB"}` }
  get title() { return `Sets` }
      }
  
  class hasSingleDispatchNode extends abstractFeatureNode {
        get pseudoExample() { return `person.run()` }
  get reference() { return `https://en.wikipedia.org/wiki/Dynamic_dispatch#Single_and_multiple_dispatch` }
  get title() { return `Single Dispatch` }
      }
  
  class hasSingleTypeArraysNode extends abstractFeatureNode {
        get pseudoExample() { return `const pldbRanks: int[]` }
  get reference() { return `https://en.wikipedia.org/wiki/Array_data_structure` }
  get title() { return `Single-Type Arrays` }
      }
  
  class hasSourceMapsNode extends abstractFeatureNode {
        get pseudoExample() { return `{file: 'pldb.min.js',sources: ['pldb.js'], mappings: 'CAAC,IAAI,IAAM'}` }
  get title() { return `Source Maps` }
      }
  
  class hasStatementTerminatorCharacterNode extends abstractFeatureNode {
        
      }
  
  class hasStatementsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Statement_(computer_science)` }
  get pseudoExample() { return `print "Hello PLDB"` }
  get title() { return `Statements` }
      }
  
  class hasStaticMethodsNode extends abstractFeatureNode {
        get pseudoExample() { return `static downloadPldb() {}` }
  get reference() { return `https://www.geeksforgeeks.org/static-methods-vs-instance-methods-java/` }
  get title() { return `Static Methods` }
      }
  
  class hasStaticTypingNode extends abstractFeatureNode {
        get pseudoExample() { return `int pldbRank = 100` }
  get reference() { return `https://en.wikipedia.org/wiki/Type_system#Static_type_checking` }
  get title() { return `Static Typing` }
      }
  
  class hasStreamsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Stream_(computing)` }
  get pseudoExample() { return `echo 123 | 123.txt` }
  get title() { return `Streams` }
      }
  
  class hasStringConcatOperatorNode extends abstractFeatureNode {
        
      }
  
  class hasStringsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/String_(computer_science)` }
  get tokenKeyword() { return `stringToken` }
  get pseudoExample() { return `"Hello PLDB"` }
  get title() { return `Strings` }
      }
  
  class hasStructsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Struct_(C_programming_language)` }
  get pseudoExample() { return `struct pldbFile { int rank; char *title; };` }
  get title() { return `Structs` }
      }
  
  class hasSwitchNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Switch_statement` }
  get pseudoExample() { return `switch animal: case dog-buy; case cat-sell;` }
  get title() { return `Switch Statements` }
      }
  
  class hasSymbolTablesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Symbol_table` }
  get pseudoExample() { return `SymbolName|Type|Scope;bar|function,double|extern` }
  get title() { return `Symbol Tables` }
      }
  
  class hasSymbolsNode extends abstractFeatureNode {
        
      }
  
  class hasTemplatesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Template_metaprogramming` }
  get pseudoExample() { return `template TCopy(T) {}` }
  get title() { return `Templates` }
      }
  
  class hasTernaryOperatorsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Ternary_operation` }
  get pseudoExample() { return `true ? 1 : 0` }
  get title() { return `Ternary operators` }
      }
  
  class hasThreadsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Thread_(computing)` }
  get pseudoExample() { return `thread1(); thread2();` }
  get title() { return `Threads` }
      }
  
  class hasTimestampsNode extends abstractFeatureNode {
        
      }
  
  class hasTraitsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Trait_(computer_programming)` }
  get pseudoExample() { return `use redBorder` }
  get title() { return `Traits` }
      }
  
  class hasTriplesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Semantic_triple` }
  get pseudoExample() { return `Javascript isListedIn PLDB` }
  get title() { return `Triples` }
      }
  
  class hasTryCatchNode extends abstractFeatureNode {
        
      }
  
  class hasTypeAnnotationsNode extends abstractFeatureNode {
        get pseudoExample() { return `score: number` }
  get title() { return `Type Annotations` }
      }
  
  class hasTypeInferenceNode extends abstractFeatureNode {
        get pseudoExample() { return `imAString = "pldb"` }
  get reference() { return `https://en.wikipedia.org/wiki/Type_inference` }
  get title() { return `Type Inference` }
      }
  
  class hasTypeParametersNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/TypeParameter` }
  get pseudoExample() { return `function identity<T>(arg: T): T {return arg}` }
  get title() { return `Type Parameters` }
      }
  
  class hasTypedHolesNode extends abstractFeatureNode {
        get pseudoExample() { return `2 + _ => 2 + [int|float]` }
  get reference() { return `https://wiki.haskell.org/GHC/Typed_holes` }
  get title() { return `Typed Holes` }
      }
  
  class hasUnaryOperatorsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Unary_operation` }
  get pseudoExample() { return `count++` }
  get title() { return `Unary Operators` }
      }
  
  class hasUnicodeIdentifiersNode extends abstractFeatureNode {
        get pseudoExample() { return `δ = 0.00001` }
  get title() { return `Unicode Identifers` }
      }
  
  class hasUnionTypesNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Union_type` }
  get pseudoExample() { return `any = string | number` }
  get title() { return `Union Types` }
      }
  
  class hasUnitsOfMeasureNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Unit_of_measurement` }
  get pseudoExample() { return `42cm` }
  get title() { return `Units of Measure` }
      }
  
  class hasUserDefinedOperatorsNode extends abstractFeatureNode {
        
      }
  
  class hasValueReturnedFunctionsNode extends abstractFeatureNode {
        
      }
  
  class hasVariableSubstitutionSyntaxNode extends abstractFeatureNode {
        get pseudoExample() { return `name = "PLDB"; print $name` }
  get title() { return `Variable Substitution Syntax` }
      }
  
  class hasVariadicFunctionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Variadic_function` }
  get pseudoExample() { return `args.map(doSomething)` }
  get title() { return `Variadic Functions` }
      }
  
  class hasVirtualFunctionsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Virtual_function` }
  get pseudoExample() { return `virtual FetchPLDBFile();` }
  get title() { return `Virtual function` }
      }
  
  class hasVoidFunctionsNode extends abstractFeatureNode {
        
      }
  
  class hasWhileLoopsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/While_loop` }
  get pseudoExample() { return `while (pldb.pop()) loop()` }
  get title() { return `While Loops` }
      }
  
  class hasZeroBasedNumberingNode extends abstractFeatureNode {
        get pseudoExample() { return `firstItem = pldb[0]` }
  get reference() { return `https://en.wikipedia.org/wiki/Zero-based_numbering` }
  get title() { return `Zero-based numbering` }
      }
  
  class hasZippersNode extends abstractFeatureNode {
        get pseudoExample() { return `pldbCursor.moveLeft()` }
  get reference() { return `https://wiki.haskell.org/Zipper https://en.wikipedia.org/wiki/Zipper_(data_structure)` }
  get title() { return `Zippers` }
      }
  
  class isCaseSensitiveNode extends abstractFeatureNode {
        get pseudoExample() { return `pldb != PLDB` }
  get reference() { return `https://en.wikipedia.org/wiki/Case_sensitivity` }
  get title() { return `Case Sensitivity` }
      }
  
  class isLispNode extends abstractFeatureNode {
        get pseudoExample() { return `(+ 1 2)` }
  get reference() { return `https://en.wikipedia.org/wiki/Lisp_(programming_language)` }
  get title() { return `Lispy` }
      }
  
  class letterFirstIdentifiersNode extends abstractFeatureNode {
        get pseudoExample() { return `pldb100 = "OK" // 100pldb = "ERROR"` }
  get title() { return `Letter-first Identifiers` }
      }
  
  class mergesWhitespaceNode extends abstractFeatureNode {
        get pseudoExample() { return `result = 1    +    2` }
  get reference() { return `http://wiki.c2.com/?SyntacticallySignificantWhitespaceConsideredHarmful` }
  get title() { return `Merges Whitespace` }
      }
  
  class supportsBreakpointsNode extends abstractFeatureNode {
        get reference() { return `https://en.wikipedia.org/wiki/Breakpoint` }
  get pseudoExample() { return `debugger;` }
  get title() { return `Breakpoints` }
      }
  
  class dblpPublicationsHitsNode extends GrammarBackedNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get intCell() {
        return parseInt(this.getWord(1))
      }
      }
  
  class featureExampleCodeNode extends GrammarBackedNode {
        createParser() { return new TreeNode.Parser(this._getBlobNodeCatchAllNodeType())}
  getErrors() { return [] }
      }
  
  class abstractBooleanNode extends GrammarBackedNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get boolCell() {
        return this.getWord(1)
      }
      }
  
  class gdbSupportNode extends abstractBooleanNode {
        get sourceDomain() { return `sourceware.org` }
      }
  
  class isDeadNode extends abstractBooleanNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get boolCell() {
        return this.getWord(1)
      }
  get urlCell() {
        return this.getWord(2)
      }
      }
  
  class isOpenSourceNode extends abstractBooleanNode {
        get alwaysRecommended() { return true }
      }
  
  class isPublicDomainNode extends abstractBooleanNode {
        get alwaysRecommended() { return true }
      }
  
  class usesSemanticVersioningNode extends abstractBooleanNode {
        
      }
  
  class githubLanguageGroupNode extends GrammarBackedNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get externalGuidCell() {
        return this.getWordsFrom(1)
      }
      }
  
  class errorNode extends GrammarBackedNode {
        getErrors() { return this._getErrorNodeErrors() }
      }
  
  class annualRankNode extends GrammarBackedNode {
        get yearCell() {
        return parseInt(this.getWord(0))
      }
  get rankCell() {
        return parseInt(this.getWord(1))
      }
      }
  
  class annualPopulationCountNode extends GrammarBackedNode {
        get yearCell() {
        return parseInt(this.getWord(0))
      }
  get populationCountCell() {
        return parseInt(this.getWord(1))
      }
      }
  
  class lineOfCodeNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(lineOfCodeNode, undefined, undefined)
    }
  get codeCell() {
        return this.getWordsFrom(0)
      }
      }
  
  class blankLineNode extends GrammarBackedNode {
        get blankCell() {
        return this.getWord(0)
      }
  get shouldSerialize() { return false }
      }
  
  class pldbNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(errorNode, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"annualReportsUrl" : annualReportsUrlNode,
  "discord" : discordNode,
  "irc" : ircNode,
  "zulip" : zulipNode,
  "cheatSheetUrl" : cheatSheetUrlNode,
  "demoVideo" : demoVideoNode,
  "documentation" : documentationNode,
  "downloadPageUrl" : downloadPageUrlNode,
  "ebook" : ebookNode,
  "emailList" : emailListNode,
  "esolang" : esolangNode,
  "eventsPageUrl" : eventsPageUrlNode,
  "faqPageUrl" : faqPageUrlNode,
  "gitRepo" : gitRepoNode,
  "githubRepo" : githubRepoNode,
  "gitlabRepo" : gitlabRepoNode,
  "sourcehutRepo" : sourcehutRepoNode,
  "firstAnnouncement" : firstAnnouncementNode,
  "screenshot" : screenshotNode,
  "photo" : photoNode,
  "languageServerProtocolProject" : languageServerProtocolProjectNode,
  "officialBlogUrl" : officialBlogUrlNode,
  "packageRepository" : packageRepositoryNode,
  "redditDiscussion" : redditDiscussionNode,
  "reference" : referenceNode,
  "rijuRepl" : rijuReplNode,
  "spec" : specNode,
  "releaseNotesUrl" : releaseNotesUrlNode,
  "website" : websiteNode,
  "webRepl" : webReplNode,
  "antlr" : antlrNode,
  "hopl" : hoplNode,
  "jupyterKernel" : jupyterKernelNode,
  "meetup" : meetupNode,
  "subreddit" : subredditNode,
  "replit" : replitNode,
  "rosettaCode" : rosettaCodeNode,
  "twitter" : twitterNode,
  "codeMirror" : codeMirrorNode,
  "monaco" : monacoNode,
  "tryItOnline" : tryItOnlineNode,
  "ubuntuPackage" : ubuntuPackageNode,
  "compilerExplorer" : compilerExplorerNode,
  "githubBigQuery" : githubBigQueryNode,
  "githubLanguage" : githubLanguageNode,
  "leachim6" : leachim6Node,
  "projectEuler" : projectEulerNode,
  "pygmentsHighlighter" : pygmentsHighlighterNode,
  "pypl" : pyplNode,
  "quineRelay" : quineRelayNode,
  "stackOverflowSurvey" : stackOverflowSurveyNode,
  "tiobe" : tiobeNode,
  "conference" : conferenceNode,
  "dblp" : dblpNode,
  "goodreads" : goodreadsNode,
  "hackerNewsDiscussions" : hackerNewsDiscussionsNode,
  "isbndb" : isbndbNode,
  "semanticScholar" : semanticScholarNode,
  "description" : githubDescriptionNode,
  "equation" : equationNode,
  "example" : wikipediaExampleNode,
  "helloWorldCollection" : helloWorldCollectionNode,
  "funFact" : funFactNode,
  "keywords" : keywordsNode,
  "lineCommentToken" : lineCommentTokenNode,
  "multiLineCommentTokens" : multiLineCommentTokensNode,
  "printToken" : printTokenNode,
  "stringToken" : stringTokenNode,
  "assignmentToken" : assignmentTokenNode,
  "booleanTokens" : booleanTokensNode,
  "includeToken" : includeTokenNode,
  "features" : featuresNode,
  "linguistGrammarRepo" : linguistGrammarRepoNode,
  "wikipedia" : wikipediaNode,
  "fileExtensions" : githubLanguageFileExtensionsNode,
  "forLanguages" : forLanguagesNode,
  "related" : relatedNode,
  "runsOnVm" : runsOnVmNode,
  "influencedBy" : influencedByNode,
  "successorOf" : successorOfNode,
  "subsetOf" : subsetOfNode,
  "renamedTo" : renamedToNode,
  "supersetOf" : supersetOfNode,
  "writtenIn" : writtenInNode,
  "extensionOf" : extensionOfNode,
  "forkOf" : forkOfNode,
  "compilesTo" : compilesToNode,
  "inputLanguages" : inputLanguagesNode,
  "packageAuthors" : packageAuthorsNode,
  "centralPackageRepositoryCount" : centralPackageRepositoryCountNode,
  "packageInstallCount" : packageInstallsNode,
  "packageCount" : packageCountNode,
  "packagesIncludingVersions" : packagesIncludingVersionsNode,
  "appeared" : appearedNode,
  "wordRank" : wordRankNode,
  "githubCopilotOptimized" : githubCopilotOptimizedNode,
  "creators" : creatorsNode,
  "nativeLanguage" : nativeLanguageNode,
  "announcementMethod" : announcementMethodNode,
  "country" : countryNode,
  "indeedJobs" : indeedJobsNode,
  "linkedInSkill" : linkedInSkillNode,
  "title" : titleNode,
  "standsFor" : standsForNode,
  "aka" : akaNode,
  "oldName" : oldNameNode,
  "originCommunity" : originCommunityNode,
  "visualParadigm" : visualParadigmNode,
  "type" : typeNode,
  "fileType" : fileTypeNode,
  "domainName" : domainNameNode,
  "gdbSupport" : gdbSupportNode,
  "isDead" : isDeadNode,
  "isOpenSource" : isOpenSourceNode,
  "isPublicDomain" : isPublicDomainNode,
  "usesSemanticVersioning" : usesSemanticVersioningNode,
  "versions" : versionsNode}), [{regex: /^$/, nodeConstructor: blankLineNode}])
    }
  get fileNameCell() {
        return this.getWord(0)
      }
  get fileExtension() { return `pldb` }
  static cachedHandGrammarProgramRoot = new HandGrammarProgram(`todo trim the trailing slash
  todo Grammar should probably have pattern matching. And then we can detect semantic versions in the below.
  todo Scoping by file in Grammar lang would be really useful for this file. Also, multiple inheritance or mixins.
  conferenceNameCell
   extends stringCell
  githubRepoUrlCell
   extends urlCell
   regex ^https://github.com/.+/.+$
  helloWorldCollectionIdCell
   description Id for this language on hello world collection.
  creatorNameCell
   extends stringCell
  nativeLanguageWordCell
   description The name of a natural language like English or Japanese.
  announcementMethodCell
   description Common ways languages are first announced.
   enum pressRelease paper rfc webpage blogPost interview dissertation
   highlightScope constant.language
  countryNameCell
   extends stringCell
  aliasCell
  numberCell
  intCell
  rankCell
   extends intCell
  populationCountCell
   description A positive integer representing a number of people.
   extends intCell
  stringCell
   highlightScope string
   description Any string except for a blank cell.
   regex .+
  fileExtensionCell
   extends stringCell
  boolCell
   enum true false
  codeCell
   highlightScope comment
  urlCell
   highlightScope constant.language
   regex (ftp|https?)://.+
  keywordCell
   highlightScope keyword
  tokenCell
   highlightScope keyword
  searchQueryCell
   extends stringCell
  yearCell
   extends intCell
  permalinkCell
   highlightScope string
   description An ID of a language on PLDB.
   enum 05ab1e 1-pak 1620sps 1c-enterprise 2-pak 20-gate 2lisp 2obj 3-lisp 3apl 3d-logo 3dcomposer 3ds 3mf 3rip 4g-standard 4th-dimension 51forth 6gunz 8th a-0-system a-sharp a51 aadl aaf aarch64 aardappel aardvark abacus-machine abal abap abbreviated-test-language-for-all-systems abc-80 abc-algol abc abcl-cp abcl-f abcl-lang abcl abcpp abel able abnf abs abset abstract-state-machine-language abstracto absys ac-toolbox accent ace acl acl2 acme acore acorn-atom acorn-lang acorn acornsoft-logo acos acsi-matic acsl act-iii act-one actalk action-code-script action actionscript active-language-i active-u-datalog activevfp activity-pub actor actors actus ad-hoc ada-95 ada-9x ada-tl ada adabtpl adagio adam-standard adam adamant adaplex address adenine-programming-language adept ades-ii ades aditi adlib adobe-font-metrics ads-b-standard advanced-continuous-simulation-language advice-taker aed aepl aesop afnix afs agda agent-k agentspeak agl agora ags-script aheui aida aids ail aime aiml aimms air airtable-app ais aith akl al aladin alambik alan alba albatross alcor aldat aldes aldor aldwych ale alec alef aleph alf alfred algae algebraic-compiler algebraic-modeling-language algem algernon algo algobox algol-58 algol-60 algol-68-r algol-68-rt algol-68 algol-e algol-n algol-w algol-x algol algy alice aljabr allo alloy alma-0 alma-007 alma-o alma almir almquist-shell alohanet alonzo alpak alpha-programming-language alphabasic alphapop alphard-programming-language alphard alpine-abuild alps altac altair-basic altibase altran alumina amalthea amanda amazon-dynamodb amazon-rds amber ambienttalk ambit-g ambit-l ambit ambush amiga-e amiga-programming-languages amigabasic amos amperes-circuital-equation ampl amppl-i amppl-ii amqp amtran-70 amtran amulet ana analytical-engine-machine and-or andante andorra-i andorra android angelscript angr anna ans-mumps ansi-basic ant-build-system ante-esolang ante antha antlr apache-cassandra apache-derby apache-hbase apache-phoenix apache-velocity apache apacheconf apar aparel ape100 apescript apex api-blueprint apl-gpss apl-hp apl-z80 apl apl2 aplette aplgol-2 aplgol aplo aplus aplusplus aplx apollo-guidance-computer apostle appcode-editor appl-a apple-1-machine apple-basic apple-prodos applescript applesoft-basic applog april aprol apse apt-pm apt aqasm aql aquarius-prolog arabic-numerals arablan arango-db arbortext-command-language arc-assembly arc-isa arc archi archieml arctic arden-syntax arduino arend aretext arexx arezzo-notation argdown argon argos argus arith-matic arjuna ark-lang ark arkscript arm-templates arm armani arret arrow-format arrow arta artspeak arturo arvelie-format ascii-armor ascii asciidoc asciidots asciimath asdf asf-sdf ashmedai asic-programming-language asmjs asn-1 asp.net asp aspectcpp aspectj aspen aspol assembly-language assemblyscript associons asspegique astatine asterisk asterius-compiler astlog astro astroml asymptote atari-basic atari-microsoft-basic atari-st-basic atlas-autocode atlas atmel-avr atol atom-editor atom atomese atomo atomos atomspace ats attic-numerals aubit-4gl augeas augment aui aur-pm aurora austral autasim autocad-app autocode autocoder-ii autocoder-iii autocoder autoconf autodraft autogrp autohotkey autoit autolisp autoloft automast automator autopromt avail avalon-common-lisp averest avi-synth avr avro awk awl aws axcess axiom-computer-algebra-system axiom axt-format aztec-c azure b-line b b3-ir b32-business-basic b4tran babel baby-modula-3 babylonian-numerals back badlanguage bag-format balanced-ternary-notation balg balgol balinda-lisp ballerina-central-pm ballerina balm balsa baltazar baltik bam-format bamboo bancstar-programming-language bare barrel bartok base64 baseball basel bash basic-11 basic-256 basic-ap basic-e basic-pdp-1-lisp basic-plus basic-programming basic-stamp basic basic09 basic4android basic4gl basic4ppc basicode basicx basil basis-universal-format batari-basic batch battlestar bawk bayer-expressions bayes-equation baysick bazel bbc-basic bbcode bbj bbn-lisp bbx bc-neliac bc bcpl bcx bdl beads-lang beagle beam-bytecode beam-vm beanshell beatnik beautiful-report-language bebasic bed-format bedsocs bee beebasic beef-lang beef beflix befunge behavior-markup-language bel-lang bel ber berkeley-db-lib berkeleydb berry besys beta-basic beta-project beta-prolog beta bgraf2 bhsl bibtex bicep biferno bigloo bigmac bigwig-format bigwig-programming-language bigwig binary-equation binary-ninja binary-notation binaryen bind-app bioconductor-pm biomod bioscript biossim biplan bird birkbeck-assembly bison bisonpp bistro-programming-language bitarray bitbake bitc bizubee bjou bla blackcoffee blacklight blade-lang blade blake-hash-function blank blaze-2 blaze blazex blc blender-app bliss blitz3d blitzbasic blitzmax blitzplus blockly blockml bloom blooms bloop blox blue-programming-language blue blueprints bluespec blur-markup-language blz bmd bml bmp-format bnf boa bob bog boil bolin bolt bon-programming-language boo boogie boomerang-decompiler boost-lib booster borneo boron bosque bossam bounce-lang bounce bourne-shell boxer boxx bpel bpkg-pm bpl bpmn bpn2 bqn brackets-editor brain-flak brainfuck breccia bridgetalk brightscript-lang brisk brl bro broccoli-1 broccoli-2 broccoli brooks-programming-language brouhaha brown-university-interactive-language bscript-interpreter bscript bsml bsp bucardo bucklescript buddyscript bugsys bullfrog bun bush business-application-language business-basic business-object-notation business-process-modeling-language business-rule-language butterfly-common-lisp buzz bx bytecode-modeling-language bytelisp bython bywater-basic c-- c-al c-cubed c-flat c-for-all c-headers c-shell c-smile c-talk c c2 c3 ca-realizer ca-telon ca65-assembly cabal cache-basic cache-objectscript cactus cadence-skill cado-systems-technical-information cafeobj caffeine cages caisys cajole cal calc-var calc calc4 cali-lang caltech-intermediate-form calypso cam camac camal camil caml candor candy-codes candy cane canon-capsl cantor capn-proto capsl capsule capybara caramel carbon carp carpet carth cartocss casio-basic cassandre cat catala catalysis categorical-query-language cayenne cayley cbasic cbor ccal ccd ccel ccr ccs cda cddl cdf cdl cdlpp cecil cedar-fortran cedar ceemac celip cell cellsim celsius-webscript ceprol cesil ceu ceylon cfengine cfml cfscript cg cgol ch chain-format chain-programming-language chained-arrow-notation chaiscript champ chaos-lang chapel chappe-code charcoal charity charly charmpp charrette-ada chartio-app charybdis chatterbot checked-c checkout cheetah chef chemtrains cheri chevrotain chibicc chicken-lang chicken chicon chika chill chimera chinese-basic chip-8 chip-programming-language chipmunk-basic chirp chisel chocolatey-pm chomski chrome-programming-language chronolog chronologmc chronologz chrysalisp chuck ciao-programming-language ciel cif cigale cil cilk cimfast cims-pl-i cir circa circal circle-lang cirru cish cito citrine cityhash-hash-function cixl cl-i claire clamp clanger clarion clarity claro clascal clash class classic-ada classic clausal-lang clay clean cleanlang clear cleo cleogo cleopatra cli-assembly click clickpath clike clion-editor clipper clips clisp clist clix cloc cloe clojars-pm clojure clojurescript clos closure-templates cloud-firestore-security-rules clover clox clp-star clpr clu clx cmake cmix cmn cms-2 cms-exec cms-pipelines cmu-common-lisp co-dfns co2 cobloc cobol-net cobol cobolscript cobra coco-r coco cocoapods-pm coconut coda-editor code-blocks-editor codecept codeflow codegear-delphi codelite-editor codemirror codeql codil coff coffee-cinema-4d coffeepp coffeescript cogmap cogo coherence coherent-parallel-c coi-protocol cokescript col colascript colasl cold-k coldfusion-components coldfusion collada color-basic colorforth comal combined-log-format comby comfy comit comm commen commodore-basic common-lisp common-log-format common-workflow-language commonloops commonmark compact-application-solution-language compiler-compiler complex-prolog component-pascal computer-compiler computest comskee comsl comsol-script comtran cona conan-center-pm conan-pm conc concept-script conceptual concert-c concise-encoding concordance concur concurnas concurr concurrent-cpp concurrent-metatem concurrent-ml concurrent-pascal concurrent-prolog cone confluence congolog conlan conll-u conman connection-machine-lisp connection-machine conniver consim constraintlisp constraints consul context-diff contracts.coffee contrans converge convert cooc cool coordinate-format copas cope copilot coq cor coral-64 coral-lang coral coralpp corbascript corc corelscript corescript corman-common-lisp cornell-university-programming-language corvision cosh cosmicos cosmo cosmos cotton couchbase-mobile couchbase couchdb coulombs-equation cowsel cp cpan-pm cperl cpl cpp cql cqlf cqlpp crack cram-format cran-pm cranelift-ir crates-pm creative-basic crema creole crmsh croc croma crush cryptol crystal cs-script csa csharp csl csmp cson csound csp-oz-dc csp-oz csp cspydr css-doodle css cssa cst csv csvpp csvw ct ctalk-lang ctalk ctan-pm ctr cubase cube cuda cuecat cuelang culler-fried-system cullinet cuneiform cupid cupit-2 curl curly curry curv cuscus cusip cvl cweb cx cyber cybil cycl cyclone cycript cymbal cypher cyphertext cython cytosol d-data-language-specification d d2 d3 d4-programming-language d4 dad dafny dag daisy-systems dale dalvik-bytecode daml-oil daml damn daonode dap-algol dap-fortran daplex darcs-patch darkbasic darklang dart-pm dart dartcvl dartmouth-basic das dashrep dasl dasm dat-protocol data-access-language data-general-business-basic data-text databus dataflex datafun datalisp datalog datan datapackage datapoint-dasl datascript datatrieve dataweave datev datomic dax dbase dbml dc dcalgol dcat dda ddfcsv ddfql ddml de-bruijn-index-notation deacon deb debl debuma dec64 decision-model-notation declare dedukti deesel definite-clause-grammar-notation del delirium delphi delta-prolog dem demeter demos deno dependent-ml dern descartes descript descriptran desktop desmos detab-65 detab-x detap deva devicetree devil dex dexterity dexvis dfl dfns dgraph dhall diagram dialog diamag diana dibol dice diet diff differential-datalog digital-command-language digraf dinkc dinnerbell dino dio dipe-r diplans disc dispel displayport-standard distributed-processes distributed-smalltalk ditran ditroff-ffortid ditroff django djangoql djot dkim-standard dllup dlp dlvm dm-1 dm dmap dml dna dns docker dockerfile docopt doe-macsyma dog dogescript doh doi dojo dokuwiki dolittle dollar-sign dolphin domino doml doodle dopl dot-product-equation dot-ql dot dowl dpp dprl draco-programming-language draconian dragonbasic dragoon drakon dreamlisp dribble drl drol drupal dscript dsd dsl-90 dslx dss dsym dtd dtrace dts dual dub-pm duel duro durra dvi-standard dwg dxf dylan dynamo-pm dynamo-visual-language dynamo dystal dyvil e eagle earl-grey eas-e ease easl easy-english easy easybuild easylanguage easytrieve ebg ebnf ec ecl eclectic-csp eclipse-command-language eclipse-editor ecmascript eco-editor ecological-metadata-language ecr ecsharp ect ed-editor eden edge-side-includes edgedb edgelisp edgeql edh edina edinburgh-imp edinburgh-lcf edison edje-data-collection edn edsac-initial-orders edscript edsim educe-star educe eex eff efl egel egison egl egs4 eiffel ejs el1 elan elastic-query-dsl election-markup-language electre elegance elegant elena elf elfe elixir ella-programming-language ellie elliott-algol ellpack elm-packages-pm elm elmol elpa-pm elpi elvish elymas em emacs-editor emacs-lisp emberjs-framework emberscript emerald-lang emerald emesh emfatic emily emma emojicode emoticon empirical emu encore energese-notation energy-momentum-equation english-programming-language eno enso-lang enso enterprise-mashup-markup-language entropy envoy-app epigram epilog epsilon eql eqlog eqn eqs equate erb erg erlang errol esc-p escapade-programming-language eskew esoteric-reaction esp espol esterel eta etc ethereum-vm ethernet etoys etruscan-numerals etude euboea euclid euclidean-geometry euler eulers-equation eulisp eumel euphoria eurisko eva eve everparse3d ex-editor exapt excel-app exec-2 executable-json exel exfat exkited expect explan explor explorer express expresso ext ext2 ext3 ext4 extempore extended-ml extended-pascal extensible-embeddable-language extran ez ezhil f-prime f-script f-sharp f fable-lang fable fac facelets fact-lang fact factor fad falcon false family-basic fancy fantom fap far faradays-induction-equation farcaster fardlang fast-fourier-transform-equation fasta-format fastq-format fasttrack-scripting-host fat faust fawlty fay fcl fcpu fe feel felix femtolisp fen-notation fenix-project fennel ferite fern ferret fetlang feynman-diagram ffmpeg fhir fibonacci-notation fibonacci fickle figlet-font filebench-wml filetab-d filetab filterscript firebase firrtl fish fishlang fizz fjolnir fjs fl flacc flagship flame-ir flang flapjax flare flatbuffers flatline flavors fleck flengpp flex-lang flex flexbuffers flexml flic flix floorplan flora floral floscript flow-matic flow flow9 flowchart-fun flowcode flowgorithm flowlog flownet flownote flua flutter-framework flux-lang flux fm-standard fmj fml-lang fml fo foaf focal focus foil foogol foral-lp foral forall forest-database forest-lang forgebox-pm fork-lang fork fork95 formac formality formatted-table forml forms-3 formula forte-4gl forth forthnet-pm forthscript fortran-77 fortran-8x fortran-90 fortran-cep fortran-d fortran-ii fortran-iii fortran-iv fortran-m fortran fortransit fortress fossil-scm foundry fox foxpro fp fp2 fp3 fpgac fpp fractran frame framework-office-suite fran frank-lang frank free-pascal freebasic freebsd freefem freemarker frege frenetic fresco frink frost frtime fructure-editor fsl fstar ftp fun function-block-diagram funl futhark futurebasic futurescript fuzuli fuzzyclips fx-87 fxml fxscript g-2 g-code g-expressions g-fu g-portugol gaea gaiman galaksija-basic galileo gambas game-maker-language game-oriented-assembly-lisp game gamemonkey-script gamerlanguage gaml gams gap gargoyle garp gas gasp-ii gasp gat gauche gauss-flux-equation gauss-magnetism-equation gaussfit gcc-machine-description gcla-ii gcp gdata gdb gdl gdpl gdscript geany-editor gedanken gedit-editor gel gellish gello gem gema gemini-protocol general-algebraic-modeling-system generate-ninja generic-haskell generic genero genexus genie genius-extension-language genshi-text genshi genstat gentee gentoo-ebuild gentran-90 gentran geo-ml geogebra geojson george gerald gerber-image gerbil germinal gettext gfa-basic gff-format gfoo gforth gfs ghc gherkin ghidra-decompiler ghostscript gif-format gimple gintonic giotto gist git-config git gitignore gks glbasic gleam glicol glide glish glitch-editor glms gloss glpk-lib glsl glu glue-nail gluon glush glyph-bitmap-distribution-format glyph gnome-basic gns gnu-e gnu-rtl gnuplot go-bang go goal goby godel godot-game-engine gofer gogs-editor gold golfscript golo golog google-apps-script google-cloud-mysql google-cloud google-data-studio-app google-sheets-app goose gopher-protocol goql gorillascript gospel gosu gp gpds gpgs gps gpss-360 gpss-85 gpss-fortran gpss gql graal grace grad-assistant gradle grain grammar grammatical-framework graph-it graph-modeling-language grapheasy graphics-basic graphlog graphml graphos graphql-plus-minus graphql-sdl graphql graqula grass gravity-equation gravity greek-numerals green greenplum gremlin gren grep grid-notation gridstudio-editor grin grml groff groove groovy-server-pages groovy grouplog grunt gsbl gsql gtf-format guide guido-music-notation guile guix gura guru gvl gw-basic gwion gwl gxl gypsy gzip h-lang habit hac hack hackage-pm hackett hackppl hacspec haggis hakaru hal-format hal-s halide ham hamdown haml hamler hancock handel-c handlebars hank harbour hare harlan harvey harwell-boeing-format hascript hashlink haskell-sharp haskell hasklig hasl haste haxe haxelibs-pm haystaq hazel hbasic hcard hccb hcl hdf hdfs hdmi-standard hdt heap.coffee hecl heic helang helena helium hello helper henk heraklit herbrand hermes heron-lang heron hex-pm hex-rays hexagon hexagony hfs-plus hfs hhvm hi-visual high-tech-basic highlightjs hilbert hilltop-lang hilvl hina hiq hivemind hiveql hjson hl7 hla hlasm hlsl hlvm hmmm hmsl hobbes hocon hodor hol holcf holo holonforth holyc homa homebrew-pm homespring honu hook hoon hoot-smalltalk hop hope hopscotch horse64 hotcocoalisp hotdog hp-basic-for-openvms hp-gl hp-pascal hp-time-shared-basic hpp hprl hr-code hrqr hsaml-format hscript hsl hsml hspec htel html htmx http-2 http-3 http httplang huginn hugo hujson humanhash-hash-function hummingbird-quickscript hurl hush huwcode hxml hy hybrid hycom hypac hyper-basic hypercard hyperflow hyperfun hyperlisp hyperlog hyperscript-lang hyperscript hypertalk hyphy hytime hytran i-expressions i ia-32 ial iam ib-templog ibex ibm-1401-symbolic-programming-system ibm-basic ibm-basica ibm-db2 ibm-gml ibm-i-control-language ibm-logo ibm-rational-sqabasic ibm-rpg ibm-system-38-language ibuki-cl icalendar-format icarus icd icedcoffeescript ices-system icetran ici icml icon icot id idio idl-sl idl idris ids idyll ifo ifps igor-pro iif iikuse iitran ikarus ilbm ilu ilx imac-machine image imaginary-number-equation imandra imap-protocol imba imf imp-lang imp imp72 impala impl ina-jo inc inchi incipit indental infer infiniband-standard influxdb infolog inform information-algebra information-processing-language information-theory-equation informix infusion-framework ingres ini ink-lang ink inko inmagic inno-setup inquire inscan insight insitux instruction-list integer-basic integral-equation intellijidea-editor interactive interbase intercal intercellas interchange-file-format intercons interleaved-notation interlisp-vax interlisp interpress interscript intersystems-cache intuitionistic invokator io iode ioke ion-schema ion ios iota-and-jot iota ip-pascal ipad-machine ipf ipfs iphone-machine ipl-v iptables-rope iptscrae ipv4 iqf iqr irc-log ircis isabelle-91 isabelle-hol isabelle isac isbl isbn iscript isetl isis islisp iso-8601 ispl isq iswim it iterm2 itl ivtran ixml izibasic j jacal jacl jade jai jakt jal-compiler jammy janet jank janus-lang janus-programming-language jargon jasmin jasmine jasper jass java-bytecode java-ee-version-history java-properties java-server-pages java javacc javafx-script javaml javascript jaws-scripting-language jayfor jazz jbc jcard jcl jcof jean jedit-editor jedlang jeebox jeeves jekyll jet-propulsion-laboratory-display-information-system jevko jflex jfugue ji jingo jinja jinx jis-x-0201 jison-lex jison jisp jiyu jlang jmap jmespath jmp jmsl joe-e join-java joker jolie jonprl josie joss-ii joss joule jovial joy joyce joycep jpeg-format jpl jplace jpp jq jql jquery jr jruby jscript jsf jsgf jsharp jsil-compiler jsl jslt jsml json-graph-format json-graph-spec json-lambda json-ld json-schema json-script json-stat json-url json-with-comments json json5 jsoniq jsonnet jspp jsx jsyn judoscript juicy jule julia-lang julia juliahub-pm juniper juno jupyter-editor jupyter-notebook just juttle juvix jvm jython k-framework k kaffeine kaggle-app kai kail kaitai kakoune-editor kal kaleidoquery kaleidoscope kaleidoscope90 kaleidoscope91 kalyn kamby kami kaml karel karl kasaya kate-editor kate katex kaukatcr kavascript kawa-scheme-implementation kayia kb kee kefir kei kek-nodal keli keras kerf kermeta kernel-e kernel kew keykit keysight-vee khepri ki kicad kid kiev kilo-lisp kima king-kong kiss kit kitlang kitten kivy-lang kixtart kl-one kl0 kl1 klaim klerer-may-system klipa klisp klong kml knight knitr knowledge-interchange-format ko koara kodu-game-lab kogut koi koka komodo-editor kona konna konsolscript korn-shell kotlin kqml krc kris krl-0 krl krs krypton ktexteditor-editor kubernetes kuin kuka kumir kuroko kvikkalkul kvsapi kylix kyma l l2 l6 labtran labview ladder-logic lagoona lain lambcalc lambda-obliv lambda-prolog lambda-zero lambda lamderp lamdu-editor lamdu lamina lammps-format lanai language-for-class-description language-h language-server-protocol laning-and-zierler-system lap laravel-framework larceny larch laris larp lasp lass lasso latex latino latte-js latte laure lav-format lava lawvere lazarus-editor lazy-k lazyml lc-3 lcf lcl ld-json ldap ldl ldl1 ldpl le-lisp leaf lean leap leazy leda legol lem-editor lemick lemon leo-editor leogo leopard les lesk lesma less lever levy lex lexon lexx-editor lezer lfe lg lgdf li-chen-wang liberty-basic libra libsvm-format life lift lighttpd-configuration-file ligo lil-pl lil lila-lang lila lily lilypond limbo limdep linc-4gl lincoln-reckoner lincos linda linden-scripting-language linearml lingo lingua-graphica link linked-markdown linker-script links-programming-language links linktext linoleum linotte linq linux-kernel-module linux liquid liquidity lis lisaac liseb liso lisp-1-5 lisp-2 lisp-a lisp-machine-lisp lisp lispme lisptalk lispworks lispyscript listdown lite-c literate-agda literate-coffeescript literate-haskell litescript lithe little-b little-smalltalk little livecode livescript livr lkif llhd lll lllpg llvmir lmdb lnf lo lobster local loci locomotive-basic locs logal logica logicon login logist loglan loglisp loglo logo logol logos logowriter logres logscheme logtalk lol lola-2 lola lolcode lookml loom loomscript loopnpp loops lore lorel-1 lorel lotis lotos lotusscript lowstar lpc lpl lrltran lsd lse lsif-format lsl lua luajit luarocks-pm luau lucene-query-syntax lucid-chart-app lucid-lang lucid-representations lucid lucinda luna-1 luna lunar lush lustre lux lyapas lygon lynx lyric lyx-editor m-expressions m-lisp m-programming-language m2001 m3db m4 m4sugar mac macaims macbasic macbook-air-machine macchiato mace machiavelli macintosh-common-lisp macintosh-machine macro-10 macro-11 macro-spitbol macro macroml macsyma mad madcap-vi madcap mads mages magic-paper magik magit magma magma2 magritte mai-basic-four mai make makedoc makefile mako mal malbolge mallard-basic malus mama-software man-machine-language manchester-syntax mangle manhood manim manool manticore manuscript map mapbasic maple maplesoft-app-center-pm mapper mapquery maps maraca-lang margin maria-db-column-store maria-xml mariadb mark-iv markdeep markdown marklogic marko markovjunior markus markwhen marlais marmot marp marsyas marten mary-2 mary mascara masim maskjs masm mass-energy-equation material-exchange-format math-matic mathcad mathematica-editor mathematica-packagedata-pm mathematica mathics mathjax mathlab mathlingua mathml mathsy mathtype mathworks-file-exchange-pm matita matlab matplotlib matrix-pascal matrix-protocol maude maven-pm maven-pom mavis mavo mawk max maxima maxscript maya mbasic mbox mckeeman-form mcleyvier-command-language mcobol md5-hash-function mdbs-qrs mdl mdx-lang mdx meanscriptcli mech-lang mediawiki medic medusa megalog meld melody melpha-pm memcached memex-machine mendel mentat mercurial mercury-programming-system mercury merd mermaid meroon mesa meson messagepack met-english meta-assembler meta-ii meta-lisp meta-plus metacomco metafont metah metal-programming-language metal metalang99 metalex metaml metapi metapost metasim metatem metaweb-query-language methodology-description-language mewl mewmew mgmt mheg-5 michelson micro-cpp micro-editor micro-flowcharts micro-mitten micro-prolog microarchitecture-description-language microdare microdata microl microplanner micropython microsoft-access microsoft-azure-cosmos-db microsoft-basic microsoft-equation-editor microsoft-macro-assembler microsoft-mysql-server microsoft-small-basic microtal midas miis mike mime mimic mimium mimix-stream-language min minc mini-ml minid minidsdb minihaskell minikanren minilang miniml-error miniml minion miniprolog minivital minizinc minopt mint mips mir mirager mirah miranda miranim mirc mirfac mirth miso-framework miva mizar ml mlab mlatu mlir mlisp2 mlite mlpolyr mmix mmsearch mmx mobl-lang mobl moby-programming-language mochajs mochi mockingbird-notation mocklisp modcap model-204 model-k modelica modl modlisp modsim-iii modula-2 modula-2p modula-3-star modula-3 modula-p modula-r modula modular-prolog module-management-system moescript moinmoin molecular-query-language molfile-format molog monaco mond monesa mongodb monkey monodevelop-editor monte moo mool moonrock-basic-compiler moonscript moose morfa morfik morphe morphism morse-code mortran motif-software mountain mouse mouse4 moxie moya mp3-format mpgs mpl mps mpsx mql mqtt mrdb ms2 mscgen msg-84 msl msp430 msx-basic mtml mu muddl mudlle muf mufp mul-t multi-user-basic multiaddr multibase multicodec multics multigame multihash-hash-function mumath mumps mums mun-lang munin muon mupad murmur-hash-function mushroom music-sp musicxml musimp musp mustache musys mvel mvl mxml mybb mycroft myghty myia mypy myrddin mys mysql mythryl n-prolog n-triples n nadesiko nail nakl nano-editor napier88 napss narpl nasal nasm nassi-shneiderman-charts native-structured-storage nato-phonetic-alphabet natural navier-stokes-equation nawk ncar-command-language ncl ndl nearley neater nebula nectar neeilang neko neliac nelua nemerle neo4j neovim-editor neralie-format nesc nesl ness nested-context-language nestedtext net-format netbasic netbeans-editor netform netlib netlinx netlogo netrexx netscript network-control-language neuronc neut neutron never newclay newick-format newlisp newp newspeak newsqueak newton newtonscript nexml nextflow nexus-format nfql nginx-config ngl-programming-language ngql ngs nhx nial nianiolang nice nickle nikl nil nilscript nim nimble-pm nimrod nimskull ninja nios nirvana nit nix nixos njcl nl nlpl nltk nml noah nodal nodejs noisecraft nomad-software noms-db none noodle nop-2 nord normal-distribution-equation northstar-basic nosica notation3 note notepad-editor notepad-plus-plus-editor noulith nova-editor noweb np npl-lang npl npm-pm npy nqc nrl nroff ns-basic nsis nsl ntfs ntp nu-prolog nu nua-prolog nuget-pm nul-lang nulan numba numbers-app numerica numpad numpy nuprl nushell nut nuua nvdl nwscript nxc nxt-g nydp nylo nymph nyquist o-matrix o-xml o o2 o42a oak oaklisp oasis-operating-system oasis oberon-2 oberon obj-programming-language obj2 objdump object-definition-language object-oberon object-pascal object-query-language object-rexx object-z objectcharts objective-c objective-cpp objective-j objective-modula-2 objective-s objectlogo objectpal objectscript objectworld objvlisp objvprolog obliq obscure observable-lang obsidian ocaml occam-2 occam-pi occam ocl octave octopus octune odata odbc oden odin odrl oem ofl oforth ofx ogdl ognl ohaskell ohayo ohm oil ok oldas ole-protocol olga oli oliver olog om omar omega ometa omg-idl omgrofl omikron-basic omnimark omnis-studio omnitab-80 omnitab-ii omnitab one-man-language onex oniguruma onnx onyx ooc ook oolp oopal oops oopsilon oopsp ooxml opa opal opam-pm open-nn open-shading-language openada opencl opencomal opendoc-protocol openedge-advanced-business-language openexr-format opengl opengraph openlisp openmusic openrc-runscript openroad openscad openspice opentype-feature-file openvera operational-control-language operon opl-langage-informatique opl opp ops-3 ops ops5 optimization-programming-language optimized-systems-software optimj oracle orange orc-format orc-lang orca-lang orca-pl orca order oregano org orient-db orient84-k orlog osiris osl-2 osql ottawa-euclid otter owbasic owen-lang owl-dl owl ox oxide oxygene oxyl oz p-cl p-prolog p-star p-tac p p3l p4 p4p package-control-pm packagist-pm pacmanconf pacol pact-i pact-ia pact pactolus padl-1 pailisp paisley palasm palcode palingol pamela pan pancode pandas pandoc-app pandora panon-1 panon-1b panther-lang paperalgo papyrus par paragon parallax-propeller parallel-ellpack parallel-pascal paralog-e parasail parasolid parenscript parenthetic pari-gp parlog parmod parquet parrot-assembly parrot-basic parrot-internal-representation parrot-vm parse-tree-notation parser partiql pascal-abc.net pascal-fc pascal-i pascal-mtp pascal-plus pascal-s pascal-sc pascal-script pascal-xsc pascal pascals-calculator-machine pasion pasro passambler passerine pasukon patch patchwork path-pascal pawn-scripting-language pawn paxscript pbasic pbm-format pbt-omega pclos pcn pcol pcpp pcrap pcre pdel pdf pdl-ada pdl pdp-11-machine pear-pm pearl pearscript pearson-correlation-coefficient-equation pebble peg pegasus-autocode pegjs pei penguor penrose peoplecode pep pep8 perfectscript peridot perl-6 perl-data-language perl petr pfort pfortran pgbouncer pgen pgm-format pgolog pgql pharen pharo phel phigs phocus phoenix-object-basic phorth php phpstorm-editor phylip phyloxml-format physictran pi-calculus pic-microcontroller pic picasso picat piccola pick-operating-system pickcode pickle-format pico picolisp pict pictol picturebalm pie-lang pie piet-programming-language pig pikachu pike pikelet pikt pilib pilot pin pinto pipelines pisc pit pixin pizza pkgconfig pl-0 pl-11 pl-as pl-c pl-exus pl-i-formac pl-i-subset-g pl-i pl-ll pl-m pl-p pl-s-ii pl-s pl-sql pl-x pl360 pl4 placa plaid-programming-language plain-english plain plam plan2d planguage planit plankalkul planner-73 planner plantuml plasma playground plb please-build please plex plexil pliant plink-bed-format plink-bim-format plink-fam-format plink-map-format plink-ped-format plist plot-lang plot plpgsql pluk plum plumb plunk plus plush plz pm2 pml png-format pnuts po pocket-smalltalk pod pod6 pogol pogoscript pointless polac polly poly polyglot-compiler polylith polymath polymorphic-programming-language polyp polytoil pomsky pony pop-11 pop-2 pop-pl pop-protocol popasm popcorn-linux poplog popr popsy port-alg portable-standard-lisp portal-langage pose post-canonical-system post-x postcss postgresql postscript potential potion pov-ray-sdl power-bi-app power-query-m powerbasic powerbuilder powerhouse-programming-language powerisa powerlanguage powerloom-knowledgebase powerpc powershell-gallery-pm powershell ppm-format pqq praat-script praxis-lang praxis preferred-executable-format preforth presto price-equation principle-of-sufficient-reason prism prisma-schema-language prismjs priz pro-star-c probevue proc-procedure-language processing processor-technology procfile procol prodel profit progol prograph progres progsbase proiv project-mentat prolog-d-linda prolog-elf prolog-iii prolog-kr prolog-linda prolog-pack-pm prolog prologpp promal promela prometheus prompter promql property-specification-language prophet proplan proset prosper protel proteus-programming-language protium proto-gnosis protobuf protos-l protosynthex proverif-lang providex prow proxy prql ps-algol psather pseint psg psi psl psyche-c psyche psyco pt ptx public-key-file pufft pug pumpkin punched-tape punycode puppet pure purebasic puredata purescript pursuit-pm pv-wave pvs py pycharm-editor pycket pygmalion pygments pyke pypi-pm pyret-lang pyret pyrex pythagorean-equation python-cl-compiler python-for-s60 python-format-spec python pytorch q-equational-programming-language q-gert q-sharp q qa4 qalb qas qb64 qbasic qbe qcl qed-editor qed-lang qfx qif qlisp qmake qml qoir qore qr-code qt qtscript quadril quaint-lang quaint quake quakec quanta quel query-by-example quexal quick-macros quickbasic quicklisp-pm quicksight-app quikscript quiktran quilt qunity quorum qute quty r r2ml r3 r4 ra rack racket raco-pm radish ragel rails rainbow raku ralph ramdascript ramen ramis-software raml rand-abel rant rapid rapidbatch rapidgen-rpl rapidq rapidwrite rapira raptor raptorjit rascal rascalmpl rason rasp ratfiv ratfor ratsno ravenscar-profile razor rbasic rbs rbscript rc rcpp rdata-format rdf-schema rdf rdfa rdml rdoc rds-format react-native readable-lisp readable real-time-cmix real-time-concurrent-c real-time-euclid real-time-mentat realbasic reason rebeca-modeling-language rebol rebus rec-sm rec-studio recfiles recol red-lang red redcode redis redpanda-app redprl redscript redshift reduce ref-arf refal refer refined-c reflex-framework reflisp reforth regent regex regina regulus reia reko-decompiler rel-english rel-lang rel relational-data-file relational-production-language relationlog relax relaxng relfun relix remix ren-c ren-notation renderman-shading-language renderscript renpy report-writer-language rescript resharper-editor rest restructuredtext retdec retroforth reuse-description-language reverse-polish-notation revit-app revolution-programming-language rexon rexx rf-maple rfc rgb-format rhet rhine rholang rhoscript rhtml ricscript rider-editor riff rigal rigc ring rio ripple risc-v rise rita rlab rlisp rlmeta rlox rmarkdown robic robomind robot-battle robotalk robotc robotframework robots.txt roc rocket rockstar-rkt rockstar rocky-mountain-basic roff roku-brightscript rol rol2 roman-abacus-machine roman-numerals ron roop root-format root-lib ros-msg roscoe rosetta-2 rosetta-smalltalk rosette-lang rosette rosie roslyn-compiler rouge roy royalscript rpg-ii rpg-iii rpl-lang rpl rpm-package-manager rpm-spec rpp rpscript rpython rql rsharp rsl rss rstudio-editor rt-aslan rt-cdl rt-z rtf rtl-2 rtp-protocol ru ruby-document-format ruby-mine-editor ruby rubygems-pm ruleml run-basic runcible runescript runic runiq runoff runrev ruri russell rust-hir rust-mir rust rustscript ruth rye s-algol s-expressions s-lang s-plus s-sl s-snobol s s2 s3 sa-c-programming-language sa saal sac-1 sac-2 sac-programming-language sagemath sako sale salem salsa saltstack sam-coupe sam-format sam76 saml sampletalk saol sap-hana sapphire sarl sartex sas sasl-programming-language sass sassy sather-k sather satysfi saustall savi sawzall sb-one sba sbasic sbcl sbml sbol scala-js scala scalpel scaml scan scat scenic schemal schemaorg schematron scheme-2-d scheme school schoonschip schrodingers-equation scieneer-common-lisp scikit-learn scil-vp scilab scipy scl sclipting scm scoop-pm scoop scopes score scratch scratchpad-ii scratchpad screamer scribble scribe scrimshaw script scriptbasic scriptease scriptol scriptx scroll-lang scroll scsh scss sdf-format sdf sdl sdlbasic sdms sdtm search secure-operations-language sed seed7 segras self semanol semi-thue-system semicolon semver send-standard sensetalk sentient seph-programming-language seph sepi seq seque sequel-2 sequencel sequential-function-chart sequential-pascal serious service-modeling-language sespath sespool set-builder-notation setl setlog setlx setun seval seymour sgml sh sha-1-hash-function sha-2-hash-function sha-3-hash-function shadama shade shaderlab shadow shakespeare-programming-language shakespeare shakti sham shapefile shapeup shared-prolog sharpscript sheep-lang sheep sheerpower-4gl sheerpower4gl shen shex shift shill shiv shml shoe short-code-computer-language shrdlu si-library si sibelius-software sibilant sidopsp sierra sieve sigma-76 signal sil sile silk sill siman-iv siman simcal simcode simdis simfactory simit simkin-programming-language siml-i simnet simodula simons-basic simpas simpl simple-binary-encoding simple-stackless-lisp simple simplescript simplictiy simpp simscript simul simula-67 simula simulink sina sinclair-basic sing-sharp singular siphash-hash-function siprol siri sisal sisc sitemap sixten sizzle sk8 sketchpad-iii sketchpad skew skil skip skookumscript skulpt sky sl sl5 slam-ii slang slash sleuth slice slick slideshow slim-lang slim-pl slim slip slips slog slony slope slpl smalgol smali small-c small-euclid small-x small smallbasic smalltalk-76 smalltalk-80 smalltalk-mt smalltalk-v smalltalk-yx smalltalk smalltalkhub-pm smallvdm smart smartgameformat smarts smartsheet-app smarty smdl smile smiles-format smithy smoke smolcs smpl smsl smt smtp smx-computer-language snakemake snap snaptag snbt snit snobat snobol snobol3 snobol4 snoop snostorm snowball-programming-language snowman-decompiler snql soap soaplang soar-ml social-networks-query-language socialite solaris-pm solaris solid solidity solmar son sophia soql-lang soql sora sorca sort-merge-generator sosl souffle soul soulver souper sourcelair-editor sourcepawn sourcetree southampton-basic-system sox soy sp-k space spade sparc spark-pm spark sparqcode sparql spatial speakeasy spec-sharp spec specl specol specrtl speedcoding speedie spf-standard spice-lisp spice spider spiderbasic spil spill spin spip spir-v spir spiral spitbol spl splaw spline-font-database split-c sporth sprint sprite-os spry sps spss spyder-editor sqhtml sql-92 sql-psm sql sqlalchemy sqlar-format sqlite-storage-format sqlite sqlmp sqlpl sqr sqrl square squeak squidconf squiggle squire squirrel squoze squrl sr-programming-language sr srecode-template srl srv ssb ssc-pm ssharp ssi ssl-lang ssl ssml stacklang stackless-python stage2 stalin stan standard-lisp standard-ml staple star-prolog star starlark starlogo staroffice-basic starpial stata statebox statemate static-typescript statsplorer status-quo-function status-quo-script steinhaus-moser-notation stella stencil stl stockholm-format stoical ston stonecutter stoneknifeforth storymatic storyscript stos-basic strand-programming-language strat stratego strcmacs streamit streem strema stress string-diagrams-notation stringbean stringcomp stripe strips strongtalk structured-storage structured-text strudel strudl struql stutter-lang stx stylus sub subleq sublime-editor sublime-syntax-test sublime-syntax subrip-text subscript subtext subversion subx sue sugar sugarj sugarss sugartex sugi summer sun-raster-format suneido superbasic supercollider superforth superjson supermac superplan supertalk superxpp surge svelte svg svgbob svl sw2 swagger swallow sweave sweet-expressions sweetjs swi-prolog swift-il swift swizzle swrl swym sybyl-notation symbal symbmath symbol symbolic-assembly sympl sympy synapse synchronized-multimedia-integration-language syndicate synergist synglish synon synproc syntex syntol sysml system-v-abi systemverilog systemz t-lang t t2b t3x tab tablam tablatal tableau-app tablog tabloid tabsol tabtran tac tacl tacpol-programming-language tactics tads taf tahoe-lafs taichi taijilang taktentus tal tale tall tamgu tampio tangledown tao-lang tao tao3d tap-code tap taql tarmac tarot tasm tawa taxa taxis tbox-lib tcc tcl tcoz tcp tcsh tcsp tdfl tdms tea-pl tea-pm tea teal teasharp teco tefkat tektronix tela telcomp telefile-assembly telnet-protocol telos telsim templar template-attribute-language tempo temporal-prolog ten tengo tensorflow teradata-aster teradata tern ternary-notation terra terse tetra tetruss-app tex texpr text-executive-programming-language textadept-editor textframe texti textile textmate-editor texy tfl the-message-system theos-multi-user-basic thinbasic thinglab think-c thorn threaded-lists thrift tht thue-programming-language thune thymeleaf ti-89-basic ti-basic-assembly ti-basic tibbo-basic tibet tick-c tics tidb tiddler tiddlywiki tidyverse tiff-format tiger-basic tikiwiki tiledb tilton timber-programming-language timed-csp timpani tinkertoy tiny-basic tinyc-compiler tinygo-compiler tiscript titan titanium tl-isa tl tla tlc tldr tls tmg tmlanguage tmtp toadskin todotxt toffeescript toi toki-sona tom-oopl tom tomal toml toolbus toontalk topaz-lang topaz topshell torchscript tornado tosh touch touchdevelop toy-lang tpdl-star tql trac trace trafola-h traits tramp tranquil transact-sql transaction-language-1 transcode transforma translang tree-annotation-operator treelang treenotation treesheets treet trellis tremor-query trex tridash trig-syntax trio triple triroff triton troff tromp-diagrams trs-80-color-computer truck true-basic truth ts tsar tscript tsl tsql2 tsquery tsv ttcn ttm ttsneo tuple-space tuplemarkup turbo-assembler turbo-basic-xl turbo-basic turbo-pascal turing-plus turing turnstile-plus turnstile turtle tutor tutorial-d twelf twig twiki two-d twoducks txl txr txt2tags txtzyme tyco tymshare-superbasic tynker type-language typecastjs typecobol typedefs typescript typographical-number-theory typoscript typst tyruba u-datalog u uan ubasic ubercode uberscript ubik ubjson uc ucg ucl ucsd-pascal udp ufl ufo ugnis uiml ujml ulisp ultralisp-pm umka uml uml2-sp umple umta uncol underlay unicode-lang unicode unicon-adl unicon unicorn uniface unified-diff unified-parallel-c unisim unison unity-engine unity unity3d-asset universe unix unlambda unlws uno unql-lang unql unravel unrealscript unseemly up-arrow-notation upic urbiscript url urn urweb usb-standard uscript uscript2 usd ussa utc-format utf-8 utopia-84 uxf v-golf v-promela v-visual-language v v8 v8torque val-ii val vala vale-assembly vale varlist vba vbscript vcard vcf-format vcl vcpkg-pm vdm-sl vdscript vector-pascal vega-editor-app velato vely venus verifpal verilog verona verse versioned-text-markup-language verve vex vga-standard vhdl-ams vhdl vi-editor video vienna-definition-language vienna-fortran vigil vilnius-basic vim-editor vim-script vim-scripts-pm vimwiki violent-es viptran virgil viron virt visavis visdown vissim visual-basic.net visual-basic visual-dataflex visual-dialogscript visual-eiffel visual-foxpro visual-logic visual-objects visual-occam visual-paradigm-app visual-prolog visual-smalltalk-enterprise visual-studio-code-editor visual-studio-editor visual-studio-marketplace-pm visual-test visual visualworks viva vivaldi viz vlibtemplate vml volt vortex voxml vpl vrml vspl vsxu vtl-lang vtl vtml vuejs vulcan vvvv vyper vyxal w wah walt wart wasm wasmer wasp-lang wast watbol watcom water watfiv watfor wats wavefront-material wavefront-object wcl wcps wddx wdf wdl web-idl webdna webgl webl webp-format webql webstorm-editor weebasic wescheme wgsl whack whalecalf whiley whirl whirlwind whitespace whois-protocol wikitax winbatch windev windows-registry-entries wing winwrap-basic winxed wireless-markup-language wirth-syntax-notation wisp wiswesser-line-notation wizml wizor wlambda wlanguage wml wmlscript woe wol wolfram wolontis-bell-interpreter wonkey woofjs wordpress work-flow-language workfl world-of-warcraft-addon-data world worst wren writeacourse wsdl wsfn-programming-language wu wxbasic wylbur wyvern x-basic x-bitmap-format x-bitmap x-font-directory-index x-it x-klaim x-pixmap x10 x11-basic x86-64-isa x86-assembly x86-isa xadl xaml xbase xbasepp xbasic xbel xbl xblite xbrl xc xcard xcas xcompose xcore xcy xdr xduce xe xetex xgboost-model xgmml xhtml xidoc xl-lang xl xlwings-editor xmi xmind xml-gl xml-ql xml-query-algebra xml xmpp-protocol xmtc xoc-compiler xodio xojo xotcl xpages xpath xpl xpl0 xpm-format xpop xproc xprofan xql-lang xql xquery xs-lang xs xsd xsharp xsim xslt xsv-app xt3d xtao xtclang xtend xtext xtran xuml xupdate xxl y-lang y yabasic yacas yacc yakou-lang yaml yamp yang yap-prolog yara yarv yasl yasnippet yawl ycp yedalog yess yeti yii yinyang yoga yoix yoptascript yorick yugabytedb yum-pm z-expressions z-flat z-lang z-machine z-notation z-shell z z2 z80 zbasic zccs zed zeek zeno zenscript zephir zephyr-asdl zeta zgrass zig zigzag zil zim-format zimbu zimpl zip-format zish zl zlang zoem zolang zone zonnon zope zopl zot zpl zpp zuo zz
  externalGuidCell
   description A GUID from another site.
  fileNameCell
   highlightScope string
  blankCell
  typeCell
   enum assembly pl barCodeFormat hardwareDescriptionLanguage knowledgeBase binaryDataFormat contractLanguage timeFormat computingMachine xmlFormat yamlFormat jsonFormat compiler grammarLanguage dataValidationLanguage application ir isa queryLanguage protocol os esolang template textMarkup characterEncoding idl library editor cloud textDataFormat visual plzoo interpreter notation binaryExecutable dataNotation stylesheetLanguage schema bytecode vm filesystem standard linter packageManager framework webApi feature optimizingCompiler numeralSystem hashFunction database font distribution headerLang dataStructure musicalNotation textEncodingFormat equation wikiMarkup decompiler configFormat diffFormat unixApplication
   highlightScope constant.language
  fileTypeWordCell
   enum paper text binary na
   highlightScope constant.language
  versionCell
   extends stringCell
   description Version numbers.
  domainNameCell
   extends stringCell
  abstractFactNode
   cells keywordCell
  abstractUrlNode
   cells keywordCell urlCell
   extends abstractFactNode
  annualReportsUrlNode
   extends abstractUrlNode
   cruxFromId
   description URL to the annual reports for this language.
   single false
  abstractChatUrlNode
   description A URL to a chat room about the language.
   extends abstractUrlNode
   cruxFromId
  discordNode
   extends abstractChatUrlNode
   description Link to official (or popular unofficial) Discord for language development.
  ircNode
   extends abstractChatUrlNode
   description Link to official (or popular unofficial) IRC channel(s) for language development.
  zulipNode
   extends abstractChatUrlNode
   description Link to official (or popular unofficial) Zulip for language development.
  cheatSheetUrlNode
   extends abstractUrlNode
   cruxFromId
   single false
   description A link to a cheat sheet for this language.
  demoVideoNode
   description Provide a url of a demo video of the language.
   extends abstractUrlNode
   cruxFromId
  documentationNode
   extends abstractUrlNode
   description Link to the official documentation for a language.
   cruxFromId
  downloadPageUrlNode
   extends abstractUrlNode
   cruxFromId
   description URL to the download page for this language.
   single false
  ebookNode
   extends abstractUrlNode
   description Link to a free eBook about this. Only include if the eBook is of high quality and not spammy.
   cruxFromId
  emailListNode
   extends abstractUrlNode
   description Link to the mailing list for a language.
   cruxFromId
  esolangNode
   extends abstractUrlNode
   description A link to this language on https://esolangs.org/
   cruxFromId
   string sourceDomain esolangs.org
   single
  eventsPageUrlNode
   extends abstractUrlNode
   cruxFromId
   description URL to the events pages of this language.
   single false
  faqPageUrlNode
   extends abstractUrlNode
   cruxFromId
   description URL to the frequently asked questions for this language.
   single false
  abstractGitRepoUrlNode
   extends abstractUrlNode
   single
   cruxFromId
  gitRepoNode
   description URL of the official git repo for the language project if not hosted on GitHub or GitLab or Sourcehut.
   extends abstractGitRepoUrlNode
  githubRepoNode
   description URL of the official GitHub repo for the project if it hosted there.
   extends abstractGitRepoUrlNode
   cells keywordCell githubRepoUrlCell
   inScope abstractGithubYearNode abstractGithubCountNode githubDescriptionNode
   contentKey url
   string sourceDomain github.com
  gitlabRepoNode
   description URL of the official GitLab repo for the language project.
   extends abstractGitRepoUrlNode
   string sourceDomain gitlab.com
  sourcehutRepoNode
   description URL of the official sourcehut repo for the project.
   extends abstractGitRepoUrlNode
   string sourceDomain sr.ht
  firstAnnouncementNode
   description A url announcing the creation or release of a new language
   extends abstractUrlNode
   cruxFromId
   single
  screenshotNode
   description For visual languages, a picture is worth a thousand words. Provide the URL to the screenshot in the form: https://pldb.com/screenshots/[pldbId].png
   extends abstractUrlNode
   cruxFromId
  photoNode
   description For notations, a picture is worth a thousand words. Provide a photo in the form: https://pldb.com/photos/[pldbId].png
   extends abstractUrlNode
   cruxFromId
  languageServerProtocolProjectNode
   extends abstractUrlNode
   inScope writtenInNode
   single false
   description A link to a project implementing LSP for this language.
   cruxFromId
   string sourceDomain langserver.org
  officialBlogUrlNode
   extends abstractUrlNode
   cruxFromId
   description URL to the official blog for this language.
   single false
  packageRepositoryNode
   extends abstractUrlNode
   cruxFromId
   description URL to the package repository for this language.
   single false
  redditDiscussionNode
   description A link to a related discussion on reddit.
   extends abstractUrlNode
   cruxFromId
   string sourceDomain reddit.com
   single false
  referenceNode
   extends abstractUrlNode
   cruxFromId
   description A link to more info about this entity. You can add raw links and then auto "upgrade" them using some of the importer code.
   single false
  rijuReplNode
   extends abstractUrlNode
   description A link to try this language on riju.codes
   cruxFromId
   string sourceDomain riju.codes
   single
   contentKey id
   inScope fileExtensionsNode descriptionNode websiteNode gitRepoNode exampleNode
  specNode
   extends abstractUrlNode
   description Link to the official spec for a language.
   cruxFromId
  releaseNotesUrlNode
   extends abstractUrlNode
   cruxFromId
   description URL to the release notes for this language.
   single
  websiteNode
   description URL of the official homepage for the language project.
   extends abstractUrlNode
   cruxFromId
   single
  webReplNode
   extends abstractUrlNode
   description An online repl for the project.
   cruxFromId
  abstractUrlGuidNode
   cells keywordCell urlCell
   extends abstractFactNode
  antlrNode
   extends abstractUrlGuidNode
   description A link to the ANTLR grammar for this language (https://github.com/antlr/grammars-v4/tree/master/LANGUAGE)
   cruxFromId
   string sourceDomain www.antlr.org
  hoplNode
   cruxFromId
   extends abstractUrlGuidNode
   cells keywordCell urlCell
   description The matching language on Diarmuid Pigott's Online Historical Encyclopaedia of Programming Languages site (https://hopl.info/)
   string sourceDomain hopl.info
  jupyterKernelNode
   extends abstractUrlGuidNode
   single false
   description A link to a Jupyter Kernel for this language.
   cruxFromId
   string sourceDomain jupyter.org
  meetupNode
   description Some languages have active meetup groups on Meetup.com 
   extends abstractUrlGuidNode
   contentKey url
   inScope meetupMemberCountNode meetupGroupCountNode
   string sourceDomain meetup.com
   cruxFromId
  subredditNode
   extends abstractUrlGuidNode
   inScope subredditMemberCountNode
   string sourceDomain reddit.com
   contentKey url
   single false
   cruxFromId
   description Url of a subreddit(s) for this language.
   example
    subreddit php
  replitNode
   extends abstractUrlGuidNode
   description A link to try this language on replit.com
   string sourceDomain replit.com
   cruxFromId
  rosettaCodeNode
   extends abstractUrlGuidNode
   description A link to this language on Rosetta Code - http://www.rosettacode.org/
   string sourceDomain rosettacode.org
   cruxFromId
  twitterNode
   extends abstractUrlGuidNode
   description Official Twitter handle of the entity, if any.
   inScope twitterFollowersNode
   string sourceDomain twitter.com
   cruxFromId
  abstractOneWordGuidNode
   todo Remove if we can in favor of URL guids
   cells keywordCell externalGuidCell
   extends abstractFactNode
   single
   cruxFromId
  codeMirrorNode
   extends abstractOneWordGuidNode
   description A link to a CodeMirror syntax highlighting package for this language (https://github.com/codemirror/codemirror5/tree/master/mode/LANGUAGE)
   string sourceDomain codemirror.net
  monacoNode
   extends abstractOneWordGuidNode
   description A link to a Monaco syntax highlighting package for this language.
   example
    javascript
     monaco javascript
   string sourceDomain microsoft.github.io/monaco-editor/
  tryItOnlineNode
   extends abstractOneWordGuidNode
   description A link to try this language on https://tio.run
   string sourceDomain tio.run
  ubuntuPackageNode
   extends abstractOneWordGuidNode
   description The name of an Ubuntu package for the language from https://packages.ubuntu.com/.
   string sourceDomain ubuntu.com
  abstractMultiwordGuidNode
   todo Remove if we can in favor of URL guids
   cruxFromId
   cells keywordCell
   catchAllCellType externalGuidCell
   extends abstractFactNode
   single
  compilerExplorerNode
   extends abstractMultiwordGuidNode
   description This language's name on https://godbolt.org
   cruxFromId
   string sourceDomain godbolt.org
   contentKey id
   inScope exampleNode
   single
  githubBigQueryNode
   cruxFromId
   description Google BigQuery Public Datasets has a dataset with info on GitHub repos: https://cloud.google.com/blog/topics/public-datasets/github-on-bigquery-analyze-all-the-open-source-code
   extends abstractMultiwordGuidNode
   contentKey id
   inScope githubBigQueryUserCountNode githubBigQueryRepoCountNode
   todo Anon node types would be useful here
   string sourceDomain cloud.google.com
  githubLanguageNode
   description GitHub has a set of supported languages as defined here: https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml
   extends abstractMultiwordGuidNode
   inScope githubRepoCountNode githubLanguageFileExtensionsNode fileNamesNode githubTrendingProjectsNode githubTrendingProjectsCountNode abstractGitHubLanguageNode abstractGitHubLanguageArrayNode githubLanguageGroupNode githubLanguageAliasesNode
   contentKey id
   string sourceDomain github.com
  leachim6Node
   extends abstractMultiwordGuidNode
   description A link to this language in leachim6's hello-world project.
   string sourceDomain github.com/leachim6/hello-world
   contentKey id
   inScope fileExtensionsNode filepathNode leachim6ExampleNode
  projectEulerNode
   extends abstractMultiwordGuidNode
   description Is this language one of the ones listed on https://projecteuler.net/?
   inScope projectEulerMemberCountNode
   string sourceDomain projecteuler.net
   contentKey id
  pygmentsHighlighterNode
   extends abstractMultiwordGuidNode
   description A link to a Pygments syntax highlighting class for this language (https://pygments.org/)
   string sourceDomain pygments.org
   inScope fileExtensionsNode pygmentsFilenameNode
   contentKey id
  pyplNode
   extends abstractMultiwordGuidNode
   description This language's id on https://pypl.github.io
   cruxFromId
   string sourceDomain pypl.github.io
   single
  quineRelayNode
   extends abstractMultiwordGuidNode
   description The Quine Relay project (https://github.com/mame/quine-relay).
   string sourceDomain github.com/mame/quine-relay
  stackOverflowSurveyNode
   extends abstractMultiwordGuidNode
   description StackOverflow does an annual developer survey: https://insights.stackoverflow.com/survey
   inScope stackOverflowSurveyYearNode
   string sourceDomain insights.stackoverflow.com
  tiobeNode
   extends abstractMultiwordGuidNode
   description Tiobe maintains a well known ranking of programming languages here: https://www.tiobe.com/tiobe-index/
   inScope tiobeCurrentRankNode
   string sourceDomain tiobe.com
   contentKey id
  conferenceNode
   description Some languages have a recurring conference(s) focused on that specific language.
   cells keywordCell urlCell
   catchAllCellType conferenceNameCell
   extends abstractFactNode
   cruxFromId
  dblpNode
   boolean fromCrawler true
   extends abstractFactNode
   cruxFromId
   description Publications about this language from https://dblp.org/.
   string sourceDomain dblp.org
   single
   inScope dblpPublicationsNode
  abstractDelimitedBlobNode
   baseNodeType blobNode
   boolean includeChildrenInCsv false
   extends abstractFactNode
  dblpPublicationsNode
   crux publications
   extends abstractDelimitedBlobNode
   description An inline PSV table of hits.
   cells keywordCell
   single
  githubTrendingProjectsNode
   todo Figure out typings.
   extends abstractDelimitedBlobNode
   boolean fromCrawler true
   description Projects in this language trending on GitHub.
   crux trendingProjects
   single
   example
    author name avatar url language languageColor stars forks currentPeriodStars description
    PavelDoGreat WebGL-Fluid-Simulation https://github.com/PavelDoGreat.png https://github.com/PavelDoGreat/WebGL-Fluid-Simulation JavaScript #f1e05a 6010 473 2246 "Play with fluids in your browser (works even on mobile)"
  goodreadsNode
   boolean fromCrawler true
   cruxFromId
   extends abstractDelimitedBlobNode
   description Books about this language from Goodreads.
   string sourceDomain goodreads.com
   single
  hackerNewsDiscussionsNode
   boolean fromCrawler true
   extends abstractDelimitedBlobNode
   cruxFromId
   description Links to Hacker News posts discussing this language.
   string sourceDomain news.ycombinator.com
   single
  isbndbNode
   boolean fromCrawler true
   cruxFromId
   extends abstractDelimitedBlobNode
   description Books about this language from ISBNdb.
   string sourceDomain isbndb.com
   single
  semanticScholarNode
   boolean fromCrawler true
   cruxFromId
   extends abstractDelimitedBlobNode
   description Papers about this language from Semantic Scholar.
   string sourceDomain semanticscholar.org
   single
  descriptionNode
   boolean alwaysRecommended true
   cruxFromId
   extends abstractFactNode
   baseNodeType blobNode
   boolean includeChildrenInCsv false
   single
  githubDescriptionNode
   single
   extends descriptionNode
   crux description
   description Description of the repo on GitHub.
  abstractCodeNode
   catchAllNodeType lineOfCodeNode
   extends abstractFactNode
   boolean includeChildrenInCsv false
   baseNodeType blobNode
  equationNode
   description A text block containing a LaTeX snippet of a formula.
   extends abstractCodeNode
   cruxFromId
  exampleNode
   description A text block containing a representative snippet of code for the language.
   cruxFromId
   extends abstractCodeNode
  helloWorldCollectionNode
   description Hello world written in this language from http://helloworldcollection.de/
   extends exampleNode
   cruxFromId
   cells keywordCell
   catchAllCellType helloWorldCollectionIdCell
   string sourceDomain helloworldcollection.de
  leachim6ExampleNode
   extends exampleNode
   crux example
   single
  linguistExampleNode
   description An example snippet from the relevant Linguist Grammar package.
   extends exampleNode
   crux example
  wikipediaExampleNode
   extends exampleNode
   description Example(s) of this language on the Wikipedia page.
   crux example
   single false
  funFactNode
   cells keywordCell urlCell
   description A text or code block containing a fun or unusual fact about the language.
   cruxFromId
   extends abstractCodeNode
  keywordsNode
   description What are all the keywords in this language?
   extends abstractFactNode
   cruxFromId
   catchAllCellType tokenCell
   listDelimiter  
   single
  abstractCommonTokenNode
   description Most general purpose programming languages implement a set of common tokens for common features like these.
   cells keywordCell
   catchAllCellType tokenCell
   extends abstractFactNode
   listDelimiter  
   cruxFromId
   single false
  lineCommentTokenNode
   extends abstractCommonTokenNode
   description Defined as a token that can be placed anywhere on a line and starts a comment that cannot be stopped except by a line break character or end of file.
   example
    javascript
     lineCommentToken //
  multiLineCommentTokensNode
   extends abstractCommonTokenNode
   description A comment with a start delimiter and end token (which can be the same) that can span multiple lines.
   example
    javascript
     multiLineCommentTokens /* */
  printTokenNode
   extends abstractCommonTokenNode
   description What token(s) is used to print a message?
   example
    javascript
     printToken console.log
  stringTokenNode
   extends abstractCommonTokenNode
   description What token(s) is used to delimite a string?
   example
    javascript
     stringToken "
  assignmentTokenNode
   extends abstractCommonTokenNode
   description What token(s) is used for assignment to an identifier?
   example
    javascript
     assignmentToken =
  booleanTokensNode
   extends abstractCommonTokenNode
   description What token(s) is used for true and false?
   example
    javascript
     booleanTokens true false
  includeTokenNode
   extends abstractCommonTokenNode
   description What token(s) is used for including another file?
   example
    nodejs
     includeToken require
  abstractSectionNode
   extends abstractFactNode
   cruxFromId
   single
  featuresNode
   inScope abstractFeatureNode
   extends abstractSectionNode
  linguistGrammarRepoNode
   description Linguist is a library used by GitHub to syntax highlight files on GitHub via a grammar. The list of languages supported by Linguist and the grammar package used for each language is listed here: https://github.com/github/linguist/blob/master/vendor/README.md. If Linguist has support for a language, it will have a repo on GitHub. Given a language is supported by Linguist, that is a good indication it has at least 200 unique :user/:repo repositories, according to their docs.
   extends abstractSectionNode
   cells keywordCell urlCell
   contentKey url
   inScope linguistExampleNode linguistCommitsNode linguistFirstCommitNode linguistLastCommitNode linguistSampleCountNode linguistCommitterCountNode
   string sourceDomain github.com
  wikipediaNode
   inScope wikipediaExampleNode wikipediaRelatedNode wikipediaSummaryNode wikipediaCreatedNode wikipediaDailyPageViewsNode wikipediaYearNode wikipediaBacklinksCountNode wikipediaRevisionCountNode wikipediaPageIdNode fileExtensionsNode
   extends abstractSectionNode
   description URL of the entity on Wikipedia, if and only if it has a page dedicated to it.
   cells keywordCell urlCell
   string sourceDomain wikipedia.org
   contentKey url
  abstractArrayNode
   extends abstractFactNode
   catchAllCellType stringCell
   cells keywordCell
   listDelimiter  
  fileExtensionsNode
   extends abstractArrayNode
   crux fileExtensions
   catchAllCellType fileExtensionCell
   single
   description What are the file extensions for this language?
  githubLanguageFileExtensionsNode
   extends fileExtensionsNode
   crux fileExtensions
   description An Array of associated extensions (the first one is considered the primary extension, the others should be listed alphabetically).
  fileNamesNode
   extends abstractArrayNode
   catchAllCellType fileNameCell
   crux filenames
   description Filenames commonly associated with the language.
  abstractGitHubLanguageArrayNode
   extends abstractArrayNode
   single
  githubLanguageInterpretersNode
   extends abstractGitHubLanguageArrayNode
   description An Array of associated interpreters
   crux interpreters
  githubLanguageAliasesNode
   extends abstractGitHubLanguageArrayNode
   description An Array of additional aliases (implicitly includes name.downcase).
   crux aliases
   listDelimiter  or 
  abstractPermalinksNode
   catchAllCellType permalinkCell
   extends abstractArrayNode
   description Links to other entities on PLDB.
   boolean providesPermalinks true
  forLanguagesNode
   description Which languages is this repository for?
   extends abstractPermalinksNode
   cruxFromId
  abstractRelationshipNode
   extends abstractPermalinksNode
   cruxFromId
  relatedNode
   extends abstractRelationshipNode
   description What languages are related? This serves as a catch all, and it is better to use a more specific relationship node such as "supersetOf".
   single
  runsOnVmNode
   extends abstractRelationshipNode
   description What virtual machine(s) does this language run on? 
  influencedByNode
   description What languages influenced this one?
   extends abstractRelationshipNode
  successorOfNode
   description Was this language launched as the successor of another?
   extends abstractRelationshipNode
  subsetOfNode
   description Is this language a subset of another?
   extends abstractRelationshipNode
  renamedToNode
   description What is the new name of this language?
   extends abstractRelationshipNode
  supersetOfNode
   description Is this language a superset of another? If you specify this link then the superset language will inherit all features of subset language.
   extends abstractRelationshipNode
  writtenInNode
   description What language(s) is the main implementation written in?
   extends abstractRelationshipNode
  extensionOfNode
   description What language is this language an extension of?
   extends abstractRelationshipNode
  forkOfNode
   description What language is this language a fork of?
   extends abstractRelationshipNode
  compilesToNode
   description Which language(s) does this language primarily compile to?
   extends abstractRelationshipNode
  inputLanguagesNode
   description Which language(s) does this take as input? For compilers, what languages does this compile compile?
   extends abstractRelationshipNode
  wikipediaRelatedNode
   description What languages does Wikipedia have as related?
   extends abstractPermalinksNode
   crux related
  abstractIntNode
   cells keywordCell intCell
   extends abstractFactNode
  abstractCountNode
   extends abstractIntNode
  abstractPopulationCountNode
   extends abstractCountNode
  githubBigQueryUserCountNode
   crux users
   extends abstractPopulationCountNode
   single
  linguistCommitterCountNode
   description How many people have made commits in this repo?
   extends abstractPopulationCountNode
   crux committerCount
  meetupMemberCountNode
   crux memberCount
   extends abstractPopulationCountNode
   single
  packageAuthorsNode
   extends abstractPopulationCountNode
   description How many people contribute packages to this cpm?
   cruxFromId
  stackOverflowSurveyUsersNode
   crux users
   extends abstractPopulationCountNode
   description How many developers reported using this language.
   single
  stackOverflowSurveyFansNode
   description How many developers reported wanting to learn this language.
   crux fans
   extends abstractPopulationCountNode
   single
  twitterFollowersNode
   description How many followers the linked account has.
   extends abstractPopulationCountNode
   crux followers
  githubBigQueryRepoCountNode
   description How many repos for this language are listed in Google's BigQuery Public GitHub Dataset snapshot.
   crux repos
   extends abstractCountNode
   single
  githubTrendingProjectsCountNode
   boolean fromCrawler true
   extends abstractCountNode
   single
   crux trendingProjectsCount
   description How many trending repos for this language does GitHub report?
  githubRepoCountNode
   boolean fromCrawler true
   extends abstractCountNode
   single
   crux repos
   description How many repos for this language does GitHub report?
  abstractGithubCountNode
   extends abstractCountNode
   single
  githubSubscribersNode
   extends abstractGithubCountNode
   crux subscribers
   description How many subscribers to the repo?
  githubForksNode
   extends abstractGithubCountNode
   crux forks
   description How many forks of the repo?
  githubStarsNode
   extends abstractGithubCountNode
   crux stars
   description How many stars of the repo?
  githubIssuesNode
   extends abstractGithubCountNode
   crux issues
   description How many isses on the repo?
  linguistCommitsNode
   description How many commits in this repo?
   extends abstractCountNode
   crux commitCount
  linguistSampleCountNode
   description How many language samples in this repo?
   extends abstractCountNode
   crux sampleCount
  meetupGroupCountNode
   crux groupCount
   extends abstractCountNode
   single
  centralPackageRepositoryCountNode
   extends abstractCountNode
   cruxFromId
   description If you've searched for a CPM for this language and can't find one, set 0 as the count.
   single
  packageInstallsNode
   description How many packages have been downloaded?
   extends abstractCountNode
   crux packageInstallCount
  packageCountNode
   description How many packages are in the repository? A package is some code with a name and a namespace, shipped as an atomic unit, with an owner(s).
   extends abstractCountNode
   cruxFromId
  packagesIncludingVersionsNode
   description How many packages are in the repository including all versions of a single package?
   extends abstractCountNode
   cruxFromId
  wikipediaDailyPageViewsNode
   extends abstractCountNode
   crux dailyPageViews
   description How many page views per day does this Wikipedia page get? Useful as a signal for rankings. Available via WP api.
   single
  wikipediaBacklinksCountNode
   extends abstractCountNode
   crux backlinksCount
   description How many pages on WP link to this page?
   single
  wikipediaRevisionCountNode
   extends abstractCountNode
   crux revisionCount
   description How many revisions does this page have?
   single
  abstractYearNode
   cells keywordCell yearCell
   extends abstractIntNode
  abstractGithubYearNode
   extends abstractYearNode
   single
  githubCreatedNode
   extends abstractGithubYearNode
   crux created
   description When was the *Github repo* for this entity created?
  githubUpdatedNode
   extends abstractGithubYearNode
   crux updated
   description What year was the last commit made?
  githubFirstCommitNode
   extends abstractGithubYearNode
   crux firstCommit
   description What year the first commit made in this git repo?
  appearedNode
   description What year was the language publicly released and/or announced?
   extends abstractYearNode
   cruxFromId
   single
   required
  linguistFirstCommitNode
   description What year was the first commit made?
   extends abstractYearNode
   crux firstCommit
  linguistLastCommitNode
   description What year was the last commit made?
   extends abstractYearNode
   crux lastCommit
  domainRegisteredNode
   extends abstractYearNode
   description When was this domain first registered?
   crux registered
   single
  wikipediaCreatedNode
   extends abstractYearNode
   crux created
   description When was the *Wikipedia page* for this entity created?
   single
  wikipediaYearNode
   extends abstractYearNode
   crux appeared
   description When does Wikipedia claim this entity first appeared?
   single
  wordRankNode
   description Some creators use a common English word as their language's name. For these we note how common the word is, where "the" is 1.
   extends abstractIntNode
   cruxFromId
   single
  stackOverflowSurveyMedianSalaryNode
   crux medianSalary
   description Median salary reported by developers using this language.
   extends abstractIntNode
   single
  tiobeCurrentRankNode
   description What is the current Tiobe rank of this language?
   extends abstractIntNode
   crux currentRank
   single
  wikipediaPageIdNode
   extends abstractIntNode
   crux pageId
   description Waht is the internal ID for this entity on WP?
   single
  abstractFlagNode
   extends abstractFactNode
   cells keywordCell
   single
  githubCopilotOptimizedNode
   description Is this language optimized for GitHub copilot? The list is here: https://docs.github.com/en/copilot/overview-of-github-copilot/about-github-copilot
   extends abstractFlagNode
   cruxFromId
   single
  abstractGitHubLanguageNode
   extends abstractFactNode
   cells keywordCell stringCell
   single
  githubLanguageAceModeNode
   extends abstractGitHubLanguageNode
   description A String name of the Ace Mode used for highlighting whenever a file is edited. This must match one of the filenames in http://git.io/3XO_Cg. Use "text" if a mode does not exist.
   crux ace_mode
  githubLanguageCodemirrorModeNode
   extends abstractGitHubLanguageNode
   description A String name of the CodeMirror Mode used for highlighting whenever a file is edited. This must match a mode from https://git.io/vi9Fx
   crux codemirror_mode
  githubLanguageCodemirrorMimeTypeNode
   extends abstractGitHubLanguageNode
   description A String name of the file mime type used for highlighting whenever a file is edited. This should match the \`mime\` associated with the mode from https://git.io/f4SoQ
   crux codemirror_mime_type
  githubLanguageTmScopeNode
   extends abstractGitHubLanguageNode
   cells keywordCell
   catchAllCellType externalGuidCell
   description The TextMate scope that represents this programming language. This should match one of the scopes listed in the grammars.yml file. Use "none" if there is no grammar for this language.
   crux tm_scope
  githubLanguageWrapNode
   extends abstractGitHubLanguageNode
   description Boolean wrap to enable line wrapping (default: false)
   cells keywordCell boolCell
   crux wrap
  githubLanguageTypeNode
   extends abstractGitHubLanguageNode
   description Either data, programming, markup, prose, or nil.
   crux type
  creatorsNode
   boolean alwaysRecommended true
   description Name(s) of the original creators of the language delimited by " and "
   cells keywordCell
   catchAllCellType creatorNameCell
   listDelimiter  and 
   extends abstractFactNode
   cruxFromId
   single
  nativeLanguageNode
   cells keywordCell nativeLanguageWordCell
   extends abstractFactNode
   description Nearly all programming languages are written in English, but some aren't. Set this field for the ones that are not.
   cruxFromId
  announcementMethodNode
   description How was the language first announced?
   extends abstractFactNode
   cells keywordCell announcementMethodCell
   cruxFromId
   single
  countryNode
   uniqueLine
   description What country was the language first developed in?
   boolean alwaysRecommended true
   cells keywordCell
   catchAllCellType countryNameCell
   extends abstractFactNode
   cruxFromId
   single false
  abstractAnnualPopulationCountMapNode
   catchAllNodeType annualPopulationCountNode
   description A map of counts, one per year.
   extends abstractFactNode
   single
  indeedJobsNode
   description How many job descriptions match this query for this language on indeed.com?
   catchAllCellType searchQueryCell
   extends abstractAnnualPopulationCountMapNode
   contentKey query
   cruxFromId
   string sourceDomain indeed.com
  linkedInSkillNode
   description How many people list this skill on LinkedIn?
   extends abstractAnnualPopulationCountMapNode
   cruxFromId
   catchAllCellType searchQueryCell
   contentKey id
   string sourceDomain linkedin.com
  projectEulerMemberCountNode
   crux memberCount
   description How many project euler members use this language.
   extends abstractAnnualPopulationCountMapNode
  subredditMemberCountNode
   extends abstractAnnualPopulationCountMapNode
   crux memberCount
   description How many members in this subreddit.
  filepathNode
   cruxFromId
   extends abstractFactNode
   catchAllCellType stringCell
   cells keywordCell
   single
  abstractStringNode
   catchAllCellType stringCell
   extends abstractFactNode
  titleNode
   description The official title of the language
   extends abstractStringNode
   cruxFromId
   single
   required
  standsForNode
   description If the language name is an acronym what does/did it stand for?
   extends abstractStringNode
   cruxFromId
   single
  akaNode
   description Another name for the language. Entries can have multiple aka lines.
   extends abstractStringNode
   cruxFromId
   single false
  oldNameNode
   description What is the old name of this language?
   extends abstractStringNode
   cruxFromId
  originCommunityNode
   description In what community(ies) did the language first originate?
   boolean alwaysRecommended true
   todo Make origin community name the url for the community, not the name.
   listDelimiter  && 
   example
    originCommunity Microsoft && /r/programminglanguages && news.ycombinator.com
   catchAllCellType stringCell
   extends abstractFactNode
   cruxFromId
   single
  abstractParadigmNode
   cells keywordCell boolCell
   extends abstractFactNode
   cruxFromId
  visualParadigmNode
   extends abstractParadigmNode
   description Is this a visual programming thing? Sometimes called "no code" or "low code"?
  abstractDecimalNode
   cells keywordCell numberCell
   extends abstractFactNode
  stackOverflowSurveyPercentageUsingNode
   description What percentage of survey respondents report using this language?
   crux percentageUsing
   extends abstractDecimalNode
   single
  abstractAnnualRankMapNode
   catchAllNodeType annualRankNode
   description A map of ranks, one per year.
   extends abstractFactNode
   single
  awisRankNode
   cruxFromId
   extends abstractAnnualRankMapNode
   description Alexa Web Information Service (AWIS) domain ranking.
   string sourceDomain aws.amazon.com
  pygmentsFilenameNode
   crux filename
   extends abstractFactNode
   cells keywordCell fileNameCell
  typeNode
   description Which category in PLDB's subjective ontology does this entity fit into.
   cells keywordCell typeCell
   required
   cruxFromId
   single
   extends abstractFactNode
  fileTypeNode
   description What is the file encoding for programs in this language?
   cells keywordCell fileTypeWordCell
   extends abstractFactNode
   cruxFromId
   single
  domainNameNode
   description If the project website is on its own domain.
   cruxFromId
   cells keywordCell domainNameCell
   extends abstractFactNode
   single
   contentKey name
   inScope domainRegisteredNode awisRankNode
  wikipediaSummaryNode
   description What is the text summary of the language from the Wikipedia page?
   extends abstractFactNode
   baseNodeType blobNode
   boolean includeChildrenInCsv false
   single
   crux summary
  abstractFeatureNode
   cells keywordCell boolCell
   contentKey value
   childrenKey example
   boolean includeChildrenInCsv false
   cruxFromId
   single
   catchAllNodeType featureExampleCodeNode
  canDoShebangNode
   extends abstractFeatureNode
   string title Shebang
   string pseudoExample #! /run
   string reference https://en.wikipedia.org/wiki/Shebang_(Unix)
  canReadCommandLineArgsNode
   extends abstractFeatureNode
  canUseQuestionMarksAsPartOfIdentifierNode
   extends abstractFeatureNode
  canWriteToDiskNode
   extends abstractFeatureNode
   string title Disk Output
   string pseudoExample write("pldb.csv", "...")
  hasAbstractTypesNode
   extends abstractFeatureNode
   string title Abstract Types
   string pseudoExample abstract class PLDBFile {}
   string reference https://en.wikipedia.org/wiki/Abstract_type
  hasAccessModifiersNode
   extends abstractFeatureNode
   string title Access Modifiers
   string pseudoExample class PLDBFile { public title }
   string reference https://en.wikipedia.org/wiki/Access_modifiers
  hasAlgebraicTypesNode
   extends abstractFeatureNode
   string title Algebraic Data Type
   string pseudoExample garageContents = empty | vehicle
   string reference https://en.wikipedia.org/wiki/Algebraic_data_type
  hasAnonymousFunctionsNode
   extends abstractFeatureNode
   string title Anonymous Functions
   string aka Lambdas
   string pseudoExample () => printPldb()
   string reference https://en.wikipedia.org/wiki/Anonymous_function
  hasArraySlicingSyntaxNode
   extends abstractFeatureNode
  hasAssertStatementsNode
   extends abstractFeatureNode
   string title Assert Statements
   string reference https://en.wikipedia.org/wiki/Debug_code#Assert_Statements
   string pseudoExample assert(isTrue)
  hasAssignmentNode
   extends abstractFeatureNode
   string title Assignment
   string pseudoExample name = "PLDB"
   string tokenKeyword assignmentToken
   string reference https://en.wikipedia.org/wiki/Assignment_(computer_science)
  hasAsyncAwaitNode
   extends abstractFeatureNode
   string title Async Await
   string pseudoExample async downloadPldb => await getFiles()
   string reference https://en.wikipedia.org/wiki/Async/await
  hasBinaryNumbersNode
   extends abstractFeatureNode
   string title Binary Literals
   string pseudoExample 0b100110100000110011110010010
   string reference https://en.wikipedia.org/wiki/Binary_number
  hasBinaryOperatorsNode
   extends abstractFeatureNode
   string title Binary Operators
   string pseudoExample 1 + 1
   string reference https://en.wikipedia.org/wiki/Binary_operation
  hasBitWiseOperatorsNode
   extends abstractFeatureNode
   string title Bitwise Operators
   string reference https://en.wikipedia.org/wiki/Bitwise_operations_in_C https://en.wikipedia.org/wiki/Bitwise_operation
   string pseudoExample 3 == (2 | 1)
  hasBlobsNode
   extends abstractFeatureNode
  hasBooleansNode
   extends abstractFeatureNode
   string title Booleans
   string pseudoExample pldb = true
   string tokenKeyword booleanTokens
   string reference https://en.wikipedia.org/wiki/Boolean_data_type
  hasBoundedCheckedArraysNode
   extends abstractFeatureNode
  hasBreakNode
   extends abstractFeatureNode
  hasBuiltInRegexNode
   extends abstractFeatureNode
  hasCaseInsensitiveIdentifiersNode
   extends abstractFeatureNode
   string title Case Insensitive Identifiers
   string reference https://rosettacode.org/wiki/Case-sensitivity_of_identifiers
   string pseudoExample pLdB = "PLDB"
  hasCharactersNode
   extends abstractFeatureNode
   string title Characters
   string pseudoExample char character = 'P';
   string reference https://en.wikipedia.org/wiki/Character_(computing)
  hasClassesNode
   extends abstractFeatureNode
   string title Classes
   string pseudoExample class PLDBFile {}
   string reference https://en.wikipedia.org/wiki/Class_(computer_programming)
  hasClobsNode
   extends abstractFeatureNode
  hasCommentsNode
   extends abstractFeatureNode
   string title Comments
   string reference https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(syntax)#Comments https://en.wikipedia.org/wiki/Comment_(computer_programming)
   string pseudoExample # Hello PLDB
  hasConditionalsNode
   extends abstractFeatureNode
   string title Conditionals
   string pseudoExample if (isTrue) printPldb()
   string reference https://en.wikipedia.org/wiki/Conditional_(computer_programming)
  hasConstantsNode
   extends abstractFeatureNode
   string title Constants
   string pseudoExample const name = "PLDB"
   string reference https://en.wikipedia.org/wiki/Const_(computer_programming)
  hasConstructorsNode
   extends abstractFeatureNode
   string title Constructors
   string pseudoExample PLDBFile { constructor() {} }
   string reference https://en.wikipedia.org/wiki/Constructor_(object-oriented_programming)
  hasContinueNode
   extends abstractFeatureNode
  hasDecimalsNode
   extends abstractFeatureNode
  hasDefaultParametersNode
   extends abstractFeatureNode
   string title Default Parameters Pattern
   string reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
   string pseudoExample say(message = "Hello PLDB")
  hasDependentTypesNode
   extends abstractFeatureNode
   string title Dependent types
   string pseudoExample pldbSortedList // a list where is sorted is true
   string reference https://en.wikipedia.org/wiki/Dependent_type
  hasDestructuringNode
   extends abstractFeatureNode
   string title Destructuring
   string website https://github.com/facebook/reason
   string reference https://reasonml.github.io/docs/en/destructuring
   string pseudoExample {title, rank} = pldbFile
  hasDirectivesNode
   extends abstractFeatureNode
   string title Directives
   string pseudoExample use strict;
   string reference https://en.wikipedia.org/wiki/Directive_(programming)
  hasDisposeBlocksNode
   extends abstractFeatureNode
   string title Dispose Blocks Pattern
   string pseudoExample with pldb: do computeRanks()
   string reference https://en.wikipedia.org/wiki/Dispose_pattern
  hasDocCommentsNode
   extends abstractFeatureNode
   description Is there a standard mini language written in comments for documenting code?
   string title Doc comments
   string pseudoExample // param1: A comment about the first param
  hasDuckTypingNode
   extends abstractFeatureNode
   string title Duck Typing
   string pseudoExample length() // makes me an iterator
   string reference https://en.wikipedia.org/wiki/Duck_typing
  hasDynamicPropertiesNode
   extends abstractFeatureNode
   string title Dynamic Properties
   string pseudoExample pldb.score = 50
  hasDynamicSizedArraysNode
   extends abstractFeatureNode
  hasDynamicTypingNode
   extends abstractFeatureNode
  hasEnumsNode
   extends abstractFeatureNode
   string title Enums
   string reference https://en.wikipedia.org/wiki/Enumerated_type
   string pseudoExample colorsEnum { "red", "white", "blue"}
  hasEscapeCharactersNode
   extends abstractFeatureNode
  hasExceptionsNode
   extends abstractFeatureNode
   string title Exceptions
   string pseudoExample throw new Error("PLDB uh oh")
   string reference https://en.wikipedia.org/wiki/Exception_handling
  hasExplicitTypeCastingNode
   extends abstractFeatureNode
   string title Type Casting
   string pseudoExample (float)pldbRank;
   string reference https://en.wikipedia.org/wiki/Type_conversion
  hasExportsNode
   extends abstractFeatureNode
  hasExpressionsNode
   extends abstractFeatureNode
   string title Expressions
   string pseudoExample (1 + 2)
   string reference https://en.wikipedia.org/wiki/Expression_(computer_science)
  hasFirstClassFunctionsNode
   extends abstractFeatureNode
   string title First-Class Functions
   string pseudoExample [2.1].map(Math.round)
   string reference https://en.wikipedia.org/wiki/First-class_function
  hasFixedPointNode
   extends abstractFeatureNode
   string title Fixed Point Numbers
   string pseudoExample 80766866.00
   string reference https://en.wikipedia.org/wiki/Fixed-point_arithmetic
  hasFloatsNode
   extends abstractFeatureNode
   string title Floats
   string reference https://evanw.github.io/float-toy/ https://en.wikipedia.org/wiki/Floating-point_arithmetic
   string pseudoExample 80766866.0
  hasFnArgumentsNode
   extends abstractFeatureNode
  hasForEachLoopsNode
   extends abstractFeatureNode
  hasForLoopsNode
   extends abstractFeatureNode
  hasFunctionCompositionNode
   extends abstractFeatureNode
   string title Function Composition
   string pseudoExample o = (f, g) => x => f(g(x))
   string reference https://en.wikipedia.org/wiki/Function_composition_(computer_science)
  hasFunctionOverloadingNode
   extends abstractFeatureNode
   string title Function Overloading
   string reference https://en.wikibooks.org/wiki/Introduction_to_Programming_Languages/Overloading https://en.wikipedia.org/wiki/Function_overloading
   string aka Ad hoc polymorphism
   string pseudoExample add(string: str, string2: str)
  hasFunctionsNode
   extends abstractFeatureNode
   string title Functions
   string aka routines
   string aka procedures
   string aka methods
   string pseudoExample function computePLDBRanks() {}
   string reference https://en.wikipedia.org/wiki/Subroutine
  hasGarbageCollectionNode
   extends abstractFeatureNode
   string title Garbage Collection
   string pseudoExample var iDontNeedToFreeThis
   string reference https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)
  hasGeneratorsNode
   extends abstractFeatureNode
   string title Generators
   string pseudoExample yield 2
   string reference https://en.wikipedia.org/wiki/Generator_(computer_programming)
  hasGenericsNode
   extends abstractFeatureNode
   string title Generics
   string pseudoExample function identity<T>(arg: T): T
   string reference https://en.wikipedia.org/wiki/Generic_programming
  hasGlobalScopeNode
   extends abstractFeatureNode
  hasGotosNode
   extends abstractFeatureNode
   string title Gotos
   string pseudoExample goto 10
   string reference https://en.wikipedia.org/wiki/Goto
  hasHereDocsNode
   extends abstractFeatureNode
   string title Here Document
   string reference https://en.wikipedia.org/wiki/Here_document
   string pseudoExample \`A big multliline text block\`
  hasHexadecimalsNode
   extends abstractFeatureNode
   string title Hexadecimals
   string aka Base16
   string aka hex
   string pseudoExample 0x4D06792
   string reference https://en.wikipedia.org/wiki/Hexadecimal
  hasHomoiconicityNode
   extends abstractFeatureNode
   string title Homoiconicity
   string pseudoExample (list ())
   string reference https://en.wikipedia.org/wiki/Homoiconicity
  hasIdsNode
   extends abstractFeatureNode
  hasIfElsesNode
   extends abstractFeatureNode
  hasIfsNode
   extends abstractFeatureNode
  hasImplicitArgumentsNode
   extends abstractFeatureNode
   string title Implicit Arguments
   string reference https://docs.scala-lang.org/tour/implicit-parameters.html
   string pseudoExample shout(implicit message: string)
  hasImplicitTypeConversionsNode
   extends abstractFeatureNode
   string title Implicit Type Casting
   string reference https://en.wikipedia.org/wiki/Type_conversion
   string pseudoExample console.log("hello " + 2)
  hasImportsNode
   extends abstractFeatureNode
   string title File Imports
   string pseudoExample import pldb
   string tokenKeyword includeToken
  hasIncrementAndDecrementOperatorsNode
   extends abstractFeatureNode
   string title Increment and decrement operators
   string pseudoExample i++
   string reference https://en.wikipedia.org/wiki/Increment_and_decrement_operators
  hasInfixNotationNode
   extends abstractFeatureNode
   string title Infix Notation
   string pseudoExample 1 + 2
   string reference https://en.wikipedia.org/wiki/Infix_notation
  hasInheritanceNode
   extends abstractFeatureNode
   string title Inheritance
   string pseudoExample class PLDBFile extends File
   string reference https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)
  hasIntegersNode
   extends abstractFeatureNode
   string title Integers
   string pseudoExample 80766866
   string reference https://en.wikipedia.org/wiki/Integer_(computer_science)
  hasInterfacesNode
   extends abstractFeatureNode
   string title Interfaces
   string pseudoExample interface PLDBFile
   string reference https://en.wikipedia.org/wiki/Protocol_(object-oriented_programming)
  hasIteratorsNode
   extends abstractFeatureNode
   string title Iterators
   string pseudoExample for lang in pldb()
   string reference https://en.wikipedia.org/wiki/Iterator
  hasLabelsNode
   extends abstractFeatureNode
  hasLazyEvaluationNode
   extends abstractFeatureNode
   string title Lazy Evaluation
   string pseudoExample print(range(1000000)[2])
   string reference https://en.wikipedia.org/wiki/Lazy_evaluation
  hasLineCommentsNode
   extends abstractFeatureNode
   string title Line Comments
   string reference https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(syntax)#Comments
   string pseudoExample # Hello PLDB
   string tokenKeyword lineCommentToken
  hasListsNode
   extends abstractFeatureNode
   string title Lists
   string aka array
   string aka vector
   string aka sequence
   string pseudoExample [2, 3, 10]
   string reference https://en.wikipedia.org/wiki/List_(abstract_data_type)
  hasMacrosNode
   extends abstractFeatureNode
   string title Macros
   string pseudoExample #define pldbItems 4000
   string reference https://en.wikipedia.org/wiki/Macro_(computer_science)
  hasMagicGettersAndSettersNode
   extends abstractFeatureNode
   string title Magic Getters and Setters
   string reference https://www.php.net/manual/en/language.oop5.overloading.php#object.get
   string pseudoExample get(name) => obj[name]
  hasManualMemoryManagementNode
   extends abstractFeatureNode
   string title Manual Memory Management
   string pseudoExample malloc(4);
   string reference https://en.wikipedia.org/wiki/Manual_memory_management
  hasMapFunctionsNode
   extends abstractFeatureNode
   string title Map Functions
   string pseudoExample pldbFiles.map(downloadFilesFn)
   string reference https://en.wikipedia.org/wiki/Map_(higher-order_function)
  hasMapsNode
   extends abstractFeatureNode
   string title Maps
   string aka dict
   string aka dictionary
   string aka object
   string aka record
   string aka struct
   string aka hashtable
   string aka keyed list
   string aka associative array
   string pseudoExample {name: "PLDB"}
   string reference https://en.wikipedia.org/wiki/Associative_array
  hasMemberVariablesNode
   extends abstractFeatureNode
  hasMessagePassingNode
   extends abstractFeatureNode
   string title Message Passing
   string pseudoExample "get pldb"
   string reference https://en.wikipedia.org/wiki/Message_passing
  hasMethodChainingNode
   extends abstractFeatureNode
   string title Method Chaining
   string pseudoExample pldbFile.toString().length
   string reference https://en.wikipedia.org/wiki/Method_chaining
  hasMethodOverloadingNode
   extends abstractFeatureNode
  hasMethodsNode
   extends abstractFeatureNode
   string title Methods
   string pseudoExample pldbFile.downloadWebsite()
   string reference https://en.wikipedia.org/wiki/Method_(computer_programming)
  hasMixinsNode
   extends abstractFeatureNode
   string title Mixins
   string pseudoExample extends pldbFile, diskFile
   string reference https://en.wikipedia.org/wiki/Mixin
  hasModulesNode
   extends abstractFeatureNode
   string title Module Pattern
   string pseudoExample module PLDB {}
   string reference https://en.wikipedia.org/wiki/Module_pattern
  hasMonadsNode
   extends abstractFeatureNode
   string title Monad
   string pseudoExample g >>= f
   string reference https://en.wikipedia.org/wiki/Monad_(functional_programming)
  hasMultiLineCommentsNode
   extends abstractFeatureNode
   string title MultiLine Comments
   string reference https://en.wikipedia.org/wiki/Comparison_of_programming_languages_(syntax)#Comments
   string pseudoExample /* Hello PLDB */
   string tokenKeyword multiLineCommentTokens
  hasMultilineStringsNode
   extends abstractFeatureNode
   string title Multiline Strings
   string pseudoExample hello = """Hello\\nPLDB"""
  hasMultipleDispatchNode
   extends abstractFeatureNode
   string title Multiple Dispatch
   string pseudoExample collide_with(x::Spaceship, y::Spaceship)
   string reference https://en.wikipedia.org/wiki/Multiple_dispatch
  hasMultipleInheritanceNode
   extends abstractFeatureNode
   string title Multiple Inheritance
   string pseudoExample extends parentWhichExtendsSomethingElse
   string reference https://en.wikipedia.org/wiki/Multiple_inheritance
  hasNamespacesNode
   extends abstractFeatureNode
   string title Namespaces
   string pseudoExample namespace PLDB {}
  hasNullNode
   extends abstractFeatureNode
   string title Null
   string reference https://en.wikipedia.org/wiki/Null_pointer
   string pseudoExample uhOh = null
  hasOctalsNode
   extends abstractFeatureNode
   string title Octals
   string aka Base8
   string aka oct
   string pseudoExample 0o464063622
   string reference https://en.wikipedia.org/wiki/Octal
  hasOperatorOverloadingNode
   extends abstractFeatureNode
   string title Operator Overloading
   string reference https://en.wikibooks.org/wiki/Introduction_to_Programming_Languages/Overloading https://en.wikipedia.org/wiki/Operator_overloading
   string pseudoExample def __add__(): doSomethingDifferent()
  hasPairsNode
   extends abstractFeatureNode
   string title Pairs
   string pseudoExample (pl . db)
  hasPartialApplicationNode
   extends abstractFeatureNode
   string title Partial Application
   string pseudoExample add5 = num => addNumbers(10, num)
   string reference https://en.wikipedia.org/wiki/Partial_application
  hasPatternMatchingNode
   extends abstractFeatureNode
   string title Pattern Matching
   string pseudoExample fib 0 = 1; fib 1 = 1
   string reference https://en.wikipedia.org/wiki/Pattern_matching
  hasPipesNode
   extends abstractFeatureNode
   string title Pipes
   string pseudoExample ls pldb | wc
   string reference https://en.wikipedia.org/wiki/Pipeline_(software)
  hasPointersNode
   extends abstractFeatureNode
   string title Pointers
   string pseudoExample int *pldb
   string reference https://en.wikipedia.org/wiki/Pointer_(computer_programming)
  hasPolymorphismNode
   extends abstractFeatureNode
   string title Polymorphism
   string pseudoExample a + "b"; 1 + 2
   string reference https://en.wikipedia.org/wiki/Polymorphism_(computer_science)
  hasPostfixNotationNode
   extends abstractFeatureNode
   string title Postfix Notation
   string pseudoExample 2 3 4 + 2 -
   string reference https://en.wikipedia.org/wiki/Reverse_Polish_notation
  hasPrefixNotationNode
   extends abstractFeatureNode
   string title Prefix Notation
   string pseudoExample + 1 2
   string reference https://en.wikipedia.org/wiki/Polish_notation
  hasPrintDebuggingNode
   extends abstractFeatureNode
   string title Print() Debugging
   string reference https://en.wikipedia.org/wiki/Debug_code#Print_debugging
   string pseudoExample print "Hello PLDB"
   string tokenKeyword printToken
  hasProcessorRegistersNode
   extends abstractFeatureNode
   string title Processor Registers
   string pseudoExample eax 2
   string reference https://en.wikipedia.org/wiki/Processor_register
  hasRangeOperatorsNode
   extends abstractFeatureNode
   string title Range Operator
   string reference https://docstore.mik.ua/orelly/perl4/prog/ch03_15.htm
   string pseudoExample 1 ... 10
  hasReferencesNode
   extends abstractFeatureNode
   string title References
   string pseudoExample fn(objPointer)
   string reference https://en.wikipedia.org/wiki/Reference_(computer_science)
  hasRefinementTypesNode
   extends abstractFeatureNode
   string title Refinement Types
   string pseudoExample evenInt where int % 2 = 0
   string reference https://en.wikipedia.org/wiki/Refinement_type
  hasRegularExpressionsSyntaxSugarNode
   extends abstractFeatureNode
   string title Regular Expression Syntax Sugar
   string reference https://pldb.com/truebase/regex.html
   string pseudoExample /pldb/
  hasRequiredMainFunctionNode
   extends abstractFeatureNode
  hasReservedWordsNode
   description Does a concept of reserved words exists? For example, not being able to use certain keywords as variable names.
   extends abstractFeatureNode
  hasRunTimeGuardsNode
   extends abstractFeatureNode
   string title Runtime Guards
   string pseudoExample f x | x > 0 = 1 | otherwise = 0
   string reference https://en.wikipedia.org/wiki/Guard_(computer_science)
  hasSExpressionsNode
   extends abstractFeatureNode
  hasScientificNotationNode
   extends abstractFeatureNode
   string title Scientific Notation
   string aka E Notation
   string pseudoExample 8076686.6e1
   string reference https://en.wikipedia.org/wiki/Scientific_notation
  hasSelfOrThisWordNode
   extends abstractFeatureNode
  hasSemanticIndentationNode
   extends abstractFeatureNode
   string title Semantic Indentation
   string reference https://pldb.com/posts/which-programming-languages-use-indentation.html
   string pseudoExample line0 if true line1  print "Hello PLDB"
  hasSetsNode
   extends abstractFeatureNode
   string title Sets
   string pseudoExample {"pldb", "PLDB"}
   string reference https://en.wikipedia.org/wiki/Set_(abstract_data_type)
  hasSingleDispatchNode
   extends abstractFeatureNode
   string title Single Dispatch
   string reference https://en.wikipedia.org/wiki/Dynamic_dispatch#Single_and_multiple_dispatch
   string pseudoExample person.run()
  hasSingleTypeArraysNode
   extends abstractFeatureNode
   description Has an array data structure that only can hold items of the same type.
   string title Single-Type Arrays
   string reference https://en.wikipedia.org/wiki/Array_data_structure
   string pseudoExample const pldbRanks: int[]
  hasSourceMapsNode
   extends abstractFeatureNode
   string title Source Maps
   string pseudoExample {file: 'pldb.min.js',sources: ['pldb.js'], mappings: 'CAAC,IAAI,IAAM'}
  hasStatementTerminatorCharacterNode
   extends abstractFeatureNode
  hasStatementsNode
   extends abstractFeatureNode
   string title Statements
   string pseudoExample print "Hello PLDB"
   string reference https://en.wikipedia.org/wiki/Statement_(computer_science)
  hasStaticMethodsNode
   extends abstractFeatureNode
   string title Static Methods
   string reference https://www.geeksforgeeks.org/static-methods-vs-instance-methods-java/
   string pseudoExample static downloadPldb() {}
  hasStaticTypingNode
   extends abstractFeatureNode
   string title Static Typing
   string reference https://en.wikipedia.org/wiki/Type_system#Static_type_checking
   string pseudoExample int pldbRank = 100
  hasStreamsNode
   extends abstractFeatureNode
   string title Streams
   string pseudoExample echo 123 | 123.txt
   string reference https://en.wikipedia.org/wiki/Stream_(computing)
  hasStringConcatOperatorNode
   extends abstractFeatureNode
  hasStringsNode
   extends abstractFeatureNode
   string title Strings
   string pseudoExample "Hello PLDB"
   string tokenKeyword stringToken
   string reference https://en.wikipedia.org/wiki/String_(computer_science)
  hasStructsNode
   extends abstractFeatureNode
   string title Structs
   string pseudoExample struct pldbFile { int rank; char *title; };
   string reference https://en.wikipedia.org/wiki/Struct_(C_programming_language)
  hasSwitchNode
   extends abstractFeatureNode
   string title Switch Statements
   string pseudoExample switch animal: case dog-buy; case cat-sell;
   string reference https://en.wikipedia.org/wiki/Switch_statement
  hasSymbolTablesNode
   extends abstractFeatureNode
   string title Symbol Tables
   string pseudoExample SymbolName|Type|Scope;bar|function,double|extern
   string reference https://en.wikipedia.org/wiki/Symbol_table
  hasSymbolsNode
   extends abstractFeatureNode
  hasTemplatesNode
   extends abstractFeatureNode
   string title Templates
   string pseudoExample template TCopy(T) {}
   string reference https://en.wikipedia.org/wiki/Template_metaprogramming
  hasTernaryOperatorsNode
   extends abstractFeatureNode
   string title Ternary operators
   string pseudoExample true ? 1 : 0
   string reference https://en.wikipedia.org/wiki/Ternary_operation
  hasThreadsNode
   extends abstractFeatureNode
   string title Threads
   string pseudoExample thread1(); thread2();
   string reference https://en.wikipedia.org/wiki/Thread_(computing)
  hasTimestampsNode
   extends abstractFeatureNode
  hasTraitsNode
   extends abstractFeatureNode
   string title Traits
   string pseudoExample use redBorder
   string reference https://en.wikipedia.org/wiki/Trait_(computer_programming)
  hasTriplesNode
   extends abstractFeatureNode
   string title Triples
   string pseudoExample Javascript isListedIn PLDB
   string reference https://en.wikipedia.org/wiki/Semantic_triple
  hasTryCatchNode
   extends abstractFeatureNode
  hasTypeAnnotationsNode
   extends abstractFeatureNode
   string title Type Annotations
   string pseudoExample score: number
  hasTypeInferenceNode
   extends abstractFeatureNode
   string title Type Inference
   string reference https://en.wikipedia.org/wiki/Type_inference
   string pseudoExample imAString = "pldb"
  hasTypeParametersNode
   extends abstractFeatureNode
   string title Type Parameters
   string pseudoExample function identity<T>(arg: T): T {return arg}
   string reference https://en.wikipedia.org/wiki/TypeParameter
  hasTypedHolesNode
   extends abstractFeatureNode
   string title Typed Holes
   string reference https://wiki.haskell.org/GHC/Typed_holes
   string pseudoExample 2 + _ => 2 + [int|float]
  hasUnaryOperatorsNode
   extends abstractFeatureNode
   string title Unary Operators
   string pseudoExample count++
   string reference https://en.wikipedia.org/wiki/Unary_operation
  hasUnicodeIdentifiersNode
   extends abstractFeatureNode
   string title Unicode Identifers
   string pseudoExample δ = 0.00001
  hasUnionTypesNode
   extends abstractFeatureNode
   string title Union Types
   string pseudoExample any = string | number
   string reference https://en.wikipedia.org/wiki/Union_type
  hasUnitsOfMeasureNode
   extends abstractFeatureNode
   string title Units of Measure
   string pseudoExample 42cm
   string reference https://en.wikipedia.org/wiki/Unit_of_measurement
  hasUserDefinedOperatorsNode
   extends abstractFeatureNode
  hasValueReturnedFunctionsNode
   extends abstractFeatureNode
  hasVariableSubstitutionSyntaxNode
   extends abstractFeatureNode
   description Do you use different syntax when assigning versus referencing a variable?
   string title Variable Substitution Syntax
   string pseudoExample name = "PLDB"; print $name
  hasVariadicFunctionsNode
   extends abstractFeatureNode
   string title Variadic Functions
   string pseudoExample args.map(doSomething)
   string reference https://en.wikipedia.org/wiki/Variadic_function
  hasVirtualFunctionsNode
   extends abstractFeatureNode
   string title Virtual function
   string pseudoExample virtual FetchPLDBFile();
   string reference https://en.wikipedia.org/wiki/Virtual_function
  hasVoidFunctionsNode
   extends abstractFeatureNode
  hasWhileLoopsNode
   extends abstractFeatureNode
   string title While Loops
   string pseudoExample while (pldb.pop()) loop()
   string reference https://en.wikipedia.org/wiki/While_loop
  hasZeroBasedNumberingNode
   extends abstractFeatureNode
   string title Zero-based numbering
   string reference https://en.wikipedia.org/wiki/Zero-based_numbering
   string pseudoExample firstItem = pldb[0]
  hasZippersNode
   extends abstractFeatureNode
   string title Zippers
   string reference https://wiki.haskell.org/Zipper https://en.wikipedia.org/wiki/Zipper_(data_structure)
   string pseudoExample pldbCursor.moveLeft()
  isCaseSensitiveNode
   extends abstractFeatureNode
   string title Case Sensitivity
   string reference https://en.wikipedia.org/wiki/Case_sensitivity
   string pseudoExample pldb != PLDB
  isLispNode
   extends abstractFeatureNode
   string title Lispy
   description Is this in the Lisp family of languages?
   string reference https://en.wikipedia.org/wiki/Lisp_(programming_language)
   string pseudoExample (+ 1 2)
  letterFirstIdentifiersNode
   extends abstractFeatureNode
   description Must identifiers start with a letter
   string title Letter-first Identifiers
   string pseudoExample pldb100 = "OK" // 100pldb = "ERROR"
  mergesWhitespaceNode
   extends abstractFeatureNode
   string title Merges Whitespace
   string reference http://wiki.c2.com/?SyntacticallySignificantWhitespaceConsideredHarmful
   string pseudoExample result = 1    +    2
  supportsBreakpointsNode
   extends abstractFeatureNode
   string title Breakpoints
   string pseudoExample debugger;
   string reference https://en.wikipedia.org/wiki/Breakpoint
  dblpPublicationsHitsNode
   crux hits
   cells keywordCell intCell
   description How many matching publications?
   single
  featureExampleCodeNode
   description Example usage of the feature. Ideally includes any necessary boilerplate to be runnable.
   baseNodeType blobNode
  abstractBooleanNode
   cells keywordCell boolCell
   cruxFromId
   single
  gdbSupportNode
   extends abstractBooleanNode
   description Is the language supported by the GNU Debugger?
   string sourceDomain sourceware.org
  isDeadNode
   description Has the creator or maintainer announced it officially dead? Include a link to proof of the announcement.
   extends abstractBooleanNode
   cells keywordCell boolCell urlCell
  isOpenSourceNode
   boolean alwaysRecommended true
   description Is it an open source project?
   extends abstractBooleanNode
  isPublicDomainNode
   boolean alwaysRecommended true
   description Is it public domain?
   extends abstractBooleanNode
  usesSemanticVersioningNode
   extends abstractBooleanNode
   description Does the official release of the language use semantic versioning?
  githubLanguageGroupNode
   cells keywordCell
   catchAllCellType externalGuidCell
   description Name of the parent language. Languages in a group are counted in the statistics as the parent language.
   crux group
  errorNode
   baseNodeType errorNode
  annualRankNode
   cells yearCell rankCell
   uniqueFirstWord
  annualPopulationCountNode
   cells yearCell populationCountCell
   uniqueFirstWord
  lineOfCodeNode
   catchAllCellType codeCell
   catchAllNodeType lineOfCodeNode
  blankLineNode
   description Blank lines compile to nothing in the HTML.
   cells blankCell
   compiler
    stringTemplate 
   pattern ^$
   tags doNotSynthesize
   boolean shouldSerialize false
  pldbNode
   root
   description A truebase about programming languages and related concepts.
   catchAllNodeType errorNode
   todo Should not have to manually list each node type here, but should be able to mark some tag as inscope. Should be fixed upstream in Jtree.
   inScope blankLineNode descriptionNode wikipediaNode equationNode exampleNode fileExtensionsNode githubLanguageNode abstractGitRepoUrlNode helloWorldCollectionNode creatorsNode appearedNode announcementUrlNode countryNode titleNode wordRankNode standsForNode akaNode pseudoExampleNode abstractFeatureGrammarLinkNode featuresNode referenceNode replitNode tryItOnlineNode twitterNode typeNode websiteNode fileTypeNode ebookNode linguistGrammarRepoNode tiobeNode meetupNode webReplNode linkedInSkillNode projectEulerNode hoplNode subredditNode redditDiscussionNode quineRelayNode ubuntuPackageNode codeMirrorNode monacoNode rosettaCodeNode antlrNode originCommunityNode cheatSheetUrlNode abstractBooleanNode indeedJobsNode hackerNewsDiscussionsNode firstAnnouncementNode announcementMethodNode abstractRelationshipNode packageCountNode packageInstallsNode packageRepositoryNode packageAuthorsNode packagesIncludingVersionsNode abstractChatUrlNode forLanguagesNode conferenceNode abstractCommonTokenNode languageServerProtocolProjectNode abstractParadigmNode versionsNode nativeLanguageNode jupyterKernelNode keywordsNode stackOverflowSurveyNode annualReportsUrlNode releaseNotesUrlNode officialBlogUrlNode eventsPageUrlNode faqPageUrlNode downloadPageUrlNode centralPackageRepositoryCountNode rijuReplNode esolangNode goodreadsNode dblpNode abstractFlagNode oldNameNode pygmentsHighlighterNode leachim6Node domainNameNode isbndbNode semanticScholarNode githubBigQueryNode compilerExplorerNode pyplNode documentationNode emailListNode specNode screenshotNode demoVideoNode funFactNode photoNode
   cells fileNameCell
   string fileExtension pldb
   example
    title TunaScript
    type pl
    appeared 2017
    creators Sam Lam
    example
     Hello world
   sortTemplate title appeared type isDead isPublicDomain screenshot photo demoVideo creators description website webRepl documentation ebook emailList spec reference cheatSheetUrl standsFor oldName renamedTo aka fileExtensions country nativeLanguage originCommunity domainName equation firstAnnouncement announcementMethod usesSemanticVersioning releaseNotesUrl versions  compilesTo forkOf subsetOf supersetOf extensionOf writtenIn inputLanguages runsOnVm related influencedBy successorOf  visualParadigm  features  lineCommentToken multiLineCommentTokens printToken assignmentToken stringToken booleanTokens includeToken keywords  example  gitRepo githubRepo sourcehutRepo gitlabRepo  funFact  wikipedia  githubLanguage githubBigQuery  antlr monaco codeMirror pygmentsHighlighter linguistGrammarRepo languageServerProtocolProject  projectEuler helloWorldCollection leachim6 rosettaCode quineRelay  compilerExplorer rijuRepl replit tryItOnline  indeedJobs linkedInSkill stackOverflowSurvey annualReportsUrl officialBlogUrl eventsPageUrl faqPageUrl downloadPageUrl  irc discord zulip subreddit meetup conference  hackerNewsDiscussions redditDiscussion  tiobe hopl esolang pypl  packageRepository packageCount packageAuthors packageInstallCount forLanguages  twitter ubuntuPackage gdbSupport jupyterKernel fileType wordRank isOpenSource githubCopilotOptimized centralPackageRepositoryCount  goodreads  isbndb  semanticScholar 
  stackOverflowSurveyYearNode
   description Survey results for a particular year.
   cells yearCell
   pattern \\d+
   uniqueFirstWord
   inScope stackOverflowSurveyMedianSalaryNode stackOverflowSurveyFansNode stackOverflowSurveyUsersNode stackOverflowSurveyPercentageUsingNode
  versionNode
   description A release year and version. Perhaps in the future we could get more specific to month or even day.
   cells yearCell versionCell
  versionsNode
   description The release years and versions of the language.
   cruxFromId
   cells keywordCell
   catchAllNodeType versionNode
   single`)
          getHandGrammarProgram() {
            return this.constructor.cachedHandGrammarProgramRoot
        }
  static getNodeTypeMap() { return {"abstractFactNode": abstractFactNode,
  "abstractUrlNode": abstractUrlNode,
  "annualReportsUrlNode": annualReportsUrlNode,
  "abstractChatUrlNode": abstractChatUrlNode,
  "discordNode": discordNode,
  "ircNode": ircNode,
  "zulipNode": zulipNode,
  "cheatSheetUrlNode": cheatSheetUrlNode,
  "demoVideoNode": demoVideoNode,
  "documentationNode": documentationNode,
  "downloadPageUrlNode": downloadPageUrlNode,
  "ebookNode": ebookNode,
  "emailListNode": emailListNode,
  "esolangNode": esolangNode,
  "eventsPageUrlNode": eventsPageUrlNode,
  "faqPageUrlNode": faqPageUrlNode,
  "abstractGitRepoUrlNode": abstractGitRepoUrlNode,
  "gitRepoNode": gitRepoNode,
  "githubRepoNode": githubRepoNode,
  "gitlabRepoNode": gitlabRepoNode,
  "sourcehutRepoNode": sourcehutRepoNode,
  "firstAnnouncementNode": firstAnnouncementNode,
  "screenshotNode": screenshotNode,
  "photoNode": photoNode,
  "languageServerProtocolProjectNode": languageServerProtocolProjectNode,
  "officialBlogUrlNode": officialBlogUrlNode,
  "packageRepositoryNode": packageRepositoryNode,
  "redditDiscussionNode": redditDiscussionNode,
  "referenceNode": referenceNode,
  "rijuReplNode": rijuReplNode,
  "specNode": specNode,
  "releaseNotesUrlNode": releaseNotesUrlNode,
  "websiteNode": websiteNode,
  "webReplNode": webReplNode,
  "abstractUrlGuidNode": abstractUrlGuidNode,
  "antlrNode": antlrNode,
  "hoplNode": hoplNode,
  "jupyterKernelNode": jupyterKernelNode,
  "meetupNode": meetupNode,
  "subredditNode": subredditNode,
  "replitNode": replitNode,
  "rosettaCodeNode": rosettaCodeNode,
  "twitterNode": twitterNode,
  "abstractOneWordGuidNode": abstractOneWordGuidNode,
  "codeMirrorNode": codeMirrorNode,
  "monacoNode": monacoNode,
  "tryItOnlineNode": tryItOnlineNode,
  "ubuntuPackageNode": ubuntuPackageNode,
  "abstractMultiwordGuidNode": abstractMultiwordGuidNode,
  "compilerExplorerNode": compilerExplorerNode,
  "githubBigQueryNode": githubBigQueryNode,
  "githubLanguageNode": githubLanguageNode,
  "leachim6Node": leachim6Node,
  "projectEulerNode": projectEulerNode,
  "pygmentsHighlighterNode": pygmentsHighlighterNode,
  "pyplNode": pyplNode,
  "quineRelayNode": quineRelayNode,
  "stackOverflowSurveyNode": stackOverflowSurveyNode,
  "tiobeNode": tiobeNode,
  "conferenceNode": conferenceNode,
  "dblpNode": dblpNode,
  "abstractDelimitedBlobNode": abstractDelimitedBlobNode,
  "dblpPublicationsNode": dblpPublicationsNode,
  "githubTrendingProjectsNode": githubTrendingProjectsNode,
  "goodreadsNode": goodreadsNode,
  "hackerNewsDiscussionsNode": hackerNewsDiscussionsNode,
  "isbndbNode": isbndbNode,
  "semanticScholarNode": semanticScholarNode,
  "descriptionNode": descriptionNode,
  "githubDescriptionNode": githubDescriptionNode,
  "abstractCodeNode": abstractCodeNode,
  "equationNode": equationNode,
  "exampleNode": exampleNode,
  "helloWorldCollectionNode": helloWorldCollectionNode,
  "leachim6ExampleNode": leachim6ExampleNode,
  "linguistExampleNode": linguistExampleNode,
  "wikipediaExampleNode": wikipediaExampleNode,
  "funFactNode": funFactNode,
  "keywordsNode": keywordsNode,
  "abstractCommonTokenNode": abstractCommonTokenNode,
  "lineCommentTokenNode": lineCommentTokenNode,
  "multiLineCommentTokensNode": multiLineCommentTokensNode,
  "printTokenNode": printTokenNode,
  "stringTokenNode": stringTokenNode,
  "assignmentTokenNode": assignmentTokenNode,
  "booleanTokensNode": booleanTokensNode,
  "includeTokenNode": includeTokenNode,
  "abstractSectionNode": abstractSectionNode,
  "featuresNode": featuresNode,
  "linguistGrammarRepoNode": linguistGrammarRepoNode,
  "wikipediaNode": wikipediaNode,
  "abstractArrayNode": abstractArrayNode,
  "fileExtensionsNode": fileExtensionsNode,
  "githubLanguageFileExtensionsNode": githubLanguageFileExtensionsNode,
  "fileNamesNode": fileNamesNode,
  "abstractGitHubLanguageArrayNode": abstractGitHubLanguageArrayNode,
  "githubLanguageInterpretersNode": githubLanguageInterpretersNode,
  "githubLanguageAliasesNode": githubLanguageAliasesNode,
  "abstractPermalinksNode": abstractPermalinksNode,
  "forLanguagesNode": forLanguagesNode,
  "abstractRelationshipNode": abstractRelationshipNode,
  "relatedNode": relatedNode,
  "runsOnVmNode": runsOnVmNode,
  "influencedByNode": influencedByNode,
  "successorOfNode": successorOfNode,
  "subsetOfNode": subsetOfNode,
  "renamedToNode": renamedToNode,
  "supersetOfNode": supersetOfNode,
  "writtenInNode": writtenInNode,
  "extensionOfNode": extensionOfNode,
  "forkOfNode": forkOfNode,
  "compilesToNode": compilesToNode,
  "inputLanguagesNode": inputLanguagesNode,
  "wikipediaRelatedNode": wikipediaRelatedNode,
  "abstractIntNode": abstractIntNode,
  "abstractCountNode": abstractCountNode,
  "abstractPopulationCountNode": abstractPopulationCountNode,
  "githubBigQueryUserCountNode": githubBigQueryUserCountNode,
  "linguistCommitterCountNode": linguistCommitterCountNode,
  "meetupMemberCountNode": meetupMemberCountNode,
  "packageAuthorsNode": packageAuthorsNode,
  "stackOverflowSurveyUsersNode": stackOverflowSurveyUsersNode,
  "stackOverflowSurveyFansNode": stackOverflowSurveyFansNode,
  "twitterFollowersNode": twitterFollowersNode,
  "githubBigQueryRepoCountNode": githubBigQueryRepoCountNode,
  "githubTrendingProjectsCountNode": githubTrendingProjectsCountNode,
  "githubRepoCountNode": githubRepoCountNode,
  "abstractGithubCountNode": abstractGithubCountNode,
  "githubSubscribersNode": githubSubscribersNode,
  "githubForksNode": githubForksNode,
  "githubStarsNode": githubStarsNode,
  "githubIssuesNode": githubIssuesNode,
  "linguistCommitsNode": linguistCommitsNode,
  "linguistSampleCountNode": linguistSampleCountNode,
  "meetupGroupCountNode": meetupGroupCountNode,
  "centralPackageRepositoryCountNode": centralPackageRepositoryCountNode,
  "packageInstallsNode": packageInstallsNode,
  "packageCountNode": packageCountNode,
  "packagesIncludingVersionsNode": packagesIncludingVersionsNode,
  "wikipediaDailyPageViewsNode": wikipediaDailyPageViewsNode,
  "wikipediaBacklinksCountNode": wikipediaBacklinksCountNode,
  "wikipediaRevisionCountNode": wikipediaRevisionCountNode,
  "abstractYearNode": abstractYearNode,
  "abstractGithubYearNode": abstractGithubYearNode,
  "githubCreatedNode": githubCreatedNode,
  "githubUpdatedNode": githubUpdatedNode,
  "githubFirstCommitNode": githubFirstCommitNode,
  "appearedNode": appearedNode,
  "linguistFirstCommitNode": linguistFirstCommitNode,
  "linguistLastCommitNode": linguistLastCommitNode,
  "domainRegisteredNode": domainRegisteredNode,
  "wikipediaCreatedNode": wikipediaCreatedNode,
  "wikipediaYearNode": wikipediaYearNode,
  "wordRankNode": wordRankNode,
  "stackOverflowSurveyMedianSalaryNode": stackOverflowSurveyMedianSalaryNode,
  "tiobeCurrentRankNode": tiobeCurrentRankNode,
  "wikipediaPageIdNode": wikipediaPageIdNode,
  "abstractFlagNode": abstractFlagNode,
  "githubCopilotOptimizedNode": githubCopilotOptimizedNode,
  "abstractGitHubLanguageNode": abstractGitHubLanguageNode,
  "githubLanguageAceModeNode": githubLanguageAceModeNode,
  "githubLanguageCodemirrorModeNode": githubLanguageCodemirrorModeNode,
  "githubLanguageCodemirrorMimeTypeNode": githubLanguageCodemirrorMimeTypeNode,
  "githubLanguageTmScopeNode": githubLanguageTmScopeNode,
  "githubLanguageWrapNode": githubLanguageWrapNode,
  "githubLanguageTypeNode": githubLanguageTypeNode,
  "creatorsNode": creatorsNode,
  "nativeLanguageNode": nativeLanguageNode,
  "announcementMethodNode": announcementMethodNode,
  "countryNode": countryNode,
  "abstractAnnualPopulationCountMapNode": abstractAnnualPopulationCountMapNode,
  "indeedJobsNode": indeedJobsNode,
  "linkedInSkillNode": linkedInSkillNode,
  "projectEulerMemberCountNode": projectEulerMemberCountNode,
  "subredditMemberCountNode": subredditMemberCountNode,
  "filepathNode": filepathNode,
  "abstractStringNode": abstractStringNode,
  "titleNode": titleNode,
  "standsForNode": standsForNode,
  "akaNode": akaNode,
  "oldNameNode": oldNameNode,
  "originCommunityNode": originCommunityNode,
  "abstractParadigmNode": abstractParadigmNode,
  "visualParadigmNode": visualParadigmNode,
  "abstractDecimalNode": abstractDecimalNode,
  "stackOverflowSurveyPercentageUsingNode": stackOverflowSurveyPercentageUsingNode,
  "abstractAnnualRankMapNode": abstractAnnualRankMapNode,
  "awisRankNode": awisRankNode,
  "pygmentsFilenameNode": pygmentsFilenameNode,
  "typeNode": typeNode,
  "fileTypeNode": fileTypeNode,
  "domainNameNode": domainNameNode,
  "wikipediaSummaryNode": wikipediaSummaryNode,
  "abstractFeatureNode": abstractFeatureNode,
  "canDoShebangNode": canDoShebangNode,
  "canReadCommandLineArgsNode": canReadCommandLineArgsNode,
  "canUseQuestionMarksAsPartOfIdentifierNode": canUseQuestionMarksAsPartOfIdentifierNode,
  "canWriteToDiskNode": canWriteToDiskNode,
  "hasAbstractTypesNode": hasAbstractTypesNode,
  "hasAccessModifiersNode": hasAccessModifiersNode,
  "hasAlgebraicTypesNode": hasAlgebraicTypesNode,
  "hasAnonymousFunctionsNode": hasAnonymousFunctionsNode,
  "hasArraySlicingSyntaxNode": hasArraySlicingSyntaxNode,
  "hasAssertStatementsNode": hasAssertStatementsNode,
  "hasAssignmentNode": hasAssignmentNode,
  "hasAsyncAwaitNode": hasAsyncAwaitNode,
  "hasBinaryNumbersNode": hasBinaryNumbersNode,
  "hasBinaryOperatorsNode": hasBinaryOperatorsNode,
  "hasBitWiseOperatorsNode": hasBitWiseOperatorsNode,
  "hasBlobsNode": hasBlobsNode,
  "hasBooleansNode": hasBooleansNode,
  "hasBoundedCheckedArraysNode": hasBoundedCheckedArraysNode,
  "hasBreakNode": hasBreakNode,
  "hasBuiltInRegexNode": hasBuiltInRegexNode,
  "hasCaseInsensitiveIdentifiersNode": hasCaseInsensitiveIdentifiersNode,
  "hasCharactersNode": hasCharactersNode,
  "hasClassesNode": hasClassesNode,
  "hasClobsNode": hasClobsNode,
  "hasCommentsNode": hasCommentsNode,
  "hasConditionalsNode": hasConditionalsNode,
  "hasConstantsNode": hasConstantsNode,
  "hasConstructorsNode": hasConstructorsNode,
  "hasContinueNode": hasContinueNode,
  "hasDecimalsNode": hasDecimalsNode,
  "hasDefaultParametersNode": hasDefaultParametersNode,
  "hasDependentTypesNode": hasDependentTypesNode,
  "hasDestructuringNode": hasDestructuringNode,
  "hasDirectivesNode": hasDirectivesNode,
  "hasDisposeBlocksNode": hasDisposeBlocksNode,
  "hasDocCommentsNode": hasDocCommentsNode,
  "hasDuckTypingNode": hasDuckTypingNode,
  "hasDynamicPropertiesNode": hasDynamicPropertiesNode,
  "hasDynamicSizedArraysNode": hasDynamicSizedArraysNode,
  "hasDynamicTypingNode": hasDynamicTypingNode,
  "hasEnumsNode": hasEnumsNode,
  "hasEscapeCharactersNode": hasEscapeCharactersNode,
  "hasExceptionsNode": hasExceptionsNode,
  "hasExplicitTypeCastingNode": hasExplicitTypeCastingNode,
  "hasExportsNode": hasExportsNode,
  "hasExpressionsNode": hasExpressionsNode,
  "hasFirstClassFunctionsNode": hasFirstClassFunctionsNode,
  "hasFixedPointNode": hasFixedPointNode,
  "hasFloatsNode": hasFloatsNode,
  "hasFnArgumentsNode": hasFnArgumentsNode,
  "hasForEachLoopsNode": hasForEachLoopsNode,
  "hasForLoopsNode": hasForLoopsNode,
  "hasFunctionCompositionNode": hasFunctionCompositionNode,
  "hasFunctionOverloadingNode": hasFunctionOverloadingNode,
  "hasFunctionsNode": hasFunctionsNode,
  "hasGarbageCollectionNode": hasGarbageCollectionNode,
  "hasGeneratorsNode": hasGeneratorsNode,
  "hasGenericsNode": hasGenericsNode,
  "hasGlobalScopeNode": hasGlobalScopeNode,
  "hasGotosNode": hasGotosNode,
  "hasHereDocsNode": hasHereDocsNode,
  "hasHexadecimalsNode": hasHexadecimalsNode,
  "hasHomoiconicityNode": hasHomoiconicityNode,
  "hasIdsNode": hasIdsNode,
  "hasIfElsesNode": hasIfElsesNode,
  "hasIfsNode": hasIfsNode,
  "hasImplicitArgumentsNode": hasImplicitArgumentsNode,
  "hasImplicitTypeConversionsNode": hasImplicitTypeConversionsNode,
  "hasImportsNode": hasImportsNode,
  "hasIncrementAndDecrementOperatorsNode": hasIncrementAndDecrementOperatorsNode,
  "hasInfixNotationNode": hasInfixNotationNode,
  "hasInheritanceNode": hasInheritanceNode,
  "hasIntegersNode": hasIntegersNode,
  "hasInterfacesNode": hasInterfacesNode,
  "hasIteratorsNode": hasIteratorsNode,
  "hasLabelsNode": hasLabelsNode,
  "hasLazyEvaluationNode": hasLazyEvaluationNode,
  "hasLineCommentsNode": hasLineCommentsNode,
  "hasListsNode": hasListsNode,
  "hasMacrosNode": hasMacrosNode,
  "hasMagicGettersAndSettersNode": hasMagicGettersAndSettersNode,
  "hasManualMemoryManagementNode": hasManualMemoryManagementNode,
  "hasMapFunctionsNode": hasMapFunctionsNode,
  "hasMapsNode": hasMapsNode,
  "hasMemberVariablesNode": hasMemberVariablesNode,
  "hasMessagePassingNode": hasMessagePassingNode,
  "hasMethodChainingNode": hasMethodChainingNode,
  "hasMethodOverloadingNode": hasMethodOverloadingNode,
  "hasMethodsNode": hasMethodsNode,
  "hasMixinsNode": hasMixinsNode,
  "hasModulesNode": hasModulesNode,
  "hasMonadsNode": hasMonadsNode,
  "hasMultiLineCommentsNode": hasMultiLineCommentsNode,
  "hasMultilineStringsNode": hasMultilineStringsNode,
  "hasMultipleDispatchNode": hasMultipleDispatchNode,
  "hasMultipleInheritanceNode": hasMultipleInheritanceNode,
  "hasNamespacesNode": hasNamespacesNode,
  "hasNullNode": hasNullNode,
  "hasOctalsNode": hasOctalsNode,
  "hasOperatorOverloadingNode": hasOperatorOverloadingNode,
  "hasPairsNode": hasPairsNode,
  "hasPartialApplicationNode": hasPartialApplicationNode,
  "hasPatternMatchingNode": hasPatternMatchingNode,
  "hasPipesNode": hasPipesNode,
  "hasPointersNode": hasPointersNode,
  "hasPolymorphismNode": hasPolymorphismNode,
  "hasPostfixNotationNode": hasPostfixNotationNode,
  "hasPrefixNotationNode": hasPrefixNotationNode,
  "hasPrintDebuggingNode": hasPrintDebuggingNode,
  "hasProcessorRegistersNode": hasProcessorRegistersNode,
  "hasRangeOperatorsNode": hasRangeOperatorsNode,
  "hasReferencesNode": hasReferencesNode,
  "hasRefinementTypesNode": hasRefinementTypesNode,
  "hasRegularExpressionsSyntaxSugarNode": hasRegularExpressionsSyntaxSugarNode,
  "hasRequiredMainFunctionNode": hasRequiredMainFunctionNode,
  "hasReservedWordsNode": hasReservedWordsNode,
  "hasRunTimeGuardsNode": hasRunTimeGuardsNode,
  "hasSExpressionsNode": hasSExpressionsNode,
  "hasScientificNotationNode": hasScientificNotationNode,
  "hasSelfOrThisWordNode": hasSelfOrThisWordNode,
  "hasSemanticIndentationNode": hasSemanticIndentationNode,
  "hasSetsNode": hasSetsNode,
  "hasSingleDispatchNode": hasSingleDispatchNode,
  "hasSingleTypeArraysNode": hasSingleTypeArraysNode,
  "hasSourceMapsNode": hasSourceMapsNode,
  "hasStatementTerminatorCharacterNode": hasStatementTerminatorCharacterNode,
  "hasStatementsNode": hasStatementsNode,
  "hasStaticMethodsNode": hasStaticMethodsNode,
  "hasStaticTypingNode": hasStaticTypingNode,
  "hasStreamsNode": hasStreamsNode,
  "hasStringConcatOperatorNode": hasStringConcatOperatorNode,
  "hasStringsNode": hasStringsNode,
  "hasStructsNode": hasStructsNode,
  "hasSwitchNode": hasSwitchNode,
  "hasSymbolTablesNode": hasSymbolTablesNode,
  "hasSymbolsNode": hasSymbolsNode,
  "hasTemplatesNode": hasTemplatesNode,
  "hasTernaryOperatorsNode": hasTernaryOperatorsNode,
  "hasThreadsNode": hasThreadsNode,
  "hasTimestampsNode": hasTimestampsNode,
  "hasTraitsNode": hasTraitsNode,
  "hasTriplesNode": hasTriplesNode,
  "hasTryCatchNode": hasTryCatchNode,
  "hasTypeAnnotationsNode": hasTypeAnnotationsNode,
  "hasTypeInferenceNode": hasTypeInferenceNode,
  "hasTypeParametersNode": hasTypeParametersNode,
  "hasTypedHolesNode": hasTypedHolesNode,
  "hasUnaryOperatorsNode": hasUnaryOperatorsNode,
  "hasUnicodeIdentifiersNode": hasUnicodeIdentifiersNode,
  "hasUnionTypesNode": hasUnionTypesNode,
  "hasUnitsOfMeasureNode": hasUnitsOfMeasureNode,
  "hasUserDefinedOperatorsNode": hasUserDefinedOperatorsNode,
  "hasValueReturnedFunctionsNode": hasValueReturnedFunctionsNode,
  "hasVariableSubstitutionSyntaxNode": hasVariableSubstitutionSyntaxNode,
  "hasVariadicFunctionsNode": hasVariadicFunctionsNode,
  "hasVirtualFunctionsNode": hasVirtualFunctionsNode,
  "hasVoidFunctionsNode": hasVoidFunctionsNode,
  "hasWhileLoopsNode": hasWhileLoopsNode,
  "hasZeroBasedNumberingNode": hasZeroBasedNumberingNode,
  "hasZippersNode": hasZippersNode,
  "isCaseSensitiveNode": isCaseSensitiveNode,
  "isLispNode": isLispNode,
  "letterFirstIdentifiersNode": letterFirstIdentifiersNode,
  "mergesWhitespaceNode": mergesWhitespaceNode,
  "supportsBreakpointsNode": supportsBreakpointsNode,
  "dblpPublicationsHitsNode": dblpPublicationsHitsNode,
  "featureExampleCodeNode": featureExampleCodeNode,
  "abstractBooleanNode": abstractBooleanNode,
  "gdbSupportNode": gdbSupportNode,
  "isDeadNode": isDeadNode,
  "isOpenSourceNode": isOpenSourceNode,
  "isPublicDomainNode": isPublicDomainNode,
  "usesSemanticVersioningNode": usesSemanticVersioningNode,
  "githubLanguageGroupNode": githubLanguageGroupNode,
  "errorNode": errorNode,
  "annualRankNode": annualRankNode,
  "annualPopulationCountNode": annualPopulationCountNode,
  "lineOfCodeNode": lineOfCodeNode,
  "blankLineNode": blankLineNode,
  "pldbNode": pldbNode,
  "stackOverflowSurveyYearNode": stackOverflowSurveyYearNode,
  "versionNode": versionNode,
  "versionsNode": versionsNode }}
      }
  
  class stackOverflowSurveyYearNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"users" : stackOverflowSurveyUsersNode,
  "fans" : stackOverflowSurveyFansNode,
  "medianSalary" : stackOverflowSurveyMedianSalaryNode,
  "percentageUsing" : stackOverflowSurveyPercentageUsingNode}), undefined)
    }
  get yearCell() {
        return parseInt(this.getWord(0))
      }
      }
  
  class versionNode extends GrammarBackedNode {
        get yearCell() {
        return parseInt(this.getWord(0))
      }
  get versionCell() {
        return this.getWord(1)
      }
      }
  
  class versionsNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(versionNode, undefined, undefined)
    }
  get keywordCell() {
        return this.getWord(0)
      }
      }
  
  window.pldbNode = pldbNode
  };
  
  {
  
  
  class tqlNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(catchAllErrorNode, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"where" : whereNode,
  "includes" : includesTextNode,
  "doesNotInclude" : doesNotIncludeTextNode,
  "missing" : columnIsMissingNode,
  "notMissing" : columnIsNotMissingNode,
  "matchesRegex" : matchesRegexNode,
  "#" : commentNode,
  "select" : selectNode,
  "selectAll" : selectAllNode,
  "rename" : renameNode,
  "sortBy" : sortByNode,
  "reverse" : reverseNode,
  "limit" : limitNode,
  "title" : titleNode,
  "description" : descriptionNode}), [{regex: /^$/, nodeConstructor: blankLineNode}])
    }
  get tests() {
    const tests = this.filter(node => node.toPredicate).map(node => {
        const predicate = node.toPredicate()
        return node.flip ? (file) => !predicate(file)  : predicate
    })
    return tests
  }
  filterFolder(trueBaseFolder) {
    const {tests} = this
    const predicate = file => tests.every(fn => fn(file))
    return trueBaseFolder.filter(file => predicate(file))
  }
  static cachedHandGrammarProgramRoot = new HandGrammarProgram(`keywordCell
   highlightScope keyword
  comparisonCell
   enum < > = != includes doesNotInclude oneOf
  stringCell
   highlightScope string
  permalinkCell
   highlightScope string
  regexCell
   highlightScope string
  numberCell
   highlightScope constant.numeric
  numberOrStringCell
   highlightScope constant.numeric
  commentCell
   highlightScope comment
  columnNameCell
   description The column to search on.
   highlightScope constant.numeric
   enum title appeared type pldbId rank languageRank factCount lastActivity exampleCount bookCount paperCount numberOfUsers numberOfJobs githubBigQuery.repos creators githubRepo website wikipedia originCommunity country centralPackageRepositoryCount reference hopl wikipedia.dailyPageViews wikipedia.backlinksCount wikipedia.summary wikipedia.pageId wikipedia.appeared wikipedia.created wikipedia.revisionCount wikipedia.related fileType isbndb githubRepo.stars githubRepo.forks githubRepo.updated githubRepo.subscribers githubRepo.created githubRepo.description description githubRepo.issues domainName githubRepo.firstCommit semanticScholar features.hasComments domainName.registered isOpenSource features.hasSemanticIndentation features.hasLineComments githubLanguage githubLanguage.tm_scope githubLanguage.type githubLanguage.ace_mode githubLanguage.fileExtensions numberOfRepos githubLanguage.repos lineCommentToken githubLanguage.trendingProjectsCount domainName.awisRank.2022 leachim6.filepath leachim6 githubBigQuery githubBigQuery.users linguistGrammarRepo linguistGrammarRepo.commitCount linguistGrammarRepo.committerCount linguistGrammarRepo.lastCommit linguistGrammarRepo.firstCommit wordRank leachim6.fileExtensions linguistGrammarRepo.sampleCount features.hasStrings pygmentsHighlighter.filename pygmentsHighlighter standsFor stringToken documentation rosettaCode pygmentsHighlighter.fileExtensions features.hasPrintDebugging printToken twitter features.hasMultiLineComments rijuRepl githubLanguage.codemirror_mime_type githubLanguage.codemirror_mode fileExtensions tiobe related multiLineCommentTokens aka features.hasIntegers helloWorldCollection githubLanguage.aliases features.hasFloats tryItOnline writtenIn features.hasBooleans keywords indeedJobs wikipedia.fileExtensions features.hasHexadecimals projectEuler.memberCount.2022 projectEuler booleanTokens visualParadigm domainName.awisRank.2017 projectEuler.memberCount.2019 webRepl subreddit.memberCount.2022 subreddit codeMirror features.hasCaseInsensitiveIdentifiers monaco features.hasConditionals jupyterKernel githubLanguage.interpreters quineRelay compilesTo ubuntuPackage indeedJobs.2022 packageRepository antlr officialBlogUrl meetup.groupCount meetup.memberCount meetup linkedInSkill.2018 linkedInSkill languageServerProtocolProject githubLanguage.filenames features.hasOctals releaseNotesUrl languageServerProtocolProject.writtenIn features.hasAssignment faqPageUrl tiobe.currentRank features.hasWhileLoops forLanguages packageCount supersetOf indeedJobs.2017 features.hasBinaryNumbers influencedBy features.hasOperatorOverloading features.hasImports features.hasFunctions githubLanguage.group rijuRepl.description subreddit.memberCount.2017 rijuRepl.gitRepo rijuRepl.fileExtensions stackOverflowSurvey.2021.percentageUsing stackOverflowSurvey.2021.fans stackOverflowSurvey.2021.medianSalary stackOverflowSurvey.2021.users downloadPageUrl assignmentToken compilerExplorer features.hasMacros features.hasClasses replit rijuRepl.website pypl emailList features.hasTypeInference features.isCaseSensitive features.hasSwitch features.hasConstants features.hasGarbageCollection spec features.hasExceptions features.hasPointers features.hasDirectives features.hasAccessModifiers eventsPageUrl cheatSheetUrl features.hasLists features.hasInheritance features.hasMultipleInheritance features.hasConstructors nativeLanguage features.hasRegularExpressionsSyntaxSugar esolang screenshot githubLanguage.wrap features.isLisp features.hasTernaryOperators features.hasScientificNotation versions.2022 features.hasMessagePassing gdbSupport features.hasEnums announcementMethod gitlabRepo demoVideo isPublicDomain features.hasMultilineStrings features.hasVariableSubstitutionSyntax subsetOf firstAnnouncement packageInstallCount features.canWriteToDisk features.hasBitWiseOperators features.hasZeroBasedNumbering oldName features.hasStaticTyping features.hasUnitsOfMeasure features.hasIncrementAndDecrementOperators features.hasSingleDispatch features.hasHomoiconicity runsOnVm features.hasHereDocs features.hasFixedPoint features.hasNamespaces features.hasThreads features.hasModules gitRepo features.hasPatternMatching annualReportsUrl features.hasFunctionComposition features.hasFunctionOverloading features.hasAsyncAwait features.hasIterators features.hasExplicitTypeCasting features.hasGotos features.hasStructs features.hasMultipleDispatch features.hasInterfaces features.hasGenerics features.hasForEachLoops features.hasMaps features.hasPipes features.hasMixins features.canDoShebang features.hasVariadicFunctions features.hasManualMemoryManagement features.hasTemplates features.hasInfixNotation features.hasPolymorphism features.hasPartialApplication features.hasAssertStatements sourcehutRepo features.hasForLoops renamedTo features.hasDocComments features.hasUnicodeIdentifiers features.hasDependentTypes conference features.hasDuckTyping features.hasDefaultParameters features.hasAnonymousFunctions features.hasMagicGettersAndSetters packageAuthors successorOf photo features.hasBuiltInRegex features.hasNull features.hasUnaryOperators features.hasUserDefinedOperators features.hasBreak features.hasContinue includeToken features.hasUnionTypes features.hasSingleTypeArrays features.hasTypedHoles features.hasReservedWords features.hasRangeOperators features.hasDisposeBlocks features.hasSymbolTables features.hasDestructuring features.hasGenerators features.hasDynamicProperties features.hasExpressions forkOf inputLanguages redditDiscussion features.hasTryCatch features.hasEscapeCharacters usesSemanticVersioning features.hasPostfixNotation features.hasPrefixNotation features.hasStreams features.hasLazyEvaluation features.hasCharacters funFact features.hasSets features.hasMethods features.hasAbstractTypes isDead features.canUseQuestionMarksAsPartOfIdentifier features.hasTypeAnnotations features.hasSymbols features.hasDecimals features.hasBlobs features.hasSExpressions features.hasLabels features.hasIfElses features.hasIfs features.hasBoundedCheckedArrays features.hasArraySlicingSyntax features.hasTimestamps features.hasMethodOverloading features.hasVoidFunctions features.hasGlobalScope features.hasFnArguments features.canReadCommandLineArgs features.hasDynamicSizedArrays features.hasRequiredMainFunction features.hasSelfOrThisWord features.hasStatementTerminatorCharacter features.hasMemberVariables features.hasStringConcatOperator versions.2021 features.hasAlgebraicTypes features.hasTypeParameters features.hasStaticMethods features.hasRunTimeGuards irc features.hasTraits features.hasVirtualFunctions discord features.letterFirstIdentifiers features.hasReferences features.hasImplicitTypeConversions features.hasFirstClassFunctions features.hasProcessorRegisters features.hasSourceMaps features.mergesWhitespace features.supportsBreakpoints features.hasMapFunctions features.hasBinaryOperators features.hasStatements versions.2007 versions.2023 versions.2015 versions.2019 versions.2013 features.hasRefinementTypes features.hasPairs features.hasValueReturnedFunctions features.hasClobs features.hasTriples features.hasIds ebook features.hasExports features.hasZippers features.hasMonads extensionOf zulip features.hasImplicitArguments features.hasDynamicTyping features.hasMethodChaining
  blankCell
  tqlNode
   root
   description Tree Query Language (TQL) is a new language for searching a TrueBase.
   catchAllNodeType catchAllErrorNode
   inScope abstractQueryNode blankLineNode commentNode abstractModifierNode abstractMetaNode
   javascript
    get tests() {
      const tests = this.filter(node => node.toPredicate).map(node => {
          const predicate = node.toPredicate()
          return node.flip ? (file) => !predicate(file)  : predicate
      })
      return tests
    }
    filterFolder(trueBaseFolder) {
      const {tests} = this
      const predicate = file => tests.every(fn => fn(file))
      return trueBaseFolder.filter(file => predicate(file))
    }
  abstractQueryNode
   cells keywordCell
   inScope abstractQueryNode commentNode
   javascript
    toPredicate() {
      return () => true
    }
  catchAllErrorNode
   baseNodeType errorNode
  blankLineNode
   description Blank lines are ignored.
   cells blankCell
   compiler
    stringTemplate 
   pattern ^$
   tags doNotSynthesize
   boolean shouldSerialize false
  whereNode
   description Find files whose value in the given column meet this condition.
   extends abstractQueryNode
   cells keywordCell columnNameCell comparisonCell
   catchAllCellType numberOrStringCell
   crux where
   javascript
    toPredicate() {
      const columnName = this.getWord(1)
      const operator = this.getWord(2)
      return file => {
        const value = file.getTypedValue(columnName)
        const valueType = typeof value
        const textQueryValue = this.getWordsFrom(3).join(" ")
        let queryValue = textQueryValue
        if (valueType === "number")
          queryValue = parseFloat(queryValue)
        if (operator === ">")
          return value > queryValue
        if (operator === "<")
          return value < queryValue
        if (operator === "=")
          return value == queryValue
        if (operator === "!=")
          return value != queryValue
        if (operator === "includes")
          return value ? value.includes(queryValue) : false
        if (operator === "doesNotInclude")
          return value ? !value.includes(queryValue) : true
        if (operator === "oneOf")
          return value ? textQueryValue.split(" ").includes(value.toString()) : false
      }
    }
  includesTextNode
   extends abstractQueryNode
   description Find files that include this text somewhere. Case insensitive.
   catchAllCellType stringCell
   crux includes
   javascript
    toPredicate() {
      const query = (this.content ?? "").toLowerCase()
      return file => file.lowercase.includes(query)
    }
  doesNotIncludeTextNode
   description Find files that do not include this text anywhere. Case insensitive.
   extends includesTextNode
   crux doesNotInclude
   boolean flip true
  columnIsMissingNode
   description Find files whose value in the given column is missing.
   extends abstractQueryNode
   cells keywordCell columnNameCell
   crux missing
   javascript
    toPredicate() {
      const columnName = this.getWord(1)
      return file => !file.has(columnName.replaceAll(".", " "))
    }
  columnIsNotMissingNode
   description Find files whose value in the given column is not missing.
   extends columnIsMissingNode
   crux notMissing
   boolean flip true
  matchesRegexNode
   description Find files that match this regex on a full text search.
   extends abstractQueryNode
   catchAllCellType regexCell
   crux matchesRegex
   javascript
    toPredicate() {
      const regex = new RegExp(this.content ?? "")
      return file => regex.test(file.toString())
    }
  commentNode
   description Comments are ignored.
   crux #
   cells commentCell
   catchAllCellType commentCell
   catchAllNodeType commentNode
   boolean suggestInAutocomplete false
  abstractModifierNode
   cells keywordCell
   cruxFromId
   single
  abstractColumnModifierNode
   extends abstractModifierNode
   catchAllCellType columnNameCell
  selectNode
   description Choose which columns to return.
   extends abstractColumnModifierNode
  selectAllNode
   description Select all the columns
   extends abstractColumnModifierNode
  renameNode
   cells keywordCell columnNameCell stringCell
   example
    rename githubRepo.stars Stars
   description Rename a column.
   extends abstractColumnModifierNode
  sortByNode
   description Sort by these columns.
   extends abstractColumnModifierNode
  reverseNode
   extends abstractModifierNode
   description Reverse the order of results.
  limitNode
   extends abstractModifierNode
   description Return a maximum of this many results.
   cells keywordCell numberCell
  abstractMetaNode
   cells keywordCell
   catchAllCellType stringCell
   cruxFromId
   single
   boolean suggestInAutocomplete false
  titleNode
   description Give your query a title for display on the results page.
   extends abstractMetaNode
  descriptionNode
   description Give your query a description for display on the results page.
   extends abstractMetaNode`)
          getHandGrammarProgram() {
            return this.constructor.cachedHandGrammarProgramRoot
        }
  static getNodeTypeMap() { return {"tqlNode": tqlNode,
  "abstractQueryNode": abstractQueryNode,
  "catchAllErrorNode": catchAllErrorNode,
  "blankLineNode": blankLineNode,
  "whereNode": whereNode,
  "includesTextNode": includesTextNode,
  "doesNotIncludeTextNode": doesNotIncludeTextNode,
  "columnIsMissingNode": columnIsMissingNode,
  "columnIsNotMissingNode": columnIsNotMissingNode,
  "matchesRegexNode": matchesRegexNode,
  "commentNode": commentNode,
  "abstractModifierNode": abstractModifierNode,
  "abstractColumnModifierNode": abstractColumnModifierNode,
  "selectNode": selectNode,
  "selectAllNode": selectAllNode,
  "renameNode": renameNode,
  "sortByNode": sortByNode,
  "reverseNode": reverseNode,
  "limitNode": limitNode,
  "abstractMetaNode": abstractMetaNode,
  "titleNode": titleNode,
  "descriptionNode": descriptionNode }}
      }
  
  class abstractQueryNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(undefined, Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {"where" : whereNode,
  "includes" : includesTextNode,
  "doesNotInclude" : doesNotIncludeTextNode,
  "missing" : columnIsMissingNode,
  "notMissing" : columnIsNotMissingNode,
  "matchesRegex" : matchesRegexNode,
  "#" : commentNode}), undefined)
    }
  get keywordCell() {
        return this.getWord(0)
      }
  toPredicate() {
    return () => true
  }
      }
  
  class catchAllErrorNode extends GrammarBackedNode {
        getErrors() { return this._getErrorNodeErrors() }
      }
  
  class blankLineNode extends GrammarBackedNode {
        get blankCell() {
        return this.getWord(0)
      }
  get shouldSerialize() { return false }
      }
  
  class whereNode extends abstractQueryNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get columnNameCell() {
        return this.getWord(1)
      }
  get comparisonCell() {
        return this.getWord(2)
      }
  get numberOrStringCell() {
        return this.getWordsFrom(3)
      }
  toPredicate() {
    const columnName = this.getWord(1)
    const operator = this.getWord(2)
    return file => {
      const value = file.getTypedValue(columnName)
      const valueType = typeof value
      const textQueryValue = this.getWordsFrom(3).join(" ")
      let queryValue = textQueryValue
      if (valueType === "number")
        queryValue = parseFloat(queryValue)
      if (operator === ">")
        return value > queryValue
      if (operator === "<")
        return value < queryValue
      if (operator === "=")
        return value == queryValue
      if (operator === "!=")
        return value != queryValue
      if (operator === "includes")
        return value ? value.includes(queryValue) : false
      if (operator === "doesNotInclude")
        return value ? !value.includes(queryValue) : true
      if (operator === "oneOf")
        return value ? textQueryValue.split(" ").includes(value.toString()) : false
    }
  }
      }
  
  class includesTextNode extends abstractQueryNode {
        get stringCell() {
        return this.getWordsFrom(0)
      }
  toPredicate() {
    const query = (this.content ?? "").toLowerCase()
    return file => file.lowercase.includes(query)
  }
      }
  
  class doesNotIncludeTextNode extends includesTextNode {
        get flip() { return true }
      }
  
  class columnIsMissingNode extends abstractQueryNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get columnNameCell() {
        return this.getWord(1)
      }
  toPredicate() {
    const columnName = this.getWord(1)
    return file => !file.has(columnName.replaceAll(".", " "))
  }
      }
  
  class columnIsNotMissingNode extends columnIsMissingNode {
        get flip() { return true }
      }
  
  class matchesRegexNode extends abstractQueryNode {
        get regexCell() {
        return this.getWordsFrom(0)
      }
  toPredicate() {
    const regex = new RegExp(this.content ?? "")
    return file => regex.test(file.toString())
  }
      }
  
  class commentNode extends GrammarBackedNode {
        createParser() {
    return new TreeNode.Parser(commentNode, undefined, undefined)
    }
  get commentCell() {
        return this.getWord(0)
      }
  get commentCell() {
        return this.getWordsFrom(1)
      }
  get suggestInAutocomplete() { return false }
      }
  
  class abstractModifierNode extends GrammarBackedNode {
        get keywordCell() {
        return this.getWord(0)
      }
      }
  
  class abstractColumnModifierNode extends abstractModifierNode {
        get columnNameCell() {
        return this.getWordsFrom(0)
      }
      }
  
  class selectNode extends abstractColumnModifierNode {
        
      }
  
  class selectAllNode extends abstractColumnModifierNode {
        
      }
  
  class renameNode extends abstractColumnModifierNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get columnNameCell() {
        return this.getWord(1)
      }
  get stringCell() {
        return this.getWord(2)
      }
      }
  
  class sortByNode extends abstractColumnModifierNode {
        
      }
  
  class reverseNode extends abstractModifierNode {
        
      }
  
  class limitNode extends abstractModifierNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get numberCell() {
        return parseFloat(this.getWord(1))
      }
      }
  
  class abstractMetaNode extends GrammarBackedNode {
        get keywordCell() {
        return this.getWord(0)
      }
  get stringCell() {
        return this.getWordsFrom(1)
      }
  get suggestInAutocomplete() { return false }
      }
  
  class titleNode extends abstractMetaNode {
        
      }
  
  class descriptionNode extends abstractMetaNode {
        
      }
  
  window.tqlNode = tqlNode
  }
  
  /*global define:false */
  /**
   * Copyright 2012-2017 Craig Campbell
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * Mousetrap is a simple keyboard shortcut library for Javascript with
   * no external dependencies
   *
   * @version 1.6.5
   * @url craig.is/killing/mice
   */
  (function(window, document, undefined) {
  
      // Check if mousetrap is used inside browser, if not, return
      if (!window) {
          return;
      }
  
      /**
       * mapping of special keycodes to their corresponding keys
       *
       * everything in this dictionary cannot use keypress events
       * so it has to be here to map to the correct keycodes for
       * keyup/keydown events
       *
       * @type {Object}
       */
      var _MAP = {
          8: 'backspace',
          9: 'tab',
          13: 'enter',
          16: 'shift',
          17: 'ctrl',
          18: 'alt',
          20: 'capslock',
          27: 'esc',
          32: 'space',
          33: 'pageup',
          34: 'pagedown',
          35: 'end',
          36: 'home',
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down',
          45: 'ins',
          46: 'del',
          91: 'meta',
          93: 'meta',
          224: 'meta'
      };
  
      /**
       * mapping for special characters so they can support
       *
       * this dictionary is only used incase you want to bind a
       * keyup or keydown event to one of these keys
       *
       * @type {Object}
       */
      var _KEYCODE_MAP = {
          106: '*',
          107: '+',
          109: '-',
          110: '.',
          111 : '/',
          186: ';',
          187: '=',
          188: ',',
          189: '-',
          190: '.',
          191: '/',
          192: '`',
          219: '[',
          220: '\\',
          221: ']',
          222: '\''
      };
  
      /**
       * this is a mapping of keys that require shift on a US keypad
       * back to the non shift equivelents
       *
       * this is so you can use keyup events with these keys
       *
       * note that this will only work reliably on US keyboards
       *
       * @type {Object}
       */
      var _SHIFT_MAP = {
          '~': '`',
          '!': '1',
          '@': '2',
          '#': '3',
          '$': '4',
          '%': '5',
          '^': '6',
          '&': '7',
          '*': '8',
          '(': '9',
          ')': '0',
          '_': '-',
          '+': '=',
          ':': ';',
          '\"': '\'',
          '<': ',',
          '>': '.',
          '?': '/',
          '|': '\\'
      };
  
      /**
       * this is a list of special strings you can use to map
       * to modifier keys when you specify your keyboard shortcuts
       *
       * @type {Object}
       */
      var _SPECIAL_ALIASES = {
          'option': 'alt',
          'command': 'meta',
          'return': 'enter',
          'escape': 'esc',
          'plus': '+',
          'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
      };
  
      /**
       * variable to store the flipped version of _MAP from above
       * needed to check if we should use keypress or not when no action
       * is specified
       *
       * @type {Object|undefined}
       */
      var _REVERSE_MAP;
  
      /**
       * loop through the f keys, f1 to f19 and add them to the map
       * programatically
       */
      for (var i = 1; i < 20; ++i) {
          _MAP[111 + i] = 'f' + i;
      }
  
      /**
       * loop through to map numbers on the numeric keypad
       */
      for (i = 0; i <= 9; ++i) {
  
          // This needs to use a string cause otherwise since 0 is falsey
          // mousetrap will never fire for numpad 0 pressed as part of a keydown
          // event.
          //
          // @see https://github.com/ccampbell/mousetrap/pull/258
          _MAP[i + 96] = i.toString();
      }
  
      /**
       * cross browser add event method
       *
       * @param {Element|HTMLDocument} object
       * @param {string} type
       * @param {Function} callback
       * @returns void
       */
      function _addEvent(object, type, callback) {
          if (object.addEventListener) {
              object.addEventListener(type, callback, false);
              return;
          }
  
          object.attachEvent('on' + type, callback);
      }
  
      /**
       * takes the event and returns the key character
       *
       * @param {Event} e
       * @return {string}
       */
      function _characterFromEvent(e) {
  
          // for keypress events we should return the character as is
          if (e.type == 'keypress') {
              var character = String.fromCharCode(e.which);
  
              // if the shift key is not pressed then it is safe to assume
              // that we want the character to be lowercase.  this means if
              // you accidentally have caps lock on then your key bindings
              // will continue to work
              //
              // the only side effect that might not be desired is if you
              // bind something like 'A' cause you want to trigger an
              // event when capital A is pressed caps lock will no longer
              // trigger the event.  shift+a will though.
              if (!e.shiftKey) {
                  character = character.toLowerCase();
              }
  
              return character;
          }
  
          // for non keypress events the special maps are needed
          if (_MAP[e.which]) {
              return _MAP[e.which];
          }
  
          if (_KEYCODE_MAP[e.which]) {
              return _KEYCODE_MAP[e.which];
          }
  
          // if it is not in the special map
  
          // with keydown and keyup events the character seems to always
          // come in as an uppercase character whether you are pressing shift
          // or not.  we should make sure it is always lowercase for comparisons
          return String.fromCharCode(e.which).toLowerCase();
      }
  
      /**
       * checks if two arrays are equal
       *
       * @param {Array} modifiers1
       * @param {Array} modifiers2
       * @returns {boolean}
       */
      function _modifiersMatch(modifiers1, modifiers2) {
          return modifiers1.sort().join(',') === modifiers2.sort().join(',');
      }
  
      /**
       * takes a key event and figures out what the modifiers are
       *
       * @param {Event} e
       * @returns {Array}
       */
      function _eventModifiers(e) {
          var modifiers = [];
  
          if (e.shiftKey) {
              modifiers.push('shift');
          }
  
          if (e.altKey) {
              modifiers.push('alt');
          }
  
          if (e.ctrlKey) {
              modifiers.push('ctrl');
          }
  
          if (e.metaKey) {
              modifiers.push('meta');
          }
  
          return modifiers;
      }
  
      /**
       * prevents default for this event
       *
       * @param {Event} e
       * @returns void
       */
      function _preventDefault(e) {
          if (e.preventDefault) {
              e.preventDefault();
              return;
          }
  
          e.returnValue = false;
      }
  
      /**
       * stops propogation for this event
       *
       * @param {Event} e
       * @returns void
       */
      function _stopPropagation(e) {
          if (e.stopPropagation) {
              e.stopPropagation();
              return;
          }
  
          e.cancelBubble = true;
      }
  
      /**
       * determines if the keycode specified is a modifier key or not
       *
       * @param {string} key
       * @returns {boolean}
       */
      function _isModifier(key) {
          return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
      }
  
      /**
       * reverses the map lookup so that we can look for specific keys
       * to see what can and can't use keypress
       *
       * @return {Object}
       */
      function _getReverseMap() {
          if (!_REVERSE_MAP) {
              _REVERSE_MAP = {};
              for (var key in _MAP) {
  
                  // pull out the numeric keypad from here cause keypress should
                  // be able to detect the keys from the character
                  if (key > 95 && key < 112) {
                      continue;
                  }
  
                  if (_MAP.hasOwnProperty(key)) {
                      _REVERSE_MAP[_MAP[key]] = key;
                  }
              }
          }
          return _REVERSE_MAP;
      }
  
      /**
       * picks the best action based on the key combination
       *
       * @param {string} key - character for key
       * @param {Array} modifiers
       * @param {string=} action passed in
       */
      function _pickBestAction(key, modifiers, action) {
  
          // if no action was picked in we should try to pick the one
          // that we think would work best for this key
          if (!action) {
              action = _getReverseMap()[key] ? 'keydown' : 'keypress';
          }
  
          // modifier keys don't work as expected with keypress,
          // switch to keydown
          if (action == 'keypress' && modifiers.length) {
              action = 'keydown';
          }
  
          return action;
      }
  
      /**
       * Converts from a string key combination to an array
       *
       * @param  {string} combination like "command+shift+l"
       * @return {Array}
       */
      function _keysFromString(combination) {
          if (combination === '+') {
              return ['+'];
          }
  
          combination = combination.replace(/\+{2}/g, '+plus');
          return combination.split('+');
      }
  
      /**
       * Gets info for a specific key combination
       *
       * @param  {string} combination key combination ("command+s" or "a" or "*")
       * @param  {string=} action
       * @returns {Object}
       */
      function _getKeyInfo(combination, action) {
          var keys;
          var key;
          var i;
          var modifiers = [];
  
          // take the keys from this pattern and figure out what the actual
          // pattern is all about
          keys = _keysFromString(combination);
  
          for (i = 0; i < keys.length; ++i) {
              key = keys[i];
  
              // normalize key names
              if (_SPECIAL_ALIASES[key]) {
                  key = _SPECIAL_ALIASES[key];
              }
  
              // if this is not a keypress event then we should
              // be smart about using shift keys
              // this will only work for US keyboards however
              if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                  key = _SHIFT_MAP[key];
                  modifiers.push('shift');
              }
  
              // if this key is a modifier then add it to the list of modifiers
              if (_isModifier(key)) {
                  modifiers.push(key);
              }
          }
  
          // depending on what the key combination is
          // we will try to pick the best event for it
          action = _pickBestAction(key, modifiers, action);
  
          return {
              key: key,
              modifiers: modifiers,
              action: action
          };
      }
  
      function _belongsTo(element, ancestor) {
          if (element === null || element === document) {
              return false;
          }
  
          if (element === ancestor) {
              return true;
          }
  
          return _belongsTo(element.parentNode, ancestor);
      }
  
      function Mousetrap(targetElement) {
          var self = this;
  
          targetElement = targetElement || document;
  
          if (!(self instanceof Mousetrap)) {
              return new Mousetrap(targetElement);
          }
  
          /**
           * element to attach key events to
           *
           * @type {Element}
           */
          self.target = targetElement;
  
          /**
           * a list of all the callbacks setup via Mousetrap.bind()
           *
           * @type {Object}
           */
          self._callbacks = {};
  
          /**
           * direct map of string combinations to callbacks used for trigger()
           *
           * @type {Object}
           */
          self._directMap = {};
  
          /**
           * keeps track of what level each sequence is at since multiple
           * sequences can start out with the same sequence
           *
           * @type {Object}
           */
          var _sequenceLevels = {};
  
          /**
           * variable to store the setTimeout call
           *
           * @type {null|number}
           */
          var _resetTimer;
  
          /**
           * temporary state where we will ignore the next keyup
           *
           * @type {boolean|string}
           */
          var _ignoreNextKeyup = false;
  
          /**
           * temporary state where we will ignore the next keypress
           *
           * @type {boolean}
           */
          var _ignoreNextKeypress = false;
  
          /**
           * are we currently inside of a sequence?
           * type of action ("keyup" or "keydown" or "keypress") or false
           *
           * @type {boolean|string}
           */
          var _nextExpectedAction = false;
  
          /**
           * resets all sequence counters except for the ones passed in
           *
           * @param {Object} doNotReset
           * @returns void
           */
          function _resetSequences(doNotReset) {
              doNotReset = doNotReset || {};
  
              var activeSequences = false,
                  key;
  
              for (key in _sequenceLevels) {
                  if (doNotReset[key]) {
                      activeSequences = true;
                      continue;
                  }
                  _sequenceLevels[key] = 0;
              }
  
              if (!activeSequences) {
                  _nextExpectedAction = false;
              }
          }
  
          /**
           * finds all callbacks that match based on the keycode, modifiers,
           * and action
           *
           * @param {string} character
           * @param {Array} modifiers
           * @param {Event|Object} e
           * @param {string=} sequenceName - name of the sequence we are looking for
           * @param {string=} combination
           * @param {number=} level
           * @returns {Array}
           */
          function _getMatches(character, modifiers, e, sequenceName, combination, level) {
              var i;
              var callback;
              var matches = [];
              var action = e.type;
  
              // if there are no events related to this keycode
              if (!self._callbacks[character]) {
                  return [];
              }
  
              // if a modifier key is coming up on its own we should allow it
              if (action == 'keyup' && _isModifier(character)) {
                  modifiers = [character];
              }
  
              // loop through all callbacks for the key that was pressed
              // and see if any of them match
              for (i = 0; i < self._callbacks[character].length; ++i) {
                  callback = self._callbacks[character][i];
  
                  // if a sequence name is not specified, but this is a sequence at
                  // the wrong level then move onto the next match
                  if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                      continue;
                  }
  
                  // if the action we are looking for doesn't match the action we got
                  // then we should keep going
                  if (action != callback.action) {
                      continue;
                  }
  
                  // if this is a keypress event and the meta key and control key
                  // are not pressed that means that we need to only look at the
                  // character, otherwise check the modifiers as well
                  //
                  // chrome will not fire a keypress if meta or control is down
                  // safari will fire a keypress if meta or meta+shift is down
                  // firefox will fire a keypress if meta or control is down
                  if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {
  
                      // when you bind a combination or sequence a second time it
                      // should overwrite the first one.  if a sequenceName or
                      // combination is specified in this call it does just that
                      //
                      // @todo make deleting its own method?
                      var deleteCombo = !sequenceName && callback.combo == combination;
                      var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                      if (deleteCombo || deleteSequence) {
                          self._callbacks[character].splice(i, 1);
                      }
  
                      matches.push(callback);
                  }
              }
  
              return matches;
          }
  
          /**
           * actually calls the callback function
           *
           * if your callback function returns false this will use the jquery
           * convention - prevent default and stop propogation on the event
           *
           * @param {Function} callback
           * @param {Event} e
           * @returns void
           */
          function _fireCallback(callback, e, combo, sequence) {
  
              // if this event should not happen stop here
              if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                  return;
              }
  
              if (callback(e, combo) === false) {
                  _preventDefault(e);
                  _stopPropagation(e);
              }
          }
  
          /**
           * handles a character key event
           *
           * @param {string} character
           * @param {Array} modifiers
           * @param {Event} e
           * @returns void
           */
          self._handleKey = function(character, modifiers, e) {
              var callbacks = _getMatches(character, modifiers, e);
              var i;
              var doNotReset = {};
              var maxLevel = 0;
              var processedSequenceCallback = false;
  
              // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
              for (i = 0; i < callbacks.length; ++i) {
                  if (callbacks[i].seq) {
                      maxLevel = Math.max(maxLevel, callbacks[i].level);
                  }
              }
  
              // loop through matching callbacks for this key event
              for (i = 0; i < callbacks.length; ++i) {
  
                  // fire for all sequence callbacks
                  // this is because if for example you have multiple sequences
                  // bound such as "g i" and "g t" they both need to fire the
                  // callback for matching g cause otherwise you can only ever
                  // match the first one
                  if (callbacks[i].seq) {
  
                      // only fire callbacks for the maxLevel to prevent
                      // subsequences from also firing
                      //
                      // for example 'a option b' should not cause 'option b' to fire
                      // even though 'option b' is part of the other sequence
                      //
                      // any sequences that do not match here will be discarded
                      // below by the _resetSequences call
                      if (callbacks[i].level != maxLevel) {
                          continue;
                      }
  
                      processedSequenceCallback = true;
  
                      // keep a list of which sequences were matches for later
                      doNotReset[callbacks[i].seq] = 1;
                      _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                      continue;
                  }
  
                  // if there were no sequence matches but we are still here
                  // that means this is a regular match so we should fire that
                  if (!processedSequenceCallback) {
                      _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                  }
              }
  
              // if the key you pressed matches the type of sequence without
              // being a modifier (ie "keyup" or "keypress") then we should
              // reset all sequences that were not matched by this event
              //
              // this is so, for example, if you have the sequence "h a t" and you
              // type "h e a r t" it does not match.  in this case the "e" will
              // cause the sequence to reset
              //
              // modifier keys are ignored because you can have a sequence
              // that contains modifiers such as "enter ctrl+space" and in most
              // cases the modifier key will be pressed before the next key
              //
              // also if you have a sequence such as "ctrl+b a" then pressing the
              // "b" key will trigger a "keypress" and a "keydown"
              //
              // the "keydown" is expected when there is a modifier, but the
              // "keypress" ends up matching the _nextExpectedAction since it occurs
              // after and that causes the sequence to reset
              //
              // we ignore keypresses in a sequence that directly follow a keydown
              // for the same character
              var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
              if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                  _resetSequences(doNotReset);
              }
  
              _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
          };
  
          /**
           * handles a keydown event
           *
           * @param {Event} e
           * @returns void
           */
          function _handleKeyEvent(e) {
  
              // normalize e.which for key events
              // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
              if (typeof e.which !== 'number') {
                  e.which = e.keyCode;
              }
  
              var character = _characterFromEvent(e);
  
              // no character found then stop
              if (!character) {
                  return;
              }
  
              // need to use === for the character check because the character can be 0
              if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                  _ignoreNextKeyup = false;
                  return;
              }
  
              self.handleKey(character, _eventModifiers(e), e);
          }
  
          /**
           * called to set a 1 second timeout on the specified sequence
           *
           * this is so after each key press in the sequence you have 1 second
           * to press the next key before you have to start over
           *
           * @returns void
           */
          function _resetSequenceTimer() {
              clearTimeout(_resetTimer);
              _resetTimer = setTimeout(_resetSequences, 1000);
          }
  
          /**
           * binds a key sequence to an event
           *
           * @param {string} combo - combo specified in bind call
           * @param {Array} keys
           * @param {Function} callback
           * @param {string=} action
           * @returns void
           */
          function _bindSequence(combo, keys, callback, action) {
  
              // start off by adding a sequence level record for this combination
              // and setting the level to 0
              _sequenceLevels[combo] = 0;
  
              /**
               * callback to increase the sequence level for this sequence and reset
               * all other sequences that were active
               *
               * @param {string} nextAction
               * @returns {Function}
               */
              function _increaseSequence(nextAction) {
                  return function() {
                      _nextExpectedAction = nextAction;
                      ++_sequenceLevels[combo];
                      _resetSequenceTimer();
                  };
              }
  
              /**
               * wraps the specified callback inside of another function in order
               * to reset all sequence counters as soon as this sequence is done
               *
               * @param {Event} e
               * @returns void
               */
              function _callbackAndReset(e) {
                  _fireCallback(callback, e, combo);
  
                  // we should ignore the next key up if the action is key down
                  // or keypress.  this is so if you finish a sequence and
                  // release the key the final key will not trigger a keyup
                  if (action !== 'keyup') {
                      _ignoreNextKeyup = _characterFromEvent(e);
                  }
  
                  // weird race condition if a sequence ends with the key
                  // another sequence begins with
                  setTimeout(_resetSequences, 10);
              }
  
              // loop through keys one at a time and bind the appropriate callback
              // function.  for any key leading up to the final one it should
              // increase the sequence. after the final, it should reset all sequences
              //
              // if an action is specified in the original bind call then that will
              // be used throughout.  otherwise we will pass the action that the
              // next key in the sequence should match.  this allows a sequence
              // to mix and match keypress and keydown events depending on which
              // ones are better suited to the key provided
              for (var i = 0; i < keys.length; ++i) {
                  var isFinal = i + 1 === keys.length;
                  var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                  _bindSingle(keys[i], wrappedCallback, action, combo, i);
              }
          }
  
          /**
           * binds a single keyboard combination
           *
           * @param {string} combination
           * @param {Function} callback
           * @param {string=} action
           * @param {string=} sequenceName - name of sequence if part of sequence
           * @param {number=} level - what part of the sequence the command is
           * @returns void
           */
          function _bindSingle(combination, callback, action, sequenceName, level) {
  
              // store a direct mapped reference for use with Mousetrap.trigger
              self._directMap[combination + ':' + action] = callback;
  
              // make sure multiple spaces in a row become a single space
              combination = combination.replace(/\s+/g, ' ');
  
              var sequence = combination.split(' ');
              var info;
  
              // if this pattern is a sequence of keys then run through this method
              // to reprocess each pattern one key at a time
              if (sequence.length > 1) {
                  _bindSequence(combination, sequence, callback, action);
                  return;
              }
  
              info = _getKeyInfo(combination, action);
  
              // make sure to initialize array if this is the first time
              // a callback is added for this key
              self._callbacks[info.key] = self._callbacks[info.key] || [];
  
              // remove an existing match if there is one
              _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);
  
              // add this call back to the array
              // if it is a sequence put it at the beginning
              // if not put it at the end
              //
              // this is important because the way these are processed expects
              // the sequence ones to come first
              self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                  callback: callback,
                  modifiers: info.modifiers,
                  action: info.action,
                  seq: sequenceName,
                  level: level,
                  combo: combination
              });
          }
  
          /**
           * binds multiple combinations to the same callback
           *
           * @param {Array} combinations
           * @param {Function} callback
           * @param {string|undefined} action
           * @returns void
           */
          self._bindMultiple = function(combinations, callback, action) {
              for (var i = 0; i < combinations.length; ++i) {
                  _bindSingle(combinations[i], callback, action);
              }
          };
  
          // start!
          _addEvent(targetElement, 'keypress', _handleKeyEvent);
          _addEvent(targetElement, 'keydown', _handleKeyEvent);
          _addEvent(targetElement, 'keyup', _handleKeyEvent);
      }
  
      /**
       * binds an event to mousetrap
       *
       * can be a single key, a combination of keys separated with +,
       * an array of keys, or a sequence of keys separated by spaces
       *
       * be sure to list the modifier keys first to make sure that the
       * correct key ends up getting bound (the last key in the pattern)
       *
       * @param {string|Array} keys
       * @param {Function} callback
       * @param {string=} action - 'keypress', 'keydown', or 'keyup'
       * @returns void
       */
      Mousetrap.prototype.bind = function(keys, callback, action) {
          var self = this;
          keys = keys instanceof Array ? keys : [keys];
          self._bindMultiple.call(self, keys, callback, action);
          return self;
      };
  
      /**
       * unbinds an event to mousetrap
       *
       * the unbinding sets the callback function of the specified key combo
       * to an empty function and deletes the corresponding key in the
       * _directMap dict.
       *
       * TODO: actually remove this from the _callbacks dictionary instead
       * of binding an empty function
       *
       * the keycombo+action has to be exactly the same as
       * it was defined in the bind method
       *
       * @param {string|Array} keys
       * @param {string} action
       * @returns void
       */
      Mousetrap.prototype.unbind = function(keys, action) {
          var self = this;
          return self.bind.call(self, keys, function() {}, action);
      };
  
      /**
       * triggers an event that has already been bound
       *
       * @param {string} keys
       * @param {string=} action
       * @returns void
       */
      Mousetrap.prototype.trigger = function(keys, action) {
          var self = this;
          if (self._directMap[keys + ':' + action]) {
              self._directMap[keys + ':' + action]({}, keys);
          }
          return self;
      };
  
      /**
       * resets the library back to its initial state.  this is useful
       * if you want to clear out the current keyboard shortcuts and bind
       * new ones - for example if you switch to another page
       *
       * @returns void
       */
      Mousetrap.prototype.reset = function() {
          var self = this;
          self._callbacks = {};
          self._directMap = {};
          return self;
      };
  
      /**
       * should we stop this event before firing off callbacks
       *
       * @param {Event} e
       * @param {Element} element
       * @return {boolean}
       */
      Mousetrap.prototype.stopCallback = function(e, element) {
          var self = this;
  
          // if the element has the class "mousetrap" then no need to stop
          if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
              return false;
          }
  
          if (_belongsTo(element, self.target)) {
              return false;
          }
  
          // Events originating from a shadow DOM are re-targetted and `e.target` is the shadow host,
          // not the initial event target in the shadow tree. Note that not all events cross the
          // shadow boundary.
          // For shadow trees with `mode: 'open'`, the initial event target is the first element in
          // the event’s composed path. For shadow trees with `mode: 'closed'`, the initial event
          // target cannot be obtained.
          if ('composedPath' in e && typeof e.composedPath === 'function') {
              // For open shadow trees, update `element` so that the following check works.
              var initialEventTarget = e.composedPath()[0];
              if (initialEventTarget !== e.target) {
                  element = initialEventTarget;
              }
          }
  
          // stop for input, select, and textarea
          return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
      };
  
      /**
       * exposes _handleKey publicly so it can be overwritten by extensions
       */
      Mousetrap.prototype.handleKey = function() {
          var self = this;
          return self._handleKey.apply(self, arguments);
      };
  
      /**
       * allow custom key mappings
       */
      Mousetrap.addKeycodes = function(object) {
          for (var key in object) {
              if (object.hasOwnProperty(key)) {
                  _MAP[key] = object[key];
              }
          }
          _REVERSE_MAP = null;
      };
  
      /**
       * Init the global mousetrap functions
       *
       * This method is needed to allow the global mousetrap functions to work
       * now that mousetrap is a constructor function.
       */
      Mousetrap.init = function() {
          var documentMousetrap = Mousetrap(document);
          for (var method in documentMousetrap) {
              if (method.charAt(0) !== '_') {
                  Mousetrap[method] = (function(method) {
                      return function() {
                          return documentMousetrap[method].apply(documentMousetrap, arguments);
                      };
                  } (method));
              }
          }
      };
  
      Mousetrap.init();
  
      // expose mousetrap to the global object
      window.Mousetrap = Mousetrap;
  
      // expose as a common js module
      if (typeof module !== 'undefined' && module.exports) {
          module.exports = Mousetrap;
      }
  
      // expose mousetrap as an AMD module
      if (typeof define === 'function' && define.amd) {
          define(function() {
              return Mousetrap;
          });
      }
  }) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);
  ;
  
  // This file has been modified by me! - Breck
  // It is not a straight copy paste.
  // There is no documentation of what I have changed. Who does this?!!!! Breck is fired.
  // Todo: cleanup
  ;(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
      ? (module.exports = factory())
      : typeof define === "function" && define.amd
      ? define(factory)
      : ((global =
          typeof globalThis !== "undefined" ? globalThis : global || self),
        (global.autocomplete = factory()))
  })(this, function() {
    "use strict"
  
    /*
     * https://github.com/kraaden/autocomplete
     * Copyright (c) 2016 Denys Krasnoshchok
     * MIT License
     */
    function autocomplete(settings) {
      // just an alias to minimize JS file size
      var doc = document
      var container = settings.container || doc.createElement("div")
      var containerStyle = container.style
      var userAgent = navigator.userAgent
      var mobileFirefox =
        ~userAgent.indexOf("Firefox") && ~userAgent.indexOf("Mobile")
      var debounceWaitMs = settings.debounceWaitMs || 0
      var preventSubmit = settings.preventSubmit || false
      var disableAutoSelect = settings.disableAutoSelect || false
      // 'keyup' event will not be fired on Mobile Firefox, so we have to use 'input' event instead
      var keyUpEventName = mobileFirefox ? "input" : "keyup"
      var items = []
      var inputValue = ""
      var minLen = 2
      var showOnFocus = settings.showOnFocus
      var selected
      var keypressCounter = 0
      var debounceTimer
      if (settings.minLength !== undefined) {
        minLen = settings.minLength
      }
      if (!settings.input) {
        throw new Error("input undefined")
      }
      var input = settings.input
      container.className = "autocomplete " + (settings.className || "")
      // IOS implementation for fixed positioning has many bugs, so we will use absolute positioning
      containerStyle.position = "absolute"
      /**
       * Detach the container from DOM
       */
      function detach() {
        var parent = container.parentNode
        if (parent) {
          parent.removeChild(container)
        }
      }
      /**
       * Clear debouncing timer if assigned
       */
      function clearDebounceTimer() {
        if (debounceTimer) {
          window.clearTimeout(debounceTimer)
        }
      }
      /**
       * Attach the container to DOM
       */
      function attach() {
        if (!container.parentNode) {
          doc.body.appendChild(container)
        }
      }
      /**
       * Check if container for autocomplete is displayed
       */
      function containerDisplayed() {
        return !!container.parentNode
      }
      /**
       * Clear autocomplete state and hide container
       */
      function clear() {
        // prevent the update call if there are pending AJAX requests
        keypressCounter++
        items = []
        inputValue = ""
        selected = undefined
        detach()
      }
      /**
       * Update autocomplete position
       */
      function updatePosition() {
        if (!containerDisplayed()) {
          return
        }
        containerStyle.height = "auto"
        containerStyle.width = input.offsetWidth + "px"
        var maxHeight = 0
        var inputRect
        function calc() {
          var docEl = doc.documentElement
          var clientTop = docEl.clientTop || doc.body.clientTop || 0
          var clientLeft = docEl.clientLeft || doc.body.clientLeft || 0
          var scrollTop = window.pageYOffset || docEl.scrollTop
          var scrollLeft = window.pageXOffset || docEl.scrollLeft
          inputRect = input.getBoundingClientRect()
          var top = inputRect.top + input.offsetHeight + scrollTop - clientTop
          var left = inputRect.left + scrollLeft - clientLeft
          containerStyle.top = top + "px"
          containerStyle.left = left + "px"
          maxHeight = window.innerHeight - (inputRect.top + input.offsetHeight)
          if (maxHeight < 0) {
            maxHeight = 0
          }
          containerStyle.top = top + "px"
          containerStyle.bottom = ""
          containerStyle.left = left + "px"
          containerStyle.maxHeight = maxHeight + "px"
        }
        // the calc method must be called twice, otherwise the calculation may be wrong on resize event (chrome browser)
        calc()
        calc()
        if (settings.customize && inputRect) {
          settings.customize(input, inputRect, container, maxHeight)
        }
      }
      /**
       * Redraw the autocomplete div element with suggestions
       */
      function update() {
        // delete all children from autocomplete DOM container
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }
        const ITEM_TAG = "a" // our addition
        // function for rendering autocomplete suggestions
        const render = function(item, currentValue) {
          const itemElement = doc.createElement(ITEM_TAG)
          itemElement.textContent = item.label || ""
          itemElement.href = item.url
          return itemElement
        }
        if (settings.render) {
          render = settings.render
        }
        // function to render autocomplete groups
        var renderGroup = function(groupName, currentValue) {
          var groupDiv = doc.createElement("div")
          groupDiv.textContent = groupName
          return groupDiv
        }
        if (settings.renderGroup) {
          renderGroup = settings.renderGroup
        }
        var fragment = doc.createDocumentFragment()
        var prevGroup = "#9?$"
        items.forEach(function(item) {
          if (item.group && item.group !== prevGroup) {
            prevGroup = item.group
            var groupDiv = renderGroup(item.group, inputValue)
            if (groupDiv) {
              groupDiv.className += " group"
              fragment.appendChild(groupDiv)
            }
          }
          var div = render(item, inputValue)
          if (div) {
            div.addEventListener("click", function(ev) {
              settings.onSelect(item, input)
              clear()
              ev.preventDefault()
              ev.stopPropagation()
            })
            if (item === selected) {
              div.className += " selected"
            }
            fragment.appendChild(div)
          }
        })
        container.appendChild(fragment)
        if (items.length < 1) {
          if (settings.emptyMsg) {
            var empty = doc.createElement(ITEM_TAG)
            empty.className = "empty"
            empty.textContent = settings.emptyMsg
            empty.href = "/fullTextSearch?q=" + encodeURIComponent(input.value)
            container.appendChild(empty)
          } else {
            clear()
            return
          }
        }
        attach()
        updatePosition()
        updateScroll()
      }
      function updateIfDisplayed() {
        if (containerDisplayed()) {
          update()
        }
      }
      function resizeEventHandler() {
        updateIfDisplayed()
      }
      function scrollEventHandler(e) {
        if (e.target !== container) {
          updateIfDisplayed()
        } else {
          e.preventDefault()
        }
      }
      function keyupEventHandler(ev) {
        var keyCode = ev.which || ev.keyCode || 0
        var ignore = settings.keysToIgnore || [
          38 /* Up */,
          13 /* Enter */,
          27 /* Esc */,
          39 /* Right */,
          37 /* Left */,
          16 /* Shift */,
          17 /* Ctrl */,
          18 /* Alt */,
          20 /* CapsLock */,
          91 /* WindowsKey */,
          9 /* Tab */
        ]
        for (var _i = 0, ignore_1 = ignore; _i < ignore_1.length; _i++) {
          var key = ignore_1[_i]
          if (keyCode === key) {
            return
          }
        }
        if (
          keyCode >= 112 /* F1 */ &&
          keyCode <= 123 /* F12 */ &&
          !settings.keysToIgnore
        ) {
          return
        }
        // the down key is used to open autocomplete
        if (keyCode === 40 /* Down */ && containerDisplayed()) {
          return
        }
        startFetch(0 /* Keyboard */)
      }
      /**
       * Automatically move scroll bar if selected item is not visible
       */
      function updateScroll() {
        var elements = container.getElementsByClassName("selected")
        if (elements.length > 0) {
          var element = elements[0]
          // make group visible
          var previous = element.previousElementSibling
          if (
            previous &&
            previous.className.indexOf("group") !== -1 &&
            !previous.previousElementSibling
          ) {
            element = previous
          }
          if (element.offsetTop < container.scrollTop) {
            container.scrollTop = element.offsetTop
          } else {
            var selectBottom = element.offsetTop + element.offsetHeight
            var containerBottom = container.scrollTop + container.offsetHeight
            if (selectBottom > containerBottom) {
              container.scrollTop += selectBottom - containerBottom
            }
          }
        }
      }
      /**
       * Select the previous item in suggestions
       */
      function selectPrev() {
        if (items.length < 1) {
          selected = undefined
        } else {
          if (selected === items[0]) {
            selected = items[items.length - 1]
          } else {
            for (var i = items.length - 1; i > 0; i--) {
              if (selected === items[i] || i === 1) {
                selected = items[i - 1]
                break
              }
            }
          }
        }
      }
      /**
       * Select the next item in suggestions
       */
      function selectNext() {
        if (items.length < 1) {
          selected = undefined
        }
        if (!selected || selected === items[items.length - 1]) {
          selected = items[0]
          return
        }
        for (var i = 0; i < items.length - 1; i++) {
          if (selected === items[i]) {
            selected = items[i + 1]
            break
          }
        }
      }
      function keydownEventHandler(ev) {
        var keyCode = ev.which || ev.keyCode || 0
        if (
          keyCode === 38 /* Up */ ||
          keyCode === 40 /* Down */ ||
          keyCode === 27 /* Esc */
        ) {
          var containerIsDisplayed = containerDisplayed()
          if (keyCode === 27 /* Esc */) {
            clear()
          } else {
            if (!containerIsDisplayed || items.length < 1) {
              return
            }
            keyCode === 38 /* Up */ ? selectPrev() : selectNext()
            update()
          }
          ev.preventDefault()
          if (containerIsDisplayed) {
            ev.stopPropagation()
          }
          return
        }
        if (keyCode === 13 /* Enter */) {
          if (selected) {
            settings.onSelect(selected, input)
            clear()
          }
          if (preventSubmit) {
            ev.preventDefault()
          }
        }
      }
      function focusEventHandler() {
        if (showOnFocus) {
          startFetch(1 /* Focus */)
        }
      }
      function startFetch(trigger) {
        // If multiple keys were pressed, before we get an update from server,
        // this may cause redrawing autocomplete multiple times after the last key was pressed.
        // To avoid this, the number of times keyboard was pressed will be saved and checked before redraw.
        var savedKeypressCounter = ++keypressCounter
        var inputText = input.value
        var cursorPos = input.selectionStart || 0
        if (inputText.length >= minLen || trigger === 1 /* Focus */) {
          clearDebounceTimer()
          debounceTimer = window.setTimeout(
            function() {
              settings.fetch(
                inputText,
                function(elements) {
                  if (keypressCounter === savedKeypressCounter && elements) {
                    items = elements
                    inputValue = inputText
                    selected =
                      items.length < 1 || disableAutoSelect ? undefined : items[0]
                    update()
                  }
                },
                trigger,
                cursorPos
              )
            },
            trigger === 0 /* Keyboard */ ? debounceWaitMs : 0
          )
        } else {
          clear()
        }
      }
      function blurEventHandler() {
        // we need to delay clear, because when we click on an item, blur will be called before click and remove items from DOM
        setTimeout(function() {
          if (doc.activeElement !== input) {
            clear()
          }
        }, 200)
      }
      /**
       * Fixes #26: on long clicks focus will be lost and onSelect method will not be called
       */
      container.addEventListener("mousedown", function(evt) {
        evt.stopPropagation()
        evt.preventDefault()
      })
      /**
       * Fixes #30: autocomplete closes when scrollbar is clicked in IE
       * See: https://stackoverflow.com/a/9210267/13172349
       */
      container.addEventListener("focus", function() {
        return input.focus()
      })
      /**
       * This function will remove DOM elements and clear event handlers
       */
      function destroy() {
        input.removeEventListener("focus", focusEventHandler)
        input.removeEventListener("keydown", keydownEventHandler)
        input.removeEventListener(keyUpEventName, keyupEventHandler)
        input.removeEventListener("blur", blurEventHandler)
        window.removeEventListener("resize", resizeEventHandler)
        doc.removeEventListener("scroll", scrollEventHandler, true)
        clearDebounceTimer()
        clear()
      }
      // setup event handlers
      input.addEventListener("keydown", keydownEventHandler)
      input.addEventListener(keyUpEventName, keyupEventHandler)
      input.addEventListener("blur", blurEventHandler)
      input.addEventListener("focus", focusEventHandler)
      window.addEventListener("resize", resizeEventHandler)
      doc.addEventListener("scroll", scrollEventHandler, true)
      return {
        destroy: destroy
      }
    }
  
    return autocomplete
  })
  //# sourceMappingURL=autocomplete.js.map
  ;
  
  const genDefaultAuthor = () => {
      let user = "region.platform.vendor"
      try {
          const region = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""
          const platform =
              navigator.userAgentData?.platform ?? navigator.platform ?? ""
          const vendor = navigator.vendor ?? ""
          // make sure email address is not too long. i think 64 is the limit.
          // so here length is max 45 + 7 + 4 + 4.
          user = [region, platform, vendor]
              .map(str => str.replace(/[^a-zA-Z]/g, "").substr(0, 15))
              .join(".")
      } catch (err) {
          console.error(err)
      }
      const hash = Utils.getRandomCharacters(7)
      return `Anon <${`anon.${user}.${hash}`}@pldb.com>`
  }
  const STAGED_KEY = "staged"
  const TEXTAREA_ID = "fileContent"
  
  let autocompleteIndex = false
  let autocompleteIndexRequestMade = false
  
  const SearchSuggestionInterface = {
      label: "string",
      appeared: "number",
      id: "string",
      url: "string"
  }
  
  const tinyTypeScript = (items, expectedInterface) =>
      items.forEach(item => {
          Object.keys(item).forEach(key => {
              const value = item[key]
              const actualType = typeof item[key]
              const expectedType = expectedInterface[key]
              const passed = actualType === expectedType
              console.assert(passed)
              if (!passed)
                  console.error(
                      `For key '${key}' object had type '${actualType}' but expected '${expectedType}'. Value was '${value}'`
                  )
          })
      })
  
  // This method is currently used to enable autocomplete on: the header search, front page search, 404 page search
  const initSearchAutocomplete = elementId => {
      const input = document.getElementById(elementId)
      const urlParams = new URLSearchParams(window.location.search)
      const query = urlParams.get("q")
      if (query) input.value = query
      autocomplete({
          input,
          minLength: 1,
          emptyMsg: "No matching entities found",
          preventSubmit: true,
          fetch: async (query, update) => {
              text = query.toLowerCase()
              // you can also use AJAX requests instead of preloaded data
  
              if (!autocompleteIndexRequestMade) {
                  autocompleteIndexRequestMade = true
                  let response = await fetch("/dist/autocomplete.json")
                  if (response.ok) autocompleteIndex = await response.json()
              }
  
              const suggestions = autocompleteIndex.filter(entity =>
                  entity.label.toLowerCase().startsWith(text)
              )
  
              const htmlEncodedQuery = query.replace(/</g, "&lt;")
  
              suggestions.push({
                  label: `Full text search for "${htmlEncodedQuery}"`,
                  appeared: 2022,
                  id: "",
                  url: `/fullTextSearch?q=${htmlEncodedQuery}`
              })
              tinyTypeScript(suggestions, SearchSuggestionInterface)
  
              update(suggestions)
          },
          onSelect: item => {
              const { url, id } = item
              if (id) window.location = url
              else
                  window.location = "/fullTextSearch?q=" + encodeURIComponent(input.value)
          }
      })
  }
  
  class TrueBaseFrontEndApp {
      constructor() {
          window.app = this
      }
  
      defaultAuthor = genDefaultAuthor()
  
      get author() {
          try {
              return this.store.getItem("author") || this.defaultAuthor
          } catch (err) {
              console.error(err)
          }
  
          return this.defaultAuthor
      }
  
      renderSearchPage() {
          this.startTQLCodeMirror()
      }
  
      async startTQLCodeMirror() {
          this.programCompiler = tqlNode
          this.codeMirrorInstance = new GrammarCodeMirrorMode(
              "custom",
              () => tqlNode,
              undefined,
              CodeMirror
          )
              .register()
              .fromTextAreaWithAutocomplete(document.getElementById("tqlInput"), {
                  lineWrapping: false,
                  lineNumbers: false
              })
  
          this.codeMirrorInstance.setSize(400, 100)
          this.codeMirrorInstance.setValue(
              (new URLSearchParams(window.location.search).get("q") || "").replace(
                  /\r/g,
                  ""
              )
          )
          this.codeMirrorInstance.on("keyup", () => this._onCodeKeyUp())
      }
  
      _onCodeKeyUp() {
          const code = this.value
          if (this._code === code) return
          this._code = code
          this.program = new this.programCompiler(code)
          const errs = this.program.scopeErrors.concat(this.program.getAllErrors())
  
          const errMessage = errs.length
              ? errs.map(err => err.getMessage()).join(" ")
              : "&nbsp;"
          document.getElementById("tqlErrors").innerHTML = errMessage
      }
  
      async renderEditPage() {
          this.renderCodeEditorStuff()
          await this.initEditData()
          this.updateQuickLinks()
      }
  
      renderCreatePage() {
          this.renderCodeEditorStuff()
          document.getElementById(
              "exampleSection"
          ).innerHTML = `Example:<br><pre>title Elixir
  appeared 2011
  type pl
  creators José Valim
  website https://elixir-lang.org/
  githubRepo https://github.com/elixir-lang/elixir</pre>`
      }
  
      renderCodeEditorStuff() {
          this.renderForm()
          this.startPLDBCodeMirror()
          this.bindStageButton()
          this.updateStagedStatus()
          this.updateAuthor()
      }
  
      async initEditData(currentValue, missingRecommendedColumns) {
          const { filename, currentFileId } = this
          const localValue = this.stagedFiles.getNode(filename)
          let response = await fetch(`/edit.json?id=${currentFileId}`)
          const data = await response.json()
  
          if (data.error)
              return (document.getElementById("formHolder").innerHTML = data.error)
  
          document.getElementById(
              "pageTitle"
          ).innerHTML = `Editing file <i>${filename}</i>`
  
          document.addEventListener("keydown", function(event) {
              if (document.activeElement !== document.body) return
              if (event.key === "ArrowLeft")
                  window.location = `edit.html?id=` + data.previous
              else if (event.key === "ArrowRight")
                  window.location = `edit.html?id=` + data.next
          })
  
          this.codeMirrorInstance.setValue(
              localValue ? localValue.childrenToString() : data.content
          )
          document.getElementById(
              "missingRecommendedColumns"
          ).innerHTML = `<br><b>Missing columns:</b><br>${data.missingRecommendedColumns
              .map(col => col.Column)
              .join("<br>")}`
      }
  
      updateStagedStatus() {
          const el = document.getElementById("stagedStatus")
          const { stagedFiles } = this
          el.style.display = "none"
          if (!stagedFiles.length) return
          document.getElementById("patch").value = stagedFiles.toString()
          el.style.display = "block"
      }
  
      bindStageButton() {
          const el = document.getElementById("stageButton")
          el.onclick = () => {
              const tree = this.stagedFiles
              tree.touchNode(this.filename).setChildren(this.value)
              this.setStage(tree.toString())
              this.updateStagedStatus()
          }
  
          Mousetrap.bind("mod+s", evt => {
              el.click()
              evt.preventDefault()
              return false
          })
      }
  
      setStage(str) {
          this.store.setItem(STAGED_KEY, str)
          document.getElementById("patch").value = str
      }
  
      get stagedFiles() {
          const str = this.store.getItem(STAGED_KEY)
          return str ? new TreeNode(str) : new TreeNode()
      }
  
      renderForm() {
          document.getElementById(
              "formHolder"
          ).innerHTML = `<form method="POST" action="/saveCommitAndPush" id="stagedStatus" style="display: none;">
   <div>You have a patch ready to submit. Author is set as: <span id="authorLabel" class="linkButton" onClick="app.changeAuthor()"></span></div>
   <textarea id="patch" name="patch" readonly></textarea><br>
   <input type="hidden" name="author" id="author" />
   <input type="submit" value="Commit and push" id="saveCommitAndPushButton" onClick="app.saveAuthorIfUnsaved()"/> <a class="linkButton" onClick="app.clearChanges()">Clear local changes</a>
  </form>
  <div id="editForm">
   <div class="cell" id="leftCell">
     <textarea id="${TEXTAREA_ID}"></textarea>
     <div id="tqlErrors"></div> <!-- todo: cleanup. -->
   </div>
   <div class="cell">
     <div id="quickLinks"></div>
     <div id="missingRecommendedColumns"></div>
     <div id="exampleSection"></div>
   </div>
   <div>
     <button id="stageButton">Stage</button>
   </div>
  </div>`
      }
  
      clearChanges() {
          if (
              confirm(
                  "Are you sure you want to delete all local changes? This cannot be undone."
              )
          )
              this.setStage("")
          this.updateStagedStatus()
      }
  
      async startPLDBCodeMirror() {
          this.programCompiler = pldbNode
          this.codeMirrorInstance = new GrammarCodeMirrorMode(
              "custom",
              () => pldbNode,
              undefined,
              CodeMirror
          )
              .register()
              .fromTextAreaWithAutocomplete(document.getElementById(TEXTAREA_ID), {
                  lineWrapping: false,
                  lineNumbers: true
              })
  
          this.codeMirrorInstance.setSize(this.codeMirrorWidth, 500)
          this.codeMirrorInstance.on("keyup", () => this._onCodeKeyUp())
      }
  
      get currentFileId() {
          return new URLSearchParams(window.location.search).get("id")
      }
  
      get filename() {
          if (location.pathname.includes("create.html")) return "create"
          return this.currentFileId + ".pldb"
      }
  
      get value() {
          return this.codeMirrorInstance.getValue()
      }
  
      get codeMirrorWidth() {
          return document.getElementById("leftCell").width
      }
  
      updateAuthor() {
          document.getElementById("authorLabel").innerHTML = Utils.htmlEscaped(
              this.author
          )
          document.getElementById("author").value = this.author
      }
  
      get store() {
          return window.localStorage
      }
  
      saveAuthorIfUnsaved() {
          try {
              if (!this.store.getItem("author")) this.saveAuthor(this.defaultAuthor)
          } catch (err) {
              console.error(err)
          }
      }
  
      saveAuthor(name) {
          try {
              this.store.setItem("author", name)
          } catch (err) {
              console.error(err)
          }
      }
  
      changeAuthor() {
          const newValue = prompt(
              `Enter author name and email formatted like "Breck Yunits <by@breckyunits.com>". This information is recorded in the public Git log.`,
              this.author
          )
          if (newValue === "") this.saveAuthor(this.defaultAuthor)
          if (newValue) this.saveAuthor(newValue)
          this.updateAuthor()
      }
  
      get route() {
          return location.pathname.split("/")[1]
      }
  
      updateQuickLinks() {
          const code = this.codeMirrorInstance.getValue()
          if (!code) return
          const tree = new TreeNode(code)
          const title = tree.get("title")
          const references = tree
              .findNodes("reference")
              .map(node => "Reference: " + node.content)
  
          const links = ["website", "githubRepo", "wikipedia"]
              .filter(key => tree.has(key))
              .map(key => `${Utils.capitalizeFirstLetter(key)}: ${tree.get(key)}`)
  
          const permalink = this.route
          document.getElementById("quickLinks").innerHTML =
              Utils.linkify(`<b>PLDB on ${title}:</b><br>
  Git: https://github.com/breck7/pldb/blob/main/truebase/things/${permalink}.pldb<br>
  HTML page: https://pldb.com/truebase/${permalink}.html
  <br><br>
  <b>Links about ${title}:</b><br>
  ${links.join("<br>")}
  ${references.join("<br>")}<br><br>
  
  <b>Search for more information about ${title}:</b><br>
  Google: https://www.google.com/search?q=${title}+programming+language<br>
  Google w/time: https://www.google.com/search?q=${title}+programming+language&tbs=cdr%3A1%2Ccd_min%3A1%2F1%2F1980%2Ccd_max%3A12%2F31%2F1995&tbm=<br>
  Google Scholar: https://scholar.google.com/scholar?q=${title}<br>
  Google Groups: https://groups.google.com/forum/#!search/${title}<br>
  Google Trends: https://trends.google.com/trends/explore?date=all&q=${title}<br>
  DDG: https://duckduckgo.com/?q=${title}<br>`) +
              `Wayback Machine: <a target="_blank" href="https://web.archive.org/web/20220000000000*/${title}">https://web.archive.org/web/20220000000000*/${title}</a>`
      }
  }
  
  document.addEventListener("DOMContentLoaded", evt =>
      initSearchAutocomplete("headerSearch")
  )
  