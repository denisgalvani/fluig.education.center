/**
 * Incluir conteúdo como anexo de processo, via SOAP `ECMWorkflowEngineService`, 
 * pelo método `setFilecontent(byte[])`.
 * 
 * `byte[] Attachment.setFilecontent`
 * 
 * ---
 * Converter `String` em Array de `bytes`
 * `String.getBytes(Charset charset)`, ou `String.getBytes(String charsetName)`
 * ---
 * References:
 * - https://docs.oracle.com/javase/7/docs/api/java/lang/String.html#getBytes(java.lang.String)
 *   - https://docs.oracle.com/javase/7/docs/api/java/nio/charset/Charset.html
 */
var strXML = '<exemplo>Exemplo</exemplo>';
var utf8 = unescape(encodeURIComponent(strXML));

var arr = [];
for (var i = 0; i < utf8.length; i++) {
    arr.push(utf8.charCodeAt(i));
}

var periodicService = ServiceManager.getService('ECMWorkflowEngineService');
var serviceHelper = periodicService.getBean();
var serviceLocator = serviceHelper.instantiate('com.totvs.technology.ecm.workflow.ws.ECMWorkflowEngineServiceService');
var service = serviceLocator.getWorkflowEngineServicePort();

var colleagueIds = serviceHelper.instantiate('net.java.dev.jaxb.array.StringArray');

var processAttachmentDtoArray = serviceHelper.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDtoArray');
var processAttachmentDto = serviceHelper.instantiate('com.totvs.technology.ecm.workflow.ws.ProcessAttachmentDto');
processAttachmentDto.setDescription("xml-exemplo.xml");

var attachment = serviceHelper.instantiate('com.totvs.technology.ecm.workflow.ws.Attachment');
attachment.setFileName("xml-exemplo.xml");
attachment.setFileSize(arr.length);
attachment.setFilecontent(arr);
attachment.setPrincipal(true);
processAttachmentDto.getAttachments().add(attachment);
processAttachmentDtoArray.getItem().add(processAttachmentDto);
