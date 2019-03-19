/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.require([
   'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




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

var store_disciplinas = Ext.create('Ext.data.Store', {
    fields: ['id_disciplina', 'nombre', 'descripcion'],
    proxy: {
        type: 'ajax',
        url: 'controller/disciplines',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var yesNoStore = Ext.create('Ext.data.Store', {
    fields: ['id', 'value'],
    data: [
        {"id": 0, "value": "No"},
        {"id": 1, "value": "Sí"}
    ]
});

var store_estudiantes_deportes = Ext.create('Ext.data.Store', {
    fields: ['id_estudiante_deportes', 'id_tipo_documento', 'tipo_documento', 'numero_documento', 'email', 'peso', 'estatura', 'cualidades_especiales', 'id_disciplina', 'disciplina'],
    proxy: {
        type: 'ajax',
        url: 'controller/students',
        reader: {type: 'json',
            root: 'data'
        }
    }
});
















function editRec(rec) {
    
    Ext.Ajax.request({
        url: 'controller/students/' + rec,

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
                            name: 'id_estudiante_deportes',
                            value: resultado.data[0].id_estudiante_deportes
                        },
                        {
                            xtype: 'combo',
                            fieldLabel: 'Tipo documento',
                            store: store_tipos_documento,
                            queryMode: 'local',
                            colspan: 2,
                            displayField: 'nombre',
                            valueField: 'id_tipo_documento',
                            value: resultado.data[0].id_tipo_documento,
                            name: 'id_tipo_documento',
                            allowBlank: false
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: 'Número Documento',
                            value: resultado.data[0].numero_documento,
                            name: 'numero_documento',
                            hideTrigger: true,
                            minValue: 1,
                            maxValue: 999999999999999999,
                            allowBlank: false
                        }, {
                            xtype: 'textfield',
                            fieldLabel: 'Correo Electrónico',
                            vtype: 'email',
                            value: resultado.data[0].email,
                            name: 'email',
                            allowBlank: false
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: 'Peso (lb)',
                            value: resultado.data[0].peso,
                            name: 'peso',
                            allowBlank: false,
                            hideTrigger: true,
                            minValue: 1,
                            maxValue: 1000
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: 'Estatura (m)',
                            value: resultado.data[0].estatura,
                            name: 'estatura',
                            allowBlank: false,
                            hideTrigger: true,
                            allowDecimals: true,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            minValue: 0.01,
                            step: 0.01,
                            maxValue: 4
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Cualidades Especiales',
                            store: yesNoStore,
                            queryMode: 'local',
                            displayField: 'value',
                            valueField: 'id',
                            value: resultado.data[0].cualidadesespeciales,
                            name: 'cualidades_especiales',
                            allowBlank: false
                        }, {
                            xtype: 'combo',
                            fieldLabel: 'Disciplina',
                            store: store_disciplinas,
                            queryMode: 'local',
                            displayField: 'nombre',
                            valueField: 'id_disciplina',
                            value: resultado.data[0].id_disciplina,
                            name: 'id_disciplina',
                            allowBlank: false
                        }
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
                                    frmEdit.mask("Espere");
                                    Ext.Ajax.request({
                                        url: 'controller/updatestudent',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            frmEdit.unmask();
                                            if (resultado.success) {
                                                vent.close();
                                                store_estudiantes_deportes.load();
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
                    url: 'controller/deletestudent',
                    method: 'POST',
                    jsonData: '{"id_estudiante_deportes": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_estudiantes_deportes.load();
                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                });
            } else if (btn === 'no') {

            } else {

            }
        }
    });
}




Ext.onReady(function () {
    
    store_disciplinas.load();
    store_estudiantes_deportes.load();
    
    
    
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
    
    var frmPpal = Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        defaultButton: 'doSearch',
        referenceHolder: true,
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
                    padding: '5 15 5 15',
                    selectOnFocus: true
                },
                buttonAlign: 'right',
                items: [
                    comboSemestre
                    , 
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Número Documento'
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Disciplina',
                        colspan: 2,
                        store: store_disciplinas,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_disciplina'
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
                                reference: 'doSearch',
                                margin: '0 15 0 0',
                                handler: function(){
                                    console.log(frmPpal.items.items[0]);
                                    store_estudiantes_deportes.getProxy().extraParams.id_tipo_documento=frmPpal.items.items[0].items.items[0].value;
                                    store_estudiantes_deportes.getProxy().extraParams.numero_documento=frmPpal.items.items[0].items.items[1].value;
                                    store_estudiantes_deportes.getProxy().extraParams.id_disciplina=frmPpal.items.items[0].items.items[2].value;
                                    
                                    store_estudiantes_deportes.load();
                                }
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
                title: 'Estudiantes',
                items: [{
                        xtype: 'grid',
                        store: store_estudiantes_deportes,

    fields: ['id_estudiante_deportes', 'id_tipo_documento', 'tipo_documento', 'numero_documento', 'email', 'peso', 'estatura', 'cualidades_especiales', 'id_disciplina', 'disciplina'],
    
    
    
                        columns: [
                            {hidden: true, dataIndex: 'id_estudiante_deportes'},
                            {text: 'Tipo Doc', dataIndex: 'tipo_documento'},
                            {text: 'Numeración', dataIndex: 'numero_documento'},
                            {text: 'Correo', dataIndex: 'email'},
                            {text: 'Peso', dataIndex: 'peso'},
                            {text: 'Estatura', dataIndex: 'estatura'},
                            {text: 'Cualidades Especiales', dataIndex: 'cualidades_especiales'},
                            {text: 'Disciplina', dataIndex: 'disciplina'},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_estudiante_deportes');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_estudiante_deportes');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ],
                        maxHeight: 450
                    }]
            }
        ]
    });
});