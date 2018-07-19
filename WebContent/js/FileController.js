/**
 * ファイル出力処理を管理する。
 */
var FileController = function () {
  /**
   * ファイルを生成して出力する。
   * 
   * @param strName
   *            出力するファイル名を指定する。
   * @param strContents
   *            ファイルへ書込む内容を指定する。
   * @param strType
   *            ファイルの種類を指定する。(text/plain, text/html, etc...)
   */
  function privateSaveFile(strName, strContents, strType) {
    var objPattern = /\n/g;
    var objBlob = new Blob([strContents.replace(objPattern, "\r\n")], {
      type: strType
    });
    var objURL = URL.createObjectURL(objBlob);

    var objAnchor = document.createElement("a");
    objAnchor.href = objURL;
    objAnchor.target = "_blank";
    objAnchor.download = strName;
    objAnchor.click();

    URL.revokeObjectURL(objURL);
  }

  /**
   * input#txtTitle と textarea#txtContents から入力を受取り、 txt ファイルへ出力する。
   */
  function publicSaveMd() {
    var objMdIB = require("./MdInputBean");

    var strTitle = objMdIB.getTitle();
    var strContents = objMdIB.getContents();

    var strMdInput = "# " + strTitle + "\n" + strContents;
    privateSaveFile(strTitle + ".txt", strMdInput, "text/plain");
  }

  /**
   * div#HtmlOutput から innerHTML を取得し、 html ファイルへ出力する。
   */
  function publicSaveHtml() {
    // ベースオブジェクトの生成。
    var objHtml = document.createElement("html");

    var objHead = document.head.cloneNode(true);
    var objTitle = objHead.getElementsByTagName("title");

    var objMdIB = require("./MdInputBean");
    var strTitle = objMdIB.getTitle();

    for (var i = 0; i < objTitle.length; i++) {
      objTitle[i].textContent = strTitle;
    }

    objHtml.appendChild(objHead);

    var objBody = document.body.cloneNode(true);
    objHtml.appendChild(objBody);

    // 余分な要素を削除。
    var objNav = objHtml.getElementsByTagName("nav");

    for (var i = 0; i < objNav.length; i++) {
      objNav[i].remove();
    }

    var objDiv = objHtml.getElementsByTagName("div");

    for (var i = 0; i < objDiv.length; i++) {
      if (objDiv[i].id == "MdInput" || objDiv[i].id == "bin") {
        objDiv[i].remove();
      }
    }

    // ファイル出力
    var strHtmlOutput = objHtml.innerHTML;
    privateSaveFile(strTitle + ".html", strHtmlOutput, "text/html");
  }

  return {
    saveMd: publicSaveMd,
    saveHtml: publicSaveHtml
  };
}();

module.exports = FileController;
