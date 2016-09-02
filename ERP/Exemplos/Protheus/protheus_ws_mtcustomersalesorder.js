function createDataset(fields, constraints, sortFields) {
	// Instanciar Servico ECM configurado para o Webservice (WSDL) MTCustomerSalesOrder do TOTVS Protheus
	var serviceObj = ServiceManager.getService("MTCUSTOMERSALESORDER");
	// Carregamento das Stubs
	svcBean = serviceObj.getBean();
	
	// URI das Classes do webservice
	wsPackage = "br.com.microsiga.webservices.mtcustomersalesorder_apw";
	// Instanciar objeto de definicao do servico (webservice)
	var serviceLoc = svcBean.instantiate(wsPackage + "." + "MTCUSTOMERSALESORDERLocator");
	
	// Objeto com abstracao dos metodos do servico (webservice)
	//  Permite passar parametro com URL para um endpoint diferente do padrao.
	//  O parametro deve ser um objeto java.net.URL com o endereco (URL).
	//  Exemplo: getMTCUSTOMERSALESORDERSOAP(new java.net.URL("http://200.204.0.10:8080/main_webservices/MTCUSTOMERSALESORDER.apw"));
	//  - Endpoint padrao, do Servico ECM: http://localhost:8011/ws/MTCUSTOMERSALESORDER.apw
	var salesOrderSOAP = serviceLoc.getMTCUSTOMERSALESORDERSOAP();
	
	// Codigo do usuario do Portal Protheus com privilegio de acesso ao servico webservice
	var cUserCode = new String('*******');
	// Identificador do cliente do Portal Protheus (Codigo do Cliente [A1_COD] + Loja [A1_LOJA])
	var cCustomerID = new String('00000101');

	// Objeto com dados do PV
	var salesOrderView = svcBean.instantiate(wsPackage + ".SALESORDERVIEW");
	// Objeto com dados do PV (cabecalho)
	salesOrderHeaderView = svcBean.instantiate(wsPackage + ".SALESORDERHEADERVIEW");
	// Objeto que reune os itens com dados do PV
	var arrayOfSalesOrderItemView = svcBean.instantiate(wsPackage + ".ARRAYOFSALESORDERITEMVIEW");
	
	// Preencher dados do cabecalho do Pedido de Venda (PV)
	montaCabecPV();
	
	// Definicao da variavel para reunir os objetos dos itens do PV
	salesOrderItemViewArray = new Array();
	
	// Incluir item no Pedido de Venda (PV)
	salesOrderItemViewArray.push( novoItemPV() );
	
	// Atribuindo objeto com vetor de objetos dos itens do PV
	arrayOfSalesOrderItemView.setSALESORDERITEMVIEW(salesOrderItemViewArray);
	// Atribuindo objeto com dados do cabecalho do PV 
	salesOrderView.setSOHEADER(salesOrderHeaderView);
	// Atribuindo objeto com itens do PV
	salesOrderView.setSOITEM(arrayOfSalesOrderItemView);
	
	// Criacao do Dataset para receber o retorno, numero do PV
	var dataset = DatasetFactory.newDataset();
	dataset.addColumn("Número do PV");
	
	// Chamada ao metodo PutSalesOrder para inclusao do Pedido de Vendas (PV) com os dados acima
	try {
		// O retorno sendo o numero PV inclui como registro do Dataset
		dataset.addRow(new Array( salesOrderSOAP.PUTSALESORDER(cUserCode, cCustomerID, salesOrderView) ));
	} catch (e) {
		return createDatasetErro(e.message);
	}
	
	return dataset;
}

// Variaveis globais para as funcoes do Dataset
var dataset_name = 'DS_Protheus_MTCustomerSalesOrder_PutSalesOrder';
var wsPackage = "br.com.microsiga.webservices.mtcustomersalesorder_apw";
var svcBean = 'serviceObj.getBean()';
var salesOrderHeaderView = 'svcBean.instantiate(wsPackage + ".SALESORDERHEADERVIEW")';
var salesOrderItemViewArray = new Array();

//Funcao para montar um Dataset com a mensagem de erro ocorrida
function createDatasetErro(a){
	var c = DatasetFactory.newDataset();
	c.addColumn("erro");
	var b = new String(a).split('\n');
	log.error("[DATASET "+dataset_name+"] Numero de linhas no retorno de erro ==>> b.length = "+b.length.toString());
	for (var i = 0; i < b.length; i++) {
		c.addRow( [ b[i] ] );
	}
	log.error("[DATASET "+dataset_name+"] "+a);
	return c;
}

//Funcao com logica para contrucao do objeto do cabecalho do Pedido de Vendas (PV)
function montaCabecPV() {
	// Numero (do PV) - OPCIONAL
	//salesOrderHeaderView.setORDERID(new String( '' ));
		
	// Cliente/Fornecedor - OBRIGATORIO (Tabela SA1 [CLIENTE]. Dependendo do 'Tipo Pedido' Tabela SA2 [FORNECEDOR])
	salesOrderHeaderView.setCUSTOMERCODE(new String( '000001' ));
	
	// Loja - OBRIGATORIO (Tabela SA1 [CLIENTE]. Dependendo do 'Tipo Pedido' Tabela SA2 [FORNECEDOR]) 
	salesOrderHeaderView.setCUSTOMERUNIT(new String( '01' ));
	
	// Despesa - OPCIONAL
	salesOrderHeaderView.setADDITIONALEXPENSEVALUE(new java.lang.Float( 150 ));
	
	// Tipo Reajust - OPCIONAL (Tabela SM4 - Formulas)
	salesOrderHeaderView.setADJUSTMENTTYPE(new String( '' ));
	
	// Tp Liberacao - OPCIONAL (1 = Libera por Item; 2 = Libera por Pedido)
	salesOrderHeaderView.setAPROBATIONTYPE(new String( '2' ));
	
	// Banco - OPCIONAL (Tabela SA6)
	salesOrderHeaderView.setBANKCODE(new String( '237' ));
	
	// Licitacao (Cotacao) - OPCIONAL (Tabela AH9 - Codigo da Cotacao - ATENCAO! NAO VALIDA O VALOR)
	salesOrderHeaderView.setBIDNUMBER(new String( 'COT001' ));
	
	// Transp. - OPCIONAL (Tabela SA4)
	salesOrderHeaderView.setCARRIERCODE(new String( 'T00001' ));
	
	// Tipo Cliente - OPCIONAL (R = Revendedor; S = Solidario; F = Consumidor Final; L = Prod. Rual; X = Exportacao/Importacao)
	salesOrderHeaderView.setCUSTOMERTYPE(new String( 'F' ));
	
	// Cli.Entrega - OPCIONAL (Tabela SA1)
	salesOrderHeaderView.setDELIVERYCUSTOMER(salesOrderHeaderView.getCUSTOMERCODE());
	
	// Loja Entrega - OPCIONAL (Tabela SA1)
	salesOrderHeaderView.setDELIVERYUNITCODE(salesOrderHeaderView.getCUSTOMERUNIT());
	
	// Desconto 1 - OPCIONAL (Deve ser menor que 100)
	salesOrderHeaderView.setDISCOUNT1(new java.lang.Float( 50 ));
	
	// Desconto 2 - OPCIONAL (Deve ser menor que 100)
	salesOrderHeaderView.setDISCOUNT2(new java.lang.Float( 50 ));
	
	// Desconto 3 - OPCIONAL (Deve ser menor que 100)
	salesOrderHeaderView.setDISCOUNT3(new java.lang.Float( 50 ));
	
	// Desconto 4 - OPCIONAL (Deve ser menor que 100)
	salesOrderHeaderView.setDISCOUNT4(new java.lang.Float( 50 ));
	
	// Desc.Financ. - OPCIONAL (Deve ser menor que 100)
	salesOrderHeaderView.setFINANCIALDISCOUNT(new java.lang.Float( 50 ));
	
	// Acr. Financ - OPCIONAL
	salesOrderHeaderView.setFINANCIALINCREASE(new java.lang.Float( 150 ));
	
	// Tipo Frete - OPCIONAL (C = CIF; F = FOB)
	salesOrderHeaderView.setFREIGHTTYPE(new String( 'F' ));
	
	// Frete - OPCIONAL
	salesOrderHeaderView.setFREIGHTVALUE(new java.lang.Float( 150 ));
	
	// Peso Bruto - OPCIONAL
	salesOrderHeaderView.setGROSSWEIGHT(new java.lang.Float( 150 ));
	
	// %Indenizacao - OPCIONAL (Deve ser menor que 100)
	salesOrderHeaderView.setINDEMNITYPERCENTAGE(new java.lang.Float( 50 ));
	
	// Indenizacao - OPCIONAL
	salesOrderHeaderView.setINDEMNITYVALUE(new java.lang.Float( 150 ));
	
	// Frete Auton. - OPCIONAL
	salesOrderHeaderView.setINDEPENDENTFREIGHT(new java.lang.Float( 150 ));
	
	// Seguro - OPCIONAL
	salesOrderHeaderView.setINSURANCEVALUE(new java.lang.Float( 150 ));
	
	// Mens.p/ Nota - OPCIONAL
	salesOrderHeaderView.setINVOICEMESSAGE(new String( 'Mensagem Padrão para Faturamento' ));
	
	// Peso Liquido - OPCIONAL
	salesOrderHeaderView.setNETWEIGHT(new java.lang.Float( 150 ));
	
	// Tipo Pedido - OPCIONAL (N = Normal; C = Compl.Precos; I = Compl.ICMS; P = Compl.IPI; D = Dev.Compras; B = Utiliza Fornecedor)
	salesOrderHeaderView.setORDERTYPECODE(new String( 'N' ));
	
	// Cond. Pagto - OPCIONAL (Tabela SE4)
	salesOrderHeaderView.setPAYMENTPLANCODE(new String( '001' ));
	
	// Tabela - OPCIONAL (Tabela DA0)
	salesOrderHeaderView.setPRICELISTCODE(new String( '' ));
	
	// ISS Incluso - OPCIONAL (S = ISS Incluso no Produto; N = No Total)
	salesOrderHeaderView.setPRICEWITHSERVICETAX(new String( 'N' ));
	
	// Redespacho (Transp.) - OPCIONAL (Tabela SA4)
	salesOrderHeaderView.setREDELIVERYCARRIERCODE(new String( 'T00001' ));
	
	// DT Emissao - OPCIONAL
	salesOrderHeaderView.setREGISTERDATE(new java.util.Date(2013,10,06));
	
	// Moeda - OPCIONAL (Moeda 1 a 5)
	salesOrderHeaderView.setSALESORDERCURRENCY(new java.math.BigInteger( 1 ));
	
	// Mens. Padrao - OPCIONAL (Tabela SM4 - Formulas [Mensagem Padrão para Faturamento])
	salesOrderHeaderView.setSTANDARDMESSAGE1(new String( '' ));
	
	//--- Vendedor 1 a 5 - OPCIONAL -- INICIO ---
	var seller = svcBean.instantiate(wsPackage + '.GENERICSTRUCT');
	
	seller.setCODE(new String( 'V00001' ));
	seller.setDESCRIPTION(new String( 'Suzane Linda de Moraes Galvani' ));
	seller.setVALUE(new java.lang.Float( 10 )); // Deve ser menor que 100
	
	var arraySellers = svcBean.instantiate(wsPackage + '.ARRAYOFGENERICSTRUCT');
	arraySellers.setGENERICSTRUCT(new Array(seller));
	// Para incluir 'Vendedor 2' e outros repetir as linhas de criacao e atribuicao dos 
	//  valores no objeto 'seller' e incluir no vetor do comando acima
	
	salesOrderHeaderView.setSELLERS(arraySellers);
	//--- Vendedor 1 a 5 - OPCIONAL -- FIM ---
	
	//--- Especie 1 a 5 - OPCIONAL -- INICIO ---
	var packageVolume = svcBean.instantiate(wsPackage + '.GENERICSTRUCT');
	
	packageVolume.setCODE(new String( 'PALETE' ));
	packageVolume.setDESCRIPTION(new String( 'PALETE LACRADO' ));
	packageVolume.setVALUE(new java.lang.Float( 150 )); // Deve ser menor que 100
	
	var arrayPackagesVolumes = svcBean.instantiate(wsPackage + '.ARRAYOFGENERICSTRUCT');
	arrayPackagesVolumes.setGENERICSTRUCT(new Array(packageVolume));
	
	salesOrderHeaderView.setPACKAGESVOLUMES(arrayPackagesVolumes);
	//--- Especie 1 a 5 - OPCIONAL -- FIM ---
	
	//--- Campos de Usuario (personalizados) - OPCIONAL -- INICIO ---
	
	var userFieldArray = new Array();
	var userField = svcBean.instantiate(wsPackage + '.USERFIELD');
	
	userField.setUSERNAME(new String( '' ));
	userField.setUSERTYPE(new String( '' ));
	userField.setUSERSIZE(new java.math.BigInteger( 1 )); // OPCIONAL
	userField.setUSERDEC(new java.math.BigInteger( 0 )); // OPCIONAL
	userField.setUSERCOMBOBOX(new String( '' )); // OPCIONAL
	userField.setUSERF3(new String( '' )); // OPCIONAL
	userField.setUSEROBLIG(new java.lang.Boolean( false )); // OPCIONAL
	userField.setUSERPICTURE(new String( '' )); // OPCIONAL
	userField.setUSERTAG(new String( '' )); // OPCIONAL
	userField.setUSERTITLE(new String( '' )); // OPCIONAL
	
	userFieldArray.push(userField);
	
	var arrayOfUserField = svcBean.instantiate(wsPackage + '.ARRAYOFUSERFIELD');
	arrayOfUserField.setUSERFIELD(userFieldArray);
	
	salesOrderHeaderView.setUSERFIELDS(arrayOfUserField);
	//--- Campos de Usuario (personalizados) - OPCIONAL -- FIM ---
}

// Funcao com logica para contrucao do objeto do item do Pedido de Vendas (PV)
function novoItemPV() {
	var salesOrderItemView = svcBean.instantiate(wsPackage + '.SALESORDERITEMVIEW');
	
	// Percentual de Comissao 1 a 5 - OPCIONAL -- INICIO
	var commissionPercentage = svcBean.instantiate(wsPackage + '.GENERICSTRUCT');
	
	commissionPercentage.setCODE(new String( 'V00001' ));
	commissionPercentage.setDESCRIPTION(new String( 'Suzane' ));
	commissionPercentage.setVALUE(new java.lang.Float( 20 )); // Deve ser menor que 100
	
	var arrayCommissionPercentage = svcBean.instantiate(wsPackage + '.ARRAYOFGENERICSTRUCT');
	arrayCommissionPercentage.setGENERICSTRUCT(new Array(commissionPercentage));
	
	salesOrderItemView.setCOMMISSIONSPERCENTAGE(arrayCommissionPercentage);
	// Percentual de Comissao 1 a 5 - OPCIONAL -- FIM

	// Numero de pedido (identificacao) do cliente do PV - OPCIONAL
	salesOrderItemView.setCUSTOMERORDERNUMBER(new String( 'PCCLI1' ));
	
	// Entrega - OPCIONAL
	salesOrderItemView.setDELIVERYDATE(new java.util.Date(2013, 10, 31));
	
	// % Desconto - OPCIONAL
	salesOrderItemView.setDISCOUNTPERCENTAGE(new java.lang.Float( 10 ));

	// Vlr Desconto - OPCIONAL
	salesOrderItemView.setITEMDISCOUNTVALUE(new java.lang.Float( 150 ));
	
	// Tp Operacao - OPCIONAL - Tabela SX5 = Tabela Generica DJ
	salesOrderItemView.setOPERATIONTYPE(new String( '' ));
	
	// Tipo Saida - OBRIGATORIO - Tabela SF4 (registros acima do codigo 500)
	//              OPCIONAL (Se Produto possui cadastrado ou regras da rotina) 
	salesOrderItemView.setITEMOUTFLOWTYPE(new String( '501' ));
	
	// Cod. Fiscal - OPCIONAL - Tabela SX5 = Tabela Generica 13
	salesOrderItemView.setFISCALOPERATION(new String( '' ));
	
	// Endereco de Estoque - OPCIONAL (Depende do Parametro [SX6] MV_RASTRO ativo)
	salesOrderItemView.setLOCATION(new String( '' ));
	
	// Lote - OPCIONAL (Depende do Parametro MV_RASTRO ativo ou campo [B1_RASTRO] do cadastro do Produto
	salesOrderItemView.setLOTNUMBER(new String( '' ));
	
	// Fabricante - OPCIONAL (Tabela SA1 [Clientes] - Codigo)
	salesOrderItemView.setMANUFACTURERCODE(new String( '' ));
	
	// Loja Fabric. - OPCIONAL (Tabela SA1 [Clientes] - Loja)
	salesOrderItemView.setMANUFACTURERUNIT(new String( '' ));
	
	// Vlr. Total - OPCIONAL (Quantidade [QUANTITY] vezes Preco de Venda [NETUNITPRICE])
	salesOrderItemView.setNETTOTAL(new java.lang.Float( 22500 ));
	
	// Prc. Unitario - OPCIONAL (Se Produto possui preco sugerido no cadastro ou tabela de precos)
	salesOrderItemView.setNETUNITPRICE(new java.lang.Float( 150 ));
	
	// Numero PV - OPCIONAL
	salesOrderItemView.setORDERID(new String( '987654' ));
	
	// Item - OBRIGATORIO (Indica a sequencia, serve para exibicao ao usuario, na tela)
	salesOrderItemView.setORDERITEM(new String( '01' ));
	
	// N.F.Original - OPCIONAL
	salesOrderItemView.setORIGINALINVOICE(new String( '123456789' ));
	
	// Item NF.Orig - OPCIONAL (Sendo informada a N.F.Original e importante informar este)
	salesOrderItemView.setORIGINALINVOICEITEM(new String( '1234' ));
	
	// Serie Orig. - OPCIONAL (Sendo informada a N.F.Original e importante informar este)
	salesOrderItemView.setORIGINALINVOICESERIALID(new String( '098' ));
	
	// Item Grade (APARENTEMENTE) - OPCIONAL
	salesOrderItemView.setPOGRADEITEM(new String( '' ));
	
	// Grade (APARENTEMENTE) - OPCIONAL
	salesOrderItemView.setPOID(new String( '' ));
	
	// Item Contr. (APARENTEMENTE) - OPCIONAL
	salesOrderItemView.setPOITEM(new String( '' ));
	
	// Revisao Estr (APARENTEMENTE) - OPCIONAL
	salesOrderItemView.setPOSEQUENCE(new String( '' ));
	
	// Descricao (Produto) - OPCIONAL
	salesOrderItemView.setPRODUCTDESCRIPTION(new String( '' ));
	
	// Produto (codigo, Tabela SB1) - OBRIGATORIO
	salesOrderItemView.setPRODUCTID(new String( '000000000000001' ));
	
	// Num de Serie - OPCIONAL
	salesOrderItemView.setPRODUCTSERIALNUMBER(new String( 'ABCDEFGHIJKLMNOPQRST' ));
	
	// Quantidade - OBRIGATORIO
	salesOrderItemView.setQUANTITY(new java.lang.Float( 150 ));
	
	// Qtd.Liberada - OPCIONAL (Vide regra de aprovacao do PV)
	salesOrderItemView.setQUANTITYAPPROVED(new java.lang.Float( 150 ));
	
	// Qtd.Entregue - OPCIONAL
	salesOrderItemView.setQUANTITYDELIVERED(new java.lang.Float( 150 ));
	
	// Qtd.Lib 2aUM - OPCIONAL
	salesOrderItemView.setQUANTITYRELEASEDSECONDUNIT(new java.lang.Float( 150 ));
	
	// Qtd Ven 2 UM - OPCIONAL
	salesOrderItemView.setSECONDMEASUREUNITQUANTITY(new java.lang.Float( 150 ));
	
	// Segunda UM - OPCIONAL (Tabela SAH)
	salesOrderItemView.setSECONDUNITOFMEASURE(new String( '' ));
	
	// Sublote - OPCIONAL (Depende Parametro [SX6] MV_RASTRO ativo)
	salesOrderItemView.setSUBLOT(new String( '' ));
	
	// Prc Lista - OPCIONAL
	salesOrderItemView.setUNITLISTPRICE(new java.lang.Float( 160 ));
	
	// Unidade - OPCIONAL (Tabela SAH. Pode vir do cadastro do Produto)
	salesOrderItemView.setUNITOFMEASURE(new String( 'UN' ));
	
	// Campos de Usuario (personalizados) - OPCIONAL -- INICIO
	
	var userFieldArray = new Array();
	var userField = svcBean.instantiate(wsPackage + '.USERFIELD');
	
	userField.setUSERNAME(new String( '' ));
	userField.setUSERTYPE(new String( '' ));
	userField.setUSERSIZE(new java.math.BigInteger( 1 )); // OPCIONAL
	userField.setUSERDEC(new java.math.BigInteger( 0 )); // OPCIONAL
	userField.setUSERCOMBOBOX(new String( '' )); // OPCIONAL
	userField.setUSERF3(new String( '' )); // OPCIONAL
	userField.setUSEROBLIG(new java.lang.Boolean( false )); // OPCIONAL
	userField.setUSERPICTURE(new String( '' )); // OPCIONAL
	userField.setUSERTAG(new String( '' )); // OPCIONAL
	userField.setUSERTITLE(new String( '' )); // OPCIONAL
	
	userFieldArray.push(userField);
	
	var arrayOfUserField = svcBean.instantiate(wsPackage + '.ARRAYOFUSERFIELD');
	arrayOfUserField.setUSERFIELD(userFieldArray);
	
	salesOrderItemView.setUSERFIELDS(arrayOfUserField);
	// Campos de Usuario (personalizados) - OPCIONAL -- FIM
	
	// Armazem - OPCIONAL (Pode vir do cadastro do Produto. Vide regras de Estoque)
	salesOrderItemView.setWAREHOUSE(new String( '01' ));
	
	return salesOrderItemView;
}
