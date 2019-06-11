var rendererResource = {
    methods : {
        isEmpty : function (value) {
            var result = false;

            if (value == null || value == "") {
                result = true;
            }

            return result;
        },
        mdBuilder : function (title, contents) {
            var md = null;

            if (!this.isEmpty(title) && !this.isEmpty(contents)) {
                md = "# " + title + "\n" + contents;
            }

            return md;
        },
        setAttribute : function (tagName, attrName, attrValue) {
            var elements = document.getElementsByTagName(tagName);

            for (var i = 0; i < elements.length; i++) {
                elements[i].setAttribute(attrName, attrValue);
            }
        },
        htmlBuilder : function (title, contents) {
            var html = null;
            var md = this.mdBuilder(title, contents);

            if (md != null) {
                html = marked(md, {
                    sanitize : true
                });
            }

            return html;
        }
    }
}