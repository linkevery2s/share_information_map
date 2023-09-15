function getData(sheetName) {
  const sheet = SpreadsheetApp.getActiveSheet(); // アクティブシートの指定
  const lastRow = sheet.getLastRow(); // 最終行
  const lastColumn = sheet.getLastColumn(); // 最終列
  
  const Array = sheet.getRange(2,1,lastRow-1,lastColumn).getValues(); //2行目以降のセルの取得

// オブジェクトに値を入れていく
  return Array.map(function(row) {
    let object = {};
    object.type = "Feature"

    // プロパティの値を入れる
    object.properties = {};
    object.properties.name = row[1]; //B列　件名
    object.properties.overview = row[4]; //E列　概要
    object.properties.timestamp = Utilities.formatDate(row[5],"JST", "YYYY/MM/dd") + " " +Utilities.formatDate(row[6], "JST", "HH:mm:ss"); //F列、G列　日付・時刻
    object.properties.photo = row[7].split(/=/,2)[1]; //H列　写真,idを抽出する

    // ポイント（点データ）の指定
    object.geometry = {};
    object.geometry.type = "Point";

    // 位置情報を代入する
    object.geometry.coordinates = [];
    object.geometry.coordinates.push(row[3],row[2]);//D列,C列

    return object;
  });

}

// 呼び出し関数
function doGet() {
  const data = getData("sheet1"); // sheet1の指定

  const geojson = {};
  geojson.type = "FeatureCollection";
  geojson.features = data;

  // geojsonファイルを返す
  return ContentService
  .createTextOutput(JSON.stringify(geojson, null, 2))
  .setMimeType(ContentService.MimeType.JSON);

}
