import VersionInfo from './Version.js';
import YamlReader from './YamlReader.js';
import Config from './Config.js';
import Render from './Render.js';

// 获取当前工作目录
const Path = process.cwd();
const { PluginVersion, yunzaiVersion } = VersionInfo;
export {
    PluginVersion,
    yunzaiVersion,
    Path,
    YamlReader,
    Config,
    Render
};