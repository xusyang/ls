export const parseArgs = (args: string[]) => {
  const result = {
    isAll: false,
    isList: false,
  }
  args.forEach((arg) => {
    if (arg === '-al' || arg == '-la') {
      result.isAll = true
      result.isList = true
    } else if (arg === '-a') {
      result.isAll = true
    } else if (arg === '-l') {
      result.isList = true
    }
  })
  return result
}
