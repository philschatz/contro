import * as fs from 'fs-extra'
import * as path from 'path'
import { controllerConfigs } from '../src/configs'
import { keyMap } from '../src/maps/keyboard'

function generateMappingDocs() {
  generateKeyboardKeyDocs()
  generateGamepadButtonDocs()
}

/**
 * Generates a table documenting the valid keyboard key values, aliases and
 * the respective labels based on the key value specified in the `keyMap`.
 */
async function generateKeyboardKeyDocs() {

  const lines: string[] = []
  for (const keyValue in keyMap) {
    const keyAliases = keyMap[keyValue]
    const keyLabel = keyAliases[0]
    lines.push([
      `\`${keyValue}\``,
      `<kbd>${keyLabel}</kbd>`,
      `${keyAliases.map(keyAlias => `\`${keyAlias}\``).join(' , ')}`,
    ].join('|'))
  }

  saveLines('keyboard-keys.md', lines)

}

/**
 * Generates a table documenting the valid gamepad button numbers, aliases and
 * respective labels based on the button numbers specified in the `buttonMap`.
 */
async function generateGamepadButtonDocs() {

  const lines: string[] = []
  for (const buttonLabel of Object.keys(controllerConfigs[0].buttons)) {
    lines.push(`<kbd>${buttonLabel}</kbd>`)
  }

  saveLines('gamepad-buttons.md', lines)

}

async function saveLines(file: string, lines: string[]) {

  const filePath = path.join(__dirname, '../docs', file)
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const newFileContent = fileContent.replace(
    /(<!--buttons-->)([\s\S]*)(\n\n)/gm,
    `$1\n${lines.join('\n')}$3`,
  )
  await fs.writeFile(filePath, newFileContent)

}

generateMappingDocs()
