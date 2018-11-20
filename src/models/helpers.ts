//function for creating clone
function createClone(number: any, label: any, type: any, validation: any) {
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
class Data {
    public key: any;
    public values: any;

    constructor(key: any, values: any) {
        this.key = key;
        this.values = values;
    }
}

class Values {
    private name: any;
    private label: any;
    private selection_type: any;
    private selection_validation: any;

    constructor(name: any = null, label: any = null, selection_type: any = null, selection_validation: any) {
        this.name = name;
        this.label = label;
        this.selection_type = selection_type;
        this.selection_validation = selection_validation;
    }
}

//class for adding one row to the table
class AddRow {
    constructor() {
        this.render();
    }
    render(e_name = "", id="add_element", i_name = "") {
        return (
            '<tr id="'+id+'">' +
            '<td class="name">Element <span id="element">'+e_name+'</span></td>' +
            '<td><input type="text" placeholder="label 1" class="form-control" name="label_name'+id+'" value="'+i_name+'"></td>' +
            '<td>' +
            '<select class="form-control select_input_type" name="input_type'+id+'">' +
            '<option value="Text">Text</option>' +
            '<option value="Number">Number</option>' +
            '<option value="Checkbox">Checkbox</option>' +
            '<option value="Radio">Radio</option>' +
            '</select>' +
            '</td>' +
            '<td class="optional_td d-none"><input id="id_'+id+'" type="number" name="number_of_columns" class="form-control"></td>'+            
            '<td>' +
            '<select class="form-control" name="validation'+id+'">' +
            '<option value="Mandatory">Mandatory</option>' +
            '<option value="None">None</option>' +
            '</select>' +
            '</td>' +
            '<td id="icon"><i class="material-icons lg">note_add</i></td>' +
            '</tr>'+
            '<tr><td></td><td></td><td></td><td>'+
            '<input type="text" name="radio_label" placeholder="Name for option" class="form-control d-none">'+
            '</td></tr>');
    }
}