/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var scheduleappointment_panel = Ext.create({
    xtype: 'form',
    //renderTo: 'main-container',
    //width: 900,
    items: [
        {
            xtype: 'fieldset',
            title: 'Programar Cita',
            layout: {
                type: 'table',
                columns: 2
            },
            padding: '5 5 5 5',
            defaults: {
                padding: '5 15 5 15'
            },
            buttonAlign: 'right',
            items: [
                {
                    xtype: 'combo',
                    fieldLabel: 'Tipo Persona',
                    store: {
                        fields: ['tipoPersona', 'nombre'],
                        data: [
                            {"tipoPersona": "estudiante", "nombre": "Estudiante"},
                            {"tipoPersona": "personalDocente", "nombre": "Personal Docente"},
                            {"tipoPersona": "personalAdministrativo", "nombre": "Personal Administrativo"}
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'nombre',
                    valueField: 'tipoPersona'
                }, {
                    xtype: 'combo',
                    fieldLabel: 'Tipo Identificación',
                    store: {
                        fields: ['tipoDocumento', 'nombre'],
                        data: [
                            {"tipoDocumento": "dpi", "nombre": "DPI"},
                            {"tipoDocumento": "tarjetaov", "nombre": "Número de Orientación Vocacional"},
                            {"tipoDocumento": "carnet", "nombre": "Carnet Universitario"},
                            {"tipoDocumento": "pasaporte", "nombre": "Pasaporte"},
                            {"tipoDocumento": "licencia", "nombre": "Licencia de Conducir"}
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'nombre',
                    valueField: 'tipoDocumento'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Identificación'
                }, {
                    xtype: 'textfield',
                    fieldLabel: 'Correo',
                    vtype: 'email'
                },{
                    xtype: 'combo',
                    fieldLabel: 'Clínica',
                    store: {
                        fields: ['id', 'nombre'],
                        data: [
                            {"id": "clinica1", "nombre": "Clínica 1"},
                            {"id": "clinica2", "nombre": "Clínica 2"},
                            {"id": "clinica3", "nombre": "Clínica 3"}
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'nombre',
                    valueField: 'id'
                },{
                    xtype: 'combo',
                    fieldLabel: 'Doctor',
                    store: {
                        fields: ['id', 'nombre'],
                        data: [
                            {"id": "doctor1", "nombre": "Doctor 1"},
                            {"id": "doctor2", "nombre": "Doctor 2"},
                            {"id": "doctor3", "nombre": "Doctor 3"}
                        ]
                    },
                    queryMode: 'local',
                    displayField: 'nombre',
                    valueField: 'id'
                }, {
                    xtype: 'datefield',
                    fieldLabel: 'Fecha'
                }, {
                    xtype: 'timefield',
                    fieldLabel: 'Hora'
                }, {
                    xtype: 'textarea',
                    colspan: 2,
                    fieldLabel: 'Síntoma',
                    width: 580
                },
                {
                    xtype: 'container',
                    pack: 'end',
                    colspan: 2,
                    layout: {
                        type: 'hbox',
                        pack: 'end'
                    },
                    items: [
                        {
                            xtype: 'button',
                            text: 'Crear',
                            anchor: '-50%'
                        }
                    ]
                }
            ]
        }
    ]
});