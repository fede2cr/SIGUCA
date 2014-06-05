$(document).ready(function() {
    /* This code is executed after the DOM has been completely loaded */
    alert('preparado');

    $('#verMarca').click(function() {
        $.getJSON('marcaJson', function(contenidoDelArchivo) {     //acá van las instrucciones que deseamos ejecutar después de recibir los datos del archivo (contenidoDelArchivo)
            var tieneMarcas = false;

            for (var j = 0; j < contenidoDelArchivo.marcas.length; j++) {
                alert('cod tarjeta usuario es ' + contenidoDelArchivo.usuario.codTarjeta + ' y de la marca es ' + contenidoDelArchivo.marcas[j].codTarjeta);
                if (((contenidoDelArchivo.marcas[j].codTarjeta)) == ((contenidoDelArchivo.usuario.codTarjeta))) {
                    alert('si entro a ciclo');
                    tieneMarcas = true;
                    break;
                }

            }

            alert('estado de la bandera' + tieneMarcas);
            if (tieneMarcas) {

                $('#marcas').append('<h3>Marcas Personales</h3>');
                $('#marcas').append('<table class="table table-hover" id= "tabla"></table>');
                $('#tabla').append('<thead  class= "primer" id= primer"></thead>');
                $('#tabla').append('<th >#Empl</th>');
                $('#tabla').append('<th >Tipo Marca</th>');
                $('#tabla').append('<th >Dia</th>');
                $('#tabla').append('<th >Mes</th>');
                $('#tabla').append('<th >Año</th>');
                $('#tabla').append('<th >Hora</th>');
                $('#tabla').append('<th >Minutos</th>');
                $('#tabla').append('<th >Segundos</th>');
                $('#tabla').append('<th >Estado</th>');
                $('#tabla').append('<tbody class="body" id="body" ></tbody>');


                for (var i = 0; i < contenidoDelArchivo.marcas.length; i++) {
                    if ((contenidoDelArchivo.marcas[i].codTarjeta) == (contenidoDelArchivo.usuario.codTarjeta)) {
                        $('#body').append('<tr ></tr>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].codTarjeta + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].tipoMarca + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].dia + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].mes + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].ano + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].hora + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].minutos + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].segundos + '</td>');
                        $('#body').append('<td >' + contenidoDelArchivo.marcas[i].estado + '</td>');
                    }

                }
            } else {
                $('#marcas').append('<p>No tiene Marcas registradas</p > ');
            }


        });

    });
});