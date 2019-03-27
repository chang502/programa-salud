/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();



var store_disciplinas = Ext.create('Ext.data.Store', {
    fields: ['id_disciplina', 'nombre', 'limite', 'semestre', 'nombre_encargado'],
    proxy: {
        type: 'ajax',
        url: 'controller/disciplines',
        reader: {type: 'json',
            root: 'data'
        }
    }
});



var store_semestres = Ext.create('Ext.data.Store', {
    fields: ['semestre'],
    proxy: {
        type: 'ajax',
        url: 'controller/semesters',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


function editRec(rec) {


    Ext.Ajax.request({
        url: 'controller/disciplines/' + rec,

        success: function (f, opts) {
            var resultado = eval('(' + f.responseText + ')');
            if (resultado.success) {

                var frmEdit = Ext.create({
                    xtype: 'form',
                    padding: '5 5 5 5',
                    defaults: {
                        padding: '5 15 5 15',
                        selectOnFocus: true
                    },
                    modal: true,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    items: [
                        {
                            xtype: 'hidden',
                            name: 'id_disciplina',
                            value: resultado.data[0].id_disciplina
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Semestre',
                            store: store_semestres,
                            queryMode: 'local',
                            colspan: 2,
                            displayField: 'semestre',
                            valueField: 'semestre',
                            name: 'semestre',
                            allowBlank: false,
                            value: resultado.data[0].semestre
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Nombre disciplina',
                            name: 'nombre',
                            allowBlank: false,
                            maxLength: 100,
                            enforceMaxLength: true,
                            value: resultado.data[0].nombre
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: 'Límite',
                            name: 'limite',
                            minValue: 0,
                            allowBlank: false,
                            hideTrigger: true,
                            value: resultado.data[0].limite
                        }, 
                        
                        
                        {
                        xtype: 'fieldset',
                        title: 'Días',
                        defaultType: 'checkboxfield',
                        margin: '0 0 5 10',
                        width: 280,
                        items: [
                            {
                                boxLabel: 'Lunes',
                                name: 'flg_lunes',
                                inputValue: 1,
                                value: resultado.data[0].flg_lunes?1:0,
                                id: 'checkbox1_'
                            }, {
                                boxLabel: 'Martes',
                                name: 'flg_martes',
                                inputValue: 1,
                                value: resultado.data[0].flg_martes?1:0,
                                id: 'checkbox2_'
                            }, {
                                boxLabel: 'Miércoles',
                                name: 'flg_miercoles',
                                inputValue: 1,
                                value: resultado.data[0].flg_miercoles?1:0,
                                id: 'checkbox3_'
                            }, {
                                boxLabel: 'Jueves',
                                name: 'flg_jueves',
                                inputValue: 1,
                                value: resultado.data[0].flg_jueves?1:0,
                                id: 'checkbox4_'
                            }, {
                                boxLabel: 'Viernes',
                                name: 'flg_viernes',
                                inputValue: 1,
                                value: resultado.data[0].flg_viernes?1:0,
                                id: 'checkbox5_'
                            }, {
                                boxLabel: 'Sábado',
                                name: 'flg_sabado',
                                inputValue: 1,
                                value: resultado.data[0].flg_sabado?1:0,
                                id: 'checkbox6_'
                            }
                        ]
                    },{
                        xtype: 'panel',
                        defaults: {
                            padding: '15 5 25 15',
                            selectOnFocus: true
                        },
                        items: [
                            {
                                xtype: 'timefield',
                                fieldLabel: 'Hora Inicio',
                                format: 'H:i',
                                minValue: '06:00',
                                maxValue: '20:00',
                                value: resultado.data[0].hora_inicio,
                                increment: 10,
                                name: 'hora_inicio'
                            },{
                                xtype: 'timefield',
                                fieldLabel: 'Hora Fin',
                                format: 'H:i',
                                minValue: '06:00',
                                maxValue: '20:00',
                                value: resultado.data[0].hora_fin,
                                increment: 10,
                                name: 'hora_fin'
                            }
                        ]
                    }
                        
                        ,getPersonTextBox({id_persona:resultado.data[0].id_persona, nombre_completo:resultado.data[0].persona_encargada, panelConfig: {colspan: 2}})



                    ]
                });

                var vent = Ext.create('Ext.window.Window', {
                    title: 'Editar Registro',
                    defaultButton: 'doUpdate',
                    referenceHolder: true,
                    buttons: [
                        {
                            text: 'Aceptar',
                            reference: 'doUpdate',
                            handler: function () {
                                if (!frmEdit.isValid()) {
                                } else {
                                    var data = frmEdit.getValues();
                                    data.id_persona = frmEdit.items.items[6].items.items[0].value;
                                    
                                    frmEdit.mask("Espere");
                                    Ext.Ajax.request({
                                        url: 'controller/updatediscipline',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                store_disciplinas.load();
                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                                            } else {
                                                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {
                                            frmEdit.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                    });
                                }
                            }
                        },
                        {text: 'Cancelar', handler: function () {
                                this.up('window').close();
                            }}
                    ],
                    items: frmEdit
                }).show();



            } else {
                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
            }
        },

        failure: function (response, opts) {
            //
        }
    });

}



function deleteRec(rec) {
    Ext.Msg.show({
        title: 'Eliminar Registro',
        message: '¿Está seguro de eliminar el registro?',
        buttons: Ext.Msg.YESNO,
        icon: Ext.Msg.QUESTION,
        fn: function (btn) {
            if (btn === 'yes') {
                Ext.Ajax.request({
                    url: 'controller/deletediscipline',
                    method: 'POST',
                    jsonData: '{"id_disciplina": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_disciplinas.load();
                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                });
            } else if (btn === 'no') {
                console.log('No pressed');
            } else {
                console.log('Cancel pressed');
            }
        }
    });
}

Ext.onReady(function () {
    store_disciplinas.load();

    comboSemestre = Ext.create({
        xtype: 'combo',
        fieldLabel: 'Semestre',
        store: store_semestres,
        colspan: 2,
        queryMode: 'local',
        displayField: 'semestre',
        valueField: 'semestre',
        name: 'semestre',
        allowBlank: false
    });

    store_semestres.load(function () {
        if (store_semestres.getCount() > 1) {
            comboSemestre.select(store_semestres.getAt(1));
        } else if (store_semestres.getCount() > 0) {
            comboSemestre.select(store_semestres.getAt(0));
        }

    });





    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        defaultButton: 'doCreate',
        referenceHolder: true,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Disciplina',
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15',
                    selectOnFocus: true
                },
                items: [
                    comboSemestre,
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Nombre disciplina',
                        name: 'nombre',
                        allowBlank: false,
                        maxLength: 100,
                        enforceMaxLength: true
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: 'Límite',
                        name: 'limite',
                        minValue: 0,
                        allowBlank: false,
                        hideTrigger: true
                    }, {
                        xtype: 'fieldset',
                        title: 'Días',
                        defaultType: 'checkboxfield',
                        margin: '0 0 5 10',
                        width: 280,
                        items: [
                            {
                                boxLabel: 'Lunes',
                                name: 'flg_lunes',
                                inputValue: 1,
                                id: 'checkbox1'
                            }, {
                                boxLabel: 'Martes',
                                name: 'flg_martes',
                                inputValue: 1,
                                id: 'checkbox2'
                            }, {
                                boxLabel: 'Miércoles',
                                name: 'flg_miercoles',
                                inputValue: 1,
                                id: 'checkbox3'
                            }, {
                                boxLabel: 'Jueves',
                                name: 'flg_jueves',
                                inputValue: 1,
                                id: 'checkbox4'
                            }, {
                                boxLabel: 'Viernes',
                                name: 'flg_viernes',
                                inputValue: 1,
                                id: 'checkbox5'
                            }, {
                                boxLabel: 'Sábado',
                                name: 'flg_sabado',
                                inputValue: 1,
                                id: 'checkbox6'
                            }
                        ]
                    },{
                        xtype: 'panel',
                        defaults: {
                            padding: '15 5 25 15',
                            selectOnFocus: true
                        },
                        items: [
                            {
                                xtype: 'timefield',
                                fieldLabel: 'Hora Inicio',
                                format: 'H:i',
                                minValue: '06:00',
                                maxValue: '20:00',
                                increment: 10,
                                name: 'hora_inicio'
                            },{
                                xtype: 'timefield',
                                fieldLabel: 'Hora Fin',
                                format: 'H:i',
                                minValue: '06:00',
                                maxValue: '20:00',
                                increment: 10,
                                name: 'hora_fin'
                            }
                        ]
                    }
                    ,
                    getPersonTextBox({
                                panelConfig: {padding: '0 0 0 5'}
                            })
                    ,
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
                                reference: 'doCreate',
                                anchor: '-50%',
                                handler: function () {
                                    //Ext.Msg.wait("Iniciando Sesi&oacute;n...","Espere");
                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        form.mask("Espere");
                                        var data = form.getValues();
                                        
                                        //adding hiddenfield value
                                        data.id_persona=form.items.items[0].items.items[5].items.items[0].value;
                                        
                                        Ext.Ajax.request({
                                            url: 'controller/creatediscipline',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                form.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    store_disciplinas.load();
                                                } else {
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                }
                                            },
                                            failure: function (f, g) {
                                                form.unmask();
                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        });
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: 'Disciplinas',
                items: [
                    {
                        xtype: 'grid',
                        store: store_disciplinas,

                        columns: [
                            {hidden: true, dataIndex: 'id_disciplina'},
                            {text: 'Nombre', dataIndex: 'nombre', width: 200},
                            {text: 'Límite/Asignados/Disponibles', dataIndex: 'resumen_cantidad', width: 150},
                            {text: 'Días', dataIndex: 'dias', width: 150},
                            {text: 'Horas', dataIndex: 'horas', width: 90},
                            {text: 'Nombre Encargado', dataIndex: 'nombre_completo', width: 250},
                            {text: 'Semestre', dataIndex: 'semestre'},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_disciplina');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_disciplina');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ],
                        maxHeight: 350
                    }
                ]

            }
        ]
    });
});

