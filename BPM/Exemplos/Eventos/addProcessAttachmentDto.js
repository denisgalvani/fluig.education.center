/**
 * Anexar arquivo via startProcess
 * https://forum.fluig.com/3609-anexar-arquivo-via-startprocess
 * 
 * Utilizar `ProcessAttachmentDto.getAttachments().add()` para incluir anexo, e
 * `java.nio.file.Files.readAllBytes` e `java.nio.file.Paths.get`
 * para passagem de sequencia de bytes a partir de arquivo existente.
 * ---
 * `getAttachments().add()` do `ProcessAttachmentDto`
 */
var filePath = '/home/usuario/arquivo.docx';
var byteArray = java.nio.file.Files.readAllBytes(java.nio.file.Paths.get(filePath));

attachment.setFileName('arquivo.docx');
attachment.setFilecontent(byteArray);

processAttachmentDto.getAttachments().add(attachment);
processAttachmentDto.setDescription('arquivo.docx');
processAttachmentDto.setNewAttach(true);

processAttachmentDtoArray.getItem().add(processAttachmentDto);
