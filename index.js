#!/usr/bin/env node
const fs = require('fs')
const program = require('commander')
const download = require('download-git-repo')
const handlebars = require('handlebars')
const inquirer = require('inquirer')
const ora = require('ora')
const chalk = require('chalk')
const log = console.log
const logSymbols = require('log-symbols')

program.version('1.0.0')
const templates = {
  template: {
    url: 'https://github.com/YangHuangYao/vue-template-admin',//仓库地址
    downloadUrl: 'direct:http://github.com/YangHuangYao/vue-template-admin.git',//下载地址
    description: '管理系统模板',
  },
}

program
  .command('init <template> <project>')
  .description('初始化项目模板')
  .action((templateName, projectName) => {
    const spinner = ora('正在下载模版...').start()
    const { downloadUrl } = templates[templateName]
    download(downloadUrl, projectName, { clone: true }, (err) => {
      if (err) {
        spinner.fail()//下载失败提示
        log(logSymbols.error, chalk.red(err))
        return
      }
      spinner.succeed()
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'name',
            message: '请输入项目名称',
          },
          {
            type: 'description',
            name: 'description',
            message: '请输入项目简介',
          },
          {
            type: 'input',
            name: 'author',
            message: '请输入作者名称',
          }
        ])
        .then((answers) => {
          const packagePath = `${projectName}/package.json`
          const packageContent = fs.readFileSync(packagePath, 'utf8')
          const packageResult = handlebars.compile(packageContent)(answers)
          fs.writeFileSync(packagePath, packageResult)
          log(logSymbols.success, chalk.yellow('初始化模板成功!'))
        })
    })
  })
program
  .command('list')
  .description("查看所有可用模版")
  .action(() => {
    for (let key in templates) {
      const element = templates[key]
      log(`${key}     ${element.description}`)
    }
  })
program.parse(process.argv)