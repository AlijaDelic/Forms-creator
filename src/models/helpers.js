"use strict";
//function for creating clone
function createClone(number, label, type, validation) {
    var clone = $("#add_element").clone(true);
    clone.attr({ id: number });
    clone.find("input[name='number_of_columns']").attr({ "id": "id_" + number });
    clone.find(".add_element").attr({ "class": number });
    clone.find("i").hide();
    clone.find("input[name='label_nameadd_element']").attr({ "name": "label_name" + number });
    clone.find("select[name='validationadd_element']").attr({ "name": "validation" + number });
    clone.find("select[name='input_typeadd_element']").attr({ "name": "input_type" + number });
    clone.find("#element").html(number);
    clone.find("input[name='label_name" + number + "']").val(label);
    clone.find("select[name='input_type" + number + "']").val(type)
        .find("option[value=" + type + "]").attr({ 'selected': true });
    clone.find("select[name='validation" + number + "']").val(validation)
        .find("option[value=" + validation + "]").attr({ 'selected': true });
    clone.find("select[name='input_type" + number + "']").val(type);
    $("#extra_table").append(clone);
}
//classes for structuring data which will be saved at DB
var Data = /** @class */ (function () {
    function Data(key, values) {
        this.key = key;
        this.values = values;
    }
    return Data;
}());
var Values = /** @class */ (function () {
    function Values(name, label, selection_type, selection_validation) {
        if (name === void 0) { name = null; }
        if (label === void 0) { label = null; }
        if (selection_type === void 0) { selection_type = null; }
        this.name = name;
        this.label = label;
        this.selection_type = selection_type;
        this.selection_validation = selection_validation;
    }
    return Values;
}());
//class for adding one row to the table
var AddRow = /** @class */ (function () {
    function AddRow() {
        this.render();
    }
    AddRow.prototype.render = function (e_name, id, i_name) {
        if (e_name === void 0) { e_name = ""; }
        if (id === void 0) { id = "add_element"; }
        if (i_name === void 0) { i_name = ""; }
        return ('<tr id="' + id + '">' +
            '<td class="name">Element <span id="element">' + e_name + '</span></td>' +
            '<td><input type="text" placeholder="label 1" class="form-control" name="label_name' + id + '" value="' + i_name + '"></td>' +
            '<td>' +
            '<select class="form-control select_input_type" name="input_type' + id + '">' +
            '<option value="Text">Text</option>' +
            '<option value="Number">Number</option>' +
            '<option value="Checkbox">Checkbox</option>' +
            '<option value="Radio">Radio</option>' +
            '</select>' +
            '</td>' +
            '<td class="optional_td d-none"><input id="id_' + id + '" type="number" name="number_of_columns" class="form-control"></td>' +
            '<td>' +
            '<select class="form-control" name="validation' + id + '">' +
            '<option value="Mandatory">Mandatory</option>' +
            '<option value="None">None</option>' +
            '</select>' +
            '</td>' +
            '<td id="icon"><i class="material-icons lg">note_add</i></td>' +
            '</tr>' +
            '<tr><td></td><td></td><td></td><td>' +
            '<input type="text" name="radio_label" placeholder="Name for option" class="form-control d-none">' +
            '</td></tr>');
    };
    return AddRow;
}());
