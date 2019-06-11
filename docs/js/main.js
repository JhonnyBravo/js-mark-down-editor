new Vue({
    el : "#app",
    components : {
        "single-input" : singleInput,
        "multiple-input" : multipleInput
    },
    mixins : [ rendererResource, fileResource ],
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
        markdown : function () {
            var md = this.mdBuilder(this.title.value, this.contents.value);
            return md;
        },
        html : function () {
            var html = this.htmlBuilder(this.title.value, this.contents.value);
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
        save : function () {
            if (this.isEmpty(this.title.value)) {
                window.alert("Title を入力してください。");
                return;
            }

            if (this.isEmpty(this.contents.value)) {
                window.alert("Contents を入力してください。");
                return;
            }

            var pattern = /\\|\/|:|\*|\?|"|<|>|\||#/g;

            if (pattern.test(this.title.value)) {
                window.alert('Title に \\ / : * ? " < > | # は使用できません。');
                return;
            }

            this.exportFile(this.getMdBlob(), this.title.value + ".txt");
            this.exportFile(this.getHtmlBlob(), this.title.value + ".html");
        },
        importFile : function (e) {
            var file = e.target.files[0];

            var pattern = /\.txt/;

            if (!pattern.test(file.name)) {
                window.alert(".txt ファイルを指定してください。");
                return;
            }

            this.title.value = file.name.replace(pattern, "");
            this.readFile(file, this.contents);
        },
        clear : function () {
            this.title.value = null;
            this.contents.value = null;
        }
    }
});
