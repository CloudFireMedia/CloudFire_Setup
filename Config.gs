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
// All the constants and configuration settings

// Configuration
// =============

var SCRIPT_NAME = "CloudFire"
var SCRIPT_VERSION = "v0.6.dev_ajr"

var PRODUCTION_VERSION_ = true

// Log Library
// -----------

var DEBUG_LOG_LEVEL_ = PRODUCTION_VERSION_ ? BBLog.Level.INFO : BBLog.Level.ALL
var DEBUG_LOG_DISPLAY_FUNCTION_NAMES_ = PRODUCTION_VERSION_ ? BBLog.DisplayFunctionNames.NO : BBLog.DisplayFunctionNames.YES

// Assert library
// --------------

var SEND_ERROR_EMAIL_ = PRODUCTION_VERSION_ ? true : false
var HANDLE_ERROR_ = Assert.HandleError.THROW
var ADMIN_EMAIL_ADDRESS_ = 'dev@cloudFire.media'

// Tests
// -----
// Should all be true for production

var TEST_CREATE_TRIGGERS_              = false
var TEST_DO_NOT_USE_TEST_FOLDER_TREE_  = true
var TEST_COPY_FOLDERS_                 = true
var TEST_SEND_CONF_EMAIL_              = false

//if (PRODUCTION_VERSION_) {
//  if (!TEST_CREATE_TRIGGERS_) {
//    throw new Errors('Test flags set in production version')
//  }
//}

// Constants/Enums
// ===============

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

  Log_.functionEntryPoint();
  
  

} // functionTemplate() 
*/