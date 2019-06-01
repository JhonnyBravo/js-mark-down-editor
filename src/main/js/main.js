new Vue({
    el : "#app",
    data : {
        title : null,
        contents : null
    },
    computed : {
        markdown : function () {
            var md = null;

            if (this.title != null && this.contents != null) {
                md = "# " + this.title + "\n" + this.contents;
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
        title : function () {
            var pattern = /\\|\/|:|\*|\?|"|<|>|\||#/g;

            if (pattern.test(this.title)) {
                window.alert('Title に \\ / : * ? " < > | # は使用できません。');
                this.title = this.title.replace(pattern, "");
            }
        },
        html : function () {
            var htmlOutput = document.getElementById("HtmlOutput");
            htmlOutput.innerHTML = this.html;

            var table = document.getElementsByTagName("table");

            if (table.length > 0) {
                for (var i = 0; i < table.length; i++) {
                    table[i].setAttribute("class",
                            "table table-bordered table-hover")
                }
            }

            var thead = document.getElementsByTagName("thead");

            if (thead.length > 0) {
                for (var i = 0; i < thead.length; i++) {
                    thead[i].setAttribute("class", "thead-dark");
                }
            }
        }
    },
    methods : {
        getHtmlBlob : function () {
            var html = document.createElement("html");

            // head をコピーする。
            var head = document.head.cloneNode(true);
            var title = head.getElementsByTagName("title");
            title[0].textContent = this.title;

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
            if (this.title == null) {
                window.alert("Title を入力してください。");
                return;
            }

            if (this.contents == null) {
                window.alert("Contents を入力してください。");
                return;
            }

            this.exportFile(this.getMdBlob(), this.title + ".txt");
            this.exportFile(this.getHtmlBlob(), this.title + ".html");
        },
        onChangeFile : function (e) {
            var file = e.target.files[0];

            var pattern = /\.txt/;

            if (!pattern.test(file.name)) {
                window.alert(".txt ファイルを指定してください。");
                return;
            }

            this.title = file.name.replace(pattern, "");
            this.contents = this.readFile(file);
        },
        readFile : function (file) {
            var reader = new FileReader();
            var vue = this;

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

                var pattern = new RegExp("# " + vue.title + "\r\n|# "
                        + vue.title + "\n");

                var converted = Encoding.convert(result, "UNICODE");
                var contents = Encoding.codeToString(converted);

                vue.contents = contents.replace(pattern, "");
            });

            reader.readAsArrayBuffer(file);
        },
        clear : function () {
            this.title = null;
            this.contents = null;
        }
    }
});
