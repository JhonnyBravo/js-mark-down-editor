/**
 * ページ読込完了時に button#btnPreview, button#btnClear, button#btnSave, button#btnFile
 * へ実行プログラムを設定する。
 */
window.onload = function () {
  var objBtnPreview = document.getElementById("btnPreview");
  var objBtnClear = document.getElementById("btnClear");
  var objBtnSave = document.getElementById("btnSave");
  var objBtnFile = document.getElementById("btnFile");

  /**
   * button#btnPreview
   * 
   * Mark Down から HTML に変換して div#HtmlOutput へ出力する。
   */
  objBtnPreview.addEventListener("click", function () {
    var objMdIB = require("./MdInputBean");
    var objHtmlOB = require("./HtmlOutputBean");
    var marked = require("marked");

    var strTitle = objMdIB.getTitle();
    var strContents = objMdIB.getContents();

    // 入力チェック
    if (strTitle == "" && strContents == "") {
      return;
    } else if (strTitle == "" || strContents == "") {
      window.alert("Title または Contents が入力されていません。");
      return;
    }

    // txtTitle 禁則文字チェック
    var objPattern = /\\|\/|:|\*|\?|"|<|>|\||#/g;

    if (objPattern.test(strTitle)) {
      window.alert('Title に \\ / : * ? " < > | # は使用できません。');
      return;
    }

    var strMdInput = "# " + strTitle + "\n" + strContents;
    var strHtmlOutput = marked(strMdInput, {
      sanitize: true
    });

    objHtmlOB.setHtmlOutput(strHtmlOutput);

    // Table 書式設定
    var objTable = document.getElementsByTagName("table");

    for (var i = 0; i < objTable.length; i++) {
      objTable[i].setAttribute("class",
        "table table-bordered table-hover");
    }

    var objTHead = document.getElementsByTagName("thead");

    for (var i = 0; i < objTHead.length; i++) {
      objTHead[i].setAttribute("class", "thead-dark");
    }
  });

  /**
   * button#btnClear
   * 
   * input#txtTitle, textarea#txtContents の入力値と div#HtmlOutput の innerHTML
   * を空にする。
   */
  objBtnClear.addEventListener("click", function () {
    var objMdIB = require("./MdInputBean");
    var objHtmlOB = require("./HtmlOutputBean");

    objMdIB.setTitle(null);
    objMdIB.setContents(null);
    objHtmlOB.setHtmlOutput(null);
  });

  /**
   * button#btnSave
   * 
   * input#txtTitle, textarea#txtContents の入力値を txt ファイルへ、 div#HtmlOutput の
   * innerHTML を html ファイルへ出力する。
   */
  objBtnSave.addEventListener("click", function () {
    var objMdIB = require("./MdInputBean");
    var objHtmlOB = require("./HtmlOutputBean");

    var strTitle = objMdIB.getTitle();
    var strContents = objMdIB.getContents();
    var strHtmlOutput = objHtmlOB.getHtmlOutput();

    // 入力チェック
    if (strTitle == "" && strContents == "" && strHtmlOutput == "") {
      return;
    } else if (strTitle == "" || strContents == "") {
      window.alert("Title または Contents が入力されていません。");
      return;
    } else if (strHtmlOutput == "") {
      window.alert("Preview ボタンをクリックしてください。");
      return;
    }

    // txtTitle 禁則文字チェック
    var objPattern = /\\|\/|:|\*|\?|"|<|>|\||#/g;

    if (objPattern.test(strTitle)) {
      window.alert('Title に \\ / : * ? " < > | # は使用できません。');
      return;
    }

    var objFC = require("./FileController");
    objFC.saveMd();
    objFC.saveHtml();
  });

  /**
   * input#btnFile
   * 
   * 外部から txt ファイルを読込み、 input#txtTitle, textarea#txtContents へ出力する。
   */
  objBtnFile.addEventListener("change", function (e) {
    var objFile = e.target.files[0];
    var objFR = new FileReader();

    objFR.addEventListener("load", function (e) {
      // 文字コード変換処理
      var Encoding = require("encoding-japanese");
      var objResult = new Uint8Array(e.target.result);

      switch (Encoding.detect(objResult)) {
      case "UTF16":
        objResult = new Uint16Array(e.target.result);
        break;
      case "UTF32":
        objResult = new Uint32Array(e.target.result);
        break;
      }

      var objConverted = Encoding.convert(objResult, "UNICODE");
      var strContents = Encoding.codeToString(objConverted);

      var strTitle = objFile.name;
      var objPattern = /\.txt/;

      if (!objPattern.test(strTitle)) {
        window.alert(".txt ファイルを指定してください。");
        return;
      }

      strTitle = strTitle.replace(objPattern, "");

      var objRE = new RegExp("# " + strTitle + "\r\n|# " + strTitle +
        "\n");
      strContents = strContents.replace(objRE, "");

      var objMdIB = require("./MdInputBean");
      objMdIB.setTitle(strTitle);
      objMdIB.setContents(strContents);
    });

    objFR.readAsArrayBuffer(objFile);
  });
};
