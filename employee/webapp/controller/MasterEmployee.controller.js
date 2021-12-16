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

        return Controller.extend("logaligroup.employee.controller.MasterEmployee", {
            onInit: function () {
               this._bus = sap.ui.getCore().getEventBus();
            },

            onInputChange: function (oEvent) {
                let oInput = this.getView().byId("_IDGenInput1"),
                    oSelect = this.getView().byId("_IDGenSelect1"),
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

            onFilter: function (oEvent) {
                let sCountryKey = this.getView().getModel("contries").getProperty("/CountryKey"),
                    sEmployeeId = this.getView().getModel("employee").getProperty("/EmployeeId"),

                    oCountryFilter = new Filter("Country", FilterOperator.EQ, sCountryKey),
                    oEmployeeFilter = new Filter("EmployeeID", FilterOperator.Contains, sEmployeeId),
                    oList = this.getView().byId("_IDGenTable1").getBinding("items"),
                    aFilters = [];

                aFilters.push(oCountryFilter);
                aFilters.push(oEmployeeFilter);

                oList.filter(aFilters);
            },

            onClearFilter: function (oEvent) {
                let oList = this.getView().byId("_IDGenTable1").getBinding("items"),
                    aFilters = [],
                    oModel = this.getView().getModel("employee");

                oList.filter(aFilters);

                oModel.setProperty("/CountryKey", "");
                oModel.setProperty("/EmployeeId", "");
            },

            onShowPostalCode: function (oEvent) {
                let oItem = oEvent.getSource().getBindingContext("employee").getObject();
                MessageToast.show(oItem.PostalCode)
            },

            onShowCity: function () {
                this.getView().getModel("selectVisibility").setProperty("/showCityColumn", true);
            },

            onHideCity: function () {
                this.getView().getModel("selectVisibility").setProperty("/showCityColumn", false);
            },

            onShowOrders: function (oEvent) {
                let oContext = oEvent.getSource().getBindingContext("odataNorthwind"),
                    oItem = oContext.getObject(),
                    aOrders = oItem.Orders,
                    aItems = [];

                // first table
                for (let i in aOrders) {
                    aItems.push(new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Label({ text: aOrders[i].OrderID }),
                            new sap.m.Label({ text: aOrders[i].Freight }),
                            new sap.m.Label({ text: aOrders[i].ShipAddress })
                        ]
                    }))
                };

                let oTable = new sap.m.Table({
                    width: "auto",
                    columns: [
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>orderID}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>freight}" }) }),
                        new sap.m.Column({ header: new sap.m.Label({ text: "{i18n>shipAddress}" }) })
                    ],
                    items: aItems
                }).addStyleClass("sapUiSmallMargin");

                let oHBox = this.getView().byId("_IDGenHBox1");
                oHBox.destroyItems();
                oHBox.addItem(oTable);

                // second table (dynamic)
                let oDynTable = new sap.m.Table();
                oDynTable.setWidth("auto");
                oDynTable.addStyleClass("sapUiSmallMargin");

                let oColumnOrderId = new sap.m.Column();
                let oLabelOrderId = new sap.m.Label();
                oLabelOrderId.bindProperty("text", "i18n>orderID");
                oColumnOrderId.setHeader(oLabelOrderId);
                oDynTable.addColumn(oColumnOrderId);

                let oColumnFreight = new sap.m.Column();
                let oLabelFreight = new sap.m.Label();
                oLabelFreight.bindProperty("text", "i18n>freight");
                oColumnFreight.setHeader(oLabelFreight);
                oDynTable.addColumn(oColumnFreight);

                let oColumnShipAddress = new sap.m.Column();
                let oLabelShipAddress = new sap.m.Label();
                oLabelShipAddress.bindProperty("text", "i18n>shipAddress");
                oColumnShipAddress.setHeader(oLabelShipAddress);
                oDynTable.addColumn(oColumnShipAddress);

                let oColumnListItem = new sap.m.ColumnListItem();

                let oCellOrderId = new sap.m.Label();
                oCellOrderId.bindProperty("text", "employee>OrderID");
                oColumnListItem.addCell(oCellOrderId);

                let oCellFreight = new sap.m.Label();
                oCellFreight.bindProperty("text", "employee>Freight");
                oColumnListItem.addCell(oCellFreight);

                let oCellShipAddress = new sap.m.Label();
                oCellShipAddress.bindProperty("text", "employee>ShipAddress");
                oColumnListItem.addCell(oCellShipAddress);

                let oBindingInfo = {
                    model: "employee",
                    path: "Orders",
                    template: oColumnListItem
                };

                oDynTable.bindAggregation("items", oBindingInfo);
                oDynTable.bindElement("employee>" + oContext.getPath());

                oHBox.addItem(oDynTable);
            },

            onDialogOpen: function (oEvent) {
                let sPath = oEvent.getSource().getBindingContext("odataNorthwind").getPath();

                if (!this._oDialogOrders) {
                    this._oDialogOrders = sap.ui.xmlfragment("logaligroup.employee.fragment.DialogOrders", this);
                    this.getView().addDependent(this._oDialogOrders);
                };

                this._oDialogOrders.bindElement("odataNorthwind>" + sPath);
                this._oDialogOrders.open();
            },

            onDialogClose: function () {
                this._oDialogOrders.close();
            },

            onShowEmployee: function(oEvent){
                let sPath = oEvent.getSource().getBindingContext("odataNorthwind").getPath();
                this._bus.publish("flexible", "showEmployee", sPath);
            }
        });
    });
