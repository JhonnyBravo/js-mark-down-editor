var singleInput = {
    template : "#single-input-template",
    model : {
        prop : "value",
        event : "input"
    },
    props : [ "id", "label", "placeholder", "value" ]
}

var multipleInput = {
    template : "#multiple-input-template",
    model : {
        prop : "value",
        event : "input"
    },
    props : [ "id", "label", "placeholder", "rows", "value" ]
}

new Vue({
    el : "#app",
    components : {
        "single-input" : singleInput,
        "multiple-input" : multipleInput
    },
    data : {
        title : {
            id : "title",
            label : "Title",
            value : null
        },
        contents : {
            id : "contents",
            label : "Contents",
            value : null,
            rows : 10
        }
    },
    computed : {
        titleData : function () {
            return this.title.value;
        },
        contentsData : function () {
            return this.contents.value;
        },
        markdown : function () {
            var md = null;

            if (!this.isEmpty(this.titleData)
                    && !this.isEmpty(this.contentsData)) {
                md = "# " + this.titleData + "\n" + this.contentsData;
            }

            return md;
        },
        html : function () {
            var html = null;

            if (this.markdown != null) {
                html = marked(this.markdown, {
                    sanitize : true
                });
            }

            return html;
        }
    },
    watch : {
        html : function () {
            var htmlOutput = document.getElementById("HtmlOutput");
            htmlOutput.innerHTML = this.html;

            this.setAttribute("table", "class",
                    "table table-bordered table-hover");
            this.setAttribute("thead", "class", "thead-dark");
        }
    },
    methods : {
        isEmpty : function (value) {
            var result = false;

            if (value == null || value == "") {
                result = true;
            }

            return result;
        },
        setAttribute : function (tagName, attrName, attrValue) {
            var elements = document.getElementsByTagName(tagName);

            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute(attrName, attrValue);
            }
        },
        getHtmlBlob : function () {
            var html = document.createElement("html");

            // head をコピーする。
            var head = document.head.cloneNode(true);
            var title = head.getElementsByTagName("title");
            title[0].textContent = this.titleData;

            html.appendChild(head);

            // body をコピーする。
            var body = document.body.cloneNode(true);
            html.appendChild(body);

            // nav 削除。
            var nav = html.getElementsByTagName("nav");

            for (var i = 0; i < nav.length; i++) {
                nav[i].remove();
            }

            // div 削除。
            var div = html.getElementsByTagName("div");

            for (var i = 0; i < div.length; i++) {
                if (div[i].id == "MdInput" || div[i].id == "bin") {
                    div[i].remove();
                }
            }

            var htmlOutput = html.innerHTML;
            var blob = new Blob([ htmlOutput ], {
                type : "text/html"
            });

            return blob;
        },
        getMdBlob : function () {
            var pattern = /\n/g
            var blob = new Blob([ this.markdown.replace(pattern, "\r\n") ], {
                type : "text/plain"
            });

            return blob;
        },
        exportFile : function (blob, fileName) {
            var url = URL.createObjectURL(blob);
            var anchor = document.createElement("a");

            anchor.href = url;
            anchor.target = "_blank";
            anchor.download = fileName;

            anchor.click();
            URL.revokeObjectURL(url);
        },
        save : function () {
            if (this.titleData == null) {
                window.alert("Title を入力してください。");
                return;
            }

            if (this.contentsData == null) {
                window.alert("Contents を入力してください。");
                return;
            }

            var pattern = /\\|\/|:|\*|\?|"|<|>|\||#/g;

            if (pattern.test(this.titleData)) {
                window.alert('Title に \\ / : * ? " < > | # は使用できません。');
                return;
            }

            this.exportFile(this.getMdBlob(), this.titleData + ".txt");
            this.exportFile(this.getHtmlBlob(), this.titleData + ".html");
        },
        importFile : function (e) {
            var file = e.target.files[0];

            var pattern = /\.txt/;

            if (!pattern.test(file.name)) {
                window.alert(".txt ファイルを指定してください。");
                return;
            }

            this.title.value = file.name.replace(pattern, "");
            this.readFile(file);
        },
        readFile : function (file) {
            var reader = new FileReader();
            var vm = this;

            reader.addEventListener("load", function (e) {
                var result = new Uint8Array(e.target.result);

                switch (Encoding.detect(result)) {
                case "UTF16":
                    result = new Uint16Array(e.target.result);
                    break;
                case "UTF32":
                    result = new Uint32Array(e.target.result);
                    break;
                }

                var pattern = new RegExp("# " + vm.titleData + "\r\n|# "
                        + vm.titleData + "\n");

                var converted = Encoding.convert(result, "UNICODE");
                var contents = Encoding.codeToString(converted);

                vm.contents.value = contents.replace(pattern, "");
            });

            reader.readAsArrayBuffer(file);
        },
        clear : function () {
            this.title.value = null;
            this.contents.value = null;
        }
    }
});
