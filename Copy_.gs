// 34567890123456789012345678901234567890123456789012345678901234567890123456789

// JSHint - TODO
/* jshint asi: true */

(function() {"use strict"})()

// Copy_.gs
// ===========
//
// This code copies a directory tree.  It maintains
// its progress only in the top level tree - so if there
// are too many files in any subfolder of the top level tree
// the script may not complete.
//
// Based on:
//
//   https://github.com/metricube/drivecopy/blob/master/script.gs

var Copy_ = (function(ns) {
  
  /**
   * 
   * @param {string} sourceid
   * @param {string} clientFolderId
   * @param {array} fileList
   * @param {array} folderList
   */
  
  ns.startCopy = function(sourceid, clientFolderId, fileList, folderList) {
  
    if (!TEST_COPY_FOLDERS_) {
      return;
    }
    
    source = DriveApp.getFolderById(sourceid);
    
    // Create the target folder

    var target = DriveApp.getFolderById(clientFolderId);    
      
    Log_.info('Copying template folder to ' + target.getId());

    // Copy the top level files
    copyFiles(source, target, fileList);
    
    // Now set the subdirectories to process
    var subfolders = source.getFolders();
    var continuationToken = subfolders.getContinuationToken();
    
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('COPY_FILES_CONTINUATION_TOKEN', continuationToken);
    userProperties.setProperty('COPY_FILES_BASE_TARGET_FOLDER_ID', target.getId());

    if (TEST_CREATE_TRIGGERS_) {
    
      // Set the trigger to start after 5 seconds - will allow the above copy to complete
      ScriptApp.newTrigger("resume")
        .timeBased()
        .after(5000)
        .create();
        
    } else {
    
      resume_()
    }
        
  }; // Copy_.startCopy()
    
  /**
   * Resume the copy
   */
   
  ns.resume = function(e) {
    
    Log_.fine('resume trigger');
    
    var userProperties = PropertiesService.getUserProperties();
    var continuationToken = userProperties.getProperty('COPY_FILES_CONTINUATION_TOKEN');
    var lastTargetFolderCreatedId = userProperties.getProperty('COPY_FILES_LAST_TARGET_FOLDER_ID');
    var baseTargetFolderId = userProperties.getProperty('COPY_FILES_BASE_TARGET_FOLDER_ID');
    var dir;
    var newdir;
    var fileList = Utils_.getList('Files');
    var folderList = Utils_.getList('Folders');
    
    // Remove any partially copied directories
    if (lastTargetFolderCreatedId != null) {     
      var partialdir = DriveApp.getFolderById(lastTargetFolderCreatedId);
      partialdir.setTrashed(true);
    }
    
    // Clear any existing triggers
    removeTriggers();
    
    // We're finished
    if (continuationToken == null) {
      return null; 
    }
    
    if (TEST_CREATE_TRIGGERS_) {
    
      // Install a trigger in case we timeout or have a problem
      ScriptApp.newTrigger("resume")
        .timeBased()
        .after(7 * 60 * 1000)
        .create();  
    }
    
    var subfolders = DriveApp.continueFolderIterator(continuationToken);
    var dfolder = DriveApp.getFolderById(baseTargetFolderId);
    
    while (subfolders.hasNext()) {  
      
      var continuationToken = subfolders.getContinuationToken();
      userProperties.setProperty('COPY_FILES_CONTINUATION_TOKEN', continuationToken);    
      
      dir = subfolders.next();
      newdir = dfolder.createFolder(dir.getName());
      Log_.info("Recursing in to " + dir.getName());
      
      userProperties.setProperty('COPY_FILES_LAST_TARGET_FOLDER_ID', newdir.getId());
      copyFolder(dir, newdir, fileList, folderList);
    }
    
    // Clean up - we're done
    userProperties.deleteAllProperties();
    removeTriggers();

    if (TEST_SEND_CONF_EMAIL_) {
  
      // Send confirmation mail
      var email = Session.getActiveUser().getEmail();
      
      MailApp.sendEmail(
        email, 
        "Copy complete",
        "The Google Drive folder copy has completed.");        
    }  
    
    Log_.info('Copy complete');
    
    return
    
    // Private Functions
    // -----------------
    
    function removeTriggers() {
      var allTriggers = ScriptApp.getProjectTriggers();
      for (var i = 0; i < allTriggers.length; i++) {
        ScriptApp.deleteTrigger(allTriggers[i]);
      }   
    };     
    
  }; // Copy_.resume()

  // Copies the files from sfolder to dfolder
  function copyFiles(sfolder, dfolder, fileList) {
    
    var files = sfolder.getFiles();
    
    while(files.hasNext()) {
      var file = files.next();
      var filename = file.getName();
      var shortFilename = Utils_.getFilename(filename);
      Log_.info("Copying " + shortFilename);
      var newFile = file.makeCopy(filename, dfolder);
      storeId(fileList, shortFilename, newFile.getId());
    }
    
  }; // Copy_.copyFiles()
  
  /**
   * Copies the files and folders
   *
   * @param {Folder} sfolder
   * @param {Folder} dfolder
   * @param {Files} fileList
   * @param {Folder} folderList
   */
   
  function copyFolder(sfolder, dfolder, fileList, folderList) {
    
    var dir;
    var newdir;
    
    copyFiles(sfolder, dfolder, fileList)
    
    var dirs = sfolder.getFolders();
    
    while (dirs.hasNext()) {
      dir = dirs.next();
      var name = dir.getName();
      newdir = dfolder.createFolder(name);
      storeId(folderList, name, newdir.getId());      
      Log_.info("Recursing in to " + name);
      var newFolder = copyFolder(dir, newdir, fileList, folderList);
    }
    
  }; // Copy_.copyFolder()

  /**
   * Check the list of files or folders for a matching name,
   * and store the ID in the config sheet
   *
   * @param {object} list
   * @param {string} name
   * @param {string} id
   */

  function storeId(list, name, id) {
    
    Log_.functionEntryPoint();
    Log_.fine('name: ' + name);
    Log_.fine('id: ' + id);
    
    for (var nextName in list) {
    
      if (!list.hasOwnProperty(name)) {
        continue;
      }
      
      if (name === nextName) {
        var key = list[name];      
        Config.set({key: key, value: id});
        Log_.fine('Found "' + name + '" with id ' + id);
        break;
      } 
      
    } // for each item in the list
    
  } // Copy_.storeId() 
  
  return ns

})(Copy_ || {})
