// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// Tests.gs
// ========
//
// Dev: AndrewRoberts.net
//
// Code for internal/unit testing

function TEST_logInit() {
  Log_ = BBLog.getLog({
    level:                BBLog.Level.ALL, 
    displayFunctionNames: BBLog.DisplayFunctionNames.NO,
    sheetId:             '13ysHAXuqMbBNViAe4STpKmxsViffb7RmKnCuOkCi7MA',
  })
}

function TEST_misc() {
  var getFunction = 'getFoldersByName'
  var rootFolder = DriveApp.getRootFolder()
  foo()
  return
  
  function foo() {  
    var nextItems = rootFolder[getFunction](' Admin');
  //  var nextItems = DriveApp.getRootFolder().getFoldersByName(' Admin');
    var item = nextItems.next().getName()
    debugger
  }
}

function TEST_onInstall() {
  TEST_logInit() 
  onInstall_()
}

function TEST_resume() {
  TEST_logInit()
  Copy_.resume()
}

function TEST_dumpConfig() {
  TEST_logInit() 
  Log_.info(JSON.stringify(PropertiesService.getUserProperties().getProperties()))
}

function TEST_clearConfig() {
  TEST_logInit()
  var props = PropertiesService.getUserProperties()
  props.deleteAllProperties()
  Log_.info(JSON.stringify(props.getProperties()))
}
