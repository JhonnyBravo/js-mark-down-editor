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

var selectInput = {
    template : "#select-input-template",
    model : {
        prop : "value",
        event : "change"
    },
    props : [ "id", "label", "value", "options" ]
}
