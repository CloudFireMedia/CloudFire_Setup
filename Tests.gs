// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// Tests.gs
// ========
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
  var a = '[ MM.dd ] Sunday'
  var b = a.slice(0, 9)
  debugger
}

function TEST_getFileName() {

  var input = "  a v va v93 v. v28. v.b v39a dv1.1 v19.32 c" 
  var expectedOutput = "a v va v93 v. v28. v.b v39a dv1.1"
  var output = Utils_.getFileName(input)
  
  if (output !== expectedOutput) {
    throw new Error('FAIL')
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
