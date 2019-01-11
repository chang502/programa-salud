/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var appointmentsforthefuture_panel = Ext.create({
    xtype: 'form',
    //renderTo: 'main-container',
    //width: 900,

    items: [
        {
            xtype: 'fieldset',
            title: 'Próximas Citas',
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
                            xtype: 'datefield',
                            fieldLabel: 'Fecha'
                        }, {
                            xtype: 'timefield',
                            fieldLabel: 'Hora'
                        }, {
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
                            xtype: 'textfield',
                            fieldLabel: 'Identificación'
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Nombre Paciente'
                        }, {
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
                                        this.up('form').reset();
                                    }
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'grid',
                    store: appointment_store,
                    columns: [
                        {text: 'Fecha', dataIndex: 'fecha'},
                        {text: 'Hora', dataIndex: 'hora'},
                        {text: 'Tipo Paciente', dataIndex: 'tipoPersona'},
                        {text: 'Identificacion', dataIndex: 'idPersona'},
                        {text: 'Doctor', dataIndex: 'doctor'},
                        {text: 'Síntoma', dataIndex: 'sintoma'},
                        {
                            xtype: 'actioncolumn',
                            text: 'Acciones',
                            defaults: {padding: '5 15 5 15', cls: 'margin-right: 8px;'},
                            width: 100,
                            items: [
                                {
                                    icon: 'images/icons/vcard.png',
                                    tooltip: 'Ver ficha del paciente',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                        //editRec(rec);
                                    }
                                }, {
                                    icon: 'images/icons/page_edit.png',
                                    tooltip: 'Editar registro',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                        editRec(rec);
                                    }
                                }, {
                                    icon: 'images/icons/cross.png',
                                    tooltip: 'Eliminar registro',
                                    handler: function (grid, rowIndex, colIndex) {
                                        var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                        deleteRec(rec);
                                    }
                                }]
                        }
                    ],
                    maxHeight: 250
                }
            ]
        }
    ]
});