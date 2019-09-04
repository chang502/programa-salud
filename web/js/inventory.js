Ext.require([
    'Ext.tip.QuickTipManager'
]);

var idEntradaInventario =null;

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

var store_medicamento = Ext.create('Ext.data.Store', {
    fields: ['id_medicamento', 'nombre', 'presentacion', 'activo', 'existencia'],
    proxy: {
        type: 'ajax',
        url: 'controller/medicaments',
        reader: {type: 'json',
            root: 'data'
        }
    }
});

var store_inventario = Ext.create('Ext.data.Store', {
    fields: ['id_entrada_inventario', 'usuario', 'fecha', 'descripcion']
});

var store_detalle_inventario = Ext.create('Ext.data.Store', {
    fields: ['id_entrada_inventario', 'id', 'nombre', 'presentacion', 'cantidad', 'tipo_inventario'],
   proxy: {
        type: 'ajax',
        url: 'controller/inventory',
        reader: {type: 'json',
            root: 'data'
        }
    }
});


var store_tipo_inventario = Ext.create('Ext.data.Store', {
    fields: ['id_tipo_inventario', 'descripcion'],
    data: [{'id_tipo_inventario': 1, 'descripcion': 'Materiales'},
        {'id_tipo_inventario': 2, 'descripcion': 'Medicamentos'}]
});



function deleteRec(idEntradaInventario,idMedicamentoMaterial, tipoInventario) {
    
   
                                    
                                    
     Ext.Msg.confirm("Procedimientos", "Esta Seguro de Eliminar el Registro?", function (id, value) {
        if (id === 'yes') {
             if (tipoInventario === 1) {

            Ext.Ajax.request({
                           url: 'controller/inventory/deleteMaterial',
                           method: 'POST',
                           jsonData: '{"id_entrada_inventario": "' + idEntradaInventario + '", "id_material": "' + idMedicamentoMaterial +'"}',
                           success: function (f, g) {
                               var resultado = eval('(' + f.responseText + ')');
                               if (resultado.success) {
                                   store_detalle_inventario.remove(store_detalle_inventario.findRecord('id', idMedicamentoMaterial));
                                   Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});

                               } else {
                                   Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                               }
                           },
                           failure: function (f, g) {
                               Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                           }
                       });
    } else {
            Ext.Ajax.request({
                           url: 'controller/inventory/deleteMedicamento',
                           method: 'POST',
                            jsonData: '{"id_entrada_inventario": "' + idEntradaInventario + '", "id_medicamento": "' + idMedicamentoMaterial +'"}',
                           success: function (f, g) {
                               var resultado = eval('(' + f.responseText + ')');
                               if (resultado.success) {
                                   store_detalle_inventario.remove(store_detalle_inventario.findRecord('id', idMedicamentoMaterial));
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
        }
    })
    
   

   
}







Ext.onReady(function () {

    
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        id: 'MyForm',
        width: 900,
        items: [{
                xtype: 'fieldset',
                title: 'Inventario',
                layout: {type: 'table', columns: 2},
                padding: '5 5 5 5',
                defaults: {padding: '5 15 5 15'},
                buttonAlign: 'right',
                items: [{
                        xtype: 'fieldset',
                        id: 'fieldsetHeader',
                        title: 'Entrada de Inventario',
                        colspan: 2,
                        items: [
                            ,{xtype: 'textfield',
                                fieldLabel: 'Fecha',
                                name: 'fecha',
                                value: new Date(),
                                allowBlank: false
                            },
                           {xtype: 'textfield',
                                fieldLabel: 'Usuario',
                                name: 'userName',
                                value: userName,
                                allowBlank: false
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Tipo de Inventario',
                                id: 'cmbTipoInventario',
                                store: store_tipo_inventario,
                                queryMode: 'local',
                                displayField: 'descripcion',
                                valueField: 'id_tipo_inventario',
                                allowBlank: false
                            }, ], },
                    {
                        xtype: 'container',
                        pack: 'end',
                        colspan: 3,
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [{
                                xtype: 'button',
                                id: 'btnIngresar',
                                text: 'Ingresar',                                
                                handler: function () {
                                    var myForm = Ext.getCmp('MyForm').getForm();                                    
                                    var tipoInventario = myForm.findField('cmbTipoInventario').getValue();
                                    if (tipoInventario == null){
                                        return false;
                                    }                                    
                                    
                                       var dataAgregar = {
                                            'id_usuario': userName,
                                            'tipo_inventario': tipoInventario                                            
                                        };
                                        Ext.Ajax.request({
                                        url: 'controller/inventory/create',
                                        method: 'POST',
                                        jsonData: dataAgregar,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');
                                            idEntradaInventario = resultado.message;                                            
                                            if (resultado.success) { 
                                                
                                                if (tipoInventario === 1) {

                                                    Ext.getCmp('fieldsetMateriales').show();
                                                    Ext.getCmp('fieldsetHeader').disable();
                                                    Ext.getCmp('gridDetalle').columnManager.getColumns()[2].hide();
                                                } else {
                                                    Ext.getCmp('fieldsetMedicamentos').show();
                                                    Ext.getCmp('fieldsetHeader').disable();
                                                    Ext.getCmp('gridDetalle').columnManager.getColumns()[2].show();
                                                }
                                                    Ext.getCmp('fieldsetObservaciones').show();
                                            } else {                                                
                                                
                                            }
                                        },
                                        failure: function (f, g) {
                                            form.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                        });
                                    
                                    Ext.getCmp('fieldsetGrid').show();
                                    Ext.getCmp('btnIngresar').hide();
                                    Ext.getCmp('btnGuardar').show();
                                    
                                }
                            }, {
                                xtype: 'button',
                                id: 'btnGuardar',
                                text: 'Guardar',
                                 hidden:true,
                                 handler: function () {
                                     var myForm = Ext.getCmp('MyForm').getForm();                                    
                                    var observaciones = myForm.findField('observaciones').getValue();                                
                                      var dataAgregarPost = {
                                        'id_entrada_inventario': idEntradaInventario,
                                        'observaciones' : observaciones
                                    };
                                    Ext.Ajax.request({
                                        url: 'controller/inventory/saveInventory',
                                        method: 'POST',
                                         jsonData: dataAgregarPost,
                                         success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');                                                                                       
                                            if (resultado.message    === 'Registro ingresado correctamente') { 
                                                 var myForm = Ext.getCmp('MyForm').getForm();
                                            myForm.reset();
                                            store_detalle_inventario.removeAll();
                                            Ext.getCmp('fieldsetMedicamentos').hide();
                                            Ext.getCmp('fieldsetMateriales').hide();
                                            Ext.getCmp('fieldsetObservaciones').hide();
                                            Ext.getCmp('fieldsetGrid').hide();
                                            Ext.getCmp('fieldsetHeader').enable();
                                            Ext.getCmp('btnIngresar').show();
                                             Ext.getCmp('btnGuardar').hide();
                                              
                                            } else {                                                
                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {                                            
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                        });                                                                       
                                 }
                            },                                
                            {
                                xtype: 'button',
                                text: 'Limpiar',                                
                                handler: function () {
                                    Ext.Msg.confirm("Materiales", "Esta Seguro de Limpiar entrada de inventario?", function (id, value) {
                                        if (id === 'yes') {
                                            var myForm = Ext.getCmp('MyForm').getForm();
                                            myForm.reset();
                                            store_detalle_inventario.removeAll();
                                            Ext.getCmp('fieldsetMedicamentos').hide();
                                            Ext.getCmp('fieldsetMateriales').hide();
                                             Ext.getCmp('fieldsetObservaciones').hide();
                                            Ext.getCmp('fieldsetGrid').hide();
                                            Ext.getCmp('fieldsetHeader').enable();
                                            Ext.getCmp('btnIngresar').show();
                                             Ext.getCmp('btnGuardar').hide();
                                            
                                        }
                                    });
                                }
                            }]
                    },
 //antes fish
 
                    {xtype: 'fieldset',
                        id: 'fieldsetObservaciones',
                        title: 'Observaciones',
                        colspan: 2,
                        items: [
                            
                          {
                            xtype: 'textarea',
                            colspan: 2,
                            fieldLabel: 'Observaciones',
                            width: 580,                            
                            name: 'observaciones',
                            maxLength: 500,
                            enforceMaxLength: false,                            
                        }
                             ], },
 
 //despues fish
 ,                   {
                        xtype: 'fieldset',
                        title: 'Medicamentos',
                        id: 'fieldsetMedicamentos',
                        colspan: 2,
                        items: [{
                                xtype: 'combo',
                                fieldLabel: 'Medicamento',
                                id: 'cmbMedicamento',
                                store: store_medicamento,
                                enableKeyEvents: true,
                                displayField: 'nombre',
                                valueField: 'id_medicamento',
                                typeAhead: true,
                                typeAheadDelay: 100,
                                triggerAction: 'all',
                                mode: 'local',
                                minChars: 3,
                                width: 500,
                                selectOnFocus: true,
                                applyTo: 'search',
                                tpl: Ext.create('Ext.XTemplate',
                                        '<ul class="x-list-plain"><tpl for=".">',
                                        '<li role="option" class="x-boundlist-item">{nombre} - {presentacion}</li>',
                                        '</tpl></ul>'
                                        ),
                                // template for the content inside text field
                                displayTpl: Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                        '{nombre} - {presentacion}',
                                        '</tpl>'
                                        ),
                                listeners: {
                                    keyup: function (el, type) {
                                        store_medicamento.filter('nombre', el.getValue(), true, false, false);
                                    }
                                }
                            },
                            {xtype: 'textfield',
                                fieldLabel: 'Cantidad',
                                name: 'cantidad',
                                id: 'cantidadMedicamento',
                                maxLength: 3,
                                enforceMaxLength: 3,
                                allowBlank: false
                            },
                            {
                                xtype: 'button',
                                name: 'btnAgregarMedicamento',
                                text: 'Agregar',
                                handler: function () {
                                    //var myForm2 = Ext.getCmp('MyForm').getForm();
                                    //var myForm2 = this.up('form');                              
                                    var myForm2 = Ext.getCmp('MyForm').getForm();
                                    var data = myForm2.getValues();                                    
                                    var id_medicamento = myForm2.findField('cmbMedicamento').getValue();
                                    var medicamentoSelected = store_medicamento.findRecord('id_medicamento', id_medicamento);
                                    var nombre_medicamento = medicamentoSelected.data.nombre;
                                    var presentacion = medicamentoSelected.data.presentacion;
                                    var cantidad = myForm2.findField('cantidadMedicamento').getValue();
                                    var observaciones = myForm2.findField('observaciones').getValue();
                                    var dataAgregar = {
                                        'id_entrada_inventario': idEntradaInventario,
                                        'id': id_medicamento,
                                        'nombre': nombre_medicamento,
                                        'presentacion': presentacion,
                                        'cantidad': cantidad,
                                        'tipo_inventario' : 2
                                    };
                                     var dataAgregarPost = {
                                        'id_entrada_inventario': idEntradaInventario,
                                        'id_medicamento': id_medicamento,                                        
                                        'cantidad': cantidad
                                    };
                                    
                                    
                                             Ext.Ajax.request({
                                        url: 'controller/inventory/agregarMedicamento',
                                        method: 'POST',
                                        jsonData: dataAgregarPost,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');                                                                                       
                                            if (resultado.message    === 'Registro ingresado correctamente') { 
                                                
                                              
                                            } else {                                                
                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {
                                            form.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                        });
                                
                                    store_detalle_inventario.add(dataAgregar);
                                  /* myForm2.findField('cantidadMedicamento').setValue('');
                                   myForm2.findField('cmbMedicamento').setValue('');*/
                                    myForm2.reset();
                                    myForm2.findField('observaciones').setValue(observaciones);
                                  
                                }
                            }
                        ], },
                    {
                        xtype: 'fieldset',
                        title: 'Material',
                        id: 'fieldsetMateriales',
                        colspan: 2,
                        items: [{
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
                                id: 'cantidadMaterial',
                                maxLength: 3,
                                enforceMaxLength: 3,
                                allowBlank: false
                            },
                            {
                                xtype: 'button',
                                name: 'btnAgregarMaterial',
                                text: 'Agregar',
                                handler: function () {
                                    //var myForm2 = Ext.getCmp('MyForm').getForm();
                                    //var myForm2 = this.up('form');                              
                                    var myForm2 = Ext.getCmp('MyForm').getForm();
                                    var data = myForm2.getValues();
                                    var id_material = myForm2.findField('cmbMaterial').getValue();
                                    var nombre_material = myForm2.findField('cmbMaterial').getRawValue();
                                    var cantidad = myForm2.findField('cantidadMaterial').getValue();
                                    var observaciones = myForm2.findField('observaciones').getValue();
                                    var dataAgregar = {
                                        'id_entrada_inventario': idEntradaInventario,
                                        'id': id_material,
                                        'nombre': nombre_material,
                                        'cantidad': cantidad,
                                        'tipo_inventario' : 1
                                    };
                                     var dataAgregarPost = {
                                        'id_entrada_inventario': idEntradaInventario,
                                        'id_material': id_material,                                        
                                        'cantidad': cantidad
                                    };
                                    
                                    
                                             Ext.Ajax.request({
                                        url: 'controller/inventory/agregarMaterial',
                                        method: 'POST',
                                        jsonData: dataAgregarPost,
                                        success: function (f, g) {
                                            var resultado = eval('(' + f.responseText + ')');                                                                                       
                                            if (resultado.message    === 'Registro ingresado correctamente') { 
                                                
                                              
                                            } else {                                                
                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                            }
                                        },
                                        failure: function (f, g) {
                                            form.unmask();
                                            Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                        });
                                    store_detalle_inventario.add(dataAgregar);
                                    /* myForm2.findField('cmbMaterial').setValue('');
                                   myForm2.findField('cantidadMaterial').setValue('');                                   */
                                    myForm2.reset();
                                    myForm2.findField('observaciones').setValue(observaciones);

                                }
                            }
                        ], },
                    {
                        xtype: 'fieldset',
                        id: 'fieldsetGrid',
                        title: 'Detalle Inventario',
                        colspan: 2,
                        items: [{
                                xtype: 'grid',
                                id: 'gridDetalle',
                                store: store_detalle_inventario,
                                maxHeight: 250,
                                columns: [
                                    {text: 'Id', dataIndex: 'id', width: 100},
                                    {text: 'Nombre', dataIndex: 'nombre', width: 150},
                                    {text: 'Presentacion', dataIndex: 'presentacion', width: 150},
                                    {text: 'Cantidad', dataIndex: 'cantidad', width: 150},
                                    {
                                        xtype: 'actioncolumn',
                                        text: 'Acciones',
                                        width: 100,
                                        items: [/*{
                                                icon: 'images/icons/page_edit.png',
                                                tooltip: 'Editar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                    var rec = grid.getStore().getAt(rowIndex).get('id_procedimiento');
                                                    editRec(rec);
                                                }
                                            }, */{
                                                icon: 'images/icons/cross.png',
                                                tooltip: 'Eliminar registro',
                                                handler: function (grid, rowIndex, colIndex) {
                                                     
                                                    var idEntradaInventario = grid.getStore().getAt(rowIndex).get('id_entrada_inventario');
                                                    var idMedicamentoMaterial = grid.getStore().getAt(rowIndex).get('id');
                                                    var tipoInventario = grid.getStore().getAt(rowIndex).get('tipo_inventario');
                                                    deleteRec(idEntradaInventario,idMedicamentoMaterial,tipoInventario);
                                                }
                                            }]
                                    }
                                ]
                            }]
                    }
                ]
            }]
    });
    Ext.getCmp('fieldsetMedicamentos').hide();
    Ext.getCmp('fieldsetMateriales').hide();
    Ext.getCmp('fieldsetObservaciones').hide();
    Ext.getCmp('fieldsetGrid').hide();

});