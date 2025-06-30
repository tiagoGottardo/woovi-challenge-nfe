import { nfeStatusService } from "./nfeStatusService"
import { nfeAutorizacaoService } from "./nfeAutorizacaoService"
import { nfeRetAutorizacaoService } from "./nfeRetAutorizacaoService"
import { nfeInutilizacaoService } from "./nfeInutilizacaoService"
import { nfeConsultaProtocoloService } from "./nfeConsultaProtocoloService"
import { nfeRecepcaoEventoService } from "./nfeRecepcaoEvento"
import { nfeConsultaCadastroService } from "./nfeConsultaCadastroService"

interface WebService {
  name: string
  service: any
}

const webServices: WebService[] = [
  { name: "nfestatusservico4", service: nfeStatusService },
  { name: "nfeautorizacao", service: nfeAutorizacaoService },
  { name: "nferetautorizacao", service: nfeRetAutorizacaoService },
  { name: "nfeinutilizacao", service: nfeInutilizacaoService },
  { name: "nfeconsultaprotocolo", service: nfeConsultaProtocoloService },
  { name: "nferecepcaoevento", service: nfeRecepcaoEventoService },
  { name: "nfeconsultacadastro", service: nfeConsultaCadastroService },
]

export {
  webServices
}
