/**
 * ページ読込完了時に button#btnPreview, button#btnClear, button#btnSave, button#btnFile
 * へ実行プログラムを設定する。
 */
window.onload = function() {
	var objBtnPreview = document.getElementById("btnPreview");
	var objBtnClear = document.getElementById("btnClear");
	var objBtnSave = document.getElementById("btnSave");
	var objBtnFile = document.getElementById("btnFile");

	// Mark Down から HTML に変換して div#HtmlOutput へ出力する。
	objBtnPreview.addEventListener("click", function() {
		var objMdIB = new MdInputBean;
		var objHtmlOB = new HtmlOutputBean;

		var strTitle = objMdIB.getTitle();
		var strContents = objMdIB.getContents();

		var strMdInput = "# " + strTitle + "\n" + strContents;
		var strHtmlOutput = marked(strMdInput, {
			sanitize : true
		});

		objHtmlOB.setHtmlOutput(strHtmlOutput);
	});

	// input#txtTitle, textarea#txtContents, div#HtmlOutput から入力値を削除する。
	objBtnClear.addEventListener("click", function() {
		var objMdIB = new MdInputBean;
		var objHtmlOB = new HtmlOutputBean;

		objMdIB.setTitle(null);
		objMdIB.setContents(null);
		objHtmlOB.setHtmlOutput(null);
	});

	/**
	 * input#txtTitle, textarea#txtContents, div#HtmlOutput から入力値を取得し、 Mark Down
	 * ファイルと HTML ファイルに出力する。
	 */
	objBtnSave.addEventListener("click", function() {
		var objFC = new FileController();
		objFC.saveMd();
		objFC.saveHtml();
	});

	// 外部から txt ファイルを読込み、 input#txtTitle, textarea#txtContents へ出力する。
	objBtnFile.addEventListener("change", function(e) {
		var objFile = e.target.files[0];
		var objFR = new FileReader();

		objFR.addEventListener("load", function() {
			var strTitle = objFile.name;
			var objPattern = /\.txt/;
			strTitle = strTitle.replace(objPattern, "");

			var strContents = objFR.result;
			var objRE = new RegExp("# " + strTitle + "\n");
			strContents = strContents.replace(objRE, "");

			var objMdIB = new MdInputBean();
			objMdIB.setTitle(strTitle);
			objMdIB.setContents(strContents);
		});

		objFR.readAsText(objFile);
	});
}
