/**
 * Execute the user's code.
 * Just a quick and dirty eval.  No checks for infinite loops, etc.
 */
function runJS() {
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  try {
    eval(code);
  } catch (e) {
    alert('Program error:\n' + e);
  }
}

/**
 * Backup code blocks to localStorage.
 */
function backup_blocks() {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    window.localStorage.setItem('arduino', Blockly.Xml.domToText(xml));
  }
}

/**
 * Restore code blocks from localStorage.
 */
function restore_blocks() {
  if ('localStorage' in window && window.localStorage.arduino) {
    var xml = Blockly.Xml.textToDom(window.localStorage.arduino);
    Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
  }
}

/**
* Copy Arduino generated code to clipboard
* Supported in Chrome, IE, Firefox and Safari
*/
function copyCode() {
    // Arduino code is placed in a <pre>-tag with other tags within it.
    // We only want the text, so can't select the <pre>-tag.
    // --> Get inner text and make textArea-element containing the inner text.
    const content = document.getElementById("content_arduino").innerText;
    const textArea = document.createElement('textarea');
    textArea.textContent = content;
    document.body.append(textArea);
    textArea.select();
    try {
        var success = document.execCommand("Copy");
        var msg = success ? "successful" : "unsuccesful";
        console.log("Copy to clipboad was: " + msg);
    } catch(err) {
        console.log("Copy to clipboard failed: " + err);				
    }
    textArea.remove();
}

/**
* Save Arduino generated code to local file.
*/
function saveCode() {
  var fileName = window.prompt(Blockly.Msg.WHAT_NAME_FOR_FILE, 'Blockly4Arduino')
  //doesn't save if the user quits the save prompt
  if(fileName){
    var blob = new Blob([Blockly.Arduino.workspaceToCode()], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, fileName + '.ino');
  }
}

/**
 * Save blocks to local file.
 * better include Blob and FileSaver for browser compatibility
 */
function save() {
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  var data = Blockly.Xml.domToText(xml);
  var fileName = window.prompt(Blockly.Msg.WHAT_NAME_FOR_FILE, 'Blockly4Arduino');
  // Store data in blob.
  // var builder = new BlobBuilder();
  // builder.append(data);
  // saveAs(builder.getBlob('text/plain;charset=utf-8'), 'blockduino.xml');
  if(fileName){
    var blob = new Blob([data], {type: 'text/xml'});
    saveAs(blob, fileName + ".xml");
  } 
}

/**
 * Load blocks from local file.
 */
function load(event) {
  var files = event.target.files;
  // Only allow uploading one file.
  if (files.length != 1) {
    return;
  }

  // FileReader
  var reader = new FileReader();
  reader.onloadend = function(event) {
    var target = event.target;
    // 2 == FileReader.DONE
    if (target.readyState == 2) {
      try {
        var xml = Blockly.Xml.textToDom(target.result);
      } catch (e) {
        alert('Error parsing XML:\n' + e);
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      if (count && confirm(Blockly.Msg.REPLACE_EXISTING_BLOCKS)) {
        Blockly.mainWorkspace.clear();
      }
      Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
  };
  reader.readAsText(files[0]);
}

/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2 || window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
    Blockly.mainWorkspace.clear();
    Blockly4Arduino.renderContent();
  }
}

/*
 * auto save and restore blocks
 */
function auto_save_and_restore_blocks() {
  // Restore saved blocks in a separate thread so that subsequent
  // initialization is not affected from a failed load.
  window.setTimeout(restore_blocks, 0);
  // Hook a save function onto unload.
  bindEvent(window, 'unload', backup_blocks);
  Blockly4Arduino.tabClick(selected);

  // Init load event.
  var loadInput = document.getElementById('load');
  loadInput.addEventListener('change', load, false);
  document.getElementById('fakeload').onclick = function() {
    loadInput.click();
  };
}


/**
 * Bind an event to a function call.
 * @param {!Element} element Element upon which to listen.
 * @param {string} name Event name to listen to (e.g. 'mousedown').
 * @param {!Function} func Function to call when event is triggered.
 *     W3 browsers will call the function with the event object as a parameter,
 *     MSIE will not.
 */
function bindEvent(element, name, func) {
  if (element.addEventListener) {  // W3C
    element.addEventListener(name, func, false);
  } else if (element.attachEvent) {  // IE
    element.attachEvent('on' + name, func);
  }
}

//loading examples via ajax
var ajax;
function createAJAX() {
  if (window.ActiveXObject) { //IE
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e2) {
        return null;
      }
    }
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else {
    return null;
  }
}

function onSuccess() {
  if (ajax.readyState == 4) {
    if (ajax.status == 200) {
      try {
      var xml = Blockly.Xml.textToDom(ajax.responseText);
      } catch (e) {
        alert('Error parsing XML:\n' + e);
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      if (count && confirm(Blockly.Msg.REPLACE_EXISTING_BLOCKS)) {
        Blockly.mainWorkspace.clear();
      }
      Blockly.Xml.domToWorkspace(xml, Blockly.mainWorkspace);
    } else {
      alert("Server error");
    }
  }
}

function load_by_url(uri) {
  ajax = createAJAX();
  if (!ajax) {
       alert ('Not compatible with XMLHttpRequest');
       return 0;
  }
  if (ajax.overrideMimeType) {
    ajax.overrideMimeType('text/xml');
  }

    ajax.onreadystatechange = onSuccess;
    ajax.open ("GET", uri, true);
    ajax.send ("");
}

function uploadCode(code, callback) {
    var target = document.getElementById('content_arduino');
    var spinner = new Spinner().spin(target);

    var url = "http://127.0.0.1:8080/";
    var method = "POST";

    // You REALLY want async = true.
    // Otherwise, it'll block ALL execution waiting for server response.
    var async = true;

    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (request.readyState != 4) { 
            return; 
        }
        
        spinner.stop();
        
        var status = parseInt(request.status); // HTTP response status, e.g., 200 for "200 OK"
        var errorInfo = null;
        switch (status) {
        case 200:
            break;
        case 0:
            errorInfo = "code 0\n\nCould not connect to server at " + url + ".  Is the local web server running?";
            break;
        case 400:
            errorInfo = "code 400\n\nBuild failed - probably due to invalid source code.  Make sure that there are no missing connections in the blocks.";
            break;
        case 500:
            errorInfo = "code 500\n\nUpload failed.  Is the Arduino connected to USB port?";
            break;
        case 501:
            errorInfo = "code 501\n\nUpload failed.  Is 'ino' installed and in your path?  This only works on Mac OS X and Linux at this time.";
            break;
        default:
            errorInfo = "code " + status + "\n\nUnknown error.";
            break;
        };
        
        callback(status, errorInfo);
    };

    request.open(method, url, async);
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    request.send(code);	     
}

function uploadClick() {
    alert(Blockly.Msg.UPLOAD_CLICK_1 + "\n" + 
          Blockly.Msg.UPLOAD_CLICK_2 + "\n" + 
	  Blockly.Msg.UPLOAD_CLICK_3 + "\n" + 
	  Blockly.Msg.UPLOAD_CLICK_4 + "\n" + 
	  Blockly.Msg.UPLOAD_CLICK_5 );
    /*
    var code = document.getElementById('content_arduino').value;

    alert("Ready to upload to Arduino.");
    
    uploadCode(code, function(status, errorInfo) {
        if (status == 200) {
            alert("Program uploaded ok");
        } else {
            alert("Error uploading program: " + errorInfo);
        }
    });
    */
}

function resetClick() {
    var code = "void setup() {} void loop() {}";

    uploadCode(code, function(status, errorInfo) {
        if (status != 200) {
            alert("Error resetting program: " + errorInfo);
        }
    });
}

/**
* Function checkExtension will poll if the extension is installed or not
*/
var extensionActive = false;

/**
* Function populatePorts will add connected devices to the select box
*/


/**
* Function getCode() will return the generated Arduino Code
*/ 
function getCode() {
    const content = document.getElementById("content_arduino").innerText;
    return content;
}   

/**
* Function handleSubmit() will load a hex-file from the local PC
* and post it to the extension to flash the device
*/
function handleSubmit(e) {
    var portType = document.getElementById('portType');
    var boardType = document.getElementById('boardType');
    e.preventDefault();
    // get the chosen file from the form
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      // get the string text of the file
      var filecontents = event.target.result;
      // get the message payload ready to send to the chrome app
      var message = {
        board: JSON.parse(boardType.value)['ext'], 
        port: portType.value,
        file: filecontents
      };
      // post object to extension so that it will flash the file
      port.postMessage(message);
    };
    // we can send the filecontents to the chrome app as plain text
    reader.readAsText(file);
}
/**
* Function verifytxt() will return whether or not the code is compilable.
* This function will NOT flash the device.
*/
function verifyCode(){
    var boardType = document.getElementById('boardType');
    var lblStatus = document.getElementById('lblStatus');
    lblStatus.innerHTML = "";
    $.post('http://' + compilerUrl + ':' + compilerPort + '/compile',
      {'data': getCode(), 'boardName': JSON.parse(boardType.value)['builder']},
      function(data){
          console.log(data);
          if(data['err'] !== '') {
              lblStatus.innerHTML += '<b>' + Blockly.Msg.B4A_ERROR + '</b> ' + data['err'] + '\n';
          } else {
              lblStatus.innerHTML += '<b>' + Blockly.Msg.B4A_SUCCESS + '</b> ' + data['out'] + '\n';
          }
      });
}
/**
* Function uploadtxt() will flash the code in the textbox to the connected device
* 1. POST code to builder to receive the hex-file
* 2. Send received hex-file to the extension
* 3. extension will flash a connected device
*/
function uploadCode(){
    var portType = document.getElementById('portType');
    var boardType = document.getElementById('boardType');
    var lblStatus = document.getElementById('lblStatus');
    lblStatus.innerHTML = "";
    // First check if extension is installed.
    if(!extensionActive) { 
        lblStatus.innerHTML += Blockly.Msg.B4A_UPLOAD_FAIL + '\n';
    } else {
        $.post('http://' + compilerUrl + ':' + compilerPort + '/compile',
            {'data': getCode(), 'boardName': JSON.parse(boardType.value)['builder']},
            function(data){
                console.log(data);
                if(data['err'] !== '') {
                    lblStatus.innerHTML += '<b>' + Blockly.Msg.B4A_ERROR + '</b> ' + data['err'] + '\n';
                } else if(JSON.stringify(data['hex']) !== '') {
                    // get the message payload ready to send to the chrome app
                    lblStatus.innerHTML += '<b>' + Blockly.Msg.B4A_SUCCESS + '</b> ' + data['out'] + '\n';
                    var message = {
                        board: JSON.parse(boardType.value)['ext'],
                        port: portType.value,
                        file: data['hex']
                    };
                    // post object to extension so that it will flash the file
                    lblStatus.innerHTML += Blockly.Msg.B4A_FLASHING + "\n";
                    console.log("Flashing file to device");
                    port.postMessage(message);
                } else {
                    console.log("Compiler returned empty file - Device not flashed.");
                    lblStatus.innerHTML += Blockly.Msg.B4A_COMPILE_EMPTY + "\n";
                }
            });
    }
}

/*
* Function setCompilerAddress will change the IP-address where the verify -and upload
* function will send their HTTP POST-messages to
*/
function setCompilerAddress(){
    newUrl = window.prompt(Blockly.Msg.B4A_SET_IP_COMPILER, compilerUrl);
    if(newUrl == null || newUrl == ''){
        console.log('User cancelled the IP Address prompt');
    } else {
        compilerUrl = newUrl;
        localStorage['compilerUrl'] = compilerUrl;
        console.log('New compilerUrl: ' + compilerUrl);
    }
}

/*
* Function setCompilerPort will change the Port where the verify -and upload
* function will send their HTTP POST-messages to
*/
function setCompilerPort(){
    newPort = window.prompt(Blockly.Msg.B4A_SET_IP_COMPILER, compilerPort);
    if(newPort == null || newPort == ''){
        console.log('User cancelled the Port prompt');
    } else {
        compilerPort = newPort;
        localStorage['compilerPort'] = compilerPort;
        console.log('New compilerPort: ' + compilerPort);
    }
}

/*
* Function setCompilerAddress will change the IP-address where the verify and upload
* function will send their HTTP POST-messages to
*/
function setExtensionId(){
    newId = window.prompt(Blockly.Msg.B4A_SET_EXT_ID, extensionid);
    if(newId == null || newId == ''){
        console.log('User cancelled the Extension ID prompt');
    } else {
        extensionid = newId;
        localStorage['extensionid'] = extensionid;
        console.log('New ExtensionId: ' + extensionid);
        if (typeof chrome !== 'undefined') {
            port = chrome.runtime.connect(extensionid);
            console.log('Connected to ext ', extensionid, ' as Port ', port )
            // log out any responses we get from the chrome app
            if (port) {
                port.onMessage.addListener(function(msg) {
                    console.log('Message from extension:', msg);
                    lblStatus.innerHTML += Blockly.Msg.B4A_MSG_EXTENSION + JSON.stringify(msg) + '\n';
                });
            } else {
                console.log('No connection available to extension !')
            }
        }
        checkExtension();
    }
}

// Standard URL where the compiler is located
var compilerUrl = localStorage['compilerUrl'] || 'localhost';
// Port of the compiler
var compilerPort = localStorage['compilerPort'] || '7000';

// Requires the extensionId if the wants to connect to the extension
//var extensionid = 'dclnahpacbkcmjampfcfjccegljfcbdd'; //local avrgirl
//var extensionid = 'ljljmcfflicbmldibmdpebbgfmbjhbigc'; // local extension
var extensionid = localStorage['extensionid'] || 'limahhklinobffpljkonpenchljefiag';
// open long lived connection with extension (it takes time for flash to complete)
var port;
//if (typeof chrome !== 'undefined') {
//  port = chrome.runtime.connect(extensionid);
//  console.log('Connected to ext ', extensionid, ' as Port ', port )
//}
// log out any responses we get from the chrome app
if (port) {
//   port.onMessage.addListener(function(msg) {
//      console.log('Message from extension:', msg);
//      lblStatus.innerHTML += Blockly.Msg.B4A_MSG_EXTENSION + JSON.stringify(msg) + '\n';
//    });
} else {
    console.log('No connection available to extension !')
}
