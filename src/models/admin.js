"use strict";
var Admin = /** @class */ (function () {
    function Admin() {
        this.count = $(".name").length;
        this.isSearched = [];
        this.registerEvents();
    }
    Admin.prototype.registerEvents = function () {
        var _this = this;
        //database instance    
        var db = new DB("Formular");
        //on choosing Admin part
        $("#admin").click(function () {
            $("#admin").addClass("active");
            $("#formular").removeClass("active");
            $("#select_from_list").addClass("d-none");
            $("#search_create").removeClass("d-none");
            $("#save_formular").addClass("d-none");
            $("#extra_table").html("");
            $("#update_formular").addClass("d-none");
        });
        //On "click" on button search
        $("#button_search").on("click", function () {
            console.log("hi");
            var key = $("input[name='search_input']").val();
            $("#extra_table").html("");
            $("#primary_table").html("");
            var addRow = new AddRow();
            if (key) {
                //search DB for results
                db.getRow(key, "Formular").then(function (resolve) {
                    $("#primary_table").append(addRow.render());
                    $("#save").removeClass("d-none");
                    $("#update").addClass("d-none");
                    $("#update_formular").addClass("d-none");
                    if (resolve) {
                        $("#save").addClass("d-none");
                        $("#update").removeClass("d-none");
                        //Show the result
                        for (var i = 0; i < resolve.values.length; i++) {
                            var show = $("#extra_table").append(addRow.render(resolve.values[i].name, i, resolve.values[i].label));
                            var type = resolve.values[i].selection_type;
                            var validation = resolve.values[i].selection_validation;
                            $("#extra_table i").addClass("d-none");
                            show.find("select[name='validation" + i + "']").val(validation)
                                .find("option[value='" + validation + "']").attr({ 'selected': true });
                            if (type == "Checkbox" || type == "Text") {
                                show.find("select[name='input_type" + i + "']").val(type)
                                    .find("option[value='" + type + "']").attr({ 'selected': true });
                            }
                            else {
                                var input_values = type.Radio.split(',');
                                show.find("select[name='input_type" + i + "']").val("Radio")
                                    .find("option[value='Radio']").attr({ 'selected': true });
                                show.find("#" + i + " .optional_td").removeClass("d-none");
                                show.find("#id_" + i).val(input_values.length);
                                for (var y = 0; y < input_values.length; y++) {
                                    show.find("#id_" + i).parents("td").append("<tr class='" + i + "'><td><input type='text' name='radio_label" + y + "' placeholder='Name for option' class='form-control'></td></tr>");
                                    show.find("." + i + " input[name='radio_label" + y + "']").val(input_values[y]);
                                }
                            }
                        }
                    }
                });
            }
            else {
                $("input[name='search_input']").css({ "border-color": "red" });
            }
        });
        //on choosing radio
        $("body").on("change", ".select_input_type", function (event) {
            var element = $(event.target);
            var id = element.closest("tr").attr("id");
            var type = $(event.target).val();
            if (type == "Radio") {
                $("#" + id).find(".optional_td").removeClass("d-none");
            }
            else {
                $("#" + id).find(".optional_td").addClass("d-none");
            }
        });
        //choosing number of radio buttons
        $("body").on("change", "input[type='number']", function (event) {
            var id = $(event.target).parents("tr").attr("id");
            var size = $("#id_" + id).val();
            $("." + id).html("");
            for (var i = 0; i < size; i++) {
                $("#id_" + id).parents("td").append("<tr class='" + id + "'><td><input type='text' name='radio_label" + i + "' placeholder='Name for option' class='form-control'></td></tr>");
            }
        });
        // On adding new element
        $("body").on("click", "#icon", function (event) {
            var count = $(".name").length - 1;
            var type = $("select[name='input_typeadd_element']").val();
            var validation = $("select[name='validationadd_element']").val();
            var label = $("input[name='label_nameadd_element']").val();
            createClone(count, label, type, validation);
            return _this.count++;
        });
        //save
        $("#save").on("click", function () {
            var val = [];
            var search = $("input[name='search_input']").val();
            for (var i = 0; i < _this.count; i++) { //colecting the data for IndexedDB
                var l = $("input[name='label_name" + i + "']").val();
                var t = $("select[name='input_type" + i + "']").val();
                var v = $("select[name='validation" + i + "']").val();
                if (t == "Radio") {
                    var s = $("#id_" + i).val();
                    var r = [];
                    for (var y = 0; y < s; y++) {
                        var radio = $("#" + i).find("input[name='radio_label" + y + "']").val();
                        r.push(radio);
                    }
                    var obj = JSON.parse('{"Radio":"' + r + '"}');
                    var va = new Values(i, l, obj, v);
                    val.push(va);
                }
                else {
                    var va = new Values(i, l, t, v);
                    val.push(va);
                }
            }
            var dataToSave = new Data(search, val);
            if (dataToSave.values.length > 0) {
                db.insertRow(dataToSave, "Formular");
                alert("Added to indexDb");
                location.reload();
            }
            else {
                alert("Nothing to add.");
            }
        });
        //update database
        $("body").on("click", "#update", function () {
            var search = $("input[name='search_input']").val();
            var val = [];
            var count = $(".name").length;
            for (var i = 0; i < count - 1; i++) {
                var l = $("input[name='label_name" + i + "']").val();
                var t = $("select[name='input_type" + i + "']").val();
                var v = $("select[name='validation" + i + "']").val();
                if (t == "Radio") {
                    var s = $("#id_" + i).val();
                    var r = [];
                    for (var y = 0; y < s; y++) {
                        var radio = $("#" + i).find("input[name='radio_label" + y + "']").val();
                        r.push(radio);
                    }
                    var obj = JSON.parse('{"Radio":"' + r + '"}');
                    var va = new Values(i, l, obj, v);
                    val.push(va);
                }
                else {
                    var va = new Values(i, l, t, v);
                    val.push(va);
                }
            }
            var dataToSave = new Data(search, val);
            if (dataToSave.values.length > 0) {
                var new_data = JSON.stringify(dataToSave.values);
                db.getRow(search, "Formular").then(function (resolve) {
                    var prev_data = JSON.stringify(resolve.values);
                    if (new_data === prev_data) {
                        alert("Nothing changed.");
                    }
                    else {
                        db.update(dataToSave, "Formular");
                        alert("Formular has been updated.");
                        location.reload();
                    }
                });
            }
            ;
        });
    };
    return Admin;
}());
