/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Ext, comboSemestre */

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
        url: 'controller/student_disciplines',
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








Ext.onReady(function () {






    comboSemestre = Ext.create({
        xtype: 'combo',
        fieldLabel: 'Semestre',
        store: store_semestres,
        colspan: 2,
        queryMode: 'local',
        displayField: 'semestre',
        valueField: 'semestre',
        name: 'semestre',
        allowBlank: false,
        listeners: {
            change: function (cbo, newValue, oldValue, eOpts) {
                store_disciplinas.load({params: {semestre: newValue}});
                store_estudiantes_deportes.load({params: {semestre: newValue, id_disciplina: cbo.ownerCt.items.items[1].value}});
            }
        }
    });
    
    
    

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
                    jsonData: '{"id_asignacion_deportes": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_estudiantes_deportes.load({params: {semestre: comboSemestre.value, id_disciplina: comboSemestre.ownerCt.items.items[1].value}});
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


    store_semestres.load(function () {
        if (store_semestres.getCount() > 1) {
            comboSemestre.select(store_semestres.getAt(1));
            //store_disciplinas.load({params: {semestre: comboSemestre.value}});
           // window.console.log('111111');
            //store_estudiantes_deportes.load({params: {semestre: comboSemestre.value}});
        } else if (store_semestres.getCount() > 0) {
            comboSemestre.select(store_semestres.getAt(0));
            //store_disciplinas.load({params: {semestre: comboSemestre.value}});
           // window.console.log('222222');
            //store_estudiantes_deportes.load({params: {semestre: comboSemestre.value}});
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
                                handler: function () {
                                    console.log(frmPpal.items.items[0]);
                                    store_estudiantes_deportes.getProxy().extraParams.semestre = frmPpal.items.items[0].items.items[0].value;
                                    store_estudiantes_deportes.getProxy().extraParams.id_disciplina = frmPpal.items.items[0].items.items[1].value;

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
                            {hidden: true, dataIndex: 'id_asignacion_deportes'},
                            {text: 'Nombre', dataIndex: 'nombre_completo', width: 180},
                            {text: 'CUI', dataIndex: 'cui', width: 115},
                            {text: 'Carnet', dataIndex: 'carnet'},
                            {text: 'NOV', dataIndex: 'nov'},
                            {text: 'Disciplina', dataIndex: 'nombre', width: 150},
                            {text: 'Semestre', dataIndex: 'sem', width: 160},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 40,
                                items: [{
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_asignacion_deportes');
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



    //store_estudiantes_deportes.load({params:{semestre:comboSemestre.value}});
});