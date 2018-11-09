// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - TODO
/* jshint asi: true */

(function() {"use strict"})()

// Utils_.gs
// =========
//
// Object template

var Utils_ = (function(ns) {

  /**
   * Get File/Folder List from GSheet
   *
   * @return {object} list
   */

  ns.getList = function(sheetName) {
  
    Log_.functionEntryPoint() 
    var data = SpreadsheetApp.getActive().getSheetByName(sheetName).getDataRange().getValues()
    data.shift() // Remove header
    var list = {}
    data.forEach(function(row) {
      list[row[0]] = row[1]
    })
    return list;
    
  } // Utils_.getList()
  
  /**
   * Extract the name before the version number: "[chars] v[number].[number]" => "[chars]"
   *
   * @param {string} input
   *
   * @return {string} filename
   */
  
  ns.getFilename = function(input) {
  
    input = input.trim()
    var output = ''
    var inputLength = input.length
    
    for (var charIndex = 0; charIndex < inputLength; charIndex++) {
    
      var nextChar = input[charIndex]
      
      if (nextChar === ' ') {
      
        var charAfterSpace = input[charIndex + 1]
      
        if (charAfterSpace === 'v') {
          
          // Check for a number after the 'v'
          var numberOffset = charIndex + 2
          var nextNumber = parseInt(input.slice(numberOffset))
          
          if (!isNaN(nextNumber)) {
  
            // Check for a dot after the number
            
            var numberLength = nextNumber.toString().length
            var dotOffset = numberOffset + numberLength
            
            if (input[dotOffset] !== '.') {          
              output += nextChar
              continue          
            }
          
            // Found the dot, so check for a number after it 
            numberOffset = dotOffset + 1
            nextNumber = parseInt(input.slice(numberOffset))
            
            if (!isNaN(nextNumber)) {
     
              // Found v[number].[number] so stop search
              break
              
            } else {
            
              // No number after "v[number]."
              output += nextChar
            }
            
          } else { 
          
            // No number after 'v'       
            output += nextChar
          }
        
        } else { 
        
          // Not a 'v'
          output += nextChar
        }
      
      } else {
        // Not a space
        output += nextChar
      }
      
    }
    
    return output
    
  } // Utils_.getFilename()
  
  return ns

})(Utils_ || {})