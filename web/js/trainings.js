Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();



/*
 var tiposPersona = Ext.create('Ext.data.Store', {
 fields: ['tipoPersona', 'nombre'],
 data: [
 {"tipoPersona": "estudiante", "nombre": "Estudiante"},
 {"tipoPersona": "personalDocente", "nombre": "Personal Docente"},
 {"tipoPersona": "personalAdministrativo", "nombre": "Personal Administrativo"}
 ]
 });
 
 */
function editRec(rec) {
    Ext.create('Ext.window.Window', {
        title: 'Editar Registro',
        //height: 400,
        //width: 580,
        padding: '5 5 5 5',
        defaults: {
            padding: '5 15 5 15'
        },
        modal: true,
        layout: {
            type: 'table',
            columns: 2
        },
        buttons: [
            {text: 'Aceptar'},
            {text: 'Cancelar', handler: function () {
                    this.up('window').close();
                }}
        ],
        items: [
            {
                xtype: 'textfield',
                fieldLabel: 'Nombre'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Descripción'
            }, {
                xtype: 'combo',
                fieldLabel: 'Tipo',
                store: {
                    fields: ['id', 'value'],
                    data: [
                        {"id": 'capacitacion', "value": "Capacitación"},
                        {"id": 'cursoLibre', "value": "Curso Libre"}
                    ]
                },
                queryMode: 'local',
                displayField: 'value',
                valueField: 'id'
            }, {
                xtype: 'textfield',
                fieldLabel: 'Estado'
            }, {
                xtype: 'datefield',
                fieldLabel: 'Fecha inicio'
            }, {
                xtype: 'datefield',
                fieldLabel: 'Fecha fin'
            }
        ]
    }).show();
}



function editSubRec(rec) {
    Ext.create('Ext.window.Window', {
        title: 'Editar Registro',
        //height: 400,
        //width: 580,
        padding: '5 5 5 5',
        defaults: {
            padding: '5 15 5 15'
        },
        modal: true,
        layout: {
            type: 'table',
            columns: 2
        },
        buttons: [
            {text: 'Aceptar'},
            {text: 'Cancelar', handler: function () {
                    this.up('window').close();
                }}
        ],
        items: [
            {
                        xtype: 'combo',
                        fieldLabel: 'Capacitación',
                        store: {
                            fields: ['idCapacitacion', 'nombre'],
                            data: [
                                {"idCapacitacion": 1, "nombre": "Capacitación 1"},
                                {"idCapacitacion": 2, "nombre": "Capacitación 2"},
                                {"idCapacitacion": 3, "nombre": "Capacitación 3"},
                                {"idCapacitacion": 4, "nombre": "Capacitación 4"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'idCapacitacion'
                    }, {
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
                    }
        ]
    }).show();
}



function deleteRec(rec) {
    Ext.Msg.show({
        title: 'Eliminar Registro',
        message: '¿Está seguro de eliminar el registro?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn === 'yes') {
                console.log('Yes pressed');
            } else if (btn === 'no') {
                console.log('No pressed');
            } else {
                console.log('Cancel pressed');
            }
        }
    });
}




Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Capacitación',
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
                        xtype: 'textfield',
                        fieldLabel: 'Nombre'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Descripción'
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Tipo',
                        store: {
                            fields: ['id', 'value'],
                            data: [
                                {"id": 'capacitacion', "value": "Capacitación"},
                                {"id": 'cursoLibre', "value": "Curso Libre"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'value',
                        valueField: 'id'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Estado'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha inicio'
                    }, {
                        xtype: 'datefield',
                        fieldLabel: 'Fecha fin'
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
            }, {
                xtype: 'fieldset',
                title: 'Capacitaciones',
                items: [{
                        xtype: 'grid',
                        store: {
                            fields: ['nombre', 'descripcion', 'tipo', 'estado', 'fechaInicio', 'fechaFin'],
                            data: [
                                {'nombre': 'Text', 'descripcion': 'Text', "tipo": "Text", "estado": "activo", "fechaInicio": "Text", "fechaFin": "Text"},
                                {'nombre': 'Text', 'descripcion': 'Text', "tipo": "Text", "estado": "activo", "fechaInicio": "Text", "fechaFin": "Text"},
                                {'nombre': 'Text', 'descripcion': 'Text', "tipo": "Text", "estado": "activo", "fechaInicio": "Text", "fechaFin": "Text"},
                                {'nombre': 'Text', 'descripcion': 'Text', "tipo": "Text", "estado": "activo", "fechaInicio": "Text", "fechaFin": "Text"}
                            ]
                        },

                        columns: [
                            {text: 'Nombre', dataIndex: 'nombre'},
                            {text: 'Descripción', dataIndex: 'descripcion'},
                            {text: 'Tipo', dataIndex: 'tipo'},
                            {text: 'Estado', dataIndex: 'estado'},
                            {text: 'Fecha Inicio', dataIndex: 'fechaInicio'},
                            {text: 'Fecha Fin', dataIndex: 'fechaFin'},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
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
                    }]
            }, {
                xtype: 'fieldset',
                title: 'Asistentes',
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: 'Capacitación',
                        store: {
                            fields: ['idCapacitacion', 'nombre'],
                            data: [
                                {"idCapacitacion": 1, "nombre": "Capacitación 1"},
                                {"idCapacitacion": 2, "nombre": "Capacitación 2"},
                                {"idCapacitacion": 3, "nombre": "Capacitación 3"},
                                {"idCapacitacion": 4, "nombre": "Capacitación 4"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'idCapacitacion'
                    }, {
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
                    },
                    {
                        xtype: 'container',
                        colspan: 2,
                        pack: 'end',
                        width: 610,
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Agregar',
                                anchor: '-50%'
                            }
                        ]
                    }, {
                        xtype: 'grid',
                        colspan: 2,
                        store: {
                            fields: ['capacitacion', 'tipoId', 'cui', 'nombre', 'tipo', 'fechaInicio', 'fechaFin'],
                            data: [
                                {'capacitacion': 'Text', 'cui': 'Text', 'nombre': 'Text', 'tipo': 'Text'},
                                {'capacitacion': 'Text', 'cui': 'Text', 'nombre': 'Text', 'tipo': 'Text'},
                                {'capacitacion': 'Text', 'cui': 'Text', 'nombre': 'Text', 'tipo': 'Text'},
                                {'capacitacion': 'Text', 'cui': 'Text', 'nombre': 'Text', 'tipo': 'Text'},
                                {'capacitacion': 'Text', 'cui': 'Text', 'nombre': 'Text', 'tipo': 'Text'}
                            ]
                        },

                        columns: [
                            {text: 'Capacitación', dataIndex: 'capacitacion'},
                            {text: 'Tipo Id.', dataIndex: 'tipo'},
                            {text: 'Identificación', dataIndex: 'cui'},
                            {text: 'Nombre', dataIndex: 'nombre'},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('idUsuario');
                                            editSubRec(rec);
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
});