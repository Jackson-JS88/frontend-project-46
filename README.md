### Hexlet tests and linter status:
[![Actions Status](https://github.com/Jackson-JS88/frontend-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Jackson-JS88/frontend-project-46/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Jackson-JS88_frontend-project-46&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Jackson-JS88_frontend-project-46)
[![Test Coverage](https://sonarcloud.io/api/project_badges/measure?project=Jackson-JS88_frontend-project-46&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Jackson-JS88_frontend-project-46)

### Description
A CLI tool to compare two configuration files (JSON, YAML) and show differences in three formats: stylish, plain, and json.

### Installation
```bash
git clone https://github.com/Jackson-JS88/frontend-project-46.git
cd frontend-project-46
npm install
npm link

gendiff [options] <filepath1> <filepath2>

Options:
  -f, --format <type>  output format: stylish, plain, json (default: "stylish")
  -V, --version        output the version number
  -h, --help           display help for command

  Stylish format:
  gendiff file1.json file2.json
  https://asciinema.org/a/GlNIndq3cmyCNIer0gJQAiCzg.svg


  Plain format:
  gendiff -f plain file1.yml file2.json
  https://asciinema.org/a/acB4XY5z6mrhuLCBIp5RzlMVR.svg


  SON format:
  gendiff --format json filepath1.json filepath2.json
  https://asciinema.org/a/wW2BVNDjZkkZGG1sfXOr0DVLV.svg
  