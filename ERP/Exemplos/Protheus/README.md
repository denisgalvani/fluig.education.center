# Integrações com TOTVS Protheus

## Dataset

### *Webservice SOAP*

#### Consulta
  Utilização do _webservice *CFGTABLE*_ e web método *_GETTABLE_*:
  + _protheus_ws_cfgtable_
    
      Parâmetros de alias de tabela (_cAlias_), campos (_cListFieldsView_), filial (_cBranch_) e condições de seleção (_cQueryAddWhere_) são passados fixamente, e o dataset é construído dinamicamente com resposta obtida.
      
  + _protheus_consulta_tabelas_
  
      Parâmetros de alias de tabela (_cAlias_), campos (_cListFieldsView_) não definidos. 
      Este pode ser utilizado através de outros recursos *fluig* (_dataset_, _evento_, [_script de_] _formulário_, _widget_). Na chamada o parâmetro de campos (_fields_ do _dataset_) deve ser indicado _os campos de uma tabela *Protheus*_ o tornando dinâmico para consultar dados de qualquer tabela do ERP.
      
      Exemplo: 
      
        var clientes = DatasetFactory.getDataset(‘protheus_consulta_tabelas’, new Array(‘A1_COD’, ‘A1_NOME’, ‘A1_CGC’), null, null);
        
#### Inclusão / Atualização
  Utilização do _webservice *MTCustomerSalesOrder*_ e web método *_PutSalesOrder_* (ref. http://tdn.totvs.com/x/CIRn):
  + _protheus_ws_mtcustomersalesorder_
    
      Incluir novo *Pedido de Venda*. Parâmetros para requisição são fixos..
  
