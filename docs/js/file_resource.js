var fileResource = {
    methods : {
        exportFile : function (blob, fileName) {
            var url = URL.createObjectURL(blob);
            var anchor = document.createElement("a");

            anchor.href = url;
            anchor.target = "_blank";
            anchor.download = fileName;

            anchor.click();
            URL.revokeObjectURL(url);
        },
        readFile : function (file, output) {
            var reader = new FileReader();

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

                var fileName = file.name.replace("\.txt", "");
                var pattern = new RegExp("# " + fileName + "\r\n|# " + fileName
                        + "\n");
                
                var converted = Encoding.convert(result, "UNICODE");
                var contents = Encoding.codeToString(converted);

                output.value = contents.replace(pattern, "");
            });

            reader.readAsArrayBuffer(file);
        }
    }
}
