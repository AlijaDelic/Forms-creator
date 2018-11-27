class Formular {
    private result: any;
    constructor() {
        this.registerEvents();
    }

    registerEvents() {
        var db = new DB("Formular");

        //On choosing Formular tab
        $("body").on("click", "#formular", () => {
            $("select[name='select_from_db']").html("<option value='' selected>Choose formular</option>");
            $("#formular").addClass("active");
            $("#admin").removeClass("active");
            $("#primary_table").html("");
            $("#save").addClass("d-none");
            $("#extra_table").html("");
            $("#update").addClass("d-none");
            $("#update_formular").addClass("d-none");
            db.getAll("Formular").then((resolve) => {
                for (var res in resolve) {
                    $("select[name='select_from_db']").append("<option value='" + resolve[res].key + "'>" + resolve[res].key + "</option>");
                }
            })
            $("#select_from_list").removeClass("d-none");
            $("#search_create").addClass("d-none");
        })

        //Choose formular name
        $("select[name='select_from_db']").change(() => {
            var select = $("select[name='select_from_db']").val();
            if (select) {
                $("#extra_table").html("");
                $("#save_formular").removeClass("d-none");
                $("#update_formular").addClass("d-none");
                var key = $("select[name='select_from_db']").val();
                db.getRow(key, "Formular").then((resolve) => {
                    this.result = resolve;
                    for (var val in resolve.values) {
                        if (resolve.values[val].selection_type == "Text" || resolve.values[val].selection_type == "Checkbox" || resolve.values[val].selection_type == "Number") {
                            $("#extra_table").append("<tr id='" + resolve.values[val].name + "'>" +
                                "<td><label for='" + resolve.values[val].label + "'>" + resolve.values[val].label + " </label></td>" +
                                "<td><input class='form-control' name='" + resolve.values[val].label + "' type='" + resolve.values[val].selection_type + "'></td>" +
                                "</tr>");
                        } else {
                            var radio = resolve.values[val].selection_type.Radio;
                            var size = radio.split(",");
                            $("#extra_table").append("<tr id='" + resolve.values[val].name + "'><td><label for='" + resolve.values[val].label + "'>" + resolve.values[val].label + "</label></td></tr>");
                            for (var i = 0; i < size.length; i++) {
                                $("#" + resolve.values[val].name).append("" +
                                    "<div class='radio_buttons'><input class='form-control' name='" + resolve.values[val].label + "' type='Radio' value='" + size[i] + "'>" + size[i] + "<br></div>");
                            }
                        }
                        if(resolve.values[val].selection_validation == "Mandatory"){
                            $("#" + resolve.values[val].name).find("label[for='"+ resolve.values[val].label +"']").append("*");
                        }
                        
                    }
                })
            }
        });

        //Save data
        $("#save_formular").click(() => {
            var values_to_save = [];
            var version = $("input[name='version']").val();
            if (version) {
                var result = this.result;
                var ver = result.key + " version " + version;
                var validation =[] ;
                for (var i = 0; i < result.values.length; i++) {
                    var label = result.values[i].label;
                    if (result.values[i].selection_type == "Text" || result.values[i].selection_type == "Number") {
                        var inputs = $("input[name='" + label + "']").val();
                        values_to_save.push(inputs);
                    } else {
                        var inputs = $("input[name='" + label + "']:checked").val();
                        values_to_save.push(inputs);
                    }
                    if(result.values[i].selection_validation =="Mandatory"){
                        var name = result.values[i].label;
                        var validate:any = $("input[name='"+name+"']").val();
                        if( validate.length > 0 ){
                            validation.push(true);
                        }else{
                            validation.push(false);
                        }
                    }
                }
                //validate and save
                if(jQuery.inArray(false,validation) !== -1){
                    alert("The fileds marked with '*' must be filled.")
                }else{
                    var data_to_save = new Data(ver, values_to_save);
                    var versions_db = new DB("Formular");
                    versions_db.insertRow(data_to_save, "Versions");
                    alert("Successfuly saved.")
                    location.reload();
                }
            } else {
                alert("Version must be inserted");
            }
        })

        //on load
        $("#load").click(() => {
            $("input[type='Checkbox']").attr({ "checked": false });
            var radio = $("input[type='Radio']").each(function () { $(this).prop('checked', false); })
            var select = $("select[name='select_from_db']").val();
            var version = $("input[name='version']").val();
            if (select && version) {
                var size = this.result.values;
                var ver = this.result.key + " version " + version;
                db.getRow(ver, "Versions").then((resolve) => {
                    if (resolve) {
                        $("#save_formular").addClass("d-none");
                        $("#save").addClass("d-none");
                        $("#save_formular").addClass("d-none");
                        $("#update_formular").removeClass("d-none");
                        $("input[type='Checkbox']").each(function(){
                            $(this).attr({ "checked": false })
                        })
                        for (var i = 0; i < size.length; i++) {
                            var name = this.result.values[i].label;
                            var type = this.result.values[i].selection_type;
                            if (type == "Text" || type == "Number") {
                                $("input[name='" + name + "']").val(resolve.values[i]);
                            }else if (type == "Checkbox") {
                                if(resolve.values[i] != undefined){
                                    
                                console.log(resolve.values[i])
                                    $("input[name='" + name + "']").val(resolve.values[i]).attr({ "checked": true });
                                }else{
                                    $("input[name='" + name + "']").val(resolve.values[i]).attr({ "checked": false });
                                }
                            }else {
                                var $radios = $('input:radio[name=' + name + ']');
                               if ($radios.is(':checked') === false) {
                                    $radios.filter('[value=' + resolve.values[i] + ']').prop('checked', true);
                                }
                            }
                        }
                    } else {
                        $("#save_formular").removeClass("d-none");
                        $("#update_formular").addClass("d-none");
                        $("#extra_table").find("input[type='Text']").val("");
                    }
                })
            } else {
                alert("Choose your formular and version.")
            }
        })

        //on update
        $("#update_formular").click(() => {
            var values_to_save = [];
            var version = $("input[name='version']").val();
            var result = this.result;
            var ver = result.key + " version " + version;
            for (var i = 0; i < result.values.length; i++) {
                var label = result.values[i].label;
                if (result.values[i].selection_type == "Text" || result.values[i].selection_type == "Number") {
                    var inputs = $("input[name='" + label + "']").val();
                    values_to_save.push(inputs);
                }else if(result.values[i].selection_type == "Checkbox"){
                    var ints = $("input[name='" + label + "']").is(":checked");
                    if(ints === true){
                    values_to_save.push(label);
                    }else{
                        values_to_save.push(undefined);
                    }
                }else {
                    var inputs = $("input[name='" + label + "']:checked").val();
                    values_to_save.push(inputs);
                }
            }
            var data_to_save = new Data(ver, values_to_save);
            var versions_db = new DB("Formular");
            versions_db.update(data_to_save, "Versions");
            alert("Successfuly updated.");
            location.reload();
        })
    }
}
