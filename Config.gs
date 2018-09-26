// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - TODO
/* jshint asi: true */

(function() {"use strict"})()

// Code review all files - TODO
// JSHint review (see files) - TODO
// Unit Tests - TODO
// System Test (Dev) - TODO
// System Test (Prod) - TODO

// Config.gs
// =========
//
// Dev: AndrewRoberts.net
//
// All the constants and configuration settings

// Configuration
// =============

var SCRIPT_NAME = "CloudFire"
var SCRIPT_VERSION = "v0.1"

var PRODUCTION_VERSION_ = true

// var TEMPLATE_FOLDER_ID_ = '1sY-8EfiejACOQjfHneCqdFDmOsC4_t4V' // TestClient1
// var TEMPLATE_FOLDER_ID_ = '1Vs45K7yA6e8xX6QLxgJ5K8xWTzEjmXyT' // Non-Shared Folder + File Tree
var TEMPLATE_FOLDER_ID_ = '10PBmG9N_cT07YJb8bUEduQRqSs0IteBV' // Staff_Data_Folder_Tree

// var CLIENT_FOLDER_ID_ = '1CUCYOl6WCYiwRvoOocmw8V6Jwci_W67j' // Folders_Template
var CLIENT_FOLDER_ID_ = '1FlXJFEiUmdmWKwqPftutKj6raDYo3WSx' // TestClient5

// Log Library
// -----------

var DEBUG_LOG_LEVEL_ = PRODUCTION_VERSION_ ? BBLog.Level.INFO : BBLog.Level.FINER
var DEBUG_LOG_DISPLAY_FUNCTION_NAMES_ = PRODUCTION_VERSION_ ? BBLog.DisplayFunctionNames.NO : BBLog.DisplayFunctionNames.YES

// Assert library
// --------------

var SEND_ERROR_EMAIL_ = PRODUCTION_VERSION_ ? true : false
var HANDLE_ERROR_ = Assert.HandleError.THROW
var ADMIN_EMAIL_ADDRESS_ = ''

// Tests
// -----
// Should all be true for production

var TEST_CREATE_TRIGGERS_              = false
var TEST_DO_NOT_USE_TEST_FOLDER_TREE_  = true
var TEST_DO_NOT_TIMESTAMP_DEST_FOLDER_ = true
var TEST_COPY_FOLDERS_                 = true
var TEST_SEND_CONF_EMAIL_              = false

//if (PRODUCTION_VERSION_) {
//  if (!TEST_CREATE_TRIGGERS_) {
//    throw new Errors('Test flags set in production version')
//  }
//}

// Constants/Enums
// ===============

var FILES = {
  'Promotion_Deadlines_Calendar' : 'PROMOTION_DEADLINES_CALENDAR_ID',
  'Staff_Data'                   : 'STAFF_DATA_SHEET_ID',
}

var FOLDERS = {
  'Staff' : 'STAFF_FOLDER_ID',
}

// Function Template
// -----------------

/**
 *
 *
 * @param {object} 
 *
 * @return {object}
 */
/* 
function functionTemplate() {

  Log_.functionEntryPoint()
  
  

} // functionTemplate() 
*/