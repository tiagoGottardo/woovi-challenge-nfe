import { nfeStatusService } from "./nfeStatusService"
import { nfeAutorizacaoService } from "./nfeAutorizacaoService"

interface WebService {
  name: string
  service: any
}

const webServices: WebService[] = [
  { name: "nfestatusservico4", service: nfeStatusService },
  { name: "nfeautorizacao", service: nfeAutorizacaoService },
]

export {
  webServices
}
