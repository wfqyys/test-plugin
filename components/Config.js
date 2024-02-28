import YAML from 'yaml';
import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
import chokidar from 'chokidar';
import YamlReader from './YamlReader.js';
import cfg from '../../../lib/config/config.js';

const Plugin_Name = 'test-plugin';
const Plugin_Path = path.join(process.cwd(), 'plugins', Plugin_Name);

class Config {
    constructor() {
        this.configs = {};
        this.defaultConfigs = {};
        this.initialize();
    }

    initialize() {
        const configDir = path.join(Plugin_Path, 'config', 'config');
        const defaultConfigDir = path.join(Plugin_Path, 'config', 'default_config');

        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        // 复制默认配置文件到配置目录
        fs.readdirSync(defaultConfigDir).forEach((file) => {
            if (file.endsWith('.yaml')) {
                const targetPath = path.join(configDir, file);
                if (!fs.existsSync(targetPath)) {
                    fs.copyFileSync(path.join(defaultConfigDir, file), targetPath);
                }
                this.startWatching(targetPath, file.replace('.yaml', ''));
            }
        });
    }

    startWatching(filePath, configName) {
        // 假设这里有个文件监听器的实现，比如使用 chokidar
        const watcher = chokidar.watch(filePath, { persistent: true });
        watcher.on('change', () => {
            this.reloadConfig(configName);
        });
    }

    reloadConfig(configName) {
        // 重新加载配置文件内容
        this.configs[configName] = this.loadConfig('config', configName);
    }

    loadConfig(type, name) {
        // 使用 JavaScript 内置的 replace 方法替换连续的斜杠（/）为单个斜杠
        let filePath = `${Plugin_Path}/config/${type}/${name}.yaml`.replace(/\/+/, '/');
        // let filePath = path.join(Plugin_Path, 'config', `${type}`, `${name}.yaml`);
        let config = YAML.parse(fs.readFileSync(filePath, 'utf8'));

        // 可选：这里可以添加文件监听逻辑
        this.startWatching(filePath, name);

        return config;
    }

    getMasterQQ() {
        return cfg.masterQQ;
    }

    createOrUpdateConfig(name, userConfig = {}) {
        const defaultConfig = this.loadDefaultConfig(name);
        const configPath = path.join(Plugin_Path, 'config', 'config', `${name}.yaml`);

        // 如果文件不存在，创建并写入默认配置
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, YAML.stringify(defaultConfig), 'utf8');
        }

        // 合并用户配置与默认配置，并更新文件
        const mergedConfig = { ...defaultConfig, ...userConfig };
        fs.writeFileSync(configPath, YAML.stringify(mergedConfig), 'utf8');

        // 更新内存中的配置
        this.configs[name] = mergedConfig;
    }

    loadDefaultConfig(name) {
        return this.loadConfig('default_config', name);
    }

    /**
   * @description: 修改设置
   * @param {String} name 文件名
   * @param {String} key 修改的key值
   * @param {String|Number} value 修改的value值
   * @param {'config'|'default_config'} type 配置文件或默认
   */
    modify(name, key, value, type = 'config') {
        // 移除或避免连续斜杠
        let filePath = path.join(Plugin_Path, 'config', `${type}`, `${name}.yaml`);
        // 创建 YamlReader 实例并修改配置
        let yamlReader = new YamlReader(filePath);
        yamlReader.set(key, value);
        // let path = `${Plugin_Path}/config/${type}/${name}.yaml`
        // new YamlReader(path).set(key, value)
        this.loadConfig[key] = _.cloneDeep(this.configs[key])
        delete this.configs[`${type}.${name}`]
    }

    /**
     * @description: 修改配置数组
     * @param {String} name 文件名
     * @param {String|Number} key key值
     * @param {String|Number} value value
     * @param {'add'|'del'} category 类别 add or del
     * @param {'config'|'default_config'} type 配置文件或默认
     */
    modifyarr(name, key, value, category = 'add', type = 'config') {

        let filePath = `${Plugin_Path}/config/${type}/${name}.yaml`
        // const filePath = path.join(Plugin_Path, 'config', `${type}`, `${name}.yaml`);
        let yaml = new YamlReader(filePath)
        if (category == 'add') {
            yaml.addIn(key, value)
        } else {
            let index = yaml.jsonData[key].indexOf(value)
            yaml.delete(`${key}.${index}`)
        }
    }

    setArr(name, key, item, value, type = 'config') {
        const filePath = path.join(Plugin_Path, 'config', `${type}`, `${name}.yaml`);
        let yaml = new YamlReader(filePath);
        let arr = yaml.get(key).slice();
        arr[item] = value;
        yaml.set(key, arr);
        yaml.save(); // 保存更改至文件
    }
    async configData(fileName) {
        const filePath = path.join(Plugin_Path, 'config', 'config', `${fileName}.yaml`);
        try {
            const data = await fs.promises.readFile(filePath, 'utf-8');
            const config = YAML.parse(data);
            return config;
        } catch (err) {
            console.error(`无法从配置文件中读取数据: ${err}`);
            throw new Error(err.message);
        }
    }
    //获取配置文件值
    getConfigValue(filename, key) {
        const filePath = path.join(Plugin_Path, 'config', 'config', `${filename}.yaml`);
        try {
            // 确保文件存在
            fs.accessSync(filePath, fs.constants.F_OK);
            // 加载并处理配置文件...
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error(`Error: Configuration file ${filename} not found.`);
                return err; // 或者抛出错误，取决于你的业务需求
            } else {
                throw err;
            }
        }
    }

    getArrConfigValue(filename, key) {
        const filePath = path.join(Plugin_Path, 'config', filename + '.yaml');

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const parsedContent = YAML.load(content);

            // 检查返回值是否为数组，如果不是，则返回空数组
            const value = parsedContent[key];
            if (Array.isArray(value)) {
                return value;
            } else {
                console.warn(`警告：配置文件 ${filename} 中的 ${key} 不是数组，已返回空数组`);
                return [];
            }
        } catch (error) {
            console.error(`读取配置文件 ${filename} 错误：`, error);
            return [];
        }
    }

    /**
     * @description 对比两个对象不同的值
     * @param {*} oldObj 
     * @param {*} newObj 
     * @param {*} parentKey 
     * @returns 
     */
    findDifference(obj1, obj2, parentKey = '') {
        const result = {};
        for (const key in obj1) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
                const diff = this.findDifference(obj1[key], obj2[key], fullKey);
                if (!_.isEmpty(diff)) {
                    Object.assign(result, diff);
                }
            } else if (!_.isEqual(obj1[key], obj2[key])) {
                result[fullKey] = { oldValue: obj1[key], newValue: obj2[key] };
            }
        }
        for (const key in obj2) {
            if (!obj1.hasOwnProperty(key)) {
                const fullKey = parentKey ? `${parentKey}.${key}` : key;
                result[fullKey] = { oldValue: undefined, newValue: obj2[key] };
            }
        }
        return result;
    }
    // 同步写入
    saveConfig(name, configObject, type = 'config') {
        const filePath = path.join(Plugin_Path, 'config', `${type}`, `${name}.yaml`);
        const yamlContent = YAML.stringify(configObject);

        try {
            fs.writeFileSync(filePath, yamlContent, 'utf8');
            console.log(`配置文件 ${name}.yaml 已成功保存`);
        } catch (error) {
            console.error(`保存配置文件 ${name}.yaml 时发生错误: `, error);
        }
    }
    // 异步写入
    async Save(name, configObject, type = 'config') {
        // const filePath = `${Plugin_Path}/config/${type}/${name}.yaml`
        const filePath = path.join(Plugin_Path, 'config', `${type}`, `${name}.yaml`);
        const yamlContent = YAML.stringify(configObject);

        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, yamlContent, 'utf8', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                    console.log(`配置文件 ${name}.yaml 已成功保存`);
                }
            });
        });
    }
    async setNumConfig(name, key, value, type = 'config') {
        const configObject = {};
        configObject[key] = value;

        // 确保 value 是数字类型
        if (typeof value === 'string') {
            configObject[key] = parseInt(value, 10);
        }

        // 更新配置文件
        await this.Save(name, configObject, type = "config");
    }
}

export default new Config();