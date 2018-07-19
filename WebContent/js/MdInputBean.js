/**
 * input#txtTitle, textarea#txtContents へのデータ入出力を管理する。
 */
var MdInputBean = function () {
  var privateObjTitle = document.getElementById("txtTitle");
  var privateObjContents = document.getElementById("txtContents");

  /**
   * @return strTitile input#txtTitle に入力された文字列を取得して返す。
   */
  function publicGetTitle() {
    return privateObjTitle.value;
  }

  /**
   * input#txtTitle へ文字列を入力する。
   * 
   * @param strTitle
   *            input#txtTitle へ入力する文字列を指定する。
   */
  function publicSetTitle(strTitle) {
    privateObjTitle.value = strTitle;
  }

  /**
   * @return strContents textarea#txtContents に入力された文字列を取得して返す。
   */
  function publicGetContents() {
    return privateObjContents.value;
  }

  /**
   * textarea#txtContents へ文字列を入力する。
   * 
   * @param strContents
   *            textarea#txtContents に入力する文字列を指定する。
   */
  function publicSetContents(strContents) {
    privateObjContents.value = strContents;
  }

  return {
    getTitle: publicGetTitle,
    setTitle: publicSetTitle,
    getContents: publicGetContents,
    setContents: publicSetContents
  };
}();

module.exports = MdInputBean;
