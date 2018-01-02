var LOG_TAG = 'DIR_IMGCACHE: ';
angular.module('brastlewarkApp').directive('cacheimg', function() {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            console.log(LOG_TAG + 'Starting Directive.');

            // Watch any value changes
            scope.$watch(function () {
                return elem.css(attrs.style);
            },  function(){

                // Style has been changed so check image hasn't been modified
                findImageURLs(elem, attrs);

            }, true);

            scope.$watch(function () {
                return attrs.src;
            },  function(){

                // Image source has been changed so check image hasn't been modified
                findImageURLs(elem, attrs);

            }, true);


            // Do an initial search for anything pre-set
            findImageURLs(elem, attrs);

        }
    };
});

function findImageURLs(elem, attrs){
    // Check for  background image
    if (elem.css('background-image') !== 'none'){
        console.log(LOG_TAG + 'Background Image');

        var backimgsrc = elem.css('background-image');
        if (backimgsrc.startsWith('url(')){
            backimgsrc = backimgsrc.substring(4, backimgsrc.length -1);
        }

        // Retrieve from the cache (or download if we havent already)
        GetFromCache(backimgsrc, function(imgPath){
            console.log(LOG_TAG + 'Got image - setting now');

            // Got the image, set it now
            elem.css('background-image', 'url(' + imgPath + ')');

        }, function(err){
            console.log(LOG_TAG + 'Failed to get image from cache');

            // SET BROKEN LINK IMAGE HERE
            elem.css('background-image', 'url(../../img/brokenlink.png)');

        });

    }

    // Check for a src tag
    if (attrs.src !== undefined){
        console.log(LOG_TAG + 'Found Src Tag');

        // Retrieve from the cache (or download if we havent already)
        GetFromCache(attrs.src, function(imgPath){
            console.log(LOG_TAG + 'Got image - setting now');

            // Got the image, set it now
            attrs.$set('src', imgPath);

        }, function(err){
            console.log(LOG_TAG + 'Failed to get image from cache');

            // SET BROKEN LINK IMAGE HERE
            attrs.$set('src', '../../img/brokenlink.png');

        });

    }
}


// Build a file key - this will be what the filename is within the cache
function buildFileKey(url){
    console.log(LOG_TAG + 'Building file key for url: ' + url);
    var parts = url.split('.');
    var result = (parts.slice(0,-1).join('') + '.' + parts.slice(-1)).toString().replace(/[\/,:]/g,'_').toLowerCase();
    console.log(LOG_TAG + 'Built file key: ' + result);
    return result;
}

// Either get hold of the file from the cache or if we don't currently have it
// then attempt to download and store in the cache ready for next time
function GetFromCache(sourceUrl, success, fail) {
    console.log(LOG_TAG + 'Getting image from the cache');
    var FOLDER_IMAGE_CACHE = 'IMAGE_CACHE';
    var fileKey = buildFileKey(sourceUrl);
    var cacheExpiry = new Date().getTime() - (86400000 * 3); // 3 days

    // Get the file system for temporary storage
               

    $window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function(fs){

        console.log(LOG_TAG + 'Opened File System: ' + fs.name);

        // Get hold of the directory (Or create if we haven't already)
        fs.root.getDirectory(FOLDER_IMAGE_CACHE, { create:true }, function(dirEntry){

            var downloadToPath = dirEntry.toURL() + fileKey;

            // Check to see if we have the file
            doesFileExist(dirEntry, fileKey, function(fileEntry){

                // File exists - check if it needs to be renewed
                if (new Date(fileEntry.lastModifiedDate).getTime() < cacheExpiry){
                    console.log(LOG_TAG + 'Image has passed the expiry threshold - re-getting the file');
                    downloadFile(sourceUrl, downloadToPath, success, fail);
                }

                // Return the file path
                console.log(LOG_TAG + 'Passing back the image path ' + fileEntry.toURL());
                return (success(fileEntry.toURL()));

            }, function(){

                // File does not exist so download
                console.log(LOG_TAG + 'Image doesnt exist - getting file');
                downloadFile(sourceUrl, downloadToPath, success, fail);

            });

        }, fail);

    }, fail);

}

// Check to see if the given image already exists in our cache
function doesFileExist(dir, fileKey, existsCallback, notExistsCallback){
    console.log(LOG_TAG + 'Checking if file exists');

    // Check the directory for this file
    dir.getFile(fileKey, { create:false }, function(fileEntry){
        existsCallback(fileEntry);
    }, notExistsCallback);

}

// Download a file into the cache
function downloadFile(url, downloadToPath, success, fail){
    console.log(LOG_TAG + 'Downloading file ' + url);
    var fileTransfer = new FileTransfer();

    // File download function with URL and local path
    fileTransfer.download(encodeURI(url), downloadToPath,
        function (fileEntry) {
            console.log(LOG_TAG + 'Download Complete to path: ' + fileEntry.toURL());
            success(fileEntry.toURL());


        },
        function (error) {
            //Download abort errors or download failed errors
            console.log(LOG_TAG + 'Download Failed: ' + error.source);
            //alert("download error target " + error.target);
            //alert("upload error code" + error.code);
        }
    );

}