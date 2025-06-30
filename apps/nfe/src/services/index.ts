import { nfeStatusService } from "./nfeStatusService"

interface WebService {
  name: string
  service: any
}

const webServices: WebService[] = [
  { name: "nfestatusservico4", service: nfeStatusService },
]

export {
  webServices
}
