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
                title: 'Recuperar Contraseña',
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
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
                        fieldLabel: 'Correo',
                        name: 'email',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        vtype: 'email',
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
                                text: 'Enviar',
                                handler: function () {
                                    var form = this.up('form');
                                    if (!form.isValid()) {

                                    } else {
                                        form.mask("Procesando");
                                        var data = form.getValues();
                                        Ext.Ajax.request({
                                            url: 'controller/forgotpassword',
                                            method: 'POST',
                                            jsonData: data,
                                            success: function (f, g) {
                                                form.unmask();
                                                var resultado = eval('(' + f.responseText + ')');
                                                if (resultado.success) {
                                                    Ext.Msg.show({title: "Operación exitosa", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.INFO,
                                                        fn: function (btn) {
                                                            location.href = 'login.jsp';
                                                        }
                                                    });
                                                    
                                                } else {
                                                    form.unmask();
                                                    Ext.Msg.show({title: "Error", msg: resultado.message, buttons: Ext.Msg.OK, icon: Ext.MessageBox.ERROR});
                                                }
                                            },
                                            failure: function (f, g) {
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