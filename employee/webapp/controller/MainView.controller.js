sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 * @param {typeof sap.m.MessageToast} MessageToast
	 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
	 */
    function (Controller, MessageToast, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("logaligroup.employee.controller.MainView", {
            onInit: function () {
                let oDataVis = {
                    visibility: true
                };

                // Model for visibility
                let oModVis = new JSONModel(oDataVis);
                this.getView().setModel(oModVis, "selectVisibility");

                debugger; 
                // Load of JSON Employee file
                let oModEmp = new JSONModel();
                oModEmp.loadData("./localService/Employees.json");
                this.getView().setModel(oModEmp, "employee");
            },

            onInputChange: function (oEvent) {
                let oInput = this.getView().byId("_IDGenInput1"),
                    oSelect =  this.getView().byId("_IDGenSelect1"),
                    oModelVis = this.getView().getModel("selectVisibility"),
                    sEmpCode = oInput.getValue();

                if (sEmpCode.length === 6) {
                    //oInput.setDescription("OK");
                    oModelVis.setProperty("/visibility", true);
                }
                else {
                    //oInput.setDescription("Not OK");
                    oModelVis.setProperty("/visibility", false);
                }
            },

            onFilter: function(oEvent){
                let sCountryKey = this.getView().getModel("employee").getProperty("/CountryKey"),
                    sEmployeeId = this.getView().getModel("employee").getProperty("/EmployeeId"),

                    oCountryFilter = new Filter("Country", FilterOperator.EQ, sCountryKey),
                    oEmployeeFilter = new Filter("EmployeeID", FilterOperator.Contains, sEmployeeId),
                    oList = this.getView().byId("_IDGenTable1").getBinding("items"),
                    aFilters = [];

                aFilters.push(oCountryFilter);
                aFilters.push(oEmployeeFilter);

                oList.filter(aFilters);
            },

            onClearFilter: function(oEvent){
                let oList = this.getView().byId("_IDGenTable1").getBinding("items"),
                    aFilters = [],
                    oModel = this.getView().getModel("employee");

                oList.filter(aFilters);

                oModel.setProperty("/CountryKey", "");
                oModel.setProperty("/EmployeeId", "");
            },

            onShowPostalCode: function(oEvent){
                let oItem = oEvent.getSource().getBindingContext("employee").getObject();
                MessageToast.show(oItem.PostalCode)
            }
        });
    });
