//var buttonGuardar = document.getElementById("guardar");
//var sectores = document.getElementById("sectores");
var resolicion = document.getElementById('resolucion');
//var photo = document.getElementById('photo');
var nombre = document.getElementById('1');
var telefono = document.getElementById('2');
//var motivo = document.getElementById('motivo');
var xmlr = new XMLHttpRequest();

var width = 200;
var height = 200;

//buttonStop.disabled = true;

function guardar() {
    var sectores = document.getElementById("sectores");
    var nombre = document.getElementById('1');
    var email = document.getElementById('email');
    var telefono = document.getElementById('2');
    var motivo = document.getElementById('motivo');
    var resolucion = document.getElementById('resolucion');

    if(sectores.options[sectores.selectedIndex].value == "Seleccione el Sector"){
        alert("Seleccione un sector");
        return false;};
    if(nombre.value == ""){
        alert("Coloque su nombre");
        return false;};
    if(telefono.value == ""){
        alert("Coloque un interno o telefono de contacto");
        return false;};
    if(motivo.value == ""){
        alert("Coloque el motivo de la solicitud");
        return false;};

    var dict = new Object();
    dict = {
       "sector": sectores.options[sectores.selectedIndex].value,
       "resolucion": resolucion.options[resolucion.selectedIndex].text,
       "nombre": nombre.value,
       "telefono": telefono.value,
       "motivo": motivo.value,
       "email": email.options[email.selectedIndex].text,
    };
    //reloadImg("image");
    // var url = window.location.href + "record_status";
    //buttonRecord.disabled = true;
    //buttonStop.disabled = false;

    // disable download link
    //var downloadLink = document.getElementById("download");
    //downloadLink.text = "";
    //downloadLink.href = "";

    // XMLHttpRequest
    xmlr.onreadystatechange = function() {
        if (xmlr.readyState == 4 && xmlr.status == 200) {
            var incidencia = JSON.parse(xmlr.responseText);
            if(incidencia.resultado == false){
                alert("Problema al generar el tiket, por favor contacte al personal de sistemas")
                return false};
            if(incidencia.resultado == true){
                alert("Tiket generado correctamente.")
                nombre.value = "";
                telefono.value = "";
                motivo.value = "";
                email.value = "";
                sectores.selectedIndex = "0";
                resolucion.selectedIndex = "0";
                };
            //document.getElementById("dni").value = persona.documet_number
            //document.getElementById("nombre").value = persona.name
            //document.getElementById("apellido").value = persona.lastname
        };
    };

    xmlr.open("POST", "/crear_incidenacia");
    xmlr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlr.send(JSON.stringify(dict));
};


buttonFoto.onclick = function() {
    sacarFoto();
    //reloadImg("image");
};

function myOnLoad(variables) {
    var sectores = document.getElementById("sectores");

    for (value in variables) {
        var option = document.createElement("option");
        option.text = variables[value];
        sectores.add(option);
    }
};

/*
function cargar_sectores() {
    xmlr.onreadystatechange = function() {
        if (xmlr.readyState == 4 && xmlr.status == 200) {
            var sectores = JSON.parse(xmlr.responseText)
            var array = sectores.sectores
            array.sort();
            addOptions("sectores", array);

            for (value in array) {
              var option = document.createElement("option");
              option.text = array[value];
              select.add(option);
            }
        }
    }

    xmlr.open("POST", "/sectores");
    xmlr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xmlr.send(JSON.stringify({}));
}*/
