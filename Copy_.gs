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
    var destinationFolder = DriveApp.getFolderById(baseTargetFolderId);
    
    while (subfolders.hasNext()) {  
      
      var continuationToken = subfolders.getContinuationToken();
      userProperties.setProperty('COPY_FILES_CONTINUATION_TOKEN', continuationToken);    
      
      dir = subfolders.next();
      newdir = destinationFolder.createFolder(dir.getName());
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

  // Copies the files from sourceFolder to destinationFolder
  function copyFiles(sourceFolder, destinationFolder, fileList) {
    
    var files = sourceFolder.getFiles();
    
    while(files.hasNext()) {
      var file = files.next();
      var filename = file.getName();
      var shortFilename = Utils_.getFilename(filename);
      Log_.info("Copying " + shortFilename);
      var newFile = makeCopy(filename, destinationFolder);
      storeId(fileList, shortFilename, newFile.getId());
    }
    
    return
    
    // Private Functions
    // -----------------
    
    /**
     * Make a copy of the original file
     *
     * @param {string} filename 
     * @param {Folder} destinationFolder
     *
     * @return {File}
     */
     
    function makeCopy(filename, destinationFolder) {
    
      Log_.functionEntryPoint()
      
      // Check for an Announcement GDoc - some start with "[ MM.dd ]"
      
      if (filename.slice(0, 9) === '[ MM.dd ]') {
      
        Log_.fine('Found Announcement GDoc: "' + filename + '"')
        
        var titles = getWeekTitles()
        
        if (filename.indexOf('0 Weeks') !== -1) {
          
          filename = titles.thisSunday
          Log_.fine('Found Announcement 0 week: "' + filename + '"')
          
        } else if (filename.indexOf('1 Week') !== -1) {
          
          filename = titles.nextSunday
          Log_.fine('Found Announcement 1 week: ' + filename + '"')
          
        } else if (filename.indexOf('Draft Document') !== -1) {
          
          filename = titles.draftSunday
          Log_.fine('Found Announcement draft: ' + filename + '"')
          
        } else {
          
          throw new Error('Unexpected Announcement GDoc: "' + filename + '"')
        }
      }

      var newFile = file.makeCopy(filename, destinationFolder);

      return newFile;
      
      // Private Functions
      // -----------------
      
      function getWeekTitles() {
    
        //get dates for next three Sundays
        var thisSunday = getUpcomingSunday(null, true)
        var nextSunday = dateAdd(thisSunday, 'week', 1)
        var draftSunday = dateAdd(thisSunday, 'week', 2)
        
        //get title for each date
        var thisSundayTitle = fDate(thisSunday, "[ MM.dd ] 'Sunday Announcements'")
        var nextSundayTitle = fDate(nextSunday, "[ MM.dd ] 'Sunday Announcements'")
        var draftSundayTitle = fDate(draftSunday, "[ MM.dd ] 'Sunday Announcements - Draft Document'")
        
        var out = {
          thisSunday  : thisSundayTitle,
          nextSunday  : nextSundayTitle,
          draftSunday : draftSundayTitle,
          dates:{
            thisSunday  : thisSunday,
            nextSunday  : nextSunday,
            draftSunday : draftSunday,
          }
        }
        
        return out
        
        // Private Functions
        // -----------------
        
        /**
         * Add time to a date in specified interval
         * Negative values work as well
         *
         * @param {Sate} javascript datetime object
         * @param {interval} text interval name [year|quarter|month|week|day|hour|minute|second]
         * @param {number} integer units of interval to add to date
         *
         * @return {date object} 
         */
        
        function dateAdd(date, interval, units) {
          date = new Date(date); //don't change original date
          switch(interval.toLowerCase()) {
            case 'year'   :  date.setFullYear(date.getFullYear() + units);            break;
            case 'quarter':  date.setMonth   (date.getMonth()    + units*3);          break;
            case 'month'  :  date.setMonth   (date.getMonth()    + units);            break;
            case 'week'   :  date.setDate    (date.getDate()     + units*7);          break;
            case 'day'    :  date.setDate    (date.getDate()     + units);            break;
            case 'hour'   :  date.setTime    (date.getTime()     + units*60*60*1000); break;
            case 'minute' :  date.setTime    (date.getTime()     + units*60*1000);    break;
            case 'second' :  date.setTime    (date.getTime()     + units*1000);       break;
            default       :  date = undefined; break;
          }
          return date;
          
        } // Copy_.copyFiles.makeCopy.getWeekTitles.dateAdd()
  
      } // Copy_.copyFiles.makeCopy.getWeekTitles()
          
    } // Copy_.copyFiles.makeCopy() 
       
  }; // Copy_.copyFiles()
  
  /**
   * Copies the files and folders
   *
   * @param {Folder} sourceFolder - Source folder
   * @param {Folder} destinationFolder - Destination folder
   * @param {Files} fileList
   * @param {Folder} folderList
   */
   
  function copyFolder(sourceFolder, destinationFolder, fileList, folderList) {
    
    var nextSourceFolder;
    var nextDestinationFolder;
    
    copyFiles(sourceFolder, destinationFolder, fileList)
    
    var folders = sourceFolder.getFolders();
    
    while (folders.hasNext()) {
    
      nextSourceFolder = folders.next();
      var nextSourceFolderName = nextSourceFolder.getName();
      var updatedNextFolderName = updateFolderName(nextSourceFolderName);
      nextDestinationFolder = destinationFolder.createFolder(updatedNextFolderName);
      storeId(folderList, nextSourceFolderName, nextDestinationFolder.getId());      
      Log_.info("Recursing in to " + nextSourceFolderName);
      var newFolder = copyFolder(nextSourceFolder, nextDestinationFolder, fileList, folderList);
    }
    
    // Private Function
    // ----------------
      
    /**
     * Update SERVICE_SLIDES_NAME folder name
     *
     * @param {string} oldFolderName
     *
     * @return {string} newFolderName
     */
     
    function updateFolderName(oldFolderName) {
    
      Log_.functionEntryPoint(oldFolderName);
      
      var newFolderName = oldFolderName;
      
      if (oldFolderName.indexOf('[ yyyy.MM.dd ] Service Slides') !== -1) {       
        var thisSunday = getUpcomingSunday(null, true);
        var newFolderName = fDate(thisSunday, "[ yyyy.MM.dd ] 'Service Slides'") 
      }
      
      return newFolderName;
    
    } // Copy_.copyFolder.updateFolderName() 
    
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
  
  /**
  * Return the next Sunday, which might be today
  *
  * @param {Date} date
  * @param {boolean} skipTodayIfSunday - skips this Sunday and returns next week Sunday
  *
  * @return {Date} upcoming Sunday
  */
  
  function getUpcomingSunday(date, skipTodayIfSunday) {
    
    // Clone the date so as not to change the original
    date = new Date(date || new Date())
    date.setHours(0,0,0,0)
    
    // If it's not a Sunday...
    if (skipTodayIfSunday || date.getDay() > 0) {
      
      // Subtract days to get to Sunday then add a week
      date.setDate(date.getDate() - date.getDay() + 7)           
    }
    
    return date;
    
  } // Copy_.getUpcomingSunday()
  
  /**
   * @param {Date} date
   * @param {string} format
   *
   * @return {string} the date formatted with format, default to today if date not provided
   */
  
  function fDate(date, format) {
    
    date = date || new Date();
    format = format || "MM/dd/yy";
    return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), format)
    
  } // Copy_.fDate()
  
  return ns

})(Copy_ || {})
