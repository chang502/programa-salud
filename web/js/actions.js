/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();

var store_acciones = Ext.create('Ext.data.Store', {
    fields: ['id_accion', 'nombre'],
    proxy: {
        type: 'ajax',
        url: 'controller/actions',
        reader: {type: 'json',
            root: 'data'
        }
    }
});









function editRec(rec) {


    Ext.Ajax.request({
        url: 'controller/actions/' + rec,

        success: function (f, opts) {
            var resultado = eval('(' + f.responseText + ')');
            if (resultado.success) {
                if (resultado.rows > 0) {

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
                                name: 'id_accion',
                                value: resultado.data[0].id_accion
                            }, {
                                xtype: 'textfield',
                                width: 300,
                                fieldLabel: 'Nombre',
                                name: 'nombre',
                                allowBlank: false,
                                maxLength: 150,
                                enforceMaxLength: true,
                                value: resultado.data[0].nombre
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
                                            url: 'controller/updateaction',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                var resultado = eval('(' + f.responseText + ')');
                                                frmEdit.unmask();
                                                if (resultado.success) {
                                                    vent.close();
                                                    store_acciones.load();
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


                }else{
                    Ext.Msg.show({title: "Error", msg: "El registro no existe", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR, fn:function(btn){store_acciones.load();}});
                }

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
                    url: 'controller/deleteaction',
                    method: 'POST',
                    jsonData: '{"id_accion": "' + rec + '"}',
                    success: function (f, opts) {
                        var resultado = eval('(' + f.responseText + ')');
                        if (resultado.success) {
                            Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                            store_acciones.load();
                        } else {
                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                        }
                    },
                    failure: function (response, opts) {
                        Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                });
            } else if (btn === 'no') {
                //console.log('No pressed');
            } else {
                //console.log('Cancel pressed');
            }
        }
    });
}





















Ext.onReady(function () {

    store_acciones.load();

    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        defaultButton: 'doCreate',
        referenceHolder: true,
        items: [
            {
                xtype: 'fieldset',
                title: 'Crear Acción',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                items: [
                    {
                        xtype: 'textfield',
                        width: 300,
                        fieldLabel: 'Nombre',
                        name: 'nombre',
                        allowBlank: false,
                        maxLength: 150,
                        enforceMaxLength: true
                    }, {
                        xtype: 'container',
                        width: 330,
                        pack: 'end',
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Crear',
                                anchor: '-50%',
                                reference: 'doCreate',
                                handler: function () {

                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        form.mask("Espere");
                                        var data = form.getValues();


                                        Ext.Ajax.request({
                                            url: 'controller/createaction',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                form.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                    form.reset();
                                                    store_acciones.load();
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
            }, {
                xtype: 'fieldset',
                title: 'Acciones',
                items: [{
                        xtype: 'grid',
                        store: store_acciones,
                        height: 250,

                        columns: [

                            {hidden: true, dataIndex: 'id_accion'},
                            {text: 'Nombre', dataIndex: 'nombre', width: 150},
                            {
                                xtype: 'actioncolumn',
                                text: 'Acciones',
                                width: 100,
                                items: [{
                                        icon: 'images/icons/page_edit.png',
                                        tooltip: 'Editar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_accion');
                                            editRec(rec);
                                        }
                                    }, {
                                        icon: 'images/icons/cross.png',
                                        tooltip: 'Eliminar registro',
                                        handler: function (grid, rowIndex, colIndex) {
                                            var rec = grid.getStore().getAt(rowIndex).get('id_accion');
                                            deleteRec(rec);
                                        }
                                    }]
                            }
                        ]
                    }
                ]
            }
        ]
    });
});


