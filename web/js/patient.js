/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.require([
    'Ext.tip.QuickTipManager'
]);

Ext.QuickTips.init();




Ext.onReady(function () {
    
    patienthistory_panel.expand();
    
    var frmPpal = Ext.create({
        xtype: 'form',
        renderTo: 'main-container',
        //width: 900,
        items: [
            {
                xtype: 'fieldset',
                collapsible: true,
                title: 'Filtros',
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: '5 5 5 5',
                defaults: {
                    padding: '5 15 5 15'
                },
                buttonAlign: 'right',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: 'Tipo Paciente'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Tipo Identificación'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Número de Identificación'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Nombres'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Apellidos'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Fecha Nacimiento'
                    },{
                        xtype: 'textfield',
                        fieldLabel: 'Sexo',
                        colspan: 2
                    }
                ]
            }, 
            patienthistory_panel
        ]
    });
});