
/* global store_citas_de_hoy */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var store_citas_futuras = Ext.create('Ext.data.Store', {
    fields: ["id_cita", "id_persona", "id_doctor", "id_clinica", 'fecha', 'hora', 'paciente', 'atiende', 'clinica', 'sintoma'],
    proxy: {
        type: 'ajax',
        url: 'controller/futureappointments',
        reader: {type: 'json',
            root: 'data'
        }
    }
});
function getAppointmentsForTheFuturePanel(conf) {

    store_citas_futuras.load();

    if (conf === undefined) {
        conf = {afterSuccess: function () {}};
    }
    
    var appointmentsforthefuture_panel = Ext.create({
        xtype: 'form',
        //renderTo: 'main-container',
        //width: 900,

        items: [
            {
                xtype: 'fieldset',
                title: 'Próximas Citas',
                items: [
                    /*
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
                    }, 
                    */
                    {
                        xtype: 'grid',
                        store: store_citas_futuras,
                        height: 250,
                        columns: [
                            {hidden: true, dataIndex: 'id_cita'},
                            {hidden: true, dataIndex: 'id_persona'},
                            {hidden: true, dataIndex: 'id_doctor'},
                            {hidden: true, dataIndex: 'id_clinica'},
                            {text: 'Fecha', dataIndex: 'fecha', width: 90},
                            {text: 'Hora', dataIndex: 'hora', width: 60},
                            {text: 'Paciente', dataIndex: 'paciente', width: 140},
                            {text: 'Atiende', dataIndex: 'atiende', width: 140},
                            {text: 'Clínica', dataIndex: 'clinica'},
                            {text: 'Síntoma', dataIndex: 'sintoma', width: 205},
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
                                            var rec = grid.getStore().getAt(rowIndex).get('id_cita');
                                            //editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_cita');
                                            editarCita(rec, function(){
                                                store_citas_futuras.load();
                                                store_citas_de_hoy.load();
                                            });
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_cita');
                                            borrarCita(rec, function(){
                                                store_citas_futuras.load();
                                                store_citas_de_hoy.load();
                                            });
                                        }
                                    }]
                            }
                        ]
                    }
                ]
            }
        ]
    });

    return appointmentsforthefuture_panel;
}