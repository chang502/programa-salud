Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Paciente',
                padding: '5 5 5 5',
                layout: {
                    type: 'table',
                    columns: 4
                },
                defaults: {
                    padding: '5 15 5 15'
                },
                items: [
                    {
                        xtype: 'label',
                        text: 'Paciente:'
                    },{
                        html: '<h2>NOMBRE PACIENTE</h2>'
                    },{
                        xtype: 'label',
                        text: 'Síntoma:'
                    }, {
                        html: '<h2>SÍNTOMA</h2>'
                    }
                    ,
                    {
                        xtype: 'label',
                        text: 'Hora inicio:'
                    },{
                        html: '<h3>'+(     ("0" + new Date().getHours()).slice(-2) + ":" + ("0" + new Date().getMinutes()).slice(-2)       )+'</h3>'
                    }

                ]
            }, {
                xtype: 'fieldset',
                title: 'Toma de Medidas',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Medida 1'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Medida 2'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Medida 3'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Medida n'
                    },
                    {
                        xtype: 'container',
                        pack: 'end',
                        width: 305,
                        colspan: 2,
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Guardar Medidas',
                                anchor: '-50%'
                            }
                        ]
                    }
                ]
            }, {
                xtype: 'fieldset',
                title: 'Diagnóstico y Acciones',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                items: [
                    {
                        xtype: 'textarea',
                        fieldLabel: 'Diagnóstico',
                        width: 700,
                        minHeight: 200,
                        height: 200,
                        grow: true,
                        minGrow: 200
                    },{
                        xtype: 'combo',
                        fieldLabel: 'Acción',
                        store: {
                            fields: ['id', 'nombre'],
                            data: [
                                {"id": "tipo1", "nombre": "Laboratorios"},
                                {"id": "tipo2", "nombre": "Medicamentos"},
                                {"id": "tipo3", "nombre": "Acción 3"}
                            ]
                        },
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: 'Observaciones'
                    },
                    {
                        xtype: 'container',
                        pack: 'end',
                        width: 305,
                        colspan: 2,
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
                    }
                ]
            },{
                        xtype: 'container',
                        pack: 'end',
                        width: 305,
                        colspan: 2,
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Finalizar Cita',
                                anchor: '-50%'
                            }
                        ]
                    },
            patienthistory_panel
        ]
    });
    
    
           // patienthistory_panel.collapse();
    
});