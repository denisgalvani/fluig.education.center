/** <!-- SUGESTAO: Ative a Visao "Documentation" da linguagem JavaScript, no Studio para melhor visualizaco destes comentarios -->
 * <p>
 * Dataset com objetivo de realizar a execução do WebService wsConsultaSQL
 * destinado a disponibilizar as Visoes de Dados da Linha RM.
 * </p>
 * <p>
 * <em>CODIGO: rm_wsConsultaSQL</em><br/>
 * <em>DESCRICAO: Disponibiliza as Visões de Dados da Linha RM</em>
 * </p>
 * <hr/><p>
 * <strong>IMPORTANTE!</strong> ESTA IMPLEMENTACAO UTILIZA O METODO "realizarConsultaSQL", AFIM DE EXECUTAR AS CONSULTAS SQL PREVIAMENTE
 * CADASTRADAS NO ERP TOTVS | RM.<br/>
 * PARA ALTERAR A VISAO DE DADOS, CONSULTA SQL, OS PARAMETROS, ETAPA 3, DEVEM SER ATUALIZADOS.
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
	const rm_wsConsultaSQL_Provider = ServiceManager.getService('RM_wsConsultaSQL');
	
	const wsConsultaSQL = rm_wsConsultaSQL_Provider.instantiate('com.totvs.WsConsultaSQL');
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 2 - CONFIGURAR SERVICO
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 2.1 - DEFINIR DESTINO DA(S) REQUISICAO(OES) - ENDPOINT
	//------------------------------------------------------------------------------------------------------------------------------------------
	const iWsConsultaSQL = wsConsultaSQL.getRMIwsConsultaSQL(); //-- SEM PARAMETRO UTILIZA ENDPOINT PADRAO, CONFIGURADO NO SERVICO DE INTEGRACAO

	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 2.2 - DEFINIR DADOS PARA AUTENTICACAO - TOTVS | RM UTILIZA AUTENTICACAO BASICA
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 2.2.1 - CONFIGURAR AUTENTICACAO BASICA - FORMATO PADRAO (SIMPLES)
	//------------------------------------------------------------------------------------------------------------------------------------------
//	const authIwsConsultaSQL = rm_wsConsultaSQL_Provider.getBasicAuthenticatedClient(iWsConsultaSQL, 'com.totvs.IwsConsultaSQL', 'mestre', 'totvs');
	
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 2.2.2 - CONFIGURAR AUTENTICACAO BASICA - FORMATO COMPLETO (PERSONALIZADO)
	//-- MAIS INFORMACOES VIDE: http://tdn.totvs.com/pages/releaseview.action?pageId=73082260#IntegraçãoComAplicativosExternos-WebServicecomclientcustomizado
	//------------------------------------------------------------------------------------------------------------------------------------------
	var properties = {};
	properties["basic.authorization"] = "true";
	properties["basic.authorization.username"] = "mestre";
	properties["basic.authorization.password"] = "totvs";
	properties["disable.chunking"] = "true";
	properties["log.soap.messages"] = "true"; // REGISTRA NO LOG FLUIG (SERVER.LOG DO JBOSS) AS MENSAGENS ENVIADAS E RETORNADAS

	const authIwsConsultaSQL = rm_wsConsultaSQL_Provider.getCustomClient(iWsConsultaSQL, 'com.totvs.IwsConsultaSQL', properties);

	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 3 - PREPARAR OS PARAMETRO(S) PARA EXECUCAO DO METODO WEBSERVICE
	//------------------------------------------------------------------------------------------------------------------------------------------
	var codSentenca = new java.lang.String ('denis');
	var codColigada = new java.lang.Integer(0); // 0 = Coligada Global, senao informe a Coligada onde a Visao esta cadastrada
	var codSistema  = new java.lang.String ('T');
	var parameters  = new java.lang.String ('CODCOLIGADA=0');

	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 4 - REALIZAR CHAMADA AO METODO WEBSERVICE
	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 4.1 - ENVOLVER CHAMADA AO METODO WEBSERVICE EM UM BLOCO PROTEGIDO
	//------------------------------------------------------------------------------------------------------------------------------------------
	try {
		var realizarConsultaSQLResult = authIwsConsultaSQL.realizarConsultaSQL(codSentenca, codColigada, codSistema, parameters);
	} catch (e) {
		//--------------------------------------------------------------------------------------------------------------------------------------
		//ETAPA 4.2 - TRATAR EXCESSAO PASSIVEL DE OCORRENCIA NA CHAMADA AO METODO WEBSERVICE
		//--------------------------------------------------------------------------------------------------------------------------------------
		return getDatasetError(e.toString());
	}

	//------------------------------------------------------------------------------------------------------------------------------------------
	//ETAPA 5 - TRANSFORMAR RESULTADO
	//------------------------------------------------------------------------------------------------------------------------------------------
	var xmlResult = new XML(realizarConsultaSQLResult);

	// TRATAMENTO DOS DADOS RETORNADOS
	var dtsConsultaSQL = DatasetBuilder.newDataset();
	dtsConsultaSQL.addColumn('CODIGO');
	dtsConsultaSQL.addColumn('NOME_FANTASIA');
	dtsConsultaSQL.addColumn('TELEFONE');
	dtsConsultaSQL.addColumn('RUA');
	dtsConsultaSQL.addColumn('NUMERO');
	dtsConsultaSQL.addColumn('BAIRRO');
	dtsConsultaSQL.addColumn('CIDADE');
	dtsConsultaSQL.addColumn('UF');
	dtsConsultaSQL.addColumn('CEP');
	dtsConsultaSQL.addColumn('NOME');
	dtsConsultaSQL.addColumn('CGC');

	for (n in xmlResult.Resultado) {
		dtsConsultaSQL.addRow(new Array(
					xmlResult.Resultado[n].CODIGO.toString(), /* COLOQUE ".toString()" PARA CONVERSAO PARA TEXTO */
					xmlResult.Resultado[n].NOME_FANTASIA.toString(),
					xmlResult.Resultado[n].TELEFONE.toString(),
					xmlResult.Resultado[n].RUA.toString(),
					xmlResult.Resultado[n].NUMERO.toString(),
					xmlResult.Resultado[n].BAIRRO.toString(),
					xmlResult.Resultado[n].CIDADE.toString(),
					xmlResult.Resultado[n].UF.toString(),
					xmlResult.Resultado[n].CEP.toString(),
					xmlResult.Resultado[n].NOME.toString(),
					xmlResult.Resultado[n].CGC.toString()
				));
	}

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
