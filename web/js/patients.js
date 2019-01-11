/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




Ext.onReady(function () {
    var frmPpal = Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                collapsible: true,
                title: 'Filtros',
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
                        fieldLabel: 'Tipo Paciente',
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
                        fieldLabel: 'Tipo identificación',
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
                        valueField: 'tipoDoc'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Número Identificación'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Nombres'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Apellidos'
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Sexo',
                        store: {
                            fields: ['id', 'value'],
                            data: [
                                {"['id": 0, "value": "Masculino"},
                                {"['id": 1, "value": "Femenino"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'value',
                        valueField: 'id'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha Nacimiento',
                        colspan: 2
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
                                text: 'Buscar',
                                margin: '0 15 0 0'
                            }, {
                                xtype: 'button',
                                text: 'Limpiar',
                                handler: function () {
                                    frmPpal.reset();
                                }
                            }
                        ]
                    }
                ]
            }, {
                xtype: 'fieldset',
                title: 'Pacientes',
                items: [{
                        xtype: 'grid',
                        store: {
                            fields: ['tipoDocumento', 'nuemroDocumento', 'peso', 'estatura', 'cualidadesEspeciales', 'disciplina'],
                            data: [
                                {'tipoDocumento': 'Text', 'nuemroDocumento': 'Text', 'peso': 'Text', 'estatura': 'Text', 'cualidadesEspeciales': 'Text', 'disciplina': 'Text'},
                                {'tipoDocumento': 'Text', 'nuemroDocumento': 'Text', 'peso': 'Text', 'estatura': 'Text', 'cualidadesEspeciales': 'Text', 'disciplina': 'Text'},
                                {'tipoDocumento': 'Text', 'nuemroDocumento': 'Text', 'peso': 'Text', 'estatura': 'Text', 'cualidadesEspeciales': 'Text', 'disciplina': 'Text'},
                                {'tipoDocumento': 'Text', 'nuemroDocumento': 'Text', 'peso': 'Text', 'estatura': 'Text', 'cualidadesEspeciales': 'Text', 'disciplina': 'Text'},
                            ]
                        },

                        columns: [
                            {text: 'Tipo Persona', dataIndex: 'tipoDocumento'},
                            {text: 'Tipo Id', dataIndex: 'nuemroDocumento'},
                            {text: 'Identificación', dataIndex: 'peso'},
                            {text: 'Nombres', dataIndex: 'estatura'},
                            {text: 'Apellidos', dataIndex: 'cualidadesEspeciales'},
                            {text: 'Fecha Nacimiento', dataIndex: 'disciplina'},
                            {text: 'Acciones', dataIndex: 'disciplina'},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/vcard.png',
                                        tooltip: 'Ver ficha del paciente',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                            //editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/add.png',
                                        tooltip: 'Crear cita',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                            //deleteRec(rec);
                                        }
                                    }]
                            }
                        ],
                        maxHeight: 250
                    }]
            }
        ]
    });
});