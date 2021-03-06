
var moment = require('moment');
var Marca = require('../models/Marca');
var Usuario = require('../models/Usuario');
var Horario = require('../models/Horario');
var Departamento = require('../models/Departamento');
var Justificaciones = require('../models/Justificaciones');
var Solicitudes = require('../models/Solicitudes');
var Cierre = require('../models/Cierre');
var CierrePersonal = require('../models/CierrePersonal');
var util = require('../util/util');
var crud = require('../routes/crud');
var crudUsuario = require('../routes/crudUsuario');

module.exports = {
	escritorio : function (req, res) {
		if (req.session.name == "Supervisor") {
			var epochGte = moment().hours(0).minutes(0).seconds(0).milliseconds(0);

			var epochYesterday = moment().subtract(1, 'days').hours(23).minutes(59).seconds(59);

			/*
			*/
			var querrySupervisores = {
				_id:{
					"$ne":req.user.id
				},
				tipo:"Supervisor"
			};
			var usuarioQuery = {tipo:{'$nin': ['Administrador', "Supervisor"]}};
			crudUsuario.get(querrySupervisores, function (err, supervisores){
				crudUsuario.getEmpleadoPorSupervisor(req.user.id, usuarioQuery, 
					function(error, usuarios, departamentos){
						var queryInUsers = {
							usuario:{"$in":util.getIdsList(usuarios.concat(supervisores))},
							estado:'Pendiente'
						}; 
						Justificaciones.find(queryInUsers).populate('usuario').exec(function(error, justCount) {
							Solicitudes.find(queryInUsers).populate('usuario').exec(function(error, soliCount) {
								Marca.find({usuario: req.user.id, epoch:{"$gte": epochGte.unix()}},{_id:0,tipoMarca:1,epoch:1}).exec(function(error, marcas){
									Justificaciones.find({usuario: req.user.id, estado:'Incompleto'}).populate('usuario').exec(function(error, justificaciones) {
										Solicitudes.find({estado:'Pendiente'}).populate('usuario').exec(function(error, solicitudes) { 
											Usuario.find({_id:req.user.id},{_id:0,departamentos: 1}).populate('departamentos.departamento').exec(function(error, supervisor){
												CierrePersonal.find({epoch:{"$gte": epochYesterday.unix()}}).exec(function(err, cierres) {
													var cierreUsuarios = [];
													if(cierres && cierres.length>0)
														cierreUsuarios = cierres[0];
												//result.forEach(function(supervisor){
													var sup = {departamentos: [1]};
													var arrayMarcas = util.eventosAjuste(marcas, sup, "escritorioEmpl");

													var array = [];
													for(var y = 0; y < req.user.departamentos.length; y++){
														array.push(req.user.departamentos[y].departamento);
													}
													just = util.eventosAjuste(justificaciones, req.user, "count");
													soli = util.eventosAjuste(solicitudes, req.user, "count");

													/*var horasSemanales;
													(epochGte.day() === 1) ? horasSemanales = 0 : (cierres.length == 0) ? horasSemanales = '' : horasSemanales = cierres[0].horasSemanales;
													*/
													var arrayJust = util.unixTimeToRegularDate(justificaciones);
													if (error) return res.json(error);
													//console.log(cierreUsuarios);
													return res.render('escritorio', {
														title: 'Escritorio Supervisor | SIGUCA',
														departamentos: supervisor[0].departamentos, 
														justificaciones: arrayJust, 
														solicitudes: soli,
														justCount: justCount.length, 
														soliCount: soliCount.length,
														todos: array,
														usuario: req.user,
														marcas: marcas,
														cierreUsuarios: cierreUsuarios,
														//horasSemanales: horasSemanales
													});
					                               // });//Supervisor
					                            });//Horas Semanales
					                        });//Departamentos    
					                    });//solicitudes
					                });//Justificaciones
					            });//Marcas
			                });//solicitudes
			            });//Justificaciones
			        });//Justificaciones
			    });//Justificaciones
				//
			} else {
				req.logout();
				res.redirect('/');
			}
		},
		escritorioEmpl : function (req, res) {
			if (req.session.name == "Empleado") {
        	//Se toma la hora actual
        	var epochGte = moment();
        	epochGte.hours(0);
        	epochGte.minutes(0);
        	epochGte.seconds(0);

        	var actualEpoch = moment();

	        //Se busca en la base de datos todas las marcas realizadas por el usuario
    		//Se busca en la base de datos las marcas del mismo día
	        //console.log(req.user.id);
	        Marca.find(
	        	{usuario: req.user.id, epoch:{"$gte": epochGte.unix()}},
	        	{_id:0,tipoMarca:1,epoch:1}
	        	).exec(
	        	function(error, marcas) {
	        		if (error) return res.json(error);
	        		Justificaciones.find(
	        			{usuario: req.user.id, estado:'Incompleto'}
	        			).exec(function(err, justificaciones) {
	        				if (err) return res.json(err);
	        				var supervisor = {departamentos: [1]};
	        				var arrayMarcas = util.eventosAjuste(marcas, supervisor, "escritorioEmpl");
	        				var arrayJust = util.unixTimeToRegularDate(justificaciones, true);
	        				return res.render('escritorio', {
	        					title: 'Escritorio Empleado | SIGUCA',
	        					usuario: req.user, 
	        					marcas: arrayMarcas,
	        					justificaciones : arrayJust
	        				});
	        			});
	        		//
	        	});
	    	//Buscar las justificaciones que se llamen "Pendiente "
	    } else {
	    	req.logout();
	    	res.redirect('/');
	    }
	},
	escritorioAdmin : function (req, res) {
		if (req.session.name ==="Administrador") {
			Usuario.find().exec(function(error, usuarios) {
				Horario.find().exec(function(error, horarios) {
					Departamento.find().exec(function(error, departamentos) {
						if (error) return res.json(error);
						return res.render('escritorio', {
							title: 'Escritorio Administrador | SIGUCA',
							usuario: req.user,
							horarios: horarios,
							departamentos: departamentos,
							usuarios: usuarios,
						});
					});
				});
			});
		} else {
			req.logout();
			res.redirect('/');
		}
	}
};
