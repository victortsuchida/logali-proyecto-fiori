sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"

], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("logaligroup.employee.controller.Main", {
        onBeforeRendering: function () {
            this._detailEmployeeView = this.getView().byId("_IDGenXMLView2");
        },

        onInit: function () {
            let oDataVis = {
                visibility: true,
                showCityColumn: false
            };

            // Model for visibility
            let oModVis = new JSONModel(oDataVis);
            this.getView().setModel(oModVis, "selectVisibility");

            // Load of JSON Employee file
            let oModEmp = new JSONModel();
            oModEmp.loadData("./localService/Employees.json");
            this.getView().setModel(oModEmp, "employee");

            // Load of JSON Countries file
            let oModCountry = new JSONModel();
            oModCountry.loadData("./localService/Countries.json");
            this.getView().setModel(oModCountry, "contries");

            // Load of JSON Layout file
            let oModLayout = new JSONModel();
            oModLayout.loadData("./localService/Layout.json");
            this.getView().setModel(oModLayout, "layout");

            this._bus = sap.ui.getCore().getEventBus();

            this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);
            this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveIncidence, this);
            this._bus.subscribe("incidence", "onDeleteIncidence", this.onDeleteIncidence, this);
        },

        showEmployeeDetails: function (category, nameEvent, path) {
            let detailView = this.getView().byId("_IDGenXMLView2");
            detailView.bindElement("odataNorthwind>" + path);

            this.getView().getModel("layout").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

            let oIncModel = new sap.ui.model.json.JSONModel([]);
            detailView.setModel(oIncModel, "incidenceModel");
            detailView.byId("tableIncidence").removeAllContent();

            this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
        },

        onSaveIncidence: function (channelId, eventId, data) {
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
            let incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

            if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                let body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    Type: incidenceModel[data.incidenceRow].Type,
                    Reason: incidenceModel[data.incidenceRow].Reason
                };

                this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                    success: function () {
                        MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                        this.onReadODataIncidence.bind(this)(employeeId);
                    }.bind(this),
                    error: function (e) {
                        MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }.bind(this)
                });
            } else if ( incidenceModel[data.incidenceRow].CreationDateX ||
                        incidenceModel[data.incidenceRow].ReasonX ||
                        incidenceModel[data.incidenceRow].TypeX) {
                let body = {
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: employeeId.toString(),
                    CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                    CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                    Type: incidenceModel[data.incidenceRow].Type,
                    TypeX: incidenceModel[data.incidenceRow].TypeX,
                    Reason: incidenceModel[data.incidenceRow].Reason,
                    ReasonX: incidenceModel[data.incidenceRow].ReasonX
                };
                this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                                                                               "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                                                                               "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId +
                                                                               "')", body, {
                    success: function(){
                        this.onReadODataIncidence.bind(this)(employeeId);
                        MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                    }.bind(this),

                    error: function(){
                        MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                    }.bind(this)
                })
            }

            else {

            }
        },

        onDeleteIncidence: function(channelId, eventId, data){
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                                                                            "',SapId='" + data.SapId +
                                                                            "',EmployeeId='" + data.EmployeeId +
                                                                            "')", {
                success: function(){
                    this.onReadODataIncidence.bind(this)(data.EmployeeId);
                    MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                }.bind(this),
                
                error: function(e){
                    MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                }
            });
        },

        onReadODataIncidence: function (employeeID) {
            this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                filters: [
                    new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                    new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                ],

                success: function (data) {
                    let incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                    incidenceModel.setData(data.results);

                    let tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                    tableIncidence.removeAllContent();

                    for (let incidence in data.results) {
                        let newIncidence = sap.ui.xmlfragment("logaligroup.employee.fragment.NewIncidence", this._detailEmployeeView.getController());
                        this._detailEmployeeView.addDependent(newIncidence);
                        newIncidence.bindElement("incidenceModel>/" + incidence);
                        tableIncidence.addContent(newIncidence);
                    }
                }.bind(this),
                error: function (e) {

                }.bind(this)
            });
        }
    })
});