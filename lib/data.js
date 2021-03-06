// Dependencies
const fs =  require("fs");
const path = require("path");
const helpers = require("./helpers");

// Container for the module(to be exported)
var lib = {};

//Base directory of the data folder
lib.baseDir = path.join(__dirname, "/../.data/"); 

//Write data to a file
lib.create = function(dir,file,data,callback) {
    //Open the file for writing
    fs.open(lib.baseDir+dir+"/"+file+".json","wx", function(err,fileDescriptor) {
        if(!err && fileDescriptor) {
          // Convert data to string
          var stringData = JSON.stringify(data);

          //Write to file and close it
          fs.writeFile(fileDescriptor,stringData,function(err) {
            if(!err) {
                fs.close(fileDescriptor,function(err) {
                    if(!err) {
                       callback(false);
                    } else {
                        callback("Error closing new file");
                    }
                })
            } else {
                callback("Error writing new file");
            }
          });
        } else {
            callback("Could not create new file,it may already exist")
        }
    });
};

// Read data from a file
lib.read = function(dir,file,callback) {
    fs.readFile(lib.baseDir+dir+"/"+file+".json","utf8", function(err,data) {
        console.log(err);
        if(!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err,data);
            console.log(data);
        }      
    });
};


// Update data inside a file
lib.update = function(dir,file,data,callback) {
    // Open file for writing
    fs.open(lib.baseDir+dir+"/"+file+".json","r+", function(err, fileDescriptor) {
       if (!err && fileDescriptor) {
        // Convert data to string
        var stringData = JSON.stringify(data);

        // Truncate the file
        fs.truncate(fileDescriptor,function(err) {
           if (!err) {
             // Write to the file and close it
             fs.writeFile(fileDescriptor,stringData,function(err) {
              if(!err) {
                fs.close(fileDescriptor, function(err) {
                    if (!err) {
                        callback(false);
                    } else {
                        callback("Error closing file");
                    };
                });
              } else {
                  callback("Error writing to existing file");
              }
             });
           } else {
               callback("Error truncating file");
           }
        });
       } else {
           callback("Could not open file for updating, it may not exist");
       };
    });
};

// Delete data
lib.delete = function(dir, file, callback) {
    // Unlink the file
    fs.unlink(lib.baseDir+dir+"/"+file+".json", function(err){
        if (!err) {
            callback(false);
        } else {
            callback("Error deleting file")
        }
    })
};







//Export module
module.exports = lib;

