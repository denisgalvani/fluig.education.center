// WEBSERVICE PROTHEUS -> URL: http://localhost:8011/ws/CFGTABLE.apw
// SERVICO DO ECM / FLUIG -> CODIGO: protheus_cfgtable
// OBJETIVO: Consulta os dados das tabelas no TOTVS Protheus, de acordo com os campos indicados

function createDataset(fields, constraints, sortFields) { /*fields = [ '_',/**'a1_cod','a1_nome','a1_cgc' ]; /*'b1_cod,b1_desc,b1_ts']; */
	//VALIDACOES
	if (!fields || fields.length < 1)
		return createDatasetErro('O parâmetro "fields" deve ter ao menos um campo');
	
	var listFieldsView = new Array(); 

	//constraints
	// NOME DO CAMPO  => campo
	// VALOR INICIAL  => valorInicial
	// VALOR FINAL    => valorFinal
	// TIPO DE FILTRO => tipo
	//var filtro = DatasetFactory.createConstraint(campo, valorInicial, valorFinal, tipo)
//	constraints[0].fieldName
//	constraints[0].initialValue
//	constraints[0].finalValue
//	constraints[0].type
//	
//	var condicao = constraints[0].fieldName;
//	if(constraints[0].type==ConstraintType.MUST)
//		condicao += ' = '
//		else if(constraints[0].type==ConstraintType.MUST_NOT)
//			condicao += ' != ';
//		else 
//			condicao = ' OR ' + condicao + ' = ';
//	condicao += " '" + constraints[0].initialValue + "' ";
	// campo = 'valorinicial'
	


	for (var f in fields) 	/** RETORNA SOMENTE O INDICE DO ELEMENTO */
//	for each(var f in fields)	/** RETORNA O ELEMENTO/ITEM */
	//for(var i = 0; i < fields.length; i++)	/** RETORNA UM INDICE PARA O ELEMENTO DO VETOR */
	{
		log.warn("[DATASET "+dataset_name+"] fields.f: "+new String(fields[f]).toString()); 	/** RETORNA O ELEMENTO/ITEM */
		//log.warn("[DATASET "+dataset_name+"] fields[i]: "+new String(fields[i].toString()).toString()); 		/** RETORNA UM INDICE PARA O ELEMENTO DO VETOR */
		listFieldsView.push(fields[f]);
	}
	//log.warn("[DATASET "+dataset_name+"] fields: "+ fields.class);
	
	var service = ServiceManager.getService('protheus_treinamento_cfgtable');
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
	try{
		var cAlias      = new String( getAlias(fields[0]) );
	}catch (e) {
		return createDatasetErro(e.toString());
	}
	var cQueryAddWhere  = new String('');
	var cBranch         = new String('');
	//5 LISTFIELDSVIEW pode ser vazio para trazer todos os campos, mas isto pode estourar o
	// tamanho maximo da variavel de string do Protheus com a resposta XML para requisicao
	// Campos nas tabelas do Protheus de tipo LOGICO ou MEMO nao podem ser listadas e causam
	// erros quando relacionadas
	var cListFieldsView = new String( listFieldsView.toString() ); //-- fields[0],fields[1],fields[N]
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

var dataset_name = 'protheus_consulta_tabelas';

function createDatasetErro(a){
	var b = DatasetFactory.newDataset();
	b.addColumn("ERROR");
	b.addRow( [a] );
	log.error("[DATASET "+dataset_name+"] "+a);
	return b;
}

function getAlias(field){
	var prefix = new String(field).split('_')[0];
	if(prefix.length < 2 || prefix.length > 3)
		throw 'Campo inválido. O alias da tabela não pôde ser definido. O prefixo do campo deve possuir dois ou três caracteres.';
	else if(prefix.length < 3)
			return 'S' + prefix.toUpperCase();
		else
			return prefix.toUpperCase();
}
