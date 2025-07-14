export const ufTocUF = (uf: string | undefined) => {
  const dict = new Map<string, string>()
  dict.set("PR", "41")

  return dict.get(uf || "")
}
