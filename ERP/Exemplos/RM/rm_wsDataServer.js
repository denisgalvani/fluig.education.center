/** <!-- SUGESTAO: Ative a Visao "Documentation" da linguagem JavaScript, no Studio para melhor visualizaco destes comentarios -->
 * <p>
 * Dataset com objetivo de realizar a execução do WebService wsDataServer
 * destinado ao acesso direto aos objetos de negócio RM (DataServer).
 * </p>
 * <p>
 * <em>CODIGO: rm_wsDataServer</em><br/>
 * <em>DESCRICAO: Disponibiliza acesso direto aos objetos de negócio RM (DataServer)</em>
 * </p>
 * <hr/><p>
 * <strong>IMPORTANTE!</strong> ESTA IMPLEMENTACAO UTILIZA O METODO "saveRecord", AFIM DE INCLUIR/ALTERAR CENTRO DE CUSTO.<br/>
 * PARA ALTERAR A REGRA DE NEGOCIO OS PARAMETROS, ETAPA 3, DEVEM SER ATUALIZADOS. E, PARA MUDAR SUA FINALIDADE, METODO WEBSERVICE
 * PODE SER NECESSARIO ALTERAR O CODIGO DESTE DATASET.
 * </p>
 * <p><strong>
 * <strong style="color:red">ATENCAO!</strong> O USUARIO E SENHA PARA AUTENTICACAO NO ERP, TOTVS | RM, DEVEM SER REVISADOS, ETAPA 2.2, 
 * PARA CADA AMBIENTE UTILIZADO.<br/>
 * NA ETAPA 3, CONFIRA O CODIGO DA COLIGADA PARA REALIZACAO DAS ALTERACOES.
 * </strong></p>
 * <hr/>
 * @param fields NAO IMPLEMENTADO, NAO REMOVER, INFORMAR null
 * @param constraints NAO IMPLEMENTADO, NAO REMOVER, INFORMAR null
 * @param sortFields NAO IMPLEMENTADO, NAO REMOVER, INFORMAR null
 */
function createDataset(fields, constraints, sortFields) {
	//------------------------------------------------------------------------------------------------------------------------------------------
    //ETAPA 1 - CARREGAR SERVICO
	//------------------------------------------------------------------------------------------------------------------------------------------
    const rm_wsDataServer_Provider = ServiceManager.getService('RM_wsDataServer');
	
	const wsDataServer = rm_wsDataServer_Provider.instantiate('com.totvs.WsDataServer');
	//------------------------------------------------------------------------------------------------------------------------------------------
    //ETAPA 2 - CONFIGURAR SERVICO
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 2.1 - DEFINIR DESTINO DA(S) REQUISICAO(OES) - ENDPOINT
	//------------------------------------------------------------------------------------------------------------------------------------------
    const iWsDataServer = wsDataServer.getRMIwsDataServer();

    //------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 2.2 - DEFINIR DADOS PARA AUTENTICACAO - TOTVS | RM UTILIZA AUTENTICACAO BASICA
    //------------------------------------------------------------------------------------------------------------------------------------------
    //ETAPA 2.2.1 - CONFIGURAR AUTENTICACAO BASICA - FORMATO PADRAO (SIMPLES)
	//------------------------------------------------------------------------------------------------------------------------------------------
	const authIwsDataServer = rm_wsDataServer_Provider.getBasicAuthenticatedClient(iWsDataServer, 'com.totvs.IwsDataServer', 'mestre', 'totvs');
	
//	//------------------------------------------------------------------------------------------------------------------------------------------
//  //ETAPA 2.2.2 - CONFIGURAR AUTENTICACAO BASICA - FORMATO COMPLETO (PERSONALIZADO)
//  //-- MAIS INFORMACOES VIDE: http://tdn.totvs.com/pages/releaseview.action?pageId=73082260#IntegraçãoComAplicativosExternos-WebServicecomclientcustomizado
//	//------------------------------------------------------------------------------------------------------------------------------------------
//	var properties = {};
//	properties["basic.authorization"] = "true";
//	properties["basic.authorization.username"] = "mestre";
//	properties["basic.authorization.password"] = "totvs";
//	properties["disable.chunking"] = "true";
//	properties["log.soap.messages"] = "true";
//	
//	const authIwsDataServer = rm_wsDataServer_Provider.getCustomClient(iWsDataServer, 'com.totvs.IwsDataServer', properties);
	
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 3 - PREPARAR O(S) PARAMETRO(S) PARA EXECUCAO DO METODO WEBSERVICE
    //------------------------------------------------------------------------------------------------------------------------------------------
    var dataServerName = new java.lang.String ('CtbCCustoData');
	var xml = new java.lang.String( getNewCCustoXML().toString() ); 
	var contexto  = new java.lang.String ('CODCOLIGADA=1');
	
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 4 - REALIZAR CHAMADA AO METODO WEBSERVICE
    //------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 4.1 - ENVOLVER CHAMADA AO METODO WEBSERVICE EM UM BLOCO PROTEGIDO
    //------------------------------------------------------------------------------------------------------------------------------------------
    try {
		var saveRecordResult = authIwsDataServer.saveRecord(dataServerName, xml, contexto);
	} catch (e) {
		//--------------------------------------------------------------------------------------------------------------------------------------
	    //ETAPA 4.2 - TRATAR EXCESSAO PASSIVEL DE OCORRENCIA NA CHAMADA AO METODO WEBSERVICE
	    //--------------------------------------------------------------------------------------------------------------------------------------
	    return getDatasetError(e.toString());
	}
	
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 5 - TRANSFORMAR RESULTADO
    //------------------------------------------------------------------------------------------------------------------------------------------
	var dtsConsultaSQL = DatasetBuilder.newDataset();
	dtsConsultaSQL.addColumn('primaryKey');
	
		dtsConsultaSQL.addRow(new Array(
					saveRecordResult					
				));

	return dtsConsultaSQL;
}

//----------------------------------------------------------------------------------------------------------------------------------------------
//FUNCAO PARA CRIAR UM DATASET COM A MENSAGEM DE ERRO OCORRIDA
//----------------------------------------------------------------------------------------------------------------------------------------------
function getDatasetError(msg){
	var dataset_error = DatasetBuilder.newDataset();
	dataset_error.addColumn('ERROR');
	dataset_error.addRow( [msg.toString()] );
	return dataset_error;
}

//----------------------------------------------------------------------------------------------------------------------------------------------
//FUNCAO PARA CRIAR UM OBJETO DO TIPO XML COM OS DADOS QUE DEVEM SER ENVIADOS PARA INCLUSAO / ALTERACAO
//----------------------------------------------------------------------------------------------------------------------------------------------
function getNewCCustoXML() {
	var ctbCCusto = new XML('<CtbCCusto></CtbCCusto>'); // CONSTROI OBJETO DEFININDO O NO RAIZ, SENAO ASSUME O PADRAO, NO RAIZ DE NOME "ROOT"
	
	//INCLUI / ALTERA O NO DO OBJETO XML
	ctbCCusto.GCCusto.CODCOLIGADA = 1;
	ctbCCusto.GCCusto.CODCCUSTO 		= '99.2'													; // UNICO
	ctbCCusto.GCCusto.NOME 				= 'Fluig'													; // UNICO
	ctbCCusto.GCCusto.CODCOLCONTAGER 	= 1															;
	ctbCCusto.GCCusto.CODCONTAGER 		= '1.01.01'													;
	ctbCCusto.GCCusto.CODREDUZIDO 		= 'TESTES Fluig'											; // UNICO
	ctbCCusto.GCCusto.ATIVO 			= 'F'														;
	ctbCCusto.GCCusto.PERMITELANC 		= 'F'														;
	ctbCCusto.GCCusto.CODCLASSIFICA 	= '99'														; // COD. DO C.C., ANALITICO, SUPERIOR
	ctbCCusto.GCCusto.ENVIASPED 		= 'F'														;
	ctbCCusto.GCCusto.DATAINCLUSAO 		= '2014-12-15T00:00:00'										;
	ctbCCusto.GCCusto.CAMPOLIVRE 		= 'Descrição/Detalhamento desejado p/ este Centro de Custo'	;
	
	ctbCCusto.CCustoCompl.CODCOLIGADA 	= ctbCCusto.GCCusto.CODCOLIGADA								;
	ctbCCusto.CCustoCompl.CODCCUSTO 	= ctbCCusto.GCCusto.CODCCUSTO								;
	
	return ctbCCusto;
}
