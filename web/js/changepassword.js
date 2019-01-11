/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



Ext.onReady(function () {
    Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        width: 400,
        margin: '30 0 10 250',
        items: [
            {
                xtype: 'fieldset',
                title: 'Cambiar Contraseña',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15',
                    selectOnFocus: true
                },
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Usuario',
                        name: 'id_usuario',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        width: 360
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Contraseña Anterior',
                        name: 'clave',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        inputType: 'password',
                        width: 360
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Nueva Contraseña',
                        name: 'nuevaclave1',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        inputType: 'password',
                        width: 360
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Confirmar Contraseña',
                        name: 'nuevaclave2',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        inputType: 'password',
                        width: 360
                    }, {
                        xtype: 'container',
                        width: 390,
                        pack: 'end',
                        layout: {
                            type: 'hbox',
                            pack: 'end'
                        },
                        items: [
                            {
                                xtype: 'button',
                                text: 'Cambiar',
                                handler: function () {
                                    var form = this.up('form');

                                    if (form.items.items[0].items.items[2].value !== form.items.items[0].items.items[3].value) {
                                        Ext.Msg.show({title: "Error", msg: "Las contraseñas no coinciden", buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                        form.items.items[0].items.items[2].focus();
                                        return;
                                    }



                                    if (!form.isValid()) {

                                    } else {
                                        form.mask("Procesando");
                                        var data = form.getValues();
                                        Ext.Ajax.request({
                                            url: 'controller/changepassword',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                form.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {

                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO,
                                                        fn: function (btn) {
                                                            var url_to_redirect = "index.jsp";
                                                            try {
                                                                var txtparams = location.search.substring(1);
                                                                if (txtparams.length > 2) {
                                                                    var urlparams = Ext.Object.fromQueryString(txtparams);
                                                                   // url_to_redirect = urlparams.redirect;

                                                                }
                                                            } catch (err) {

                                                            }
                                                            location.href = url_to_redirect;
                                                        }
                                                    });


                                                } else {
                                                    form.unmask();
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                }
                                            },
                                            failure: function (f, g) {
                                                form.unmask();
                                                Ext.Msg.show({title: "Error", msg: 'Ocurri&oacute; un error al procesar la solicitud', cls: 'x-border-box', buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
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