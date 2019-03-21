/* global Ext */

Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();


var store_reportes = Ext.create('Ext.data.Store', {
    fields: ['id_reporte', 'nombre'],
    proxy: {
        type: 'ajax',
        url: 'controller/reportes',
        reader: {type: 'json',
            root: 'data'
        }
    }
});




Ext.onReady(function () {

    store_reportes.load();

    var panelParams = Ext.create({
        xtype: 'panel',
        colspan: 2,
        defaults: {
            selectOnFocus: true,
            padding: '5 0 5 0'
        }
    })

    Ext.create({
        xtype: 'form',
        /*url: 'reports',
         method: 'GET',
         target: '_blank',*/
        renderTo: 'main-container',
        defaultButton: 'doCreate',
        referenceHolder: true,
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                title: 'Reportes',
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
                    {
                        xtype: 'combo',
                        fieldLabel: 'Reporte',
                        store: store_reportes,
                        queryMode: 'local',
                        displayField: 'nombre',
                        valueField: 'id_reporte',
                        allowBlank: false,
                        colspan: 2,
                        name: 'id_reporte',
                        listeners: {
                            select: function (combo, record, eOpts) {


                                Ext.Ajax.request({
                                    url: 'controller/reportes/' + combo.getValue(),
                                    method: 'GET',
                                    success: function (f, opts) {
                                        var resultado = eval('(' + f.responseText + ')');
                                        if (resultado.success) {
                                            //panelParams.items.clear();
                                            var f;
                                            while (f = panelParams.items.first()) {
                                                panelParams.remove(f, true);
                                            }
                                            //window.console.log(resultado.data.length);
                                            for (var i = 0; i < resultado.data.length; i++) {
                                                panelParams.add({
                                                    xtype: resultado.data[i].var_type,
                                                    name: resultado.data[i].var_name,
                                                    allowBlank: false,
                                                    value: new Date(),
                                                    fieldLabel: resultado.data[i].display_name
                                                });
                                            }
                                            panelParams.ownerCt.items.items[2].items.items[0].setDisabled(false);

                                        } else {
                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                    }, failure: function (response, opts) {}
                                });



                            }
                        }
                    },
                    panelParams
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
                                text: 'Generar',
                                disabled: true,
                                width: 75,
                                anchor: '-50%',
                                reference: 'doCreate',
                                handler: function () {
                                    //Ext.Msg.wait("Iniciando Sesi&oacute;n...","Espere");
                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        //form.mask("Espere");
                                        //var data = form.getValues();
                                        //console.log(data);


                                        //////////////////
                                        var frm = form.getForm();
                                        frm.standardSubmit = true;
                                        frm.submit({
                                            target: '_blank',
                                            url: 'reports',
                                            success: function (form, action) {
                                                Ext.Msg.show({title: "Operación exitosa", msg: 'Reporte generado exitosamente', buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                            },
                                            failure: function (form, action) {
                                                Ext.Msg.alert('Failed', action.result ? action.result.message : 'No response');
                                            }
                                        });

                                        /*Ext.Msg.show({title: "Operación exitosa", msg: 'Reporte generado exitosamente', buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                         //panelParams.items.clear();
                                         var f;
                                         while (f = panelParams.items.first()) {
                                         panelParams.remove(f, true);
                                         }
                                         form.reset();*/
                                        /*Ext.Ajax.request({
                                         url: 'reports',
                                         method: 'POST',
                                         data: JSON.stringify(data),
                                         //jsonData: data,
                                         success: function (f, g) {
                                         form.unmask();
                                         var resultado = eval('(' + f.responseText + ')');
                                         if (resultado.success) {
                                         Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO});
                                         form.reset();
                                         //store_espacio_convivencia.load();
                                         } else {
                                         Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                         }
                                         },
                                         failure: function (f, g) {
                                         form.unmask();
                                         Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                         }
                                         });*/
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    });
});