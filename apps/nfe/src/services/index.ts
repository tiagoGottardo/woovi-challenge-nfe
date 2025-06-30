import { nfeStatusService } from "./nfeStatusService"
import { nfeAutorizacaoService } from "./nfeAutorizacaoService"
import { nfeRetAutorizacaoService } from "./nfeRetAutorizacaoService"
import { nfeInutilizacaoService } from "./nfeInutilizacaoService"

interface WebService {
  name: string
  service: any
}

const webServices: WebService[] = [
  { name: "nfestatusservico4", service: nfeStatusService },
  { name: "nfeautorizacao", service: nfeAutorizacaoService },
  { name: "nferetautorizacao", service: nfeRetAutorizacaoService },
  { name: "nfeinutilizacao", service: nfeInutilizacaoService },
]

export {
  webServices
}
