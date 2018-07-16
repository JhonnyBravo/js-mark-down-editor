/**
 * div#HtmlOutput へのデータ入出力を管理する。
 */
var HtmlOutputBean = function() {
	var privateObjHtmlOutput = document.getElementById("HtmlOutput");

	/**
	 * @return strHtmlOutput div#HtmlOutput から HTML 文字列を取得して返す。
	 */
	function publicGetHtmlOutput() {
		return privateObjHtmlOutput.innerHTML;
	}

	/**
	 * div#HtmlOutput へ HTML 文字列を入力する。
	 * @param strHtmlOutput div#HtmlOutput へ入力する HTML 文字列を指定する。
	 */
	function publicSetHtmlOutput(strHtmlOutput) {
		privateObjHtmlOutput.innerHTML = strHtmlOutput;
	}

	return {
		getHtmlOutput : publicGetHtmlOutput,
		setHtmlOutput : publicSetHtmlOutput
	};
};