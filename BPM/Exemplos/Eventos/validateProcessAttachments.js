/**
 * Valida existencia de anexo especifico
 */

var anexos = hAPI.listAttachments();

//if (anexos.empty){
//  throw "Favor anexar";
//}

var hasAttachment = false;
for (var i = 0; i < anexos.size(); i++) {

  var doc = anexos.get(i);
  log.info(doc.getDocumentDescription());

  if (doc.getDocumentDescription() == "CONTRATO_ASSINADO.pdf") {
    hasAttachment = true;
    log.info("<<< CONTRATO INCLUIDO COM SUCESSO");
  }

}

if (!hasAttachment) {
  log.info("<<< NAO ENCONTROU - CONTRATO_ASSINADO.pdf");
}