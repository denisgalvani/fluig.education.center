function defineStructure() {

}
function onSync(lastSyncDate) {

}
/**
 * Dataset com integracao ao webservice (SOAP) da plataforma fluig para inclusao
 * de registro(s) de formulario. 
 * 
 * <p><u>Parametros nao implementados</u>.</p>
 * 
 * @depends fluig integration service
 * 
 * @param fields
 *            null
 * @param constraints
 *            null
 * @param sortFields
 *            null
 * @returns dataset object
 */
function createDataset(fields, constraints, sortFields) {
	// -- DATASET: treina_criar_reg

	try {
		// -- CARREGA BIBLIOTECA / STUB DO SERVICO EXTERNO (DO TIPO SOAP)
		var fluigService = ServiceManager.getService('SOAP_CardService');
		// -- SOAP_CardService URL:
		// http://10.10.1.113:8084/webdesk/ECMCardService?wsdl
		var servicePort = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.ECMCardServiceService');
		var cardService = servicePort.getCardServicePort();

		// -- PREPARAR OS PARAMETROS PARA PASSAGEM A FUNCAO / WEB METODO
		var companyId = 1;
		var userCode = 'aluno';
		var userPass = 'aluno'; // -- 'MD5:SENHA_CODIFICADA_EM_HASH_MD5'
		// -- IRA CONTER O(S) REGISTRO(S) DE FORMULARIO
		var cardDtoArray = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardDtoArray');

		// -- DADOS DO REGISTRO DE FORMULARIO - INICIO
		var regCardDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardDto');
		regCardDto
				.setAdditionalComments("Exemplo de registro via WS + Dataset");
		regCardDto.setColleagueId("denis.galvani");
		regCardDto
				.setDocumentDescription("Exemplo de registro via Webservice SOAP, através de um Dataset");
		regCardDto
				.setDocumentKeyWord("fluig webservice soap treinamento dataset");
		regCardDto.setInheritSecurity(false);
		regCardDto.setParentDocumentId(371); //-- CODIGO DO MODELO DE FORMULARIO
		regCardDto.setVersionDescription("Um modelo de publicação (interna)");

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		// -- PREENCHIMENTO DO CAMPO DE FORMULARIO
		cardFieldDto.setField('vl_exemplo');
		cardFieldDto
				.setValue('Exemplo de registro via Webservice SOAP, através de um Dataset');
		// -- INCLUSAO DO CAMPO PREENCHIDO NA LISTAGEM PARA ENVIO
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('cb_demandante');
		cardFieldDto.setValue('aluno');
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('vl_demandante');
		cardFieldDto.setValue('Aluno Analytics');
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		// -- CAMPOS DE PAI-FILHO DEVEM TER O NOME BASE (PREFIXO) MAIS TRES
		// UNDERLINE SEGUIDO DE UM NUMERO SEQUENCIAL INDICATIVO DA LINHA
		cardFieldDto.setField('vl_vendedor_nome___1');
		cardFieldDto.setValue('Vendedor Amigo');
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('vl_pedido_desc___2');
		cardFieldDto.setValue('Produto Genérico');
		regCardDto.getCardData().add(cardFieldDto);

		// -- FIM DO PREENCHIMENTO DOS CAMPOS DO REGISTRO DE FORMULARIO
		// -- DADOS DO REGISTRO DE FORMULARIO - FIM

		// -- INCLUIR OBJETO COMPLEXO COM DADOS (METADADOS, CAMPOS E VALORES) DO
		// REGISTRO
		// DE FORMULARIO NO PARAMETRO PARA CHAMADA AO METODO
		cardDtoArray.getItem().add(regCardDto);

/*
 *\/\/ SEGUNDO REGISTRO DE FORMULARIO NA MESMA REQUISICAO - INICIO
 *
		// -- DADOS DO REGISTRO DE FORMULARIO - INICIO (2)
		var regCardDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardDto');
		regCardDto
				.setAdditionalComments("Exemplo de registro via WS + Dataset");
		regCardDto.setColleagueId("denis.galvani");
		regCardDto
				.setDocumentDescription("Exemplo de registro via Webservice SOAP, através de um Dataset");
		regCardDto
				.setDocumentKeyWord("fluig webservice soap treinamento dataset");
		regCardDto.setInheritSecurity(false);
		regCardDto.setParentDocumentId(371);
		regCardDto.setVersionDescription("Um modelo de publicação (interna)");

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('vl_exemplo');
		cardFieldDto
				.setValue('Exemplo de registro via Webservice SOAP, através de um Dataset');
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('cb_demandante');
		cardFieldDto.setValue('aluno');
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('vl_demandante');
		cardFieldDto.setValue('Aluno Analytics');
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('vl_vendedor_nome___1');
		cardFieldDto.setValue('Vendedor Amigo');
		regCardDto.getCardData().add(cardFieldDto);

		var cardFieldDto = fluigService
				.instantiate('com.totvs.technology.ecm.dm.ws.CardFieldDto');
		cardFieldDto.setField('vl_pedido_desc___2');
		cardFieldDto.setValue('Produto Genérico');
		regCardDto.getCardData().add(cardFieldDto);

		// -- FIM DO PREENCHIMENTO DOS CAMPOS DO REGISTRO DE FORMULARIO
		// -- DADOS DO REGISTRO DE FORMULARIO - FIM (2)

		cardDtoArray.getItem().add(regCardDto);
*		
*\/\/ SEGUNDO REGISTRO DE FORMULARIO NA MESMA REQUISICAO - FIM
*/
		
		// -- CHAMADA AO WEBMETHOD / FUNCAO DO WEBSERVICE
		var returnWsMsgArray = cardService.create(companyId, userCode,
				userPass, cardDtoArray);

		var webServiceMessage = returnWsMsgArray.getItem();

		// log.warn(' ===>>> treina_criar_reg');

		// -- CRIACAO DO DATASET PARA RETORNO DOS DADOS DO(S) REGISTRO(S) DE
		// FORMULARIO
		var dtsRegistrosInseridos = DatasetBuilder.newDataset();
		dtsRegistrosInseridos.addColumn('companyId');
		dtsRegistrosInseridos.addColumn('documentId');
		dtsRegistrosInseridos.addColumn('version');
		dtsRegistrosInseridos.addColumn('documentDescription');
		dtsRegistrosInseridos.addColumn('webServiceMessage');

		var valores = new Array();
		for (var i = 0; i < webServiceMessage.size(); i++) {
			// -- LIMPAR VETOR ANTES DE INCLUIR VALORES, QUANDO FEITA CHAMADA
			// PARA INCLUSAO DE MAIS DE UM REGISTRO DE FORMULARIO SERAO
			// RETORNADO "N" ESTATUS
			valores.length = 0;
			valores.push(webServiceMessage.get(i).getCompanyId());
			valores.push(webServiceMessage.get(i).getDocumentId());
			valores.push(webServiceMessage.get(i).getVersion());
			valores.push(webServiceMessage.get(i).getDocumentDescription());
			valores.push(webServiceMessage.get(i).getWebServiceMessage());
			dtsRegistrosInseridos.addRow(valores);

			// -- ESCRITA DOS VALORES NO LOG, OPCIONAL. PODE SER COMENTADO
			// (COMANDO CTRL+7 NAS LINHAS SELECIONADAS)
			log.info('webServiceMessage.get(' + new String(i) + '): ');
			log.dir(webServiceMessage.get(i));
			log
					.info('getCompanyId: '
							+ webServiceMessage.get(i).getCompanyId());
			log.info('getDocumentId: '
					+ webServiceMessage.get(i).getDocumentId());
			log.info('getVersion: ' + webServiceMessage.get(i).getVersion());
			log.info('getDocumentDescription: '
					+ webServiceMessage.get(i).getDocumentDescription());
			log.info('getWebServiceMessage: '
					+ webServiceMessage.get(i).getWebServiceMessage());
		}

		// log.warn('webServiceMessage :');
		// log.dir(webServiceMessage);
		// log.warn('returnWsMsgArray :');
		// log.dir(returnWsMsgArray);
		// log.warn('returnWsMsgArray.getItem() :');
		// log.dir(returnWsMsgArray.getItem());

		return dtsRegistrosInseridos;
	} catch (e) {
		return getDtsError(e);
	}

	var dtsResult = DatasetBuilder.newDataset();

	dtsResult.addColumn('returnWsMsgArray');

	dtsResult.addRow(new Array('CONFERIR NO LOG, E PASTA'));
	return dtsResult
}
/**
 * Retorna um objeto Dataset com as colunas indicativas da linha onde ocorreu um
 * erro na execução, e a mensagem de erro disparada pela exceção.
 * 
 * @param errObj
 * @returns
 */
function getDtsError(errObj) {
	var dtsError = DatasetBuilder.newDataset();

	dtsError.addColumn('ERROR_LINE');
	dtsError.addColumn('ERROR_MESSAGE');

	dtsError.addRow(new Array(errObj.lineNumber, errObj.message));
	return dtsError;
}

function onMobileSync(user) {

}
