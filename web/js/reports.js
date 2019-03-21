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

    Ext.create({
        xtype: 'form',
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

                                        } else {
                                            Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        }
                                    }, failure: function (response, opts) {}
                                });



                            }
                        }
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
                                text: 'Crear',
                                anchor: '-50%',
                                reference: 'doCreate',
                                handler: function () {
                                    //Ext.Msg.wait("Iniciando Sesi&oacute;n...","Espere");
                                    var form = this.up('form');
                                    if (!form.isValid()) {
                                    } else {
                                        form.mask("Espere");
                                        var data = form.getValues();
                                        //console.log(data);
                                        Ext.Ajax.request({
                                            url: 'controller/create_',
                                            method: 'POST',
                                            jsonData: data,
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
                                        });
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