import { parseArgs } from './parseArg'
import fs from 'fs/promises'
import path from 'path'
import { Stats } from 'fs'

type IOptions = {
  isAll: boolean
  isList: boolean
}

const genFileOutput = async (options: IOptions, file: string) => {
  if (options.isList) {
    const stat = await getFileStat(file)
    const fileState = parseFileStat(stat)
    return fileState + '  ' + file + '\n'
  } else {
    return file + '\t'
  }
}

/**
 * 获取文件状态
 * @param filePath 文件路径
 * @returns
 */
const getFileStat = async (filePath: string) => {
  const stat = await fs.stat(path.join(process.cwd(), filePath))
  return stat
}

/**
 * 解析文件的状态
 * @param stat
 */
const parseFileStat = (stat: Stats) => {
  const f = stat.isDirectory() ? 'd' : stat.isFile() ? '-' : '|'

  const getStatStr = (i: number) => {
    if (i === 0) {
      return 'x'
    } else if (i === 1) {
      return 'w'
    } else if (i === 2) {
      return 'r'
    } else {
      throw new Error('非法索引')
    }
  }

  const getTimeStr = (i: number) => {
    const d = new Date(i)
    const yy = d.getFullYear()
    const MM = (d.getMonth() + 1).toString().padStart(2, '0')
    const dd = d.getDate().toString().padStart(2, '0')
    const hh = d.getHours().toString().padStart(2, '0')
    const mm = d.getMinutes().toString().padStart(2, '0')
    return `${yy}.${MM}.${dd} ${hh}:${mm} `
  }

  const getSize = (size: number) => {
    const units = ['B', 'K', 'M', 'G', 'T', 'P']
    for (let i = 0; i <= 6; i++) {
      const unit_size = 1 << (10 * (i + 1))
      const prev_unit_size = 1 << (10 * i)
      if (size < unit_size) {
        return Math.round(size / prev_unit_size) + units[i]
      }
    }
  }

  const stats = []
  for (let i = 0; i < 9; i++) {
    const s = 1 << i
    if (s & stat.mode) {
      stats[i] = getStatStr(i % 3)
    } else {
      stats[i] = '-'
    }
  }

  const uid = stat.uid
  const gid = stat.gid
  const size = stat.size
  return `${f}${stats.reverse().join('')} ${uid} ${gid}\t${getSize(size)}\t${getTimeStr(stat.birthtimeMs)}`
}

export async function ls() {
  const options: IOptions = parseArgs(process.argv.slice(2))

  const dirs = await fs.readdir(process.cwd())
  let result = ''

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i]
    const str = await genFileOutput(options, dir)
    result += str
  }

  console.log(result)
}

ls()
