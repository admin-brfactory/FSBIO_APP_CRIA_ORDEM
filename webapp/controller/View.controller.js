sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	'sap/ui/core/Fragment',
	"com/fsbioenergiaZCRIAR_ORD_VENDA/model/formatter",
	'sap/m/MessageToast',
	"sap/m/MessageBox"
], function(Controller, JSONModel, Fragment, formatter, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("com.fsbioenergiaZCRIAR_ORD_VENDA.controller.View", {

		formatter: formatter,

		onInit: function() {
			var oViewModel = new JSONModel({
				atuaVisibility: true,
				listaOvCount: 0,
				listaOvsCriadas: 0,
				oDadosResumo: [],
				dadosOV: [],
				dadosGerais: [],
				btnAntEnable: true,
				btnProxEnable: true,
				tipoDocList: [],
				orgVendasList: [],
				canalList: [],
				setorList: [],
				observacoesList: [],
				dadosOVFragment: [],
				numSemanaBind: "",
				listaErros: [],
				indiceSemana: 2

			});
			this.getView().setModel(oViewModel, "ordemView");
			this.onSearchOrdens();
		},

		onSearchOrdens: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("ordemView");
			var usuario = sap.ushell.Container.getService("UserInfo").getId();
			var sURL = "/GET_ORDENS_VENDASet(USUARIO='" + usuario + "')";

			sap.ui.core.BusyIndicator.show();
			oModel.read(sURL, {
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();

					if (oData.TAB_OV) {
						var oTabOV = JSON.parse(oData.TAB_OV);
						oViewModel.setProperty("/dadosGerais", oTabOV);
					}

					if (oData.LISTA_TP_DOC) {
						var oListTipoDoc = JSON.parse(oData.LISTA_TP_DOC);

						oViewModel.setProperty("/tipoDocList", oListTipoDoc);
					}

					if (oData.LISTA_ORG_VENDAS) {
						var oListOrgVendas = JSON.parse(oData.LISTA_ORG_VENDAS);

						oViewModel.setProperty("/orgVendasList", oListOrgVendas);
					}

					if (oData.LISTA_CANAL) {
						var oListCanal = JSON.parse(oData.LISTA_CANAL);

						oViewModel.setProperty("/canalList", oListCanal);
					}

					if (oData.LISTA_SETOR) {
						var oListCanal = JSON.parse(oData.LISTA_SETOR);

						oViewModel.setProperty("/setorList", oListCanal);
					}

					if (oData.LISTA_OBSERVACOES) {
						var oListObs = JSON.parse(oData.LISTA_OBSERVACOES);
						oListObs.unshift({
							KEY: "",
							OBSERVACOES: ""
						});
						oViewModel.setProperty("/observacoesList", oListObs);
					}

					this.setTableBind();

				}.bind(this),
				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
				}.bind(this)
			});
		},

		setTableBind: function(NextPrev) {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("ordemView");
			var indiceSemana = oViewModel.getProperty("/indiceSemana");
			var dadosGerais = oViewModel.getProperty("/dadosGerais");
			var tabBind, tabCheckProxAntSemana;
			var semana = dadosGerais[indiceSemana].SEMANA;

			if (NextPrev == "proximo") {
				if (typeof(dadosGerais[indiceSemana + 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnProxEnable", false);
				}

				if (oViewModel.getProperty("/btnAntEnable") === false) {
					oViewModel.setProperty("/btnAntEnable", true);
				}

				tabBind = dadosGerais.filter(indice => indice.SEMANA == semana);

				oViewModel.setProperty("/dadosOV", tabBind[0].DADOS_OVS);
				oViewModel.setProperty("/oDadosResumo", tabBind[0].RESUMO_OVS);
				oViewModel.setProperty("/listaOvCount", tabBind[0].DADOS_OVS.length);
				oViewModel.setProperty("/numSemanaBind", tabBind[0].SEMANA);

			} else if (NextPrev == "anterior") {
				if (typeof(dadosGerais[indiceSemana - 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnAntEnable", false);
				}

				if (oViewModel.getProperty("/btnProxEnable") === false) {
					oViewModel.setProperty("/btnProxEnable", true);
				}

				tabBind = dadosGerais.filter(indice => indice.SEMANA == semana);

				if (oViewModel.getProperty("/btnProxEnable") == false) {
					oViewModel.setProperty("/btnProxEnable", true);
				}
				oViewModel.setProperty("/dadosOV", tabBind[0].DADOS_OVS);
				oViewModel.setProperty("/oDadosResumo", tabBind[0].RESUMO_OVS);
				oViewModel.setProperty("/listaOvCount", tabBind[0].DADOS_OVS.length)
				oViewModel.setProperty("/numSemanaBind", tabBind[0].SEMANA);

			} else {
				if (typeof(dadosGerais[indiceSemana - 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnAntEnable", false);
				}

				tabCheckProxAntSemana = true

				if (typeof(dadosGerais[indiceSemana + 1]) == "undefined") {
					tabCheckProxAntSemana = false;
				}

				if (tabCheckProxAntSemana == false) {
					oViewModel.setProperty("/btnProxEnable", false);
				}

				indiceSemana = dadosGerais.findIndex(indice => indice.SEMANA == semana)

				tabBind = dadosGerais.filter(indice => indice.SEMANA == semana);

				if (tabBind.length == 0) {
					MessageBox.error("Ocorreu um erro, recarregue a pagina e tente novamente.");
					return;
				}
				oViewModel.setProperty("/dadosOV", tabBind[0].DADOS_OVS);
				oViewModel.setProperty("/oDadosResumo", tabBind[0].RESUMO_OVS);
				oViewModel.setProperty("/listaOvCount", tabBind[0].DADOS_OVS.length);
				oViewModel.setProperty("/numSemanaBind", tabBind[0].SEMANA);
				oViewModel.setProperty("/indiceSemana", indiceSemana);
			}

		},

		onClickOpcoes: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("ordemView");
			var usuario = sap.ushell.Container.getService("UserInfo").getId();
			var semana = oViewModel.getProperty("/numSemanaBind");
			var sURL = "/GET_OVS_CRIADASSet(USUARIO='" + usuario + "',SEMANA='" + semana + "')";

			sap.ui.core.BusyIndicator.show();
			oModel.read(sURL, {
				success: function(oData) {
					sap.ui.core.BusyIndicator.hide();

					if (oData.TAB_OVS_CRIADAS) {
						var oTabOVSCriadas = JSON.parse(oData.TAB_OVS_CRIADAS);

						oViewModel.setProperty("/dadosOVFragment", oTabOVSCriadas);
						oViewModel.setProperty("/listaOvsCriadas", oTabOVSCriadas.length);
						this.openCancelarOrdem().open();
					};

				}.bind(this),
				error: function(oError) {
					sap.ui.core.BusyIndicator.hide();
				}.bind(this)
			});
		},

		moveSemana: function(NextPrev) {
			var oViewModel = this.getView().getModel("ordemView");

			var indiceSemana = oViewModel.getProperty("/indiceSemana");
			this.limpaTabSelections("table2");

			if (NextPrev == "proximo") {
				indiceSemana = indiceSemana + 1;
				oViewModel.setProperty("/indiceSemana", indiceSemana);
				this.setTableBind(NextPrev);
			} else {
				indiceSemana = indiceSemana - 1;
				oViewModel.setProperty("/indiceSemana", indiceSemana);
				this.setTableBind(NextPrev);
			}
		},

		_openListaErros: function() {
			if (!this.openListaErro) {
				this.openListaErro = sap.ui.xmlfragment(this.getView().getId(), "com.fsbioenergiaZCRIAR_ORD_VENDA.view.fragments.MessageList",
					this);
				this.getView().addDependent(this.openListaErro);
			}
			return this.openListaErro;
		},

		openDialogParamCriarOrdem: function() {
			if (!this.pDialogParamCriarOrdem) {
				this.pDialogParamCriarOrdem = sap.ui.xmlfragment(this.getView().getId(),
					"com.fsbioenergiaZCRIAR_ORD_VENDA.view.fragments.ParamCriaOrdem",
					this);
				this.getView().addDependent(this.pDialogParamCriarOrdem);
			}
			return this.pDialogParamCriarOrdem;

		},

		openCancelarOrdem: function() {
			if (!this.pDialogCancelarOrdem) {
				this.pDialogCancelarOrdem = sap.ui.xmlfragment(this.getView().getId(), "com.fsbioenergiaZCRIAR_ORD_VENDA.view.fragments.cancelar",
					this);
				this.getView().addDependent(this.pDialogCancelarOrdem);
			}
			return this.pDialogCancelarOrdem;

		},

		onCloseDialog: function(sID) {
			var oViewModel = this.getView().getModel("ordemView");
			if (sID == "cancFragment") {
				this.limpaTabSelections("table3")
				this.limpaFragments("/dadosOVFragment")
			} else if (sID == "messageList") {
				this.limpaFragments("/listaErros");
			}
			this.byId(sID).close();

		},

		limpaFragments: function(sBind) {
			var oViewModel = this.getView().getModel("ordemView");
			oViewModel.setProperty(sBind, []);
		},

		enviarDadosGerarOv: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("ordemView");
			var usuario = sap.ushell.Container.getService("UserInfo").getId();
			var tipoDoc = this.getView().byId("tpDoc");
			var tipoDocKey = tipoDoc.getSelectedKey();
			var orgVend = this.getView().byId("orgVenda");
			var orgVendaKey = orgVend.getSelectedKey();
			var canal = this.getView().byId("canal");
			var canalKey = canal.getSelectedKey();
			var setor = this.getView().byId("setor");
			var setorKey = setor.getSelectedKey();
			var oTable = this.getView().byId("table2");
			var oTableData = oViewModel.getProperty("/dadosOV");
			var linhaSelec = oTable.getSelectedIndices();
			var oTableRows = oTable.getRows();
			var oSelectItemsArray = [];

			MessageBox.confirm("Confirma envio de dados para geração de ordem?", {
				onClose: function(sAction) {
					if (sAction == "OK") {
						for (var i in linhaSelec) {
							oSelectItemsArray.push(oTableData[linhaSelec[i]]);
						}

						var oEntry = {
							USUARIO: usuario,
							TIPO_DOC: tipoDocKey,
							ORG_VENDA: orgVendaKey,
							CANAL: canalKey,
							SETOR: setorKey,
							DADOS_OV: JSON.stringify(oSelectItemsArray)
						};

						sap.ui.core.BusyIndicator.show();
						oModel.create("/GERAR_OVSet", oEntry, {
							success: function(oData) {
								sap.ui.core.BusyIndicator.hide();

								if (oData.TAB_MENSAGEM) {
									var oMensagem = JSON.parse(oData.TAB_MENSAGEM);
									var oListErro = [];
									for (var index in oMensagem) {
										if (oMensagem[index].TYPE == "S") {
											MessageBox.success(oMensagem[index].MESSAGE);
										} else {
											oListErro.push(oMensagem[index]);
										}
									}

									if (oListErro.length != 0) {
										oViewModel.setProperty("/listaErros", oListErro);
										this._openListaErros().open();
									} else {
										tipoDoc.setSelectedIndex(0);
										orgVend.setSelectedIndex(0);
										canal.setSelectedIndex(0);
										setor.setSelectedIndex(0);
										this.openDialogParamCriarOrdem().close();
										this.limpaTabSelections("table2");
										this.onSearchOrdens();
									}
								}

							}.bind(this),

							error: function(error) {
								sap.ui.core.BusyIndicator.hide();
								MessageBox.error("Ocorreu um erro inesperado ao salvar os dados, tente novamente.");
							}.bind(this)

						});

					}
				}.bind(this)
			});

		},

		onGerarOV: function() {
			var oTable = this.getView().byId("table2");
			var linhaSelec = oTable.getSelectedIndices();

			if (linhaSelec.length == 0) {
				MessageToast.show("Necessario selecionar uma ou mais linhas da tabela!");
				return;
			}

			this.openDialogParamCriarOrdem().open();
		},

		onCancelarOV: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("ordemView");
			var usuario = sap.ushell.Container.getService("UserInfo").getId();
			var oTable = this.getView().byId("table3");
			var oTableData = oViewModel.getProperty("/dadosOVFragment");
			var linhaSelec = oTable.getSelectedIndices();
			var oTableRows = oTable.getRows();
			var oSelectItemsArray = [];

			if (linhaSelec.length == 0) {
				MessageToast.show("Necessario selecionar uma ou mais linhas da tabela!");
				return;
			}

			for (var i in linhaSelec) {
				if (oTableRows[linhaSelec[i]].getCells()[8].getSelectedKey() == "") {
					MessageBox.error("Ao cancelar, todas os campos observações devem estar preenchidos.")
					return;
				}
				oSelectItemsArray.push(oTableData[linhaSelec[i]]);
			}

			MessageBox.confirm("Deseja cancelar as ordens de venda selecionadas?", {
				onClose: function(oAction) {
					if (oAction == "OK") {

						var oEntry = {
							USUARIO: usuario,
							DADOS_OV: JSON.stringify(oSelectItemsArray)
						};

						sap.ui.core.BusyIndicator.show();
						oModel.create("/CANCELAR_OVSet", oEntry, {
							success: function(oData) {
								sap.ui.core.BusyIndicator.hide();

								if (oData.TAB_MENSAGEM) {
									var oMensagem = JSON.parse(oData.TAB_MENSAGEM);
									var oListErro = [];
									for (var index in oMensagem) {
										if (oMensagem[index].TYPE == "S") {
											MessageBox.success(oMensagem[index].MESSAGE);
										} else {
											oListErro.push(oMensagem[index]);
										}
									}

									if (oListErro.length != 0) {
										oViewModel.setProperty("/listaErros", oListErro);
										this._openListaErros().open();
									} else {
										this.limpaTabSelections("table3");
										this.onClickOpcoes();
									}

								};

							}.bind(this),

							error: function(error) {
								sap.ui.core.BusyIndicator.hide();
								MessageBox.error("Ocorreu um erro inesperado ao salvar os dados, tente novamente.");
							}.bind(this)

						});
					}
				}.bind(this)
			});

		},

		onBloquearOv: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("ordemView");
			var usuario = sap.ushell.Container.getService("UserInfo").getId();
			var oTable = this.getView().byId("table3")
			var oTableData = oViewModel.getProperty("/dadosOVFragment");
			var linhaSelec = oTable.getSelectedIndices();
			var oTableRows = oTable.getRows();
			var oSelectItemsArray = [];
			
			if (linhaSelec.length == 0) {
				MessageToast.show("Necessario selecionar uma ou mais linhas da tabela!");
				return;
			}

			for (var i in linhaSelec) {
				if (oTableRows[linhaSelec[i]].getCells()[8].getSelectedKey() == "") {
					MessageBox.error("Ao bloquear, todas os campos observações devem estar preenchidos.")
					return;
				}
				oSelectItemsArray.push(oTableData[linhaSelec[i]]);
			}

			MessageBox.confirm("Deseja bloquear as ordens de venda selecionadas?", {
				onClose: function(oAction) {
					if (oAction == "OK") {
						var oEntry = {
							USUARIO: usuario,
							DADOS_OV: JSON.stringify(oSelectItemsArray)
						};

						sap.ui.core.BusyIndicator.show();
						oModel.create("/BLOQUEAR_OVSet", oEntry, {
							success: function(oData) {
								sap.ui.core.BusyIndicator.hide();

								if (oData.TAB_MENSAGEM) {
									var oMensagem = JSON.parse(oData.TAB_MENSAGEM);
									var oListErro = [];
									for (var index in oMensagem) {
										if (oMensagem[index].TYPE == "S") {
											MessageBox.success(oMensagem[index].MESSAGE);
										} else {
											oListErro.push(oMensagem[index]);
										}
									}

									if (oListErro.length != 0) {
										oViewModel.setProperty("/listaErros", oListErro);
										this._openListaErros().open();
									} else {
										this.limpaTabSelections("table3");
										this.onClickOpcoes();
									}

								};

							}.bind(this),

							error: function(error) {
								sap.ui.core.BusyIndicator.hide();
								MessageBox.error("Ocorreu um erro inesperado ao salvar os dados, tente novamente.");
							}.bind(this)

						});
					}
				}.bind(this)
			});

		},

		onDesbloqOV: function() {
			var oModel = this.getOwnerComponent().getModel();
			var oViewModel = this.getView().getModel("ordemView");
			var usuario = sap.ushell.Container.getService("UserInfo").getId();
			var oTable = this.getView().byId("table3")
			var oTableData = oViewModel.getProperty("/dadosOVFragment");
			var linhaSelec = oTable.getSelectedIndices();
			var oTableRows = oTable.getRows();
			var oSelectItemsArray = [];

			if (linhaSelec.length == 0) {
				MessageToast.show("Necessario selecionar uma ou mais linhas da tabela!");
				return;
			}

			MessageBox.confirm("Deseja desbloquear as ordens de venda selecionadas?", {
				onClose: function(oAction) {
					if (oAction == "OK") {
						for (var i in linhaSelec) {
							oSelectItemsArray.push(oTableData[linhaSelec[i]]);
						}

						var oEntry = {
							USUARIO: usuario,
							DADOS_OV: JSON.stringify(oSelectItemsArray)
						};

						sap.ui.core.BusyIndicator.show();
						oModel.create("/DESBLOQUEAR_OVSet", oEntry, {
							success: function(oData) {
								sap.ui.core.BusyIndicator.hide();

								if (oData.TAB_MENSAGEM) {
									var oMensagem = JSON.parse(oData.TAB_MENSAGEM);
									var oListErro = [];
									
									for (var index in oMensagem) {
										if (oMensagem[index].TYPE == "S") {
											MessageBox.success(oMensagem[index].MESSAGE);
										} else {
											oListErro.push(oMensagem[index]);
										}
									}

									if (oListErro.length != 0) {
										oViewModel.setProperty("/listaErros", oListErro);
										this._openListaErros().open();
									} else {
										this.limpaTabSelections("table3");
										this.onClickOpcoes();
									}

								};

							}.bind(this),

							error: function(error) {
								sap.ui.core.BusyIndicator.hide();
								MessageBox.error("Ocorreu um erro inesperado ao salvar os dados, tente novamente.");
							}.bind(this)

						});
					}
				}.bind(this)
			});

		},

		limpaTabSelections: function(sID) {
			var oTable = this.getView().byId(sID);
			oTable.clearSelection();
		}

	});
});