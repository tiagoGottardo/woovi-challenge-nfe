import { nfeStatusService } from "./nfeStatusService"
import { nfeAutorizacaoService } from "./nfeAutorizacaoService"
import { nfeRetAutorizacaoService } from "./nfeRetAutorizacaoService"

interface WebService {
  name: string
  service: any
}

const webServices: WebService[] = [
  { name: "nfestatusservico4", service: nfeStatusService },
  { name: "nfeautorizacao", service: nfeAutorizacaoService },
  { name: "nferetautorizacao", service: nfeRetAutorizacaoService },
]

export {
  webServices
}
