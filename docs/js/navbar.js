new Vue({
    el : "#navbar",
    components : {
        "navbar" : navbar
    },
    data : {
        brand : {
            url : "index.html",
            label : "Mark Down Editor"
        },
        links : [ {
            url : "table_definition.html",
            label : "Table Definition"
        } ]
    }
})
