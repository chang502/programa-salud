/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



Ext.onReady(function () {
    var panel=Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        width: 400,
        margin: '30 0 10 250',
        defaultButton: 'doLogin',
        referenceHolder: true,
        items: [
            {
                xtype: 'fieldset',
                title: 'Iniciar Sesión',
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
                        fieldLabel: 'Contraseña',
                        name: 'clave',
                        allowBlank: false,
                        maxLength: 50,
                        enforceMaxLength: true,
                        inputType: 'password',
                        width: 360
                    }
                ]
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
                        html: '<a href="forgotpassword.jsp">Olvidé mi contraseña</a>'
                    }
                ]
            }
        ],
        buttons: [
            {
                text: 'Ingresar',
                reference: 'doLogin',
                handler: function () {
                    var form = this.up('form');
                    if (!form.isValid()) {

                    } else {
                        form.mask("Iniciando Sesión");
                        var data = form.getValues();
                        Ext.Ajax.request({
                            url: 'controller/login',
                            method: 'POST',
                            jsonData: data,
                            success: function (f, g) {
                                form.unmask();
                                var resultado = eval('(' + f.responseText + ')');
                                if (resultado.success) {
                                    var url_to_redirect = "index.jsp";
                                    try {
                                        var txtparams = location.search.substring(1);
                                        if (txtparams.length > 2) {
                                            var urlparams = Ext.Object.fromQueryString(txtparams);
                                            url_to_redirect = urlparams.redirect;

                                        }
                                    } catch (err) {

                                    }
                                    location.href = url_to_redirect;
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
    });
    console.log(panel.items.items[0].items.items[0]);
    panel.items.items[0].items.items[0].focus();
    
    
});