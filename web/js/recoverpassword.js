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
                        width: 360
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Correo',
                        vtype: 'email',
                        width: 360
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Nueva Contraseña',
                        inputType: 'password',
                        width: 360
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Confirmar Contraseña',
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
                                text: 'Cambiar'
                            }
                        ]
                    }
                ]
            }
        ]
    });
});

