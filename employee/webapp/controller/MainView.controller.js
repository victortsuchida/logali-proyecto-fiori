sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 * @param {typeof sap.m.MessageToast} MessageToast
	 * @param {typeof sap.ui.model.json.JSONModel} JSONModel
	 */
    function (Controller, MessageToast, JSONModel) {
        "use strict";

        return Controller.extend("logaligroup.employee.controller.MainView", {
            onInit: function () {
/*                let oDataCountries = {
                    countries: [
                        {
                            key: "",
                            country: ""
                        },                        
                        {
                            key: "US",
                            country: "United States"
                        },
                        {
                            key: "UK",
                            country: "United Kingdom"
                        },
                        {
                            key: "ES",
                            country: "Spain"
                        }
                    ]
                };



                let oModCountries = new JSONModel(oDataCountries);*/
                //this.getView().setModel(oModCountries, "countries");

                let oDataVis = {
                    visibility: false
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
            }
        });
    });
