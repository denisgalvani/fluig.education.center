# Integrações com TOTVS RM

## Dataset

### Webservice SOAP (_TBC - TOTVS Business Conector_ / _Host_)

#### *DataServer*
	Este serviço disponibiliza acesso direto aos objetos de negócio RM (DataServer). Serviço wsConsultaSQL.
	
##### Inclusão / Atualização
  + _rm_wsDataServer.js_
    + _DataServer_ *_CtbCCustoData_*. Cria um novo centro de custo. 
    + Parâmetros para requisição são fixos.

#### *wsConsultaSQL*
	Este serviço disponibiliza as Visões de Dados da Linha RM. Serviço wsFin.

##### Consulta
  + _rm_wsConsultaSQL.js_
    + _DataServer_ *_wsConsultaSQL_*. 
    + Utiliza web método _realizarConsultaSQL_ para retornar dados de consultas pré-existentes no _ERP_ *TOTVS RM*.
