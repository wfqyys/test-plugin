import fs from 'fs';
import path from 'path';

const Cwd = process.cwd();

// 获取插件版本号
const pluginPackageJsonPath = `${Cwd}/plugins/test-plugin/package.json`;
let PluginVersion = '0.0.4';
try {
    const pluginPackageJson = JSON.parse(fs.readFileSync(pluginPackageJsonPath, 'utf-8'));
    PluginVersion = pluginPackageJson.version || PluginVersion;
} catch (err) { }

// 获取Yunzai版本号
const packageJsonPath = path.join(Cwd, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const yunzaiVersion = packageJson.version;

// 直接导出版本信息
export default {
    PluginVersion,
    yunzaiVersion
};