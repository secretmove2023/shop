var SHEET_NAME = "sheet1";//ชื่อชีต
var SpreadsheetID = '1eSekh1J5R8bIBbd3mXOlnF1PnqvROvhPPxcqLek7i6Q'
var SCRIPT_PROP = PropertiesService.getScriptProperties();

function doGet(e) {
    var template = HtmlService.createTemplateFromFile('index')
  return  template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)
  .addMetaTag('viewport', 'width=device-width , initial-scale=1')
}
function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty(SpreadsheetID, doc.getId())
}

function uploadFile(data, file, name, tel, address, email, number, baht ) {

  try {

     var folder = DriveApp.getFolderById('1M5MYcLuT988eKoSnCm5AYfUKliHXq90C');//ไอดีโฟลเดอร์
     var date = Utilities.formatDate(new Date(),'GMT+7','dd/MM/yyyy')
    var contentType = data.substring(5, data.indexOf(';')),
      bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7)),
      blob = Utilities.newBlob(bytes, contentType, file),
      file = folder.createFolder([name,date].join(" ")).createFile(blob),
      filelink = file.getUrl();
    var lock = LockService.getPublicLock();
    lock.waitLock(30000);

    var doc = SpreadsheetApp.openById(SpreadsheetID);
    var sheet = doc.getSheetByName(SHEET_NAME);
    var headRow = 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;
    var row = [new Date, name, "'"+tel.toString(), address, email, number, baht, filelink];

    // for (i in headers) {
    //   if (headers[i] == "วันที่") {
    //     row.push(new Date());
    //   } else if (headers[i] == "ชื่อ สกุล") {
    //     row.push(name);
    //   } else if (headers[i] == "โรงเรียน") {
    //     row.push(school);
    //   } else if (headers[i] == "อีเมล") {
    //     row.push(email);
    //   } else if (headers[i] == "เบอร์โทร") {
    //     row.push('0'+tel.toString())
    //   } else if (headers[i] == "ลิ้งค์ไฟล์") {
    //     row.push(filelink);
    //   }
    // }
    // sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);

    sheet.appendRow(row)
    return "success";

  } catch (f) {
    return f.toString();
  } finally {
    lock.releaseLock();
  }

}
