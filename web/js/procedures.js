Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




var store_materiales = Ext.create('Ext.data.Store', {
    fields: ['id_material', 'nombre', 'descripcion', 'activo', 'existencia'],
    proxy: {
        type: 'ajax',
        url: 'controller/materials',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var store_procedimientos = Ext.create('Ext.data.Store', {
    fields: ['id_procedimiento', 'descripcion', 'activo'],
    proxy: {
        type: 'ajax',
        url: 'controller/procedures',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_detalle_procedimientos = Ext.create('Ext.data.Store', {
    fields: ['id_procedimiento', 'id_material', 'nombre_material', 'cantidad'],
    proxy: {
        type: 'ajax',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_temporal_procedimiento = Ext.create('Ext.data.Store', {
    fields: ['id_procedimiento', 'id_material', 'nombre_material', 'cantidad']
});



function deleteRec(rec) {
    Ext.Msg.confirm("Procedimientos", "Esta Seguro de Eliminar el Registro?", function (id, value) {
        if (id === 'yes') {
            Ext.Ajax.request({
                url: 'controller/procedures/delete',
                method: 'POST',
                jsonData: '{"id_procedimiento": "' + rec + '"}',
                success: function (f, g) {
                    var resultado = eval('(' + f.responseText + ')');
                    if (resultado.success) {
                        store_procedimientos.load();
                        Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                    } else {
                        Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                    }
                },
                failure: function (f, g) {
                    Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                }
            });
        }
    })
}

function fillProcedimientoDetalle(id_procedimiento) {

    Ext.Ajax.request({
        url: 'controller/procedures/details/' + id_procedimiento,
        success: function (f, opts) {
            var resultado = eval('(' + f.responseText + ')');
            if (resultado.success) {
                store_detalle_procedimientos.loadData(resultado.data);
            } else {
                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
            }
        },
        failure: function (response, opts) {
            Ext.Msg.show({title: "Error", msg: "Ocurrió un error", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
        }
    });
}

function editRec(id_procedimiento) {
    fillProcedimientoDetalle(id_procedimiento);
    var frmCrearProcedimiento = Ext.create({
        xtype: 'form',
        id: 'formCreateProcedimiento',
        renderTo: 'main-container',
        width: 900,
        items: [{
                xtype: 'fieldset',
                layout: {type: 'table', columns: 3},
                padding: '5 5 5 5',
                defaults: {padding: '5 15 5 15'},
                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: 'Material',
                        id: 'cmbMaterial',
                        store: store_materiales,
                        enableKeyEvents: true,
                        displayField: 'nombre',
                        valueField: 'id_material',
                        typeAhead: true,
                        typeAheadDelay: 100,
                        triggerAction: 'all',
                        mode: 'local',
                        minChars: 3,
                        width: 300,
                        selectOnFocus: true,
                        applyTo: 'search',
                        listeners: {
                            keyup: function (el, type) {
                                store_materiales.filter('nombre', el.getValue(), true, false, false);
                            }
                        }
                    },
                    {xtype: 'textfield',
                        fieldLabel: 'Cantidad',
                        name: 'cantidad',
                        maxLength: 3,
                        enforceMaxLength: 3,
                        allowBlank: false
                    },
                    {
                        xtype: 'button',
                        name: 'btnAgregarMaterial',
                        text: 'Agregar',
                        handler: function () {
                            var myForm2 = Ext.getCmp('formCreateProcedimiento').getForm();
                            if (myForm2.isValid()) {
                                var data = myForm2.getValues();
                                var id_material = myForm2.findField('cmbMaterial').getValue();
                                var nombre_material = myForm2.findField('cmbMaterial').getRawValue();

                                var dataAgregar = {
                                    'id_procedimiento': id_procedimiento,
                                    'id_material': id_material,
                                    'cantidad': data.cantidad
                                };

                                Ext.Ajax.request({
                                    url: 'controller/procedures/creatematerial',
                                    method: 'POST',
                                    jsonData: dataAgregar,
                                    success: function (f, g) {
                                        var resultado = eval('(' + f.responseText + ')');
                                        if (resultado.success) {
                                            myForm2.reset();
                                            fillProcedimientoDetalle(id_procedimiento);
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
                            ;
                        }
                    },
                    {
                        xtype: 'fieldset',
                        title: 'Procedimiento',
                        colspan: 2,
                        items: [{
                                xtype: 'grid',
                                store: store_detalle_procedimientos,
                                maxHeight: 250,
                                columns: [
                                    {text: 'Id Material', dataIndex: 'id_material', width: 100},
                                    {text: 'Descripcion', dataIndex: 'nombre_material', width: 150},
                                    {text: 'Cantidad', dataIndex: 'cantidad', width: 120},
                                    {
                                        xtype: 'actioncolumn',
                                        text: 'Acciones',
                                        width: 100,
                                        items: [{
                                                icon: 'images/icons/cross.png',
                                                tooltip: 'Eliminar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_material');
                                                    Ext.Ajax.request({
                                                        url: 'controller/procedures/deletematerial',
                                                        method: 'POST',
                                                        jsonData: '{"id_procedimiento": "' + id_procedimiento + '", "id_material" : "' + rec + '"}',
                                                        success: function (f, g) {
                                                            var resultado = eval('(' + f.responseText + ')');
                                                            if (resultado.success) {
                                                                fillProcedimientoDetalle(id_procedimiento);
                                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                                                            } else {
                                                                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                            }
                                                        },
                                                        failure: function (f, g) {
                                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                        }
                                                    });
                                                }
                                            }]
                                    }
                                ]
                            }]
                    }]
            }]
    });

    var vent = Ext.create('Ext.window.Window', {
        title: 'Crear Procedimiento',
        modal: true,
        buttons: [{
                text: 'Aceptar',
                handler: function () {

                    this.up('window').close();

                }
            }],
//            {text: 'Cancelar', handler: function () {
//                    this.up('window').close();
//                }}]

        items: frmCrearProcedimiento
    }).show();
}



function createRec(data) {

    Ext.Ajax.request({
        url: 'controller/procedures/create',
        method: 'POST',
        jsonData: data,
        success: function (f, g) {
            var resultado = eval('(' + f.responseText + ')');
            if (resultado.success) {
                store_procedimientos.load();
            } else {
                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
            }
        },
        failure: function (f, g) {
            form.unmask();
            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
        }
    });

//    var frmCrearProcedimiento = Ext.create({
//        xtype: 'form',
//        id: 'formCreateProcedimiento',
//        renderTo: 'main-container',
//        width: 900,
//        items: [{
//                xtype: 'fieldset',
//                layout: {type: 'table', columns: 3},
//                padding: '5 5 5 5',
//                defaults: {padding: '5 15 5 15'},
//                buttonAlign: 'right',
//                items: [
//                    {
//                        xtype: 'combo',
//                        fieldLabel: 'Material',
//                        id: 'cmbMaterial',
//                        store: store_materiales,
//                        enableKeyEvents: true,
//                        displayField: 'nombre',
//                         valueField: 'id_material',
//                        typeAhead: true,
//                        typeAheadDelay: 100,
//                        triggerAction: 'all',
//                        mode: 'local',
//                        minChars: 3,
//                        width: 300,
//                        selectOnFocus: true,
//                        applyTo: 'search',
//                        listeners: {
//                            keyup: function (el, type) {
//                                store_materiales.filter('nombre', el.getValue(), true, false, false);
//                            }
//                        }
//                    },
//                    {xtype: 'textfield',
//                        fieldLabel: 'Cantidad',
//                        name: 'cantidad',
//                        maxLength: 3,
//                        enforceMaxLength: 3,
//                        allowBlank: false
//                    },
//                    {
//                        xtype: 'button',
//                        name: 'btnAgregarMaterial',
//                        text: 'Agregar',
//                        handler: function () {
//                              var myForm2 = Ext.getCmp('formCreateProcedimiento').getForm();
//                                if (myForm2.isValid()) {
//                                    var data = myForm2.getValues();
//                                    var id_material = myForm2.findField('cmbMaterial').getValue();                                
//                                    var nombre_material = myForm2.findField('cmbMaterial').getRawValue();                                     
//                                   
//                                    var dataAgregar = {
//                                        'id_procedimiento' : 'temp',
//                                        'id_material' : id_material,
//                                        'nombre_material' : nombre_material,
//                                        'cantidad' : data.cantidad
//                                    };
//                                  
//                                    store_temporal_procedimiento.add(dataAgregar);
//                                    myForm2.reset();
//                                };
//                         }
//                    },
//                    {
//                        xtype: 'fieldset',
//                        title: 'Procedimiento',
//                        colspan: 2,
//                        items: [{
//                                xtype: 'grid',
//                                store: store_temporal_procedimiento,
//                                maxHeight: 250,
//                                columns: [
//                                    {text: 'Id Material', dataIndex: 'id_material', width: 100},
//                                    {text: 'Descripcion', dataIndex: 'nombre_material', width: 150},
//                                    {text: 'Cantidad', dataIndex: 'cantidad', width: 120},
//                                    {
//                                        xtype: 'actioncolumn',
//                                        text: 'Acciones',
//                                        width: 100,
//                                        items: [ {
//                                                icon: 'images/icons/cross.png',
//                                                tooltip: 'Eliminar registro',
//                                                handler: function (grid, rowIndex, colIndex) {
//                                                    var rec = grid.getStore().getAt(rowIndex).get('id_material');
//                                                    store_temporal_procedimiento.remove(store_temporal_procedimiento.findRecord('id_material', rec));
//                                                }
//                                            }]
//                                    }
//                                ]
//                            }]
//                    }]
//            }]
//    });
//
//    var vent = Ext.create('Ext.window.Window', {
//        title: 'Crear Procedimiento',
//        modal: true,
//        buttons: [{
//                text: 'Aceptar',
//                handler: function () {           
//                       var newIdProc = store_procedimientos.getCount() + 1;
//                       var dataProcedimiento  = {
//                           'id_procedimiento' : newIdProc,
//                           'descripcion' : descripcion_proc,
//                           'activo' : activo_proc
//                       };
//                       store_procedimientos.add(dataProcedimiento);
//                       store_temporal_procedimiento.each(function (record, idx){
//                          record.data.id_procedimiento = newIdProc;
//                          store_detalle_procedimientos.add(record.data);
//                       });
//                       store_temporal_procedimiento.removeAll();
//                        this.up('window').close();
//                       
//                }
//            },
//            {text: 'Cancelar', handler: function () {
//                    this.up('window').close();
//                }}],
//        items: frmCrearProcedimiento
//    }).show();
}
;

Ext.onReady(function () {
    store_procedimientos.load();
    store_materiales.load();




    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        id: 'MyForm',
        width: 900,
        items: [{
                xtype: 'fieldset',
                title: 'Procedimientos',
                layout: {type: 'table', columns: 2},
                padding: '5 5 5 5',
                defaults: {padding: '5 15 5 15'},
                buttonAlign: 'right',
                items: [{
                        xtype: 'fieldset',
                        title: 'Crear Procedimiento',
                        colspan: 2,
                        items: [
                            {xtype: 'textfield',
                                fieldLabel: 'Descripción',
                                name: 'descripcion',
                                maxLength: 50,
                                enforceMaxLength: 50,
                                allowBlank: false
                            },
                            {xtype: 'checkboxfield',
                                fieldLabel: 'Activo',
                                inputValue: 1,
                                uncheckedValue: 0,
                                name: 'activo'
                            }], },
                    {
                        xtype: 'container',
                        pack: 'end',
                        colspan: 2,
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [{
                                xtype: 'button',
                                text: 'Crear',
                                anchor: '-50%',
                                handler: function () {
                                    var myForm = this.up('form');
                                    //var myForm = Ext.getCmp('MyForm').getForm();
                                    if (myForm.isValid()) {


                                        Ext.Msg.confirm("Desea Guardar?", "Esta Seguro?", function (id, value) {
                                            if (id === 'yes') {
                                                var data = myForm.getValues();
                                                //var descripcion = myForm.findField('descripcion_procedimiento').getValue();
                                                //var activo = myForm.findField('activo_procedimiento').getValue();                                        
                                                createRec(data);
                                                myForm.reset();
                                            }
                                        })
                                    } else {
                                        Ext.Msg.alert('Validar', 'Validar campos', Ext.emptyFn);
                                    }
                                }
                            }, {
                                xtype: 'button',
                                text: 'Limpiar',
                                anchor: '-50%',
                                handler: function () {
                                    var form = this.up('form');
                                    form.reset();
                                }
                            }]
                    }, {
                        xtype: 'fieldset',
                        title: 'Procedimiento',
                        colspan: 2,
                        items: [{
                                xtype: 'grid',
                                store: store_procedimientos,
                                maxHeight: 250,
                                columns: [
                                    {text: 'Id Procedimiento', dataIndex: 'id_procedimiento', width: 100},
                                    {text: 'Descripcion', dataIndex: 'descripcion', width: 150},
                                    {text: 'Estado', dataIndex: 'activo', width: 120, renderer: function (value) {
                                            if (value == true) {
                                                return 'Activo'
                                            } else {
                                                return 'Inactivo'
                                            }
                                        }},
                                    {
                                        xtype: 'actioncolumn',
                                        text: 'Acciones',
                                        width: 100,
                                        items: [{
                                                icon: 'images/icons/page_edit.png',
                                                tooltip: 'Editar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_procedimiento');
                                                    editRec(rec);
                                                }
                                            }, {
                                                icon: 'images/icons/cross.png',
                                                tooltip: 'Eliminar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_procedimiento');
                                                    deleteRec(rec);
                                                    //store_detalle_procedimientos.filter("id_procedimiento", rec);
                                                    //store_detalle_procedimientos.removeAll();
                                                    //store_detalle_procedimientos.remove(store_detalle_procedimientos.findBy('id_procedimiento', rec));
                                                    //store_procedimientos.remove(store_procedimientos.findRecord('id_procedimiento', rec));                                                    
                                                    //store_detalle_procedimientos.filters.clear();
                                                }
                                            }]
                                    }
                                ]
                            }]
                    }
                ]
            }]
    });
});