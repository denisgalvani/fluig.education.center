// WEBSERVICE PROTHEUS -> URL: http://localhost:8011/ws/CFGTABLE.apw
// SERVICO DO ECM / FLUIG -> CODIGO: protheus_ws
// OBJETIVO: Consulta os dados do Planejamento no TOTVS Protheus, tabela de Alias RA8

function createDataset(fields, constraints, sortFields) {
	var service = ServiceManager.getService('protheus_ws');
	var serviceBean = service.getBean();
	var locator = serviceBean.instantiate('br.com.microsiga.webservices.cfgtable_apw.CFGTABLELocator');
	var cfgTableSoap = locator.getCFGTABLESOAP();
	//PASSE A URL COMO PARAMETRO CASO DESEJE UTILIZAR OUTRO ENDPOINT DIFERENTE DO UTILIZADO NA CRIACAO DO SERVICO/BEAN
	//var cfgTableSoap = locator.getCFGTABLESOAP(new java.net.URL('http://192.168.165.107:8011/ws01/'));
	
	//PARAMETROS
	//1 STRING - USERCODE - Usuario com acesso ao Portal Protheus/RH.
	//2 STRING - ALIAS - Codinome da tabela Protheus. Tres primeiras letras
	//3 STRING - QUERYADDWHERE - Condicao para a consulta SQL do Top Connect/DBAccess
	//4 STRING - BRANCH - Filial para retorno/filtragem dos dados
	//5 STRING - LISTFIELDSVIEW - Relacao de campos a serem retornados, separados por virgula
	var cUserCode       = new String('*******');
	var cAlias          = new String('RA8');
	var cQueryAddWhere  = new String('');
	var cBranch         = new String('');
	//5 LISTFIELDSVIEW pode ser vazio para trazer todos os campos, mas isto pode estourar o
	// tamanho maximo da variavel de string do Protheus com a resposta XML para requisicao
	// Campos nas tabelas do Protheus de tipo LOGICO ou MEMO nao podem ser listadas e causam
	// erros quando relacionadas
	var cListFieldsView = new String('');
	try {
		var oTableView  = cfgTableSoap.GETTABLE(cUserCode, cAlias, cQueryAddWhere, cBranch, cListFieldsView);
	} catch(e) {
		return createDatasetErro('Não foi possível executar o método GetTable do WebService CFGTable do TOTVS|Protheus 11. \nERRO RETORNADO: \n' + e.message);
	}
	
	//DATASET DE RESULTADOS
	var dataset = DatasetFactory.newDataset();
	
	//CAMPOS DA CONSULTA
	var oArrayOfFieldStruct = oTableView.getTABLESTRUCT();
	var aFieldStruct = oArrayOfFieldStruct.getFIELDSTRUCT();
	for(var i = 0; i < aFieldStruct.length; i++){
		dataset.addColumn(aFieldStruct[i].getFLDNAME()); // INCLUI DINAMICAMENTE AS COLUNAS CONSULTADAS NO DATASET
	}
	
	//VALORES DA CONSULTA
	//IMPORTANTE! Os valores dos campos das tabelas do Protheus retornam com espacos a direta
	// em comparacoes isto devera ser considerado, pois 'a' <> 'a '.
	//OBSERVACAO: Considere remover os espacos a direita com uso de expressoes regulares, por
	// exemplo.
	var oArrayOfFieldView = oTableView.getTABLEDATA();
	for(var j = 0; j < oArrayOfFieldView.getFIELDVIEW().length; j++){
		var aRegistro = new Array();
		for(var i = 0; i < aFieldStruct.length; i++){
			aRegistro.push( oArrayOfFieldView.getFIELDVIEW(j).getFLDTAG().getSTRING(i) );
		}
		dataset.addRow(aRegistro);
	}
	
	return dataset;
}

var dataset_name = 'protheus_ws_cfgtable';

function createDatasetErro(a){
	var b = DatasetFactory.newDataset();
	b.addColumn("erro");
	b.addRow( [a] );
	log.error("[DATASET "+dataset_name+"] "+a);
	return b;
}
