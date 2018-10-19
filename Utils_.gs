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
  
    Log_.functionEntryPoint();    
    var data = SpreadsheetApp.getActive().getSheetByName(sheetName).getDataRange().getValues();
    data.shift(); // Remove header
    var list = {};
    data.forEach(function(row) {
      list[row[0]] = row[1];
    })
    return list;
    
  } // Utils_.getList()

  return ns

})(Utils_ || {})