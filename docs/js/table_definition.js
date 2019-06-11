var entity = new Vue({
    el : "#entity",
    components : {
        "single-input" : singleInput,
        "entity-table" : entityTable
    },
    data : {
        table : {
            id : "table-name",
            label : "Table Name",
            value : null
        },
        file : {
            id : "file-name",
            label : "File Name",
            value : null
        }
    }
});

new Vue({
    el : "#definition",
    components : {
        "single-input" : singleInput,
        "multiple-input" : multipleInput,
        "select-input" : selectInput,
        "definition-table" : definitionTable
    },
    mixins : [ fileResource ],
    data : {
        no : {
            id : "no",
            label : "No",
            value : null,
            options : [ {
                label : null,
                value : null
            } ]
        },
        logical : {
            id : "logical-name",
            label : "Logical Name",
            value : null
        },
        phisical : {
            id : "phisical-name",
            label : "Phisical Name",
            value : null
        },
        key : {
            id : "key",
            label : "Key",
            value : null,
            options : [ {
                label : null,
                value : null
            }, {
                label : "Primary Key",
                value : "Primary Key"
            } ]
        },
        type : {
            id : "data-type",
            label : "Data Type",
            value : null,
            options : [ {
                label : null,
                value : null
            }, {
                label : "String",
                value : "String"
            }, {
                label : "Integer",
                value : "Integer"
            }, {
                label : "Long",
                value : "Long"
            }, {
                label : "Single",
                value : "Single"
            }, {
                label : "Double",
                value : "Double"
            }, {
                label : "Boolean",
                value : "Boolean"
            }, {
                label : "Date",
                value : "Date"
            }, {
                label : "Variant",
                value : "Variant"
            }, {
                label : "Object",
                value : "Object"
            } ]
        },
        size : {
            id : "size",
            label : "Size",
            value : null
        },
        note : {
            id : "note",
            label : "Note",
            value : null
        },
        definitions : []
    },
    methods : {
        clear : function () {
            this.no.value = null;
            this.logical.value = null;
            this.phisical.value = null;
            this.key.value = null;
            this.type.value = null;
            this.size.value = null;
            this.note.value = null;
        },
        addDefinition : function () {
            var no = 1;

            if (this.definitions.length > 0) {
                var last = this.definitions.length - 1;
                no = this.definitions[last].no + 1;
            }

            this.no.options.push({
                label : no,
                value : no
            });

            var definition = {
                no : no,
                logicalName : this.logical.value,
                phisicalName : this.phisical.value,
                key : this.key.value,
                dataType : this.type.value,
                size : this.size.value,
                note : this.note.value
            }

            this.definitions.push(definition);
            this.clear();
        },
        getIndexByNo : function () {
            var index = this.definitions.findIndex(function (definition) {
                var result = false;

                if (definition.no == this.no.value) {
                    result = true;
                }

                return result;
            });

            return index;
        },
        getDefinition : function () {
            var i = this.getIndexByNo();

            if (i != -1) {
                var definition = this.definitions[i];

                this.logical.value = definition.logicalName;
                this.phisical.value = definition.phisicalName;
                this.key.value = definition.key;
                this.type.value = definition.dataType;
                this.size.value = definition.size;
                this.note.value = definition.note;
            } else {
                this.clear();
            }
        },
        deleteNo : function () {
            var i = this.no.options.findIndex(function (option) {
                var result = false;

                if (option.value == this.no.value) {
                    result = true;
                }

                return result;
            });

            this.no.options.splice(i, 1);
        },
        deleteDefinition : function () {
            var i = this.getIndexByNo();

            if (i != -1) {
                this.definitions.splice(i, 1);
                this.deleteNo();
                this.clear();
            }
        },
        updateDefinition : function () {
            var i = this.getIndexByNo();

            var definition = {
                no : parseInt(this.no.value),
                logicalName : this.logical.value,
                phisicalName : this.phisical.value,
                key : this.key.value,
                dataType : this.type.value,
                size : this.size.value,
                note : this.note.value
            }

            if (i != -1) {
                this.definitions.splice(i, 1, definition);
                this.clear();
            }
        },
        getHtmlBlob : function () {
            var html = document.createElement("html");

            var head = document.head.cloneNode(true);
            var title = head.getElementsByTagName("title");
            title[0].textContent = entity.table.value;

            html.appendChild(head);

            var body = document.body.cloneNode(true);
            html.appendChild(body);

            var nav = html.getElementsByTagName("nav");

            for (var i = 0; i < nav.length; i++) {
                nav[i].remove();
            }

            var div = html.getElementsByTagName("div");

            for (var i = 0; i < div.length; i++) {
                if (div[i].id == "bin") {
                    div[i].remove();
                }
            }

            var form = html.querySelectorAll("form");

            for (var i = 0; i < form.length; i++) {
                form[i].parentNode.remove();
            }

            var htmlOutput = html.innerHTML;

            var blob = new Blob([ htmlOutput ], {
                type : "text/html"
            });

            return blob;
        },
        save : function () {
            if (entity.table.value == null || entity.table.value == "") {
                window.alert("Table Name を入力してください。");
                return;
            }

            if (this.definitions.length == 0) {
                window.alert("Columns を入力してください。");
                return;
            }

            this.exportFile(this.getHtmlBlob(), entity.table.value + ".html");
        }
    }
});
