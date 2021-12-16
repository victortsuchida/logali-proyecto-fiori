sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/employee/model/formatter"

], function(Controller, formatter){
    "use strict";

    return Controller.extend("logaligroup.employee.controller.EmployeeDetails", {
        onInit: function(){
            this._bus = sap.ui.getCore().getEventBus();
        },

        onCreateIncidence: function(){
            let tableIncidence = this.getView().byId("tableIncidence");
            let newIncidence = sap.ui.xmlfragment("logaligroup.employee.fragment.NewIncidence", this);
            let incidenceModel = this.getView().getModel("incidenceModel");
            let oData = incidenceModel.getData();
            let index = oData.length;

            oData.push({ index : index + 1 });
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index );
            tableIncidence.addContent(newIncidence);
        },

        Formatter: formatter,

        onDeleteIncidence: function(oEvent){
            // let tableIncidence = this.getView().byId("tableIncidence");
            // let rowIncidence = oEvent.getSource().getParent().getParent();
            // let incidenceModel = this.getView().getModel("incidenceModel");
            // let oData = incidenceModel.getData();
            // let contextObject = rowIncidence.getBindingContext("incidenceModel").getObject();

            // oData.splice(contextObject.index-1,1);
            // for (let i in oData){
            //     oData[i].index = parseInt(i) + 1;
            // }

            // incidenceModel.refresh();
            // tableIncidence.removeContent(rowIncidence);

            // for (let j in tableIncidence.getContent()){
            //     tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j);
            // };

            let contextObject = oEvent.getSource().getBindingContext("incidenceModel").getObject();
            this._bus.publish("incidence", "onDeleteIncidence", { 
                IncidenceId: contextObject.IncidenceId,
                SapId: contextObject.SapId,
                EmployeeId: contextObject.EmployeeId
             });
        },

        updateIncidenceCreationDate: function(oEvent){
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();
            contextObject.CreationDateX = true;
        },

        updateIncidenceReason: function(oEvent){
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();
            contextObject.ReasonX = true;
        },

        updateIncidenceType: function(oEvent){
            let context = oEvent.getSource().getBindingContext("incidenceModel");
            let contextObject = context.getObject();
            contextObject.TypeX = true;
        },

        onSaveDataIncidence: function(oEvent){
            let incidence = oEvent.getSource().getParent().getParent();
            let incidenceRow = incidence.getBindingContext("incidenceModel");
            this._bus.publish("incidence", "onSaveIncidence", { incidenceRow : incidenceRow.getPath().replace("/", "") }); 
        }
    })
});