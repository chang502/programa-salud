Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();


var store_materiales = Ext.create('Ext.data.Store', {
    fields: ['id_material', 'nombre', 'descripcion', 'activo', 'existencia', 'alerta'],
     proxy: {
        type: 'ajax',
        url: 'controller/materials',
        reader: {type: 'json',
            root: 'data'
        }
    }    
});



function deleteRec(rec) {    
     Ext.Msg.confirm("Materiales", "Esta Seguro de Eliminar el Registro?", function (id, value) {
                                            if (id === 'yes') {
                                                     Ext.Ajax.request({
                                        url: 'controller/materials/delete',
                                        method: 'POST',
                                        jsonData: '{"id_material": "' + rec + '"}',
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {                                                                                               
                                                store_materiales.load();
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

function editRec(rec) {    
    var recordMaterial = store_materiales.findRecord('id_material',rec);    
    var dataMaterial = recordMaterial.data;
    var frmEdit = Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        width: 900,
        items: [{
                xtype: 'fieldset',
                layout: {type: 'table', columns: 2},
                padding: '5 5 5 5',
                defaults: {padding: '5 15 5 15'},
                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'hiddenfield',
                        fieldLabel: 'Id Material',
                        name: 'id_material',
                        id: 'id_material',  
                        value: dataMaterial.id_material,
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },
                    {xtype: 'textfield',
                        fieldLabel: 'Nombre',
                        name: 'nombre',
                        maxLength: 50,
                           value: dataMaterial.nombre,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },
                    {xtype: 'textfield',
                        fieldLabel: 'Descripción',
                        name: 'descripcion',
                        value: dataMaterial.descripcion,
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Existencia',
                        name: 'existencia',
                         value: dataMaterial.existencia,
                        maxlength: 4,
                        enforceMaxLength: 4,                        
                        allowBlank: false
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Alerta',
                        name: 'alerta',
                         value: dataMaterial.alerta,
                        maxlength: 4,
                        enforceMaxLength: 4,                        
                        allowBlank: false
                    },
                    {   xtype: 'checkboxfield',
                        fieldLabel: 'Activo',                        
                        value: dataMaterial.activo,
                        inputValue : 1,
                        uncheckedValue : 0,
                        name: 'activo'
                    }]
            }]
    });
    
    var vent = Ext.create('Ext.window.Window', {
                    title: 'Editar Registro',
                    modal : true,
                    buttons: [{
                            text : 'Aceptar',
                            handler : function(){
                                 if (frmEdit.isValid()) {
                                        var data = frmEdit.getValues();                                                              
                                         Ext.Ajax.request({
                                        url: 'controller/materials',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {
                                                frmEdit.unmask();
                                                vent.close();
                                                store_materiales.load();
                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});                                                                                                

                                            } else {
                                                frmEdit.unmask();
                                                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {
                                            frmEdit.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                        });                                        
                                 }  else {
                                        Ext.Msg.alert('Validar', 'Validar campos', Ext.emptyFn);
                                    }
                              
                            }
                    },
                    {text: 'Cancelar', handler: function () {
                                this.up('window').close();
                            }}],
                    items: frmEdit                    
    }).show();
    
}


Ext.onReady(function () {
    store_materiales.load();
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        width: 900,
        items: [{
                xtype: 'fieldset',
                title: 'Crear Material',
                layout: {type: 'table', columns: 2},
                padding: '5 5 5 5',
                defaults: {padding: '5 15 5 15'},
                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'hiddenfield',
                        fieldLabel: 'Id Material',
                        name: 'id_material',
                        id: 'id_material',
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },
                    {xtype: 'textfield',
                        fieldLabel: 'Nombre',
                        name: 'nombre',
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },
                    {xtype: 'textfield',
                        fieldLabel: 'Descripción',
                        name: 'descripcion',
                        maxLength: 50,
                        enforceMaxLength: 50,
                        allowBlank: false
                    },{
                        xtype: 'hiddenfield',
                        fieldLabel: 'Existencia',
                        name: 'existencia',                         
                        maxlength: 4,
                        enforceMaxLength: 4,
                        allowBlank: false,
                        value : 0
                    },{
                        xtype: 'hiddenfield',
                        fieldLabel: 'Alerta',
                        name: 'alerta',                         
                        maxlength: 4,
                        enforceMaxLength: 4,
                        allowBlank: false,
                        value : 0
                    },
                    {xtype: 'checkboxfield',
                        fieldLabel: 'Activo',
                        inputValue : 1,
                        uncheckedValue : 0,
                        name: 'activo'
                    },
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
                                    var form = this.up('form');
                                    if (form.isValid()) {
                                                                         
                                        Ext.Msg.confirm("Desea Guardar?", "Esta Seguro?", function (id, value) {
                                            if (id === 'yes') {
                                                var data = form.getValues();                                                              
                                         Ext.Ajax.request({
                                        url: 'controller/materials/create',
                                        method: 'POST',
                                        jsonData: data,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            if (resultado.success) {
                                                form.unmask();                                                
                                                store_materiales.load();
                                                Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                                form.reset();
                                            } else {
                                                form.unmask();
                                                Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {
                                            form.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                        });     
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
                        title: 'Materiales',
                        colspan: 2,
                        items: [{
                                xtype: 'grid',
                                store: store_materiales,
                                maxHeight: 250,
                                columns: [
                                    {text: 'Id Material', dataIndex: 'id_material', width: 100},
                                    {text: 'Nombre', dataIndex: 'nombre', width: 150,
                                        filter: {
                                            // required configs
                                            type: 'string',
                                            // optional configs
                                            value: 'star',  // setting a value makes the filter active.
                                            itemDefaults: {
                                                // any Ext.form.field.Text configs accepted
                                            }
                                        }
                                    },                                    
                                    {text: 'Estado', dataIndex: 'activo', width: 120, renderer: function(value){ if (value == true) { return 'Activo' } else { return 'Inactivo'}}},
                                    {
                                        xtype: 'actioncolumn',
                                        text: 'Acciones',
                                        width: 100,
                                        items: [{
                                                icon: 'images/icons/page_edit.png',
                                                tooltip: 'Editar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_material');
                                                    editRec(rec);
                                                }
                                            }, {
                                                icon: 'images/icons/cross.png',
                                                tooltip: 'Eliminar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_material');
                                                    deleteRec(rec);
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